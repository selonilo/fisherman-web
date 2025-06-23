import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../service/auth.service';
import { LoginModel } from '../model/login.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    templateUrl: "login.html" 
})
export class Login {

    checked: boolean = false;

    mail: string = "";
    password: string = "";

    loginModel: LoginModel = {
        mail: "",
        password: ""
    };

    constructor(
        private service: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    login() {
        this.loginModel.mail = this.mail;
        this.loginModel.password = this.password;
        this.service.login(this.loginModel).subscribe({
            next: (data) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId.toString());
                localStorage.setItem('name', data.name);
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'İşlem başarılı' });
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: err?.error?.message });
                console.log(err);
            }
        });
    }
}
