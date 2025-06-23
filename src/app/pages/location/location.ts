import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EnumPostType } from '../enum/enum.post.type';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ChipModule } from 'primeng/chip';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { AccordionModule } from 'primeng/accordion';
import { LocationService } from '../service/location.service';
import { LocationModel } from './model/location.model';
import * as L from 'leaflet';
import { PopoverModule } from 'primeng/popover';
import { EnumFishType } from '../enum/enum.fish.type';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Post } from '../post/post';
import { CardModule } from 'primeng/card';

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
    selector: 'app-location',
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
        PopoverModule,
        MultiSelectModule,
        ToggleSwitchModule,
        Post,
        CardModule
    ],
    templateUrl: 'location.html',
    providers: [MessageService, LocationService, ConfirmationService],
    styleUrls: ['location.scss']
})
export class Location implements OnInit {
    @Input() isProfilePage: boolean = false;
    formDialog: boolean = false;
    submitted: boolean = false;
    postTypeList = Object.keys(EnumPostType).map((key) => ({
        label: EnumPostType[key as keyof typeof EnumPostType],
        value: key
    }));
    userId?: number;
    filePath: string = PROJECT_CONSTANTS.FILE_PATH;

    map!: L.Map;
    marker?: L.Marker;
    selectedLocation: LocationModel = {};
    fishTypeList = Object.keys(EnumFishType).map((key) => ({
        label: EnumFishType[key as keyof typeof EnumFishType],
        value: key
    }));

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private service: LocationService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.setMapConfig();
        this.initMap();
        this.getList();
        this.userId = Number(localStorage.getItem('userId'));
    }

    setMapConfig() {
        L.Marker.prototype.options.icon = L.icon({
            iconUrl: 'assets/leaflet/marker-icon.png',
            iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
            shadowUrl: 'assets/leaflet/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
    }

    initMap(): void {
        this.map = L.map('map').setView([40.15088231873142, 32.40294098854066], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'MERA'
        }).addTo(this.map);

        this.map.on('click', (e: L.LeafletMouseEvent) => {
            this.selectedLocation = {};
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            if (this.marker) {
                this.map.removeLayer(this.marker);
            }

            this.marker = L.marker([lat, lng]).addTo(this.map);

            this.formDialog = true;

            this.selectedLocation.coordinate = '[' + lat.toString() + ',' + lng.toString() + ']';

            // Adres bilgisini API ile al
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(response => response.json())
                .then(data => {
                    // API'den dönen adres bilgisini kullan
                    this.selectedLocation.address = data.display_name || 'Adres bulunamadı';
                })
                .catch(err => {
                    console.error('Adres alınamadı', err);
                    this.selectedLocation.address = 'Adres alınamadı';
                });
        });

    }

    getList(page: number = 0, size: number = 10) {
        this.service.getList(Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                data.forEach((location) => {
                    if (location.coordinate) {
                        try {
                            const [lat, lng] = JSON.parse(location.coordinate);
                            const marker = L.marker([lat, lng]).addTo(this.map);

                            marker.on('click', () => {
                                this.selectedLocation = location;
                                this.formDialog = true;
                            });
                        } catch (e) {
                            console.error('Geçersiz coordinate:', location.coordinate);
                        }
                    }
                });
            },
            error: (err) => {
                console.log(err);
            }
        });

    }

    hideDialog() {
        this.formDialog = false;
        this.submitted = false;
    }

    delete(selectedItem: LocationModel) {
        this.confirmationService.confirm({
            message: selectedItem.name + ' silmek istediğinize emin misiniz' + '?',
            header: 'Onaylama',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.service.deleteById(selectedItem.id).subscribe({
                //     next: (data) => {
                //         this.selectedItem = <PostModel>{};
                //         this.messageService.add({
                //             severity: 'success',
                //             summary: 'Başarılı',
                //             detail: 'Seçili ürün silindi',
                //             life: 3000
                //         });
                //         this.findPostWithPagination();
                //     },
                //     error: (err) => {
                //         console.log(err);
                //     }
                // });
            }
        });
    }

    save() {
        this.submitted = true;
        if (this.selectedLocation.id) {
            this.service.update(this.selectedLocation).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Başarılı',
                        detail: 'Kaydedildi',
                        life: 3000
                    });
                    this.getList();
                },
                error: (err) => {
                    console.log(err);
                }
            });
        } else {
            this.selectedLocation.isPublic = this.selectedLocation.isPublic != null;
            this.selectedLocation.userId = Number(localStorage.getItem('userId'));
            this.service.save(this.selectedLocation).subscribe({
                next: (data) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Başarılı',
                        detail: 'Kaydedildi',
                        life: 3000
                    });
                    this.getList();
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }

        this.formDialog = false;
        this.selectedLocation = <LocationModel>{};

    }

    likePost(location: LocationModel) {
        // this.service.likePost(post.id, Number(localStorage.getItem('userId'))).subscribe({
        //     next: (data) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Başarılı',
        //             detail: 'Kaydedildi',
        //             life: 3000
        //         });
        //         this.findPostWithPagination();
        //     },
        //     error: (err) => {
        //         console.log(err);
        //     }
        // });
    }

    unLikePost(location: LocationModel) {
        // this.service.unLikePost(post.id, Number(localStorage.getItem('userId'))).subscribe({
        //     next: (data) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Başarılı',
        //             detail: 'Kaydedildi',
        //             life: 3000
        //         });
        //         this.findPostWithPagination();
        //     },
        //     error: (err) => {
        //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
        //     }
        // });
    }

    checkFormDisable(): boolean {
        if (!this.selectedLocation?.id) {
            return false;
        } else {
            if (this.userId == this.selectedLocation?.userModel?.id) {
                return false;
            } else {
                return true;
            }
        }
    }
}
