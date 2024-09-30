import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';
import { Location } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { MeComponent } from '../me/me.component';
import { AuthGuard } from '../../guards/auth.guard';
import { UnauthGuard } from '../../guards/unauth.guard';
import { expect } from '@jest/globals';

// Mock de AuthGuard pour autoriser l'accès
const mockAuthGuard = {
  canActivate: () => true
};

// Définition des routes pour tester l'intégration
const routes: Routes = [
  {
    path: 'me',
    component: MeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

describe('NotFoundComponent - Integration Test', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    // Configuration du module de test avec le routage et composants nécessaires
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [NotFoundComponent, MeComponent], // Déclarer les composants nécessaires
      providers: [
        { provide: AuthGuard, useValue: mockAuthGuard }, // Mock du AuthGuard
        UnauthGuard
      ]
    }).compileComponents();

    // Initialisation du composant et du système de routage
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation(); // Initialise la navigation
  });

  // Test pour vérifier si une route inexistante redirige bien vers NotFoundComponent
  it('should navigate to NotFoundComponent for non-existing routes', async () => {
    await router.navigate(['/non-existent-page']); // Navigue vers une route inexistante
    expect(location.path()).toBe('/404'); // Vérifie que la redirection vers '/404' a bien eu lieu

    const compiled = fixture.nativeElement as HTMLElement; // Récupère le DOM du composant
    expect(compiled.querySelector('h1')?.textContent).toContain('Page not found !'); // Vérifie que le message est affiché
  });

  // Test pour vérifier une route valide
  it('should navigate to MeComponent for existing routes', async () => {
    await router.navigate(['/me']); // Navigue vers une route valide ('/me')
    expect(location.path()).toBe('/me'); // Vérifie que la route valide a bien été accédée
  });
});
