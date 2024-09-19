import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UnauthGuard } from './unauth.guard';
import { SessionService } from '../services/session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { expect } from '@jest/globals';

describe('UnauthGuard', () => {
    let unauthGuard: UnauthGuard;
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
                UnauthGuard,
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: Router, useValue: routerMock }
            ]
        });

        // Injection des services mockés
        unauthGuard = TestBed.inject(UnauthGuard);
        sessionService = TestBed.inject(SessionService) as unknown as Partial<jest.Mocked<SessionService>>;
        router = TestBed.inject(Router) as unknown as Partial<jest.Mocked<Router>>;
    });

    // Test pour vérifier que l'utilisateur non authentifié peut accéder à la route
    it('should allow the unauthenticated user to access the route', () => {
        sessionService.isLogged = false;

        const result = unauthGuard.canActivate();

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    // Test pour vérifier que l'utilisateur authentifié est redirigé vers la page des locations
    it('should redirect an authenticated user to the rentals route', () => {
        sessionService.isLogged = true;

        const result = unauthGuard.canActivate();

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['rentals']);
    });
});