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

// Début de la suite de tests pour le composant FormComponent
describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let snackBar: MatSnackBar;
  let router: Router;
  let ngZone: NgZone;

  // Mock des services utilisés dans le composant
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: '1'
    }
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of([]))
  };

  const mockSessionApiService = {
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of({}))
  };

  // Définition des routes pour le RouterTestingModule
  const routes: Routes = [
    { path: 'sessions', component: FormComponent }
  ];

  // Configuration du module de test avant chaque test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    // Création du composant et initialisation des services
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    fixture.detectChanges();
  });

  // Test pour vérifier que le composant est créé correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test pour vérifier l'initialisation du formulaire
  it('should initialize form on create', () => {
    component.ngOnInit();
    expect(component.sessionForm).toBeDefined();
    expect(component.sessionForm?.controls['name']).toBeDefined();
    expect(component.sessionForm?.controls['date']).toBeDefined();
    expect(component.sessionForm?.controls['teacher_id']).toBeDefined();
    expect(component.sessionForm?.controls['description']).toBeDefined();
  });

  // Test pour vérifier l'appel de la méthode create lors de la soumission du formulaire en mode création
  it('should call create method on submit when not updating', () => {
    component.onUpdate = false;
    component.sessionForm?.setValue({
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    const exitPageSpy = jest.spyOn(component as any, 'exitPage').mockImplementation((...args: unknown[]) => {
      const [message] = args as [string];
      ngZone.run(() => {
        component['matSnackBar'].open(message, 'Close', { duration: 3000 });
        component['router'].navigate(['sessions']);
      });
    });
    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    expect(exitPageSpy).toHaveBeenCalledWith('Session created !');
  });

  // Test pour vérifier l'appel de la méthode update lors de la soumission du formulaire en mode mise à jour
  it('should call update method on submit when updating', () => {
    component.onUpdate = true;
    (component as any).id = '1'; // Utilisation de TypeScript pour accéder à la propriété privée
    component.sessionForm?.setValue({
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    const exitPageSpy = jest.spyOn(component as any, 'exitPage').mockImplementation((...args: unknown[]) => {
      const [message] = args as [string];
      ngZone.run(() => {
        component['matSnackBar'].open(message, 'Close', { duration: 3000 });
        component['router'].navigate(['sessions']);
      });
    });
    component.submit();
    expect(mockSessionApiService.update).toHaveBeenCalledWith('1', {
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    });
    expect(exitPageSpy).toHaveBeenCalledWith('Session updated !');
  });

  // Test pour vérifier l'affichage du snackbar et la navigation lors de l'appel de exitPage
  it('should show snackbar and navigate on exitPage', () => {
    const snackBarSpy = jest.spyOn(snackBar, 'open');
    const navigateSpy = jest.spyOn(router, 'navigate');
    ngZone.run(() => {
      component['exitPage']('Test Message');
    });
    expect(snackBarSpy).toHaveBeenCalledWith('Test Message', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  // Test pour vérifier la récupération des détails de la session lors de l'initialisation en mode mise à jour
  it('should fetch session details on init when updating', () => {
    component.onUpdate = true;
    (component as any).id = '1'; // Utilisation de TypeScript pour accéder à la propriété privée
    const sessionDetail = {
      name: 'Test Session',
      date: '2023-01-01',
      teacher_id: 1,
      description: 'Test Description'
    };
    mockSessionApiService.detail.mockReturnValue(of(sessionDetail));

    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/1');
    jest.spyOn(component['route'].snapshot.paramMap, 'get').mockReturnValue('1');

    ngZone.run(() => {
      component.ngOnInit();
    });

    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');

    if (component.sessionForm) {
      expect(component.sessionForm.value).toEqual(sessionDetail);
    } else {
      fail('sessionForm is undefined');
    }
  });

  // Test pour vérifier la navigation vers /sessions si l'utilisateur n'est pas admin
  it('should navigate to /sessions if user is not admin', () => {
    const mockSessionServiceNonAdmin = {
      sessionInformation: {
        admin: false,
        id: '1'
      }
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionServiceNonAdmin },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    ngZone.run(() => {
      component.ngOnInit();
    });

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  // Test pour vérifier une condition spécifique à la ligne 50
  it('should handle specific condition at line 50', () => {
    // Cas où le champ 'name' est invalide
    component.sessionForm?.controls['name'].setValue('');
    ngZone.run(() => {
      component.submit();
    });
    expect(component.sessionForm?.controls['name'].valid).toBeFalsy();

    // Cas où le champ 'name' est valide
    component.sessionForm?.controls['name'].setValue('Valid Name');
    ngZone.run(() => {
      component.submit();
    });
    expect(component.sessionForm?.controls['name'].valid).toBeTruthy();
  });
});