import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

describe('DetailComponent - Integration Test', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: DetailComponent }
        ]),
        HttpClientModule, // Utiliser HttpClientModule pour permettre les appels HTTP réels
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        NoopAnimationsModule
      ],
      declarations: [DetailComponent],
      providers: [
        SessionService,       // Utiliser les vrais services ici
        SessionApiService,    // Pas de mocks
        TeacherService,       // Pas de mocks
        {
          provide: ActivatedRoute, // Fournir une route simulée
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1' // Simuler un paramètre de route "id"
              }
            }
          }
        }
      ],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);

    // Initialiser sessionInformation pour éviter les erreurs "undefined"
    sessionService.sessionInformation = {
      admin: true,         // Simuler un admin
      id: 1,               // Simuler un utilisateur avec ID 1 (nombre)
      token: 'fake-token', // Ajouter un faux jeton
      type: 'Bearer',      // Type de jeton, par exemple 'Bearer'
      username: 'testuser', // Nom d'utilisateur simulé
      firstName: 'John',   // Prénom simulé
      lastName: 'Doe'      // Nom de famille simulé
    };



    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de l'affichage du bouton de suppression uniquement pour l'admin
  it('should show delete button only for admin', fakeAsync(() => {
    // Forcer l'utilisateur à être admin
    component.isAdmin = true;
    fixture.detectChanges();   // Détecter les changements après la mise à jour de isAdmin

    // Utiliser whenStable pour s'assurer que la détection des changements est complète
    fixture.whenStable().then(() => {
      // Cibler le bouton de suppression par son attribut color="warn"
      const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
      expect(deleteButton).toBeTruthy();  // Le bouton doit être présent si l'utilisateur est admin
    });

    flush();  // Nettoyer les tâches restantes
  }));

  it('should not show delete button if not admin', fakeAsync(() => {
    // Forcer l'utilisateur à ne pas être admin
    component.isAdmin = false;
    fixture.detectChanges();   // Détecter les changements après la mise à jour de isAdmin

    // Utiliser whenStable pour s'assurer que la détection des changements est complète
    fixture.whenStable().then(() => {
      // Cibler le bouton de suppression par son attribut color="warn"
      const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
      expect(deleteButton).toBeNull();  // Le bouton ne doit pas être présent si l'utilisateur n'est pas admin
    });

    flush();  // Nettoyer les tâches restantes
  }));


  // Test de la navigation arrière
  it('should navigate back', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  // Test de la suppression de session
  it('should delete session and navigate to sessions list', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Simuler la suppression
    jest.spyOn(sessionApiService, 'delete').mockReturnValue(of({}));

    component.delete();
    tick();
    flush();

    // Vérifier que la suppression et la redirection ont eu lieu
    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  }));
});
