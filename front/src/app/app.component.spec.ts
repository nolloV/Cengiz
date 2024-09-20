import { HttpClientModule } from '@angular/common/http';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

// Définition du bloc de tests pour le composant AppComponent
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let sessionService: SessionService;
  let router: Router;
  let ngZone: NgZone; // Déclaration de NgZone

  // Configuration du module de test avant chaque test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([ // Définition des routes pour les tests d'intégration
          { path: '', component: AppComponent },
          { path: 'login', component: AppComponent }
        ]),
        HttpClientModule, // Module HTTP pour les requêtes
        MatToolbarModule // Module Angular Material pour la barre d'outils
      ],
      declarations: [
        AppComponent // Déclaration du composant à tester
      ],
      providers: [
        AuthService, // Utilisation du service réel AuthService
        SessionService // Utilisation du service réel SessionService
      ]
    }).compileComponents();

    // Création de l'instance du composant et initialisation des services
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone); // Initialisation de NgZone

    // Espionner la méthode logOut de sessionService
    jest.spyOn(sessionService, 'logOut');
  });

  // Test pour vérifier que le composant est créé
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // Test d'intégration pour vérifier que l'état de connexion est retourné en tant qu'observable
  it('should return the logged status as an observable', (done) => {
    // Simuler l'état de connexion
    sessionService.isLogged = true;
    sessionService.$isLogged = () => new BehaviorSubject<boolean>(true).asObservable();

    const isLogged$: Observable<boolean> = component.$isLogged();
    isLogged$.subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      done();
    });
  });

  // Test d'intégration pour vérifier que la déconnexion et la navigation fonctionnent correctement
  it('should log out and navigate to the root path', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    ngZone.run(() => { // Utilisation de NgZone pour encapsuler la navigation
      component.logout();
    });
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['']);
  });

  // Test d'intégration pour vérifier la navigation vers la page de connexion
  it('should navigate to the login page', async () => {
    await ngZone.run(async () => {
      await router.navigate(['login']);
      expect(router.url).toBe('/login');
    });
  });
});