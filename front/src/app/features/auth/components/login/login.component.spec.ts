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
import { NgZone } from '@angular/core'; // Import NgZone

describe('LoginComponent - Integration Test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let ngZone: NgZone; // Ajout de NgZone

  // Mock des services nécessaires
  const mockAuthService = {
    login: jest.fn()
  };

  const mockSessionService = {
    logIn: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService }
      ],
      imports: [
        RouterTestingModule.withRoutes([]), // Module de test pour le routage
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    ngZone = TestBed.inject(NgZone); // Injecter NgZone
    fixture.detectChanges();
  });

  // Vérifier que le composant est créé correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Vérifier que le formulaire est initialisé correctement
  it('should initialize the form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
  });

  // Vérifier la validation du formulaire
  it('should validate the form', () => {
    const emailControl = component.form.controls['email'];
    const passwordControl = component.form.controls['password'];

    emailControl.setValue('');
    passwordControl.setValue('');
    expect(component.form.invalid).toBeTruthy(); // Formulaire invalide avec champs vides

    emailControl.setValue('invalid-email');
    expect(emailControl.invalid).toBeTruthy(); // Email invalide avec mauvais format

    emailControl.setValue('test@example.com');
    passwordControl.setValue('123');
    expect(component.form.valid).toBeTruthy(); // Formulaire valide avec des valeurs correctes
  });

  // Vérifier que la méthode submit appelle authService.login
  it('should call authService.login on submit', () => {
    const loginRequest = { email: 'test@example.com', password: '123' };
    component.form.setValue(loginRequest);
    mockAuthService.login.mockReturnValue(of({ id: 1, username: 'user', firstName: 'First', lastName: 'Last', admin: true }));

    ngZone.run(() => { // Encapsuler dans NgZone pour éviter le warning
      component.submit();
    });

    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(sessionService.logIn).toHaveBeenCalled();
  });

  // Vérifier que onError est défini à true en cas d'erreur de login
  it('should set onError to true on login error', () => {
    const loginRequest = { email: 'test@example.com', password: '123' };
    component.form.setValue(loginRequest);
    mockAuthService.login.mockReturnValue(throwError('error'));

    ngZone.run(() => { // Encapsuler dans NgZone
      component.submit();
    });

    expect(component.onError).toBeTruthy(); // Vérifie que onError est défini à true
  });

  // Vérifier que le bouton de soumission est désactivé lorsque le formulaire est invalide
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy(); // Le bouton est désactivé si le formulaire est invalide

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('123');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalsy(); // Le bouton est activé si le formulaire est valide
  });

  // Vérifier que le message d'erreur est affiché lorsque onError est true
  it('should display error message when onError is true', () => {
    component.onError = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessage = compiled.querySelector('.error');
    expect(errorMessage).toBeTruthy(); // Le message d'erreur est présent dans le DOM
    expect(errorMessage?.textContent).toContain('An error occurred'); // Vérifie que le message contient le texte attendu
  });
});
