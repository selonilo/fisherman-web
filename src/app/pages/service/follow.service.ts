import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import {FollowModel} from "../common/model/follow.model";

@Injectable({
    providedIn: 'root'
})
export class FollowService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'follow';

    constructor(private http: HttpClient) { }

    follow(model: FollowModel): Observable<void> {
        return this.http.post<void>(this.apiUrl + '/follow', model);
    }

    unFollow(model: FollowModel): Observable<void> {
        return this.http.post<void>(this.apiUrl + '/unFollow', model);
    }

}
