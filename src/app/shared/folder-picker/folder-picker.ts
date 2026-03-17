import { Component, inject, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {Tooltip} from "primeng/tooltip";

interface BrowseResponse {
    currentPath: string;
    directories: string[];
}

@Component({
    selector: 'app-folder-picker',
    standalone: true,
    imports: [CommonModule, ButtonModule, DialogModule, Tooltip],
    template: `
        <p-dialog
            header="Ordner wählen"
            [visible]="visible()"
            (visibleChange)="onVisibleChange($event)"
            [modal]="true"
            [style]="{ width: '540px' }"
            [draggable]="false"
        >
            <div class="flex flex-col gap-3">
                <!-- Breadcrumb / current path -->
                <div class="flex items-center gap-2 flex-wrap">
                    <button pButton type="button" size="small" severity="secondary"
                        icon="pi pi-home" (click)="navigate('')" pTooltip="Laufwerke"></button>
                    @for (crumb of breadcrumbs(); track crumb.path) {
                        <i class="pi pi-angle-right text-surface-400"></i>
                        <button pButton type="button" size="small" severity="secondary"
                            [label]="crumb.label" (click)="navigate(crumb.path)"></button>
                    }
                </div>

                <!-- Directory list -->
                <div class="border border-surface rounded overflow-y-auto" style="max-height: 320px;">
                    @if (loading()) {
                        <div class="flex justify-center items-center p-6">
                            <i class="pi pi-spin pi-spinner text-2xl"></i>
                        </div>
                    } @else if (dirs().length === 0) {
                        <div class="p-4 text-surface-400 text-sm">Keine Unterordner vorhanden</div>
                    } @else {
                        @for (dir of dirs(); track dir) {
                            <div
                                class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 border-b border-surface last:border-b-0"
                                [class.bg-primary-50]="selected() === dir"
                                [class.dark:bg-primary-900]="selected() === dir"
                                (click)="select(dir)"
                                (dblclick)="navigate(dir)"
                            >
                                <i class="pi pi-folder text-yellow-500"></i>
                                <span class="text-sm flex-1 break-all">{{ dirName(dir) }}</span>
                                <button pButton type="button" size="small" severity="secondary"
                                    icon="pi pi-angle-right" (click)="$event.stopPropagation(); navigate(dir)"
                                    pTooltip="Öffnen"></button>
                            </div>
                        }
                    }
                </div>

                <!-- Selected path display -->
                @if (selected()) {
                    <div class="text-sm text-surface-600 dark:text-surface-300 break-all">
                        <span class="font-medium">Ausgewählt: </span>{{ selected() }}
                    </div>
                }
            </div>

            <ng-template pTemplate="footer">
                <button pButton type="button" label="Abbrechen" severity="secondary" (click)="close()"></button>
                <button pButton type="button" label="Übernehmen"
                    [disabled]="!selected()"
                    (click)="confirm()"></button>
            </ng-template>
        </p-dialog>
    `
})
export class FolderPicker {
    private http = inject(HttpClient);

    visible = signal(false);
    loading = signal(false);
    dirs = signal<string[]>([]);
    currentPath = signal('');
    selected = signal('');
    breadcrumbs = signal<{ label: string; path: string }[]>([]);

    folderSelected = output<string>();

    open(startPath = ''): void {
        this.selected.set('');
        this.visible.set(true);
        this.navigate(startPath);
    }

    close(): void {
        this.visible.set(false);
    }

    onVisibleChange(v: boolean): void {
        if (!v) this.close();
    }

    navigate(path: string): void {
        this.loading.set(true);
        this.selected.set(path || '');
        this.http.get<BrowseResponse>(`${environment.apiUrl}/api/files/browse`, { params: { path } }).subscribe({
            next: (res) => {
                this.dirs.set(res.directories);
                this.currentPath.set(res.currentPath);
                this.buildBreadcrumbs(res.currentPath);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    select(dir: string): void {
        this.selected.set(dir);
    }

    confirm(): void {
        if (this.selected()) {
            this.folderSelected.emit(this.selected());
            this.close();
        }
    }

    dirName(path: string): string {
        return path.replace(/\\/g, '/').split('/').filter(Boolean).pop() ?? path;
    }

    private buildBreadcrumbs(path: string): void {
        if (!path) { this.breadcrumbs.set([]); return; }
        const parts = path.replace(/\\/g, '/').split('/').filter(Boolean);
        const crumbs: { label: string; path: string }[] = [];
        let accumulated = '';
        for (const part of parts) {
            accumulated = accumulated ? `${accumulated}/${part}` : (path.includes('\\') ? `${part}\\` : `/${part}`);
            crumbs.push({ label: part, path: accumulated });
        }
        this.breadcrumbs.set(crumbs);
    }
}
