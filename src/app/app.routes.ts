import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'shop', component: ShopComponent},
    {path: 'account', loadChildren: () => import('./pages/account/routes').then(r => r.accountRoutes)},
    {path: 'admin', loadComponent: () => import('./pages/admin/admin.component')
        .then(c => c.AdminComponent), canActivate: [authGuard, adminGuard]},
    {path: 'not-found', component: NotFoundComponent},
    {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];
