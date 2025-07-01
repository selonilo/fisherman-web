import {Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
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
import {EnumPostType} from '../enum/enum.post.type';
import {DataViewModule} from 'primeng/dataview';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ChipModule} from 'primeng/chip';
import {PROJECT_CONSTANTS} from '../constant/project.constants';
import {Router} from '@angular/router';
import {FileUploadModule} from 'primeng/fileupload';
import {AvatarModule} from 'primeng/avatar';
import {AccordionModule} from 'primeng/accordion';
import {LocationService} from '../service/location.service';
import {LocationModel} from './model/location.model';
import * as L from 'leaflet';
import {PopoverModule} from 'primeng/popover';
import {EnumFishType} from '../enum/enum.fish.type';
import {MultiSelectModule} from 'primeng/multiselect';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {Post} from '../post/post';
import {CardModule} from 'primeng/card';
import {FavoriteService} from "../service/favorite.service";
import {FavoriteModel} from "../common/model/favorite.model";
import {EnumContentType} from "../enum/enum.content.type";
import {CheckboxModule} from "primeng/checkbox";
import {LocationQueryModel} from "./model/location-query.model";
import {FloatLabel} from "primeng/floatlabel";

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
        CardModule,
        CheckboxModule,
        FloatLabel
    ],
    templateUrl: 'location.html',
    providers: [MessageService, LocationService, ConfirmationService],
    styleUrls: ['location.scss']
})
export class Location implements OnInit {
    @Input() isProfilePage: boolean = false;
    formDialog: boolean = false;
    submitted: boolean = false;
    onlyFavorite: boolean = false;
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

    @ViewChild('popupTemplate') popupTemplateRef!: TemplateRef<any>;
    markerMap: Map<number, L.Marker> = new Map();
    queryModel: LocationQueryModel = {}

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private service: LocationService,
        private router: Router,
        private viewContainerRef: ViewContainerRef,
        private favoriteService: FavoriteService
    ) {
    }

    ngOnInit() {
        this.setMapConfig();
        this.getAllList();
        this.userId = Number(localStorage.getItem('userId'));
    }

    getAllList() {
        this.initMap();
        this.getList();
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
        // Eski marker'ları temizle
        this.markerMap.forEach((marker) => {
            this.map.removeLayer(marker);
        });
        this.markerMap.clear();

        this.queryModel.userId = Number(localStorage.getItem('userId'));
        this.service.getListByQueryModel(this.queryModel).subscribe({
            next: (data) => {
                data.forEach((location) => {
                    if (location.coordinate) {
                        try {
                            const [lat, lng] = JSON.parse(location.coordinate);
                            const marker = L.marker([lat, lng]).addTo(this.map);

                            if (location.id)
                                this.markerMap.set(location.id, marker);

                            marker.on('click', () => {
                                this.selectedLocation = location;

                                const embeddedView = this.popupTemplateRef.createEmbeddedView({location});
                                this.viewContainerRef.insert(embeddedView);
                                embeddedView.detectChanges();

                                const container = document.createElement('div');
                                embeddedView.rootNodes.forEach(node => container.appendChild(node));

                                marker.unbindPopup();
                                marker.bindPopup(container).openPopup();
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

    openDialogFromPopup(location: any) {
        this.selectedLocation = location;
        this.formDialog = true;
    }

    delete(selectedItem: LocationModel) {
        this.confirmationService.confirm({
            message: selectedItem.name + ' silmek istediğinize emin misiniz?',
            header: 'Onaylama',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (selectedItem?.id) {
                    this.service.deleteById(selectedItem.id).subscribe({
                        next: () => {
                            if (selectedItem.id) {
                                const marker = this.markerMap.get(selectedItem.id);
                                if (marker) {
                                    marker.closePopup();
                                    this.map.removeLayer(marker);
                                    this.markerMap.delete(selectedItem.id);
                                }
                            }
                            this.selectedLocation = <LocationModel>{};

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Başarılı',
                                detail: 'Seçili ürün silindi',
                                life: 3000
                            });

                            this.getAllList();
                        },
                        error: (err) => {
                            console.log(err);
                        }
                    });
                }
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

    favorite(location: LocationModel) {
        const favoriteModel: FavoriteModel = {
            userId: Number(localStorage.getItem('userId')),
            contentId: location.id,
            contentType: EnumContentType.LOCATION
        }
        this.favoriteService.favorite(favoriteModel).subscribe({
            next: (data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Kaydedildi',
                    life: 3000
                });
                this.getList();
                this.selectedLocation.isFavorited = true;
                if (this.selectedLocation.favoriteCount) {
                    this.selectedLocation.favoriteCount++;
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    unFavorite(location: LocationModel) {
        const favoriteModel: FavoriteModel = {
            userId: Number(localStorage.getItem('userId')),
            contentId: location.id,
            contentType: EnumContentType.LOCATION
        }
        this.favoriteService.unFavorite(favoriteModel).subscribe({
            next: (data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Kaydedildi',
                    life: 3000
                });
                this.getList();
                this.selectedLocation.isFavorited = false;
                if (this.selectedLocation.favoriteCount) {
                    this.selectedLocation.favoriteCount--;
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
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

    approve(location: LocationModel) {
        this.service.approve(location.id, Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Kaydedildi',
                    life: 3000
                });
                this.selectedLocation.isApproved = true;
                if (this.selectedLocation.approveCount) {
                    ++this.selectedLocation.approveCount;
                }
                this.getList();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    unApprove(location: LocationModel) {
        this.service.unApprove(location.id, Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Kaydedildi',
                    life: 3000
                });
                this.selectedLocation.isApproved = false;
                if (this.selectedLocation.approveCount) {
                    --this.selectedLocation.approveCount;
                }
                this.getList();
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    checkboxChange() {
        this.getList();
    }

    inputChange() {
        if (this.queryModel && this.queryModel.name && this.queryModel.name.length >= 3) {
            this.getList();
        } else if (this.queryModel && this.queryModel.name == "" && this.queryModel.name.length == 0) {
            this.getList();
        }
    }
}
