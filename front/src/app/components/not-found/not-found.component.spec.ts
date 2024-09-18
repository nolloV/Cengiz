import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  // Avant chaque test, configure le module de test et crée une instance du composant
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent] // Déclare le composant à tester
    })
      .compileComponents(); // Compile les composants

    fixture = TestBed.createComponent(NotFoundComponent); // Crée une instance du composant
    component = fixture.componentInstance; // Récupère l'instance du composant
    fixture.detectChanges(); // Déclenche la détection des changements pour initialiser le composant
  });

  // Test pour vérifier que le composant est créé correctement
  it('should create', () => {
    expect(component).toBeTruthy(); // Vérifie que l'instance du composant est créée
  });

  // Test pour vérifier que le message correct est affiché dans le template
  it('should display the correct message', () => {
    const compiled = fixture.nativeElement as HTMLElement; // Récupère l'élément natif du composant
    expect(compiled.querySelector('h1')?.textContent).toContain('Page not found !'); // Vérifie que le texte du <h1> contient "Page not found !"
  });
});