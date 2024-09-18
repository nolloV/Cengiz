import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  // Mock du service d'authentification
  const mockAuthService = {
    register: jest.fn()
  };

  // Mock du routeur
  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    // Création du composant et initialisation des services
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // Test pour vérifier que le composant est créé correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test pour vérifier que le formulaire est initialisé correctement
  it('should initialize the form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['firstName']).toBeDefined();
    expect(component.form.controls['lastName']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
  });

  // Test pour vérifier la validation du formulaire
  it('should validate the form', () => {
    const emailControl = component.form.controls['email'];
    const firstNameControl = component.form.controls['firstName'];
    const lastNameControl = component.form.controls['lastName'];
    const passwordControl = component.form.controls['password'];

    // Rendre le formulaire invalide
    emailControl.setValue('');
    firstNameControl.setValue('');
    lastNameControl.setValue('');
    passwordControl.setValue('');
    expect(component.form.invalid).toBeTruthy();

    // Tester avec des valeurs qui respectent les validations
    emailControl.setValue('test@example.com');
    firstNameControl.setValue('John');
    lastNameControl.setValue('Doe');
    passwordControl.setValue('password123'); // Assurez-vous que cela respecte la validation des mots de passe

    component.form.updateValueAndValidity();  // Mettez à jour la validation du formulaire

    expect(component.form.valid).toBeTruthy();
  });

  // Test pour vérifier que le service d'authentification est appelé lors de la soumission
  it('should call authService.register on submit', () => {
    const registerRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123456'
    };
    component.form.setValue(registerRequest);
    mockAuthService.register.mockReturnValue(of({}));

    component.submit();

    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Test pour vérifier que la variable onError est définie à true en cas d'erreur
  it('should set onError to true on register error', () => {
    const registerRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '123456'
    };
    component.form.setValue(registerRequest);
    mockAuthService.register.mockReturnValue(throwError('error'));

    component.submit();

    expect(component.onError).toBeTruthy();
  });

  // Test pour vérifier que le bouton de soumission est désactivé lorsque le formulaire est invalide
  it('should disable submit button when form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Rendre le formulaire invalide
    component.form.controls['email'].setValue('');
    component.form.controls['firstName'].setValue('');
    component.form.controls['lastName'].setValue('');
    component.form.controls['password'].setValue('');
    component.form.updateValueAndValidity(); // Mettre à jour la validité
    fixture.detectChanges(); // Mettre à jour la vue
    expect(submitButton.disabled).toBeTruthy();

    // Rendre le formulaire valide
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['firstName'].setValue('John');
    component.form.controls['lastName'].setValue('Doe');
    component.form.controls['password'].setValue('password123'); // Respecter les règles de validation
    component.form.updateValueAndValidity(); // Mettez à jour le formulaire
    fixture.detectChanges(); // Mettre à jour la vue
    expect(submitButton.disabled).toBeFalsy(); // Vérifiez que le bouton n'est plus désactivé
  });

  // Test pour vérifier que le message d'erreur est affiché lorsque onError est true
  it('should display error message when onError is true', () => {
    component.onError = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const errorMessage = compiled.querySelector('.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage?.textContent).toContain('An error occurred');
  });
});