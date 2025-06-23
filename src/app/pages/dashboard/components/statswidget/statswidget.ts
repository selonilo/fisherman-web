import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth.service';
import { PostService } from '../../../service/post.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    templateUrl: "statswidget.html"
})
export class StatsWidget implements OnInit {

    postCount: number = 0;
    followCount: number = 0;
    followerCount: number = 0;
    commentCount: number = 0;
    totalPostCount: number = 0;
    totalUserCount: number = 0;
    totalLikeCount: number = 0;
    totalCommentCount: number = 0;

    constructor(private authService: AuthService, private postService: PostService) { }

    ngOnInit(): void {
        this.authService.getById(Number(localStorage.getItem('userId'))).subscribe({
            next: (data) => {
                this.postCount = data.postCount;
                this.followCount = data.followCount;
                this.followerCount = data.followerCount;
                this.commentCount = data.commentCount;
            }
        });
        this.postService.getTotalStats().subscribe({
            next: (data) => {
                this.totalPostCount = data.totalPostCount;
                this.totalUserCount = data.totalUserCount;
                this.totalLikeCount = data.totalLikeCount;
                this.totalCommentCount = data.totalCommentCount;
            }
        })
    }



}
