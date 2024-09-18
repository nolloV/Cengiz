import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;

  // Mock du service SessionService
  const mockSessionService = {
    sessionInformation: {
      admin: true, // Assurez-vous que l'utilisateur est configuré en tant qu'administrateur
      id: 1
    }
  };

  // Mock du service SessionApiService
  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      teacher_id: 1,
      users: [1]
    })), // Mock de la méthode detail
    delete: jest.fn().mockReturnValue(of({})), // Mock de la méthode delete
    participate: jest.fn().mockReturnValue(of({})), // Mock de la méthode participate
    unParticipate: jest.fn().mockReturnValue(of({})) // Mock de la méthode unParticipate
  };

  // Mock du service TeacherService
  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      name: 'Teacher Name'
    })) // Mock de la méthode detail
  };

  // Mock du service ActivatedRoute
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1') // Mock de la méthode get
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: DetailComponent }
        ]),
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    })
      .compileComponents();

    // Injection des services et création du composant
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de récupération de la session lors de l'initialisation
  it('should fetch session on init', () => {
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual({
      id: 1,
      teacher_id: 1,
      users: [1]
    });
    expect(component.isParticipate).toBe(true);
  });

  // Test de récupération des détails de l'enseignant
  it('should fetch teacher details', () => {
    expect(teacherService.detail).toHaveBeenCalledWith('1');
    expect(component.teacher).toEqual({
      id: 1,
      name: 'Teacher Name'
    });
  });

  // Test de l'affichage du bouton de suppression uniquement pour l'admin
  it('should show delete button only for admin', () => {
    // Cas où l'utilisateur est admin
    component.isAdmin = true;
    fixture.detectChanges(); // Re-rendre le composant

    // Utiliser un sélecteur plus spécifique pour cibler le bouton de suppression
    let buttons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));
    let deleteButton = buttons.find(button => button.nativeElement.textContent.includes('Delete'));
    expect(deleteButton).toBeTruthy(); // Le bouton doit être présent

    // Cas où l'utilisateur n'est pas admin
    component.isAdmin = false;
    fixture.detectChanges(); // Re-rendre le composant

    // Utiliser un sélecteur plus spécifique pour cibler le bouton de suppression
    buttons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));
    deleteButton = buttons.find(button => button.nativeElement.textContent.includes('Delete'));
    expect(deleteButton).toBeUndefined(); // Le bouton ne doit pas être présent
  });

  // Test de la participation à la session
  it('should participate in session', () => {
    component.participate();
    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
  });

  // Test de l'annulation de la participation à la session
  it('should unParticipate from session', () => {
    component.unParticipate();
    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  // Test de la navigation vers l'arrière
  it('should navigate back', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });
});