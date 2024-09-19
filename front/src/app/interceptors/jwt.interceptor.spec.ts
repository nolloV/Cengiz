import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { SessionService } from '../services/session.service';
import { expect } from '@jest/globals';

describe('JwtInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let sessionService: Partial<jest.Mocked<SessionService>>;

    beforeEach(() => {
        // Création d'un mock pour SessionService avec les propriétés nécessaires
        const sessionServiceMock: Partial<jest.Mocked<SessionService>> = {
            isLogged: false,
            sessionInformation: undefined
        };

        // Configuration du module de test avec HttpClientTestingModule et l'intercepteur JwtInterceptor
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
                { provide: SessionService, useValue: sessionServiceMock }
            ]
        });

        // Injection des services mockés
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        sessionService = TestBed.inject(SessionService) as unknown as Partial<jest.Mocked<SessionService>>;
    });

    // Vérification que toutes les requêtes HTTP ont été traitées après chaque test
    afterEach(() => {
        httpMock.verify();
    });

    // Test pour vérifier que l'en-tête Authorization est ajouté si l'utilisateur est authentifié
    it('should add an Authorization header if the user is logged in', () => {
        sessionService.isLogged = true;
        sessionService.sessionInformation = { token: 'fake-jwt-token' } as any;

        httpClient.get('/test').subscribe();

        const httpRequest = httpMock.expectOne('/test');

        expect(httpRequest.request.headers.has('Authorization')).toBe(true);
        expect(httpRequest.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
    });

    // Test pour vérifier que l'en-tête Authorization n'est pas ajouté si l'utilisateur n'est pas authentifié
    it('should not add an Authorization header if the user is not logged in', () => {
        sessionService.isLogged = false;

        httpClient.get('/test').subscribe();

        const httpRequest = httpMock.expectOne('/test');

        expect(httpRequest.request.headers.has('Authorization')).toBe(false);
    });
});