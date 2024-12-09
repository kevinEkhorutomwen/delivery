import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'account', loadChildren: () => import('./pages/account/routes').then(r => r.accountRoutes)},
];
