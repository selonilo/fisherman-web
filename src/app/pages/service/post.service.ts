import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import { PostModel } from '../post/model/post.model';
import { PostQueryModel } from '../post/model/post.query.model';
import { Page } from '../common/model/page.model';
import { TotalStatsModel } from '../dashboard/components/statswidget/model/total-stats.model';
import { CommentModel } from '../post/model/comment.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'post';

    constructor(private http: HttpClient) { }

    save(material: PostModel): Observable<PostModel> {
        return this.http.post<PostModel>(this.apiUrl + '/save', material);
    }

    savePost(post: PostModel) {
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('content', post.content);
        formData.append('userId', post.userId.toString());
        formData.append('fishType', post.fishType);
        if (post.file) {
            formData.append('file', post.file, post.file.name);
        }
        if (post.locationId !== undefined) {
            formData.append('locationId', post.locationId.toString());
        }

        return this.http.post<PostModel>(this.apiUrl + '/save', formData);
    }

    deleteById(id: number): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/delete/' + id);
    }

    getList(userId: number): Observable<PostModel[]> {
        return this.http.get<PostModel[]>(this.apiUrl + '/getList/' + userId);
    }

    getListByUserId(userId: number): Observable<PostModel[]> {
        return this.http.get<PostModel[]>(this.apiUrl + '/getListByUserId/' + userId);
    }

    getListByUserIdAndLoginUserId(userId: number, loginUserId: number): Observable<PostModel[]> {
        return this.http.get<PostModel[]>(this.apiUrl + '/getListByUserIdAndLoginUserId/' + userId + '/' + loginUserId);
    }

    findPostWithPagination(page: number, size: number, queryModel: PostQueryModel): Observable<Page<PostModel>> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.post<Page<PostModel>>(
            `${this.apiUrl}/queryPage`,
            queryModel,
            { params }
        );
    }

    likePost(postId: number, userId: number): Observable<void> {
        return this.http.put<void>(this.apiUrl + '/like/' + postId + '/' + userId, "");
    }

    unLikePost(postId: number, userId: number): Observable<void> {
        return this.http.put<void>(this.apiUrl + '/unLike/' + postId + '/' + userId, "");
    }

    isLiked(postId: number, userId: number): Observable<boolean> {
        return this.http.get<boolean>(this.apiUrl + '/isLiked/' + postId + '/' + userId);
    }

    uploadImage(postId: number | undefined, file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string }>(this.apiUrl + '/uploadImage/' + postId, formData);
    }

    deleteImage(postId: number | undefined): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/deleteImage/' + postId);
    }

    getTotalStats(): Observable<TotalStatsModel> {
        return this.http.get<TotalStatsModel>(this.apiUrl + '/getTotalStats');
    }

    getListByLocationId(locationId: number, userId: number): Observable<PostModel[]> {
        return this.http.get<PostModel[]>(this.apiUrl + '/getListByLocationId/' + locationId + '/' + userId);
    }

}
