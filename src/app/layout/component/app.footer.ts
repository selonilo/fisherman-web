import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <img src="assets/logo/fishermanLogo.png" alt="Logo" style="height: 40px;"/>
        by
        <a target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Selonilo</a>
    </div>`
})
export class AppFooter {}
