import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  // Mock du service SessionService
  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  // Mock du service SessionApiService
  const mockSessionApiService = {
    all: () => of([
      { id: 1, name: 'Session 1', date: new Date(), description: 'Description 1' },
      { id: 2, name: 'Session 2', date: new Date(), description: 'Description 2' }
    ])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent], // Déclaration du composant à tester
      imports: [
        HttpClientModule, // Importation du module HttpClientModule
        MatCardModule, // Importation du module MatCardModule
        MatIconModule, // Importation du module MatIconModule
        RouterModule.forRoot([]) // Importation du module RouterModule avec une configuration vide
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }, // Fourniture du mock de SessionService
        { provide: SessionApiService, useValue: mockSessionApiService } // Fourniture du mock de SessionApiService
      ]
    })
      .compileComponents(); // Compilation des composants

    fixture = TestBed.createComponent(ListComponent); // Création de l'instance du composant
    component = fixture.componentInstance; // Récupération de l'instance du composant
    fixture.detectChanges(); // Déclenchement de la détection des changements
  });

  // Test pour vérifier que le composant est créé
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test pour vérifier que sessions$ contient les sessions attendues
  it('should have sessions$', (done) => {
    component.sessions$.subscribe(sessions => {
      expect(sessions.length).toBe(2);
      expect(sessions[0].name).toBe('Session 1');
      done();
    });
  });

  // Test pour vérifier que la méthode user retourne les informations de session de l'utilisateur
  it('should get user information', () => {
    expect(component.user).toEqual(mockSessionService.sessionInformation);
  });
});