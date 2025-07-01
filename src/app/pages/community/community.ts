import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Table, TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {SelectModule} from 'primeng/select';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {DialogModule} from 'primeng/dialog';
import {TagModule} from 'primeng/tag';
import {InputIconModule} from 'primeng/inputicon';
import {IconFieldModule} from 'primeng/iconfield';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PostService} from '../service/post.service';
import {DataViewModule} from 'primeng/dataview';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ChipModule} from 'primeng/chip';
import {PROJECT_CONSTANTS} from '../constant/project.constants';
import {Router} from '@angular/router';
import {FileUploadModule} from 'primeng/fileupload';
import {AvatarModule} from 'primeng/avatar';
import {AuthService} from '../service/auth.service';
import {AccordionModule} from 'primeng/accordion';
import {EnumFishType} from '../enum/enum.fish.type';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CommentService} from '../service/comment.service';
import {CommunityModel} from "./model/community.model";
import {CommunityService} from "../service/community.service";
import {ToggleSwitch} from "primeng/toggleswitch";
import {FollowService} from "../service/follow.service";
import {FollowModel} from "../common/model/follow.model";
import {EnumContentType} from "../enum/enum.content.type";
import {PostModel} from "../post/model/post.model";
import {Post} from "../post/post";

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-community',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DataViewModule,
        SelectButtonModule,
        ChipModule,
        FileUploadModule,
        AvatarModule,
        TextareaModule,
        AccordionModule,
        ProgressSpinnerModule,
        ToggleSwitch,
        Post
    ],
    templateUrl: 'community.html',
    providers: [MessageService, Community, ConfirmationService],
    styleUrls: ['community.scss']
})
export class Community implements OnInit {
    @Input() isProfilePage: boolean = false;
    formDialog: boolean = false;
    submitted: boolean = false;
    @ViewChild('dt') dt!: Table;
    cols!: Column[];
    tableList: CommunityModel[] = [];
    selectedItem!: CommunityModel;
    loading: boolean = false;
    showPost: boolean = false;
    totalRecords: number = 0;
    pageSize: number = 10;
    currentPage: number = 0;
    layout: 'list' | 'grid' = 'list';
    options = ['list', 'grid'];
    userId?: number;
    filePath: string = PROJECT_CONSTANTS.FILE_PATH;
    comment: string = '';
    file?: File;
    communityId?: number;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private service: CommunityService,
        private router: Router,
        private followService: FollowService
    ) {
    }

    ngOnInit() {
        this.findPostWithPagination();
        this.userId = Number(localStorage.getItem('userId'));
    }

    findPostWithPagination(page: number = 0, size: number = 10) {
        this.loading = true;
        this.service.getList(Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.tableList = data;
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
            }
        });

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.selectedItem = <CommunityModel>{};
        this.submitted = false;
        this.formDialog = true;
    }

    edit(selectedItem: CommunityModel) {
        this.selectedItem = {...selectedItem};
        this.formDialog = true;
    }

    hideDialog() {
        this.formDialog = false;
        this.submitted = false;
    }

    delete(selectedItem: CommunityModel) {
        this.confirmationService.confirm({
            message: selectedItem.name + ' silmek istediğinize emin misiniz' + '?',
            header: 'Onaylama',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.service.deleteById(selectedItem.id).subscribe({
                    next: (data) => {
                        this.selectedItem = <CommunityModel>{};
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Seçili ürün silindi',
                            life: 3000
                        });
                        this.findPostWithPagination();
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            }
        });
    }

    save() {
        this.submitted = true;
        if (this.selectedItem.name?.trim()) {
            this.selectedItem.userId = Number(localStorage.getItem('userId'));
            if (this.selectedItem.id) {
                this.service.update(this.selectedItem).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Seçili ürün güncellendi',
                            life: 3000
                        });
                        this.findPostWithPagination();
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            } else {
                this.selectedItem.file = this.file;
                this.service.save(this.selectedItem).subscribe({
                    next: (data) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Kaydedildi',
                            life: 3000
                        });
                        this.findPostWithPagination();
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            }

            this.formDialog = false;
            this.selectedItem = <CommunityModel>{};
        }
    }

    routeProfile(userId: any) {
        this.router.navigate(['/pages/profile'], {state: {userId: userId}});
    }

    onUpload(event: any) {
        const file: File = event.files[0];
        this.file = file;
    }

    onDeleteImage() {
        this.service.deleteImage(this.selectedItem.id).subscribe({
            next: () => {
                this.messageService.add({severity: 'info', summary: 'Success', detail: 'Resim Silindi.'});
                this.selectedItem.imageUrl = '';
                this.tableList.forEach(x => {
                    if (this.selectedItem.id == x.id) {
                        x.imageUrl = this.selectedItem.imageUrl;
                    }
                })
            },
            error: () => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Resim Silinirken Hata Oluştu.'});
            }
        });
    }

    followCommunity(item: any) {
        const followModel: FollowModel = {
            userId: Number(localStorage.getItem('userId')),
            contentId: item.id,
            contentType: EnumContentType.COMMUNITY
        }
        this.followService.follow(followModel).subscribe({
            next: (data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Kaydedildi',
                    life: 3000
                });
                this.findPostWithPagination();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    unFollowCommunity(item: any) {
        const followModel: FollowModel = {
            userId: Number(localStorage.getItem('userId')),
            contentId: item.id,
            contentType: EnumContentType.COMMUNITY
        }
        this.followService.unFollow(followModel).subscribe({
            next: (data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Kaydedildi',
                    life: 3000
                });
                this.findPostWithPagination();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    getPost(community: CommunityModel) {
        this.communityId = community.id;
        this.showPost = true;
    }

    goBack() {
        this.showPost = false;
    }
}
