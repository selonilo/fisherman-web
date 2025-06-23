import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Post } from './post/post';
import { Profile } from './auth/profile/profile';
import { Location } from './location/location';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'post', component: Post },
    { path: 'location', component: Location },
    { path: 'profile', component: Profile },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
