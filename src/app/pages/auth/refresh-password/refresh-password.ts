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
import { PasswordRefreshModel } from '../model/password-refresh-model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-refresh-password',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule],
    providers: [MessageService],
    templateUrl: "refresh-password.html"
})
export class RefreshPassword {
    mail: string = '';

    passwordRefreshModel: PasswordRefreshModel = {
        mail: ""
    };

    constructor(
        private service: AuthService,
        private router: Router,
        private messageService: MessageService
    ) { }

    refreshPassword() {
        this.passwordRefreshModel.mail = this.mail;
        this.service.refreshPassword(this.passwordRefreshModel).subscribe({
            next: (data) => {
                this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'İşlem başarılı', life: 3000 });
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Hata', detail: err?.error?.message });
                console.log(err);
            }
        });

    }
}
