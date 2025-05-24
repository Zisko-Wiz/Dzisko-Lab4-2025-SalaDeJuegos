import { Routes } from '@angular/router';

export const routes: Routes =
[
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'juegos',
        loadChildren: () => import('./modules/juegos/juegos.module').then(m => m.JuegosModule)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'quienSoy',
        loadComponent: () => import('./components/about/about.component').then(c => c.AboutComponent)
    },
    {
        path: 'registrarse',
        loadComponent: () => import('./components/registro/registro.component').then(c => c.RegistroComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./components/error/error.component').then(c => c.ErrorComponent)
    },
];
