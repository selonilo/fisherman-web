import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import { PostModel } from '../post/model/post.model';
import { PostQueryModel } from '../post/model/post.query.model';
import { Page } from '../common/model/page.model';
import { TotalStatsModel } from '../dashboard/components/statswidget/model/total-stats.model';
import { CommentModel } from '../post/model/comment.model';
import {CommunityModel} from "../community/model/community.model";

@Injectable({
    providedIn: 'root'
})
export class CommunityService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'community';

    constructor(private http: HttpClient) { }

    save(model: CommunityModel) {
        const formData = new FormData();
        formData.append('name', model.name);
        formData.append('description', model.description);
        formData.append('isPublic', model.isPublic ? model.isPublic.toString() : false.toString());
        formData.append('postConfirmation', model.postConfirmation ? model.postConfirmation.toString() : false.toString());
        formData.append('userId', model.userId.toString());
        if (model.file) {
            formData.append('file', model.file, model.file.name);
        }
        return this.http.post<PostModel>(this.apiUrl + '/save', formData);
    }

    update(model: CommunityModel): Observable<CommunityModel> {
        return this.http.put<CommunityModel>(this.apiUrl + '/update', model);
    }

    deleteById(id: number): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/delete/' + id);
    }

    getList(userId: number): Observable<CommunityModel[]> {
        return this.http.get<CommunityModel[]>(this.apiUrl + '/getList/' + userId);
    }

    getListByFollowed(userId: number): Observable<CommunityModel[]> {
        return this.http.get<CommunityModel[]>(this.apiUrl + '/getListByFollowed/' + userId);
    }

    uploadImage(postId: number | undefined, file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string }>(this.apiUrl + '/uploadImage/' + postId, formData);
    }

    deleteImage(postId: number | undefined): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/deleteImage/' + postId);
    }

}
