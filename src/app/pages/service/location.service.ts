import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import { LocationModel } from '../location/model/location.model';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'location';

    constructor(private http: HttpClient) { }

    getList(userId: number): Observable<LocationModel[]> {
        return this.http.get<LocationModel[]>(this.apiUrl + '/getList/' + userId);
    }

    update(location: LocationModel): Observable<LocationModel> {
        return this.http.put<LocationModel>(this.apiUrl + '/update', location);
    }

    save(location: LocationModel): Observable<LocationModel> {
        return this.http.post<LocationModel>(this.apiUrl + '/save', location);
    }

}
