import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import {FavoriteModel} from "../common/model/favorite.model";

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'post';

    constructor(private http: HttpClient) { }

    favorite(favorite: FavoriteModel): Observable<FavoriteModel> {
        return this.http.post<FavoriteModel>(this.apiUrl + '/favorite', favorite);
    }

    unFavorite(favorite: FavoriteModel): Observable<FavoriteModel> {
        return this.http.post<FavoriteModel>(this.apiUrl + '/unFavorite', favorite);
    }

}
