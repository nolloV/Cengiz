import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SessionService } from 'src/app/services/session.service'; // Chemin corrigé
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let authService: AuthService; // Déclaration de la variable pour le service AuthService
  let sessionService: SessionService; // Déclaration de la variable pour le service SessionService
  let httpMock: HttpTestingController; // Déclaration de la variable pour le mock HttpTestingController

  beforeEach(() => {
    // Configuration du module de test
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import du module de test HttpClient
      providers: [AuthService, SessionService] // Fourniture des services AuthService et SessionService
    });

    // Injection des dépendances
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérification qu'il n'y a pas de requêtes HTTP en attente
    httpMock.verify();
  });

  it('should be created', () => {
    // Test pour vérifier que le service est créé
    expect(authService).toBeTruthy();
  });

  it('should register a user', () => {
    // Données de test pour l'inscription
    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    // Appel de la méthode register du service
    authService.register(registerRequest).subscribe(response => {
      // Vérification que la réponse est undefined
      expect(response).toBeUndefined();
    });

    // Vérification de la requête HTTP envoyée
    const req = httpMock.expectOne(`${authService['pathService']}/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should log in a user and update session information', () => {
    // Données de test pour la connexion
    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Données de réponse simulées pour la connexion
    const mockSessionInformation: SessionInformation = {
      token: 'fake-jwt-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    // Espionner la méthode logIn de SessionService
    const logInSpy = jest.spyOn(sessionService, 'logIn');

    // Appel de la méthode login du service
    authService.login(loginRequest).subscribe(response => {
      // Vérification que la réponse correspond aux données simulées
      expect(response).toEqual(mockSessionInformation);
      // Vérification que la méthode logIn de SessionService a été appelée avec les bonnes données
      expect(logInSpy).toHaveBeenCalledWith(mockSessionInformation);
    });

    // Vérification de la requête HTTP envoyée
    const req = httpMock.expectOne(`${authService['pathService']}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockSessionInformation);
  });
});