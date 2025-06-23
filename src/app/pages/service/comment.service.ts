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
export class CommentService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'comment';

    constructor(private http: HttpClient) { }

    save(material: CommentModel): Observable<CommentModel> {
        return this.http.post<CommentModel>(this.apiUrl + '/save', material);
    }

    update(material: CommentModel): Observable<CommentModel> {
        return this.http.post<CommentModel>(this.apiUrl + '/update', material);
    }

    deleteById(id?: number): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/delete/' + id);
    }

}
