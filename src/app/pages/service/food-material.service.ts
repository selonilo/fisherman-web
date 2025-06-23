import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import { FoodMaterialModel } from '../food/food-material/model/food-material.model';

@Injectable({
    providedIn: 'root'
})
export class FoodMaterialService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'food-material';

    constructor(private http: HttpClient) {}

    save(material: FoodMaterialModel): Observable<FoodMaterialModel> {
        return this.http.post<FoodMaterialModel>(this.apiUrl + '/save', material);
    }

    deleteById(id: number): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/deleteById/' + id);
    }

    getList(): Observable<FoodMaterialModel[]> {
        return this.http.get<FoodMaterialModel[]>(this.apiUrl + '/getList');
    }
}
