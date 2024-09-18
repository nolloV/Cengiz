import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { expect } from '@jest/globals';

describe('AuthRoutingModule', () => {
    let router: Router; // Déclaration de la variable pour le routeur
    let location: Location; // Déclaration de la variable pour la localisation

    beforeEach(() => {
        // Configuration du module de test
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    // Définition des routes pour les tests
                    { title: 'Login', path: 'login', component: LoginComponent },
                    { title: 'Register', path: 'register', component: RegisterComponent }
                ]),
                AuthRoutingModule // Import du module de routage AuthRoutingModule
            ],
            declarations: [
                // Déclaration des composants utilisés dans les routes
                LoginComponent,
                RegisterComponent
            ]
        });

        // Injection des dépendances
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        router.initialNavigation(); // Initialisation de la navigation du routeur
    });

    it('should navigate to "login" redirects you to /login', async () => {
        // Test pour vérifier que la navigation vers "login" redirige vers /login
        await router.navigate(['login']);
        expect(location.path()).toBe('/login');
    });

    it('should navigate to "register" redirects you to /register', async () => {
        // Test pour vérifier que la navigation vers "register" redirige vers /register
        await router.navigate(['register']);
        expect(location.path()).toBe('/register');
    });
});