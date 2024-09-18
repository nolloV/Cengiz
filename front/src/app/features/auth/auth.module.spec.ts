import { TestBed } from '@angular/core/testing';
import { AuthModule } from './auth.module';
import { expect } from '@jest/globals';

describe('AuthModule', () => {
  // Avant chaque test, configure le module de test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModule] // Importe le module AuthModule pour le test
    }).compileComponents(); // Compile les composants déclarés dans le module
  });

  // Test pour vérifier que le module AuthModule est créé sans erreur
  it('should create the module', () => {
    expect(AuthModule).toBeTruthy(); // Vérifie que AuthModule est défini et non null
  });
});