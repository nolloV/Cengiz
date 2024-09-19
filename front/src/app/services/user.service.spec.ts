import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';
import { expect } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  // Configuration du module de test et création d'une instance de UserService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Utilisation de HttpClientTestingModule pour les tests HTTP
      providers: [UserService] // Fourniture de UserService pour les tests
    });
    service = TestBed.inject(UserService); // Injection de UserService pour l'utiliser dans les tests
    httpMock = TestBed.inject(HttpTestingController); // Injection de HttpTestingController pour vérifier les requêtes HTTP
  });

  // Vérification que toutes les requêtes HTTP ont été traitées après chaque test
  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP n'est en attente
  });

  // Test pour vérifier que le service est créé correctement
  it('should be created', () => {
    expect(service).toBeTruthy(); // Vérifie que le service est créé
  });

  // Test pour vérifier que la méthode getById() retourne les détails d'un utilisateur
  it('should return a user from getById()', () => {
    // Données mockées pour un utilisateur
    const mockUser: User = {
      id: 1,
      email: 'john.doe@example.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: true,
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Appel de la méthode getById() du service
    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser); // Vérifie que les données retournées correspondent aux données mockées
    });

    // Vérifie que la requête HTTP est de type GET et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(`${service['pathService']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); // Simule une réponse HTTP avec les données mockées
  });

  // Test pour vérifier que la méthode delete() supprime un utilisateur
  it('should delete a user from delete()', () => {
    // Appel de la méthode delete() du service
    service.delete('1').subscribe((response) => {
      expect(response).toBeTruthy(); // Vérifie que la réponse est correcte
    });

    // Vérifie que la requête HTTP est de type DELETE et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(`${service['pathService']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simule une réponse HTTP vide
  });
});