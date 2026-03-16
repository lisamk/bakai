import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [TranslatePipe],
    template: `<div class="layout-footer">
        {{ 'FOOTER.TEXT' | translate }}
        <a href="https://primeng.org" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">PrimeNG</a>
    </div>`
})
export class AppFooter {}
