import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login/login';
import { Error } from './error';
import { Register } from './register/register';
import { RefreshPassword } from './refresh-password/refresh-password';
import { Profile } from './profile/profile';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'refresh-password', component: RefreshPassword },
] as Routes;
