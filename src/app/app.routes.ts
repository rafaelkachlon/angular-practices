import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'tic-tac-toe', pathMatch: 'full' },
    { path: 'tic-tac-toe', loadComponent: () => import('./tic-tac-toe/tic-tac-toe.component').then(c => c.TicTacToeComponent) }
];
