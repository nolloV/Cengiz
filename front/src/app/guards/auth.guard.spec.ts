import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SessionService } from '../services/session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { expect } from '@jest/globals';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let sessionService: Partial<jest.Mocked<SessionService>>;
    let router: Partial<jest.Mocked<Router>>;

    beforeEach(() => {
        // Création d'un BehaviorSubject pour simuler l'état de connexion
        const isLoggedSubject = new BehaviorSubject<boolean>(false);

        // Création d'un mock pour SessionService avec les propriétés et méthodes nécessaires
        const sessionServiceMock: Partial<jest.Mocked<SessionService>> = {
            isLogged: false,
            sessionInformation: undefined,
            $isLogged: jest.fn().mockReturnValue(isLoggedSubject.asObservable()),
            logIn: jest.fn(),
            logOut: jest.fn()
        };

        // Création d'un mock pour Router avec la méthode navigate
        const routerMock: Partial<jest.Mocked<Router>> = {
            navigate: jest.fn()
        };

        // Configuration du module de test avec les mocks
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                AuthGuard,
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        });

        // Injection des services mockés
        authGuard = TestBed.inject(AuthGuard);
        sessionService = TestBed.inject(SessionService) as unknown as Partial<jest.Mocked<SessionService>>;
        router = TestBed.inject(Router) as unknown as Partial<jest.Mocked<Router>>;
    });

    // Test d'intégration pour vérifier que l'utilisateur authentifié peut accéder à la route
    it('should allow the authenticated user to access the route', () => {
        sessionService.isLogged = true;

        const result = authGuard.canActivate();

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    // Test d'intégration pour vérifier que l'utilisateur non authentifié est redirigé vers la page de connexion
    it('should redirect an unauthenticated user to the login route', () => {
        sessionService.isLogged = false;

        const result = authGuard.canActivate();

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
});