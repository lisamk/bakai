import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FolderPicker } from '@/app/shared/folder-picker/folder-picker';
import { BackendOfflineMessage } from '@/app/shared/backend-offline-message/backend-offline-message';
import { environment } from '@/environments/environment';

interface MoveResult {
    movedFiles: string[];
    errors: string[];
}

@Component({
    selector: 'app-mkvmoverwidget',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, MessageModule, ProgressSpinnerModule, TooltipModule, TranslatePipe, FolderPicker, BackendOfflineMessage],
    templateUrl: './mkvmoverwidget.html',
    styleUrl: './mkvmoverwidget.scss'
})
export class Mkvmoverwidget implements OnInit {
    private http = inject(HttpClient);
    private translate = inject(TranslateService);

    sourceFolder = '';
    targetFolder = '';
    extension = 'mkv';

    loading = signal(false);
    result = signal<MoveResult | null>(null);
    errorMessage = signal('');
    backendAvailable = signal<boolean | null>(null);

    ngOnInit(): void {
        this.http.get(`${environment.apiUrl}/api/files/browse`, { params: { path: '' } }).subscribe({
            next: () => this.backendAvailable.set(true),
            error: () => this.backendAvailable.set(false)
        });
    }

    pickerTarget: 'source' | 'target' = 'source';
    folderPicker = viewChild.required(FolderPicker);

    get canCopySource(): boolean {
        return this.sourceFolder.trim().length > 0;
    }

    copySourceToTarget(): void {
        this.targetFolder = this.sourceFolder;
    }

    openPicker(target: 'source' | 'target'): void {
        this.pickerTarget = target;
        this.folderPicker().open('Z:\\');
    }

    onFolderSelected(path: string): void {
        if (this.pickerTarget === 'source') {
            this.sourceFolder = path;
        } else {
            this.targetFolder = path;
        }
    }

    move(): void {
        this.result.set(null);
        this.errorMessage.set('');
        this.loading.set(true);

        this.http.post<MoveResult>(`${environment.apiUrl}/api/files/move`, {
            sourceFolder: this.sourceFolder.trim(),
            targetFolder: this.targetFolder.trim(),
            extension: this.extension.trim().replace(/^\./, '')
        }).subscribe({
            next: (res) => {
                this.result.set(res);
                this.loading.set(false);
            },
            error: (err) => {
                this.errorMessage.set(err?.error?.message ?? err?.message ?? this.translate.instant('DASHBOARD.MKV_MOVER.UNKNOWN_ERROR'));
                this.loading.set(false);
            }
        });
    }

    getMovedFilesText(count: number): string {
        return this.translate.instant('DASHBOARD.MKV_MOVER.FILES_MOVED', { count });
    }
}
