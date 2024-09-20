import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';
import { Component } from '@angular/core';
import { expect } from '@jest/globals';

@Component({
  selector: 'app-test-user',
  template: ''
})
class TestUserComponent {
  user: User | undefined;
  deleteResponse: any;

  constructor(private userService: UserService) { }

  getUserById(id: string) {
    this.userService.getById(id).subscribe((user) => {
      this.user = user;
    });
  }

  deleteUser(id: string) {
    this.userService.delete(id).subscribe((response) => {
      this.deleteResponse = response;
    });
  }
}

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let testComponent: TestUserComponent;

  // Configuration du module de test et création d'une instance de UserService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Utilisation de HttpClientTestingModule pour les tests HTTP
      declarations: [TestUserComponent], // Déclaration du composant de test
      providers: [UserService] // Fourniture de UserService pour les tests
    });
    service = TestBed.inject(UserService); // Injection de UserService pour l'utiliser dans les tests
    httpMock = TestBed.inject(HttpTestingController); // Injection de HttpTestingController pour vérifier les requêtes HTTP
    testComponent = TestBed.createComponent(TestUserComponent).componentInstance; // Création de l'instance du composant de test
  });

  // Vérification que toutes les requêtes HTTP ont été traitées après chaque test
  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP n'est en attente
  });

  // Test pour vérifier que le service est créé correctement
  it('should be created', () => {
    expect(service).toBeTruthy(); // Vérifie que le service est créé
  });

  // Test d'intégration pour vérifier que le composant utilise correctement le service pour obtenir les détails d'un utilisateur
  it('should get user detail through the component', () => {
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

    // Appel de la méthode getUserById() du composant de test
    testComponent.getUserById('1');

    // Vérifie que la requête HTTP est de type GET et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(`${service['pathService']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); // Simule une réponse HTTP avec les données mockées

    // Vérifie que les données retournées correspondent aux données mockées
    expect(testComponent.user).toEqual(mockUser);
  });

  // Test d'intégration pour vérifier que le composant utilise correctement le service pour supprimer un utilisateur
  it('should delete user through the component', () => {
    // Appel de la méthode deleteUser() du composant de test
    testComponent.deleteUser('1');

    // Vérifie que la requête HTTP est de type DELETE et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(`${service['pathService']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Simule une réponse HTTP vide

    // Vérifie que la réponse est correcte
    expect(testComponent.deleteResponse).toBeTruthy();
  });
});