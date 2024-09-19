import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('SessionService', () => {
  let service: SessionService;

  // Configuration du module de test et création d'une instance de SessionService
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  // Test pour vérifier que le service est créé correctement
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test pour vérifier que isLogged est initialisé à false
  it('should initialize with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
  });

  // Test pour vérifier que sessionInformation est initialisé à undefined
  it('should initialize with sessionInformation as undefined', () => {
    expect(service.sessionInformation).toBeUndefined();
  });

  // Test pour vérifier que $isLogged retourne un observable initialisé à false
  it('should return an observable from $isLogged', (done) => {
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
      done();
    });
  });

  // Test pour vérifier que logIn met à jour isLogged et sessionInformation
  it('should log in a user and update isLogged and sessionInformation', () => {
    const user: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    };

    service.logIn(user);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(user);
  });

  // Test pour vérifier que $isLogged émet true lors de la connexion d'un utilisateur
  it('should emit true when user logs in', (done) => {
    const user: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    };

    service.$isLogged().subscribe((isLogged) => {
      if (isLogged) {
        expect(isLogged).toBe(true);
        done();
      }
    });

    service.logIn(user);
  });

  // Test pour vérifier que logOut met à jour isLogged et sessionInformation
  it('should log out a user and update isLogged and sessionInformation', () => {
    const user: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    };

    service.logIn(user);
    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  // Test pour vérifier que $isLogged émet false lors de la déconnexion d'un utilisateur
  it('should emit false when user logs out', (done) => {
    const user: SessionInformation = {
      token: 'fake-token',
      type: 'Bearer',
      id: 1,
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      admin: true
    };

    service.logIn(user);

    service.$isLogged().subscribe((isLogged) => {
      if (!isLogged) {
        expect(isLogged).toBe(false);
        done();
      }
    });

    service.logOut();
  });
});