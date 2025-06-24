import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PROJECT_CONSTANTS } from '../constant/project.constants';
import { PasswordRefreshModel } from '../auth/model/password-refresh-model';
import { ResponseMessageModel } from '../common/model/response-message.model';
import { LoginModel } from '../auth/model/login.model';
import { TokenModel } from '../auth/model/token.model';
import { UserModel } from '../auth/model/user.model';
import { NotificationModel } from '../auth/model/notification.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = PROJECT_CONSTANTS.API_URL + 'auth';

    constructor(private http: HttpClient) { }

    getById(id: number): Observable<UserModel> {
        return this.http.get<UserModel>(this.apiUrl + '/getById/' + id);
    }

    refreshPassword(passwordRefreshModel: PasswordRefreshModel): Observable<ResponseMessageModel> {
        return this.http.post<ResponseMessageModel>(this.apiUrl + '/refreshPassword', passwordRefreshModel);
    }

    login(loginModel: LoginModel): Observable<TokenModel> {
        return this.http.post<TokenModel>(this.apiUrl + '/login', loginModel);
    }

    update(userModel: UserModel): Observable<UserModel> {
        return this.http.put<UserModel>(this.apiUrl + '/update', userModel);
    }

    register(userModel: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(this.apiUrl + '/register', userModel);
    }

    uploadImage(userId: number | undefined, file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ imageUrl: string }>(this.apiUrl + '/uploadImage/' + userId, formData);
    }

    deleteImage(userId: number | undefined): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/deleteImage/' + userId);
    }

    getImage(userId: number): Observable<string> {
        return this.http.get<string>(this.apiUrl + '/getImage/' + userId);
    }

    getFollowListByUserId(userId: number): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(this.apiUrl + '/getFollowListByUserId/' + userId);
    }

    getFollowerListByUserId(userId: number): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(this.apiUrl + '/getFollowerListByUserId/' + userId);
    }

    getNotification(userId: number): Observable<NotificationModel[]> {
        return this.http.get<NotificationModel[]>(this.apiUrl + '/getNotification/' + userId);
    }
}
