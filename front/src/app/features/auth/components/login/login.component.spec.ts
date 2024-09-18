import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  // Mock des services nécessaires
  const mockAuthService = {
    login: jest.fn()
  };

  const mockSessionService = {
    logIn: jest.fn()
  };

  // Avant chaque test, configure le module de test et crée une instance du composant
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent], // Déclare le composant à tester
      providers: [
        { provide: AuthService, useValue: mockAuthService }, // Fournit un mock du service AuthService
        { provide: SessionService, useValue: mockSessionService }, // Fournit un mock du service SessionService
        { provide: Router, useValue: { navigate: jest.fn() } } // Fournit un mock du service Router
      ],
      imports: [
        RouterTestingModule, // Module de test pour le routage
        BrowserAnimationsModule, // Module pour les animations
        HttpClientModule, // Module pour les requêtes HTTP
        MatCardModule, // Module pour les cartes Material
        MatIconModule, // Module pour les icônes Material
        MatFormFieldModule, // Module pour les champs de formulaire Material
        MatInputModule, // Module pour les entrées Material
        ReactiveFormsModule // Module pour les formulaires réactifs
      ]
    })
      .compileComponents(); // Compile les composants

    fixture = TestBed.createComponent(LoginComponent); // Crée une instance du composant
    component = fixture.componentInstance; // Récupère l'instance du composant
    authService = TestBed.inject(AuthService); // Injecte le service AuthService
    sessionService = TestBed.inject(SessionService); // Injecte le service SessionService
    router = TestBed.inject(Router); // Injecte le service Router
    fixture.detectChanges(); // Déclenche la détection des changements pour initialiser le composant
  });

  // Test pour vérifier que le composant est créé correctement
  it('should create', () => {
    expect(component).toBeTruthy(); // Vérifie que l'instance du composant est créée
  });

  // Test pour vérifier que le formulaire est initialisé correctement
  it('should initialize the form', () => {
    expect(component.form).toBeDefined(); // Vérifie que le formulaire est défini
    expect(component.form.controls['email']).toBeDefined(); // Vérifie que le contrôle email est défini
    expect(component.form.controls['password']).toBeDefined(); // Vérifie que le contrôle password est défini
  });

  // Test pour vérifier la validation du formulaire
  it('should validate the form', () => {
    const emailControl = component.form.controls['email'];
    const passwordControl = component.form.controls['password'];

    emailControl.setValue('');
    passwordControl.setValue('');
    expect(component.form.invalid).toBeTruthy(); // Vérifie que le formulaire est invalide si les champs sont vides

    emailControl.setValue('invalid-email');
    expect(emailControl.invalid).toBeTruthy(); // Vérifie que le champ email est invalide si le format est incorrect

    emailControl.setValue('test@example.com');
    passwordControl.setValue('123');
    expect(component.form.valid).toBeTruthy(); // Vérifie que le formulaire est valide si les champs sont corrects
  });

  // Test pour vérifier que la méthode submit appelle authService.login
  it('should call authService.login on submit', () => {
    const loginRequest = { email: 'test@example.com', password: '123' };
    component.form.setValue(loginRequest);
    mockAuthService.login.mockReturnValue(of({ id: 1, username: 'user', firstName: 'First', lastName: 'Last', admin: true }));

    component.submit();

    expect(authService.login).toHaveBeenCalledWith(loginRequest); // Vérifie que authService.login est appelé avec les bonnes données
    expect(sessionService.logIn).toHaveBeenCalled(); // Vérifie que sessionService.logIn est appelé
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']); // Vérifie que la navigation se fait vers /sessions
  });

  // Test pour vérifier que onError est défini à true en cas d'erreur de login
  it('should set onError to true on login error', () => {
    const loginRequest = { email: 'test@example.com', password: '123' };
    component.form.setValue(loginRequest);
    mockAuthService.login.mockReturnValue(throwError('error'));

    component.submit();

    expect(component.onError).toBeTruthy(); // Vérifie que onError est défini à true en cas d'erreur
  });

  // Test pour vérifier que le bouton de soumission est désactivé lorsque le formulaire est invalide
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy(); // Vérifie que le bouton est désactivé si le formulaire est invalide

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalsy(); // Vérifie que le bouton est activé si le formulaire est valide
  });

  // Test pour vérifier que le message d'erreur est affiché lorsque onError est true
  it('should display error message when onError is true', () => {
    component.onError = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessage = compiled.querySelector('.error');
    expect(errorMessage).toBeTruthy(); // Vérifie que le message d'erreur est présent dans le DOM
    expect(errorMessage?.textContent).toContain('An error occurred'); // Vérifie que le message d'erreur contient le texte attendu
  });
});