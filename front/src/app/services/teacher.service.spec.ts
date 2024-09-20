import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { Component } from '@angular/core';
import { expect } from '@jest/globals';

@Component({
  selector: 'app-test-teacher',
  template: ''
})
class TestTeacherComponent {
  teachers: Teacher[] = [];
  teacher: Teacher | undefined;

  constructor(private teacherService: TeacherService) { }

  getAllTeachers() {
    this.teacherService.all().subscribe((teachers) => {
      this.teachers = teachers;
    });
  }

  getTeacherDetail(id: string) {
    this.teacherService.detail(id).subscribe((teacher) => {
      this.teacher = teacher;
    });
  }
}

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;
  let testComponent: TestTeacherComponent;

  // Configuration du module de test et création d'une instance de TeacherService
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Utilisation de HttpClientTestingModule pour les tests HTTP
      declarations: [TestTeacherComponent], // Déclaration du composant de test
      providers: [TeacherService] // Fourniture de TeacherService pour les tests
    });
    service = TestBed.inject(TeacherService); // Injection de TeacherService pour l'utiliser dans les tests
    httpMock = TestBed.inject(HttpTestingController); // Injection de HttpTestingController pour vérifier les requêtes HTTP
    testComponent = TestBed.createComponent(TestTeacherComponent).componentInstance; // Création de l'instance du composant de test
  });

  // Vérification que toutes les requêtes HTTP ont été traitées après chaque test
  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP n'est en attente
  });

  // Test pour vérifier que le service est créé correctement
  it('should be created', () => {
    expect(service).toBeTruthy(); // Vérifie que le service est créé
  });

  // Test d'intégration pour vérifier que le composant utilise correctement le service pour obtenir tous les professeurs
  it('should get all teachers through the component', () => {
    // Données mockées pour les professeurs
    const mockTeachers: Teacher[] = [
      { id: 1, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, lastName: 'Smith', firstName: 'Jane', createdAt: new Date(), updatedAt: new Date() }
    ];

    // Appel de la méthode getAllTeachers() du composant de test
    testComponent.getAllTeachers();

    // Vérifie que la requête HTTP est de type GET et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(service['pathService']);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers); // Simule une réponse HTTP avec les données mockées

    // Vérifie que les données retournées correspondent aux données mockées
    expect(testComponent.teachers.length).toBe(2);
    expect(testComponent.teachers).toEqual(mockTeachers);
  });

  // Test d'intégration pour vérifier que le composant utilise correctement le service pour obtenir les détails d'un professeur
  it('should get teacher detail through the component', () => {
    // Données mockées pour un professeur
    const mockTeacher: Teacher = { id: 1, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date() };

    // Appel de la méthode getTeacherDetail() du composant de test
    testComponent.getTeacherDetail('1');

    // Vérifie que la requête HTTP est de type GET et qu'elle est envoyée à la bonne URL
    const req = httpMock.expectOne(`${service['pathService']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher); // Simule une réponse HTTP avec les données mockées

    // Vérifie que les données retournées correspondent aux données mockées
    expect(testComponent.teacher).toEqual(mockTeacher);
  });
});