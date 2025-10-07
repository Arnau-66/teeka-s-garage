import { Routes } from '@angular/router';
import { StarshipsListComponent } from './features/starships/starships-list/starships-list';
import { StarshipDetailsComponent } from './features/starships/starship-details/starship-details';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'Home',
        component: HomeComponent,
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
        redirectTo: 'starships',
        pathMatch: 'full'
    }

];
