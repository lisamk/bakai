import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-backend-offline-message',
    standalone: true,
    imports: [TranslatePipe],
    template: `
        <div class="flex flex-col items-center gap-3 py-6 text-center">
            <i class="pi pi-server text-4xl text-red-400"></i>
            <div class="text-red-500 font-medium">{{ 'DASHBOARD.MKV_MOVER.BACKEND_NOT_REACHABLE' | translate }}</div>
            <div class="text-surface-400 text-sm">{{ 'DASHBOARD.MKV_MOVER.BACKEND_NOT_RUNNING' | translate }}</div>
        </div>
    `
})
export class BackendOfflineMessage {}
