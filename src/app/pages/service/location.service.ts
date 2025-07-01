import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import { LocationModel } from '../location/model/location.model';
import {LocationQueryModel} from "../location/model/location-query.model";

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'location';

    constructor(private http: HttpClient) { }

    getList(userId: number): Observable<LocationModel[]> {
        return this.http.get<LocationModel[]>(this.apiUrl + '/getList/' + userId);
    }

    getListByQueryModel(queryModel: LocationQueryModel): Observable<LocationModel[]> {
        return this.http.post<LocationModel[]>(this.apiUrl + '/getListByQueryModel', queryModel);
    }

    update(location: LocationModel): Observable<LocationModel> {
        return this.http.put<LocationModel>(this.apiUrl + '/update', location);
    }

    save(location: LocationModel): Observable<LocationModel> {
        return this.http.post<LocationModel>(this.apiUrl + '/save', location);
    }

    approve(locationId?: number, userId?: number): Observable<LocationModel> {
        return this.http.put<LocationModel>(this.apiUrl + '/approve' + '/' + locationId + '/' + userId, "");
    }

    unApprove(locationId?: number, userId?: number): Observable<LocationModel> {
        return this.http.put<LocationModel>(this.apiUrl + '/unApprove' + '/' + locationId + '/' + userId, "");
    }

    deleteById(id: number): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/delete/' + id);
    }

}
