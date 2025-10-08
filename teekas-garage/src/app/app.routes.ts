import { Routes } from '@angular/router';
import { StarshipsListComponent } from './features/starships/starships-list/starships-list';
import { StarshipDetailsComponent } from './features/starships/starship-details/starship-details';
import { HomeComponent } from './features/home/home';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [

    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'starships',
        component: StarshipsListComponent,
    },
    {
        path: 'starships/:id',
        component: StarshipDetailsComponent,
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }

];
