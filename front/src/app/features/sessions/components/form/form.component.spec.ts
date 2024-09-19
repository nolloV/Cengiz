import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormComponent } from './form.component';
import { Routes, Router } from '@angular/router';
import { NgZone } from '@angular/core';

// Déclaration de la suite de tests pour le composant FormComponent
describe('FormComponent', () => {
  let component: FormComponent; // Instance du composant
  let fixture: ComponentFixture<FormComponent>; // Fixture pour accéder au composant et déclencher des changements
  let snackBar: MatSnackBar; // Instance de MatSnackBar pour afficher des notifications
  let router: Router; // Instance de Router pour la navigation
  let ngZone: NgZone; // Instance de NgZone pour exécuter du code dans la zone Angular

  // Mock des services utilisés par le composant
  const mockSessionService = {
    // Informations de session fictives pour les tests
    sessionInformation: {
      admin: true, // Indique que l'utilisateur est un administrateur
      id: '1' // Identifiant de session fictif
    }
  };

  const mockTeacherService = {
    // Mock de la méthode 'all' du service TeacherService, qui retourne un Observable vide
    all: jest.fn().mockReturnValue(of([]))
  };

  const mockSessionApiService = {
    // Mock de la méthode 'create' du service SessionApiService, qui retourne un Observable vide
    create: jest.fn().mockReturnValue(of({})),
    // Mock de la méthode 'update' du service SessionApiService, qui retourne un Observable vide
    update: jest.fn().mockReturnValue(of({})),
    // Mock de la méthode 'detail' du service SessionApiService, qui retourne un Observable vide
    detail: jest.fn().mockReturnValue(of({}))
  };

  // Définition des routes pour le RouterTestingModule
  const routes: Routes = [
    { path: 'sessions', component: FormComponent }
  ];

  // Configuration du module de test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes), // Module de test pour le routing
        HttpClientModule, // Module HTTP pour les requêtes API
        ReactiveFormsModule, // Module pour les formulaires réactifs
        MatSnackBarModule, // Module pour les notifications
        NoopAnimationsModule, // Module pour désactiver les animations
        MatCardModule, // Module pour les cartes Material
        MatIconModule, // Module pour les icônes Material
        MatFormFieldModule, // Module pour les champs de formulaire Material
        MatInputModule, // Module pour les champs de saisie Material
        MatSelectModule, // Module pour les sélecteurs Material
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }, // Fourniture du mock de SessionService
        { provide: TeacherService, useValue: mockTeacherService }, // Fourniture du mock de TeacherService
        { provide: SessionApiService, useValue: mockSessionApiService } // Fourniture du mock de SessionApiService
      ],
      declarations: [FormComponent] // Déclaration du composant à tester
    }).compileComponents();

    // Création de l'instance du composant et initialisation des services
    fixture = TestBed.createComponent(FormComponent); // Crée une instance du composant FormComponent
    component = fixture.componentInstance; // Récupère l'instance du composant
    snackBar = TestBed.inject(MatSnackBar); // Injecte le service MatSnackBar pour les notifications
    router = TestBed.inject(Router); // Injecte le service Router pour la navigation
    ngZone = TestBed.inject(NgZone); // Injecte le service NgZone pour exécuter du code dans la zone Angular
    fixture.detectChanges(); // Déclenche la détection des changements pour initialiser le composant
  });

  // Vérifie que le composant est créé correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Vérifie que le formulaire est initialisé correctement lors de la création du composant
  it('should initialize form on create', () => {
    component.ngOnInit();
    expect(component.sessionForm).toBeDefined(); // Vérifie que le formulaire est défini
    expect(component.sessionForm?.controls['name']).toBeDefined(); // Vérifie que le champ 'name' est défini
    expect(component.sessionForm?.controls['date']).toBeDefined(); // Vérifie que le champ 'date' est défini
    expect(component.sessionForm?.controls['teacher_id']).toBeDefined(); // Vérifie que le champ 'teacher_id' est défini
    expect(component.sessionForm?.controls['description']).toBeDefined(); // Vérifie que le champ 'description' est défini
  });

  // Vérifie que la méthode create est appelée lors de la soumission du formulaire en mode création
  it('should call create method on submit when not updating', () => {
    component.onUpdate = false; // Définit le mode création
    component.sessionForm?.setValue({
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    // Espionne et moque la méthode exitPage pour vérifier son appel
    const exitPageSpy = jest.spyOn(component as any, 'exitPage').mockImplementation((...args: unknown[]) => {
      const [message] = args as [string];
      ngZone.run(() => {
        component['matSnackBar'].open(message, 'Close', { duration: 3000 });
        component['router'].navigate(['sessions']);
      });
    });
    component.submit(); // Soumet le formulaire
    // Vérifie que la méthode create de SessionApiService est appelée avec les bonnes valeurs
    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    // Vérifie que la méthode exitPage est appelée avec le bon message
    expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
  });

  // Vérifie que la méthode update est appelée lors de la soumission du formulaire en mode mise à jour
  it('should call update method on submit when updating', () => {
    component.onUpdate = true; // Définit le mode mise à jour
    (component as any).id = '1'; // Utilisation de TypeScript pour accéder à la propriété privée
    component.sessionForm?.setValue({
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    // Espionne et moque la méthode exitPage pour vérifier son appel
    const exitPageSpy = jest.spyOn(component as any, 'exitPage').mockImplementation((...args: unknown[]) => {
      const [message] = args as [string];
      ngZone.run(() => {
        component['matSnackBar'].open(message, 'Close', { duration: 3000 });
        component['router'].navigate(['sessions']);
      });
    });
    component.submit(); // Soumet le formulaire
    // Vérifie que la méthode update de SessionApiService est appelée avec les bonnes valeurs
    expect(mockSessionApiService.update).toHaveBeenCalledWith('1', {
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    // Vérifie que la méthode exitPage est appelée avec le bon message
    expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
  });

  // Vérifie que le snackbar est affiché et que la navigation est effectuée lors de l'appel de exitPage
  it('should show snackbar and navigate on exitPage', () => {
    const snackBarSpy = jest.spyOn(snackBar, 'open'); // Espionne la méthode open de MatSnackBar
    const navigateSpy = jest.spyOn(router, 'navigate'); // Espionne la méthode navigate de Router
    ngZone.run(() => {
      component['exitPage']('Test Message'); // Appelle la méthode exitPage avec un message de test
    });
    // Vérifie que le snackbar est affiché avec le bon message et les bonnes options
    expect(snackBarSpy).toHaveBeenCalledWith('Test Message', 'Close', { duration: 3000 });
    // Vérifie que la navigation est effectuée vers la route 'sessions'
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});