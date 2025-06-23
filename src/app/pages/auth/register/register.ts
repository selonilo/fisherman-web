import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { UserModel } from '../model/user.model';
import { AuthService } from '../../service/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    templateUrl: 'register.html'
})
export class Register {
    mail: string = '';

    name: string = '';

    surname: string = '';

    location: string = '';

    password: string = '';

    userModel: UserModel = {
        name: "",
        surname: "",
        mail: "",
        password: "",
        location: "",
        imageUrl: "",
        postCount: 0,
        followCount: 0,
        followerCount: 0,
        commentCount: 0
    }

    constructor(
            private service: AuthService,
            private router: Router,
            private messageService: MessageService
        ) { }

    register() {
        this.userModel.mail = this.mail;
        this.userModel.password = this.password;
        this.userModel.name = this.name;
        this.userModel.surname = this.surname;
        this.userModel.location = this.location;
        this.service.register(this.userModel).subscribe({
            next: (data) => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'İşlem başarılı', life: 3000 });
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: err?.error?.message });
            }
        });

    }
}
