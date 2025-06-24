import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Ana Sayfa', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Forum',
                        icon: 'pi pi-book',
                        routerLink: ['/pages/post']
                    },
                    {
                        label: 'Mera',
                        icon: 'pi pi-map',
                        routerLink: ['/pages/location']
                    },
                    {
                        label: 'Topluluk',
                        icon: 'pi pi-users',
                        routerLink: ['/pages/community']
                    }
                ]
            }
        ];
    }
}
