import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SessionsRoutingModule } from './sessions-routing.module';
import { expect } from '@jest/globals';

describe('SessionsRoutingModule', () => {
    let router: Router; // Variable pour le routeur
    let location: Location; // Variable pour gérer la localisation

    beforeEach(() => {
        // Configuration du test avec les modules nécessaires
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([]), SessionsRoutingModule]
        });

        // Injection des services Router et Location
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        // Initialisation de la navigation
        router.initialNavigation();
    });

    // Fonction pour tester la navigation
    const testNavigation = async (path: string, expectedPath: string) => {
        await router.navigate([path]); // Navigation vers le chemin spécifié
        expect(location.path()).toBe(expectedPath); // Vérification que le chemin actuel est celui attendu
    };

    // Test pour vérifier que la navigation vers "" redirige vers ListComponent
    it('should navigate to "" redirects to ListComponent', async () => {
        await testNavigation('', '/'); // Teste la redirection
    });

    // Test pour vérifier que la navigation vers "detail/:id" redirige vers DetailComponent
    it('should navigate to "detail/:id" redirects to DetailComponent', async () => {
        await testNavigation('detail/1', '/detail/1'); // Teste la redirection avec un ID
    });

    // Test pour vérifier que la navigation vers "create" redirige vers FormComponent
    it('should navigate to "create" redirects to FormComponent', async () => {
        await testNavigation('create', '/create'); // Teste la redirection
    });

    // Test pour vérifier que la navigation vers "update/:id" redirige vers FormComponent
    it('should navigate to "update/:id" redirects to FormComponent', async () => {
        await testNavigation('update/1', '/update/1'); // Teste la redirection avec un ID
    });
});
