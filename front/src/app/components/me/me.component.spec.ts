import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';
import { User } from 'src/app/interfaces/user.interface';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let router: Router;
  let snackBar: MatSnackBar;

  // Mock d'un utilisateur
  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    lastName: 'Test',
    firstName: 'User',
    admin: true,
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Mock du service de session
  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 },
    logOut: jest.fn()
  };

  // Mock du service utilisateur
  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of({}))
  };

  // Mock du routeur
  const mockRouter = {
    navigate: jest.fn()
  };

  // Mock du snack bar
  const mockSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ],
    })
      .compileComponents();

    // Création du composant et initialisation des services
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  // Test pour vérifier que le composant est créé
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test pour vérifier que l'utilisateur est initialisé lors de ngOnInit
  it('should initialize user on ngOnInit', () => {
    component.ngOnInit();
    expect(userService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  // Test pour vérifier que la méthode back appelle window.history.back
  it('should call window.history.back on back', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  // Test pour vérifier que la méthode delete fonctionne correctement
  it('should delete user, show snackbar, log out and navigate on delete', () => {
    // Espionner les méthodes pour vérifier qu'elles sont appelées correctement
    const deleteSpy = jest.spyOn(userService, 'delete');
    const logOutSpy = jest.spyOn(sessionService, 'logOut');
    const navigateSpy = jest.spyOn(router, 'navigate');
    const snackBarSpy = jest.spyOn(snackBar, 'open');

    // Appelle la méthode delete du composant
    component.delete();

    // Vérifie que la méthode delete de userService a été appelée avec l'ID '1'
    expect(deleteSpy).toHaveBeenCalledWith('1');
    // Vérifie que la méthode open de snackBar a été appelée avec le bon message, le bouton 'Close' et la durée de 3000 ms
    expect(snackBarSpy).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    // Vérifie que la méthode logOut de sessionService a été appelée
    expect(logOutSpy).toHaveBeenCalled();
    // Vérifie que la méthode navigate de router a été appelée avec l'argument ['/']
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});