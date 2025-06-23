import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    providers: [MessageService],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent { }
