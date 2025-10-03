import { Routes } from '@angular/router';
import { StarshipsListComponent } from './features/starships/starships-list/starships-list';

export const routes: Routes = [
    {
     path: 'starships',
     component: StarshipsListComponent,
    },

    {
     path: '',
     redirectTo: 'starships',
     pathMatch: 'full'
    }

];
