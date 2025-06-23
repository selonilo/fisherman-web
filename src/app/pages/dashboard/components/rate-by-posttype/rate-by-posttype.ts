import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { EnumPostType } from '../../../enum/enum.post.type';

@Component({
    standalone: true,
    selector: 'app-rate-by-posttype',
    imports: [CommonModule, ButtonModule, MenuModule],
    templateUrl: 'rate-by-posttype.html'
})
export class RateByPosttype {
    posttypeList: EnumPostType[] = Object.values(EnumPostType);
}
