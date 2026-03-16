import { Component } from '@angular/core';
import { Mkvmoverwidget } from './components/mkvmoverwidget/mkvmoverwidget';

@Component({
    selector: 'app-dashboard',
    imports: [Mkvmoverwidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-6 xl:col-span-4">
                <app-mkvmoverwidget></app-mkvmoverwidget>
            </div>
        </div>
    `
})
export class Dashboard {}
