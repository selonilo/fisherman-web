import { Component, OnInit } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../service/product.service';
import { PostService } from '../../../service/post.service';
import { PostQueryModel } from '../../../post/model/post.query.model';
import { PostModel } from '../../../post/model/post.model';
import { PROJECT_CONSTANTS } from '../../../constant/project.constants';

@Component({
    standalone: true,
    selector: 'app-my-posts',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    templateUrl: 'my-posts.html',
    providers: [ProductService]
})
export class MyPosts implements OnInit {
    products!: Product[];

    loading: boolean = false;

    userId?: number;

    tableList: PostModel[] = [];

    selectedItem!: PostModel;

    constructor(private postService: PostService) { }

    ngOnInit() {
        this.findPostWithPagination();
        this.userId = Number(localStorage.getItem('userId'));
    }

    findPostWithPagination(page: number = 0, size: number = 10) {
        this.loading = true;
        this.postService.getListByUserId(Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.tableList = data;
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
            }
        });


    }
}
