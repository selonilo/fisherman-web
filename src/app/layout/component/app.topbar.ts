import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../pages/service/auth.service';
import { PROJECT_CONSTANTS } from '../../pages/constant/project.constants';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule, AvatarModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="assets/logo/fishermanLogo.png" alt="Logo" style="height: 40px;"/>
                <span>FISHERMAN</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                        <i *ngIf="!imageUrl" class="pi pi-user"></i>
                        <p-avatar *ngIf="imageUrl" [image]="imageUrl" size="normal" shape="circle"></p-avatar>
                    </button>
                </div>
            </div>
            <p-menu #menu [model]="items" [popup]="true" appendTo="body"/>
        </div>
    </div>`
})
export class AppTopbar implements OnInit {
    items!: MenuItem[];

    imageUrl: string = '';

    constructor(public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.getById(Number(localStorage.getItem('userId'))).subscribe({
            next:(data) => {
                this.imageUrl = data.imageUrl;
            }
        })
        this.items = [
            {
                label: localStorage.getItem('name')?.toString(),
                items: [
                    {
                        label: 'Profil',
                        icon: 'pi pi-user',
                        command: () => {
                            this.router.navigate(['/pages/profile']);
                        }
                    },
                    {
                        label: 'Çıkış',
                        icon: 'pi pi-sign-out',
                        command: () => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('userId');
                            localStorage.removeItem('name');
                            this.router.navigate(['/auth/login']);
                        }
                    }
                ]
            }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
