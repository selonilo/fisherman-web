import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../service/auth.service';
import { NotificationModel } from '../../../auth/model/notification.model';
import { CommonModule } from '@angular/common';
import { ChipModule } from 'primeng/chip';
import { PROJECT_CONSTANTS } from '../../../constant/project.constants';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [ButtonModule, MenuModule, CommonModule, ChipModule],
    templateUrl: 'notificationswidget.html'
})
export class NotificationsWidget implements OnInit {
    notificationModelList: NotificationModel[] = [];
    filePath: string = PROJECT_CONSTANTS.FILE_PATH;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.getNotification(Number(localStorage.getItem('userId'))).subscribe({
            next:(data) => {
                this.notificationModelList = data;
            }
        })
    }
    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];
}
