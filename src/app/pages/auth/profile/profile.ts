import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { UserModel } from '../model/user.model';
import { AuthService } from '../../service/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Post } from "../../post/post";
import { FileUploadModule } from 'primeng/fileupload';
import { PROJECT_CONSTANTS } from '../../constant/project.constants';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ToastModule, CardModule, Post, FileUploadModule, AvatarModule, CommonModule, OverlayBadgeModule, AvatarGroupModule],
    providers: [MessageService],
    templateUrl: 'profile.html',
    styleUrls: ['profile.scss']
})
export class Profile implements OnInit {

    id?: number;
    mail: string = '';
    name: string = '';
    surname: string = '';
    location: string = '';
    password: string = '';
    imageUrl: string = '';
    userModel: UserModel = {
        name: "",
        surname: "",
        mail: "",
        password: "",
        location: "",
        imageUrl: "",
        postCount: 0,
        followCount: 0,
        followerCount: 0,
        commentCount: 0
    }
    isMyPage: boolean = false;
    postCount: number = 0;
    followCount: number = 0;
    followerCount: number = 0;
    followUserList: UserModel[] = [];
    followerUserList: UserModel[] = [];
    filePath = PROJECT_CONSTANTS.FILE_PATH;

    constructor(
        private service: AuthService,
        private router: Router,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const userId = history.state.userId;
        this.isMyPage = userId == undefined || userId == Number(localStorage.getItem('userId'));
        this.service.getById(userId ? userId : Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.id = data.id;
                this.mail = data.mail;
                this.name = data.name;
                this.surname = data.surname;
                this.location = data.location;
                this.imageUrl = data.imageUrl;
                this.postCount = data.postCount;
                this.followCount = data.followCount;
                this.followerCount = data.followerCount;
            }
        })
        this.service.getFollowListByUserId(userId ? userId : Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.followUserList = data;
            }
        });
        this.service.getFollowerListByUserId(userId ? userId : Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.followerUserList = data;
            }
        });
    }

    update() {
        this.userModel.id = this.id;
        this.userModel.mail = this.mail;
        this.userModel.password = this.password;
        this.userModel.name = this.name;
        this.userModel.surname = this.surname;
        this.userModel.location = this.location;
        this.userModel.imageUrl = this.imageUrl;
        this.service.update(this.userModel).subscribe({
            next: (data) => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'İşlem başarılı', life: 3000 });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: err?.error?.message });
            }
        });
    }

    onUpload(event: any) {
        const file: File = event.files[0];
        if (file) {
            this.service.uploadImage(this.id, file).subscribe({
                next: (response) => {
                    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Resim Yüklendi.' });
                    this.imageUrl = response.imageUrl;
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Resim Yüklenirken Hata Oluştu.' });
                }
            });
        }
    }

    onDeleteImage() {
        this.service.deleteImage(this.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Resim Silindi.' });
                this.imageUrl = '';
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Resim Silinirken Hata Oluştu.' });
            }
        });
    }

    get firstThreeUsers() {
        return this.followUserList.slice(0, 3);
    }

    get remainingUserCount() {
        return this.followUserList.length > 3 ? this.followUserList.length - 3 : 0;
    }

    get firstThreeUsersFollower() {
        return this.followerUserList.slice(0, 3);
    }

    get remainingUserCountFollower() {
        return this.followerUserList.length > 3 ? this.followerUserList.length - 3 : 0;
    }
}
