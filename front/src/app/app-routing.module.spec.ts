import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { MeComponent } from './components/me/me.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { SessionService } from './services/session.service';
import { BehaviorSubject } from 'rxjs';
import { expect } from '@jest/globals';

// Définition du bloc de tests pour le module de routage AppRoutingModule
describe('AppRoutingModule', () => {
    let router: Router;
    let location: Location;
    let sessionService: SessionService;

    // Configuration du module de test avant chaque test
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([]), AppRoutingModule], // Importation des modules de test et de routage
            declarations: [MeComponent, NotFoundComponent], // Déclaration des composants utilisés dans les tests
            providers: [
                {
                    provide: AuthGuard,
                    useValue: {
                        canActivate: () => true // Simule que l'utilisateur est authentifié
                    }
                },
                {
                    provide: UnauthGuard,
                    useClass: class {
                        constructor(private router: Router, private sessionService: SessionService) { }
                        canActivate() {
                            if (this.sessionService.isLogged) {
                                this.router.navigate(['rentals']);
                                return false;
                            }
                            return true;
                        }
                    },
                    deps: [Router, SessionService] // Dépendances pour le garde non authentifié
                },
                {
                    provide: SessionService,
                    useValue: {
                        isLogged: false, // Simule que l'utilisateur n'est pas authentifié
                        $isLogged: () => new BehaviorSubject<boolean>(false).asObservable(), // Observable pour l'état de connexion
                        logIn: jest.fn(), // Mock de la méthode logIn
                        logOut: jest.fn() // Mock de la méthode logOut
                    }
                }
            ]
        });

        // Initialisation des services de routage et de localisation
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        sessionService = TestBed.inject(SessionService);

        // Initialisation de la navigation
        router.initialNavigation();
    });

    // Test pour vérifier la navigation vers le module sessions
    it('should navigate to "sessions" redirects to sessions module', async () => {
        await router.navigate(['sessions']);
        expect(location.path()).toBe('/sessions');
    });

    // Test pour vérifier la navigation vers le composant MeComponent
    it('should navigate to "me" redirects to MeComponent', async () => {
        await router.navigate(['me']);
        expect(location.path()).toBe('/me');
    });

    // Test pour vérifier la navigation vers le composant NotFoundComponent
    it('should navigate to "404" redirects to NotFoundComponent', async () => {
        await router.navigate(['404']);
        expect(location.path()).toBe('/404');
    });

    // Test pour vérifier la redirection des chemins inconnus vers le composant NotFoundComponent
    it('should redirect unknown paths to "404"', async () => {
        await router.navigate(['unknown']);
        expect(location.path()).toBe('/404');
    });
});