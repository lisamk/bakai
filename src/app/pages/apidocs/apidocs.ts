import { Component, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BackendOfflineMessage } from '../../shared/backend-offline-message/backend-offline-message';

@Component({
    selector: 'app-apidocs',
    standalone: true,
    imports: [CommonModule, BackendOfflineMessage],
    template: `
        <!-- Loading state -->
        <div *ngIf="backendAvailable() === null" class="card flex justify-center py-6">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
        </div>

        <!-- Backend not reachable -->
        <div *ngIf="backendAvailable() === false" class="card">
            <app-backend-offline-message></app-backend-offline-message>
        </div>

        <!-- Swagger UI -->
        <div *ngIf="backendAvailable() === true" class="card" style="padding: 0; overflow: hidden; height: calc(100vh - 9rem);">
            <iframe
                [src]="swaggerUrl"
                style="width: 100%; height: 100%; border: none;"
                title="API Documentation">
            </iframe>
        </div>
    `
})
export class ApiDocs implements OnInit {
    swaggerUrl: SafeResourceUrl;
    backendAvailable = signal<boolean | null>(null);

    private sanitizer = inject(DomSanitizer);
    private http = inject(HttpClient);

    constructor() {
        this.swaggerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://localhost:8080/swagger-ui/index.html'
        );
    }

    ngOnInit(): void {
        this.http.get('/api/files/browse', { params: { path: '' } }).subscribe({
            next: () => this.backendAvailable.set(true),
            error: () => this.backendAvailable.set(false)
        });
    }
}
