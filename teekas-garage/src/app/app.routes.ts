import { Routes } from '@angular/router';
import { StarshipsListComponent } from './features/starships/starships-list/starships-list';
import { StarshipDetailsComponent } from './features/starships/starship-details/starship-details';

export const routes: Routes = [
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
