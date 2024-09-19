import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { expect } from '@jest/globals';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  // Configuration du module de test et création d'une instance de TeacherService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Utilisation de HttpClientTestingModule pour les tests HTTP
      providers: [TeacherService] // Fourniture de TeacherService pour les tests
    });
    service = TestBed.inject(TeacherService); // Injection de TeacherService pour l'utiliser dans les tests
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

  // Test pour vérifier que la méthode all() retourne une liste de professeurs
  it('should return an array of teachers from all()', () => {
    // Données mockées pour les professeurs
    const mockTeachers: Teacher[] = [
      { id: 1, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, lastName: 'Smith', firstName: 'Jane', createdAt: new Date(), updatedAt: new Date() }
    ];

    // Appel de la méthode all() du service
    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(2); // Vérifie que la longueur du tableau est de 2
      expect(teachers).toEqual(mockTeachers); // Vérifie que les données retournées correspondent aux données mockées
    });

    // Vérifie que la requête HTTP est de type GET et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers); // Simule une réponse HTTP avec les données mockées
  });

  // Test pour vérifier que la méthode detail() retourne les détails d'un professeur
  it('should return a teacher from detail()', () => {
    // Données mockées pour un professeur
    const mockTeacher: Teacher = { id: 1, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date() };

    // Appel de la méthode detail() du service
    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher); // Vérifie que les données retournées correspondent aux données mockées
    });

    // Vérifie que la requête HTTP est de type GET et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(`${service['pathService']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher); // Simule une réponse HTTP avec les données mockées
  });
});