import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SessionsRoutingModule } from './sessions-routing.module';
import { expect } from '@jest/globals';

describe('SessionsRoutingModule', () => {
    let router: Router;
    let location: Location;

    // Configuration du module de test
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([]), SessionsRoutingModule] // Importation des modules de test et de routage
        });

        router = TestBed.inject(Router); // Injection du routeur
        location = TestBed.inject(Location); // Injection de l'emplacement
        router.initialNavigation(); // Initialisation de la navigation
    });

    // Test pour vérifier la navigation vers la route racine
    it('should navigate to "" redirects to ListComponent', async () => {
        await router.navigate(['']); // Navigation vers la route racine
        expect(location.path()).toBe('/'); // Vérification du chemin
    });

    // Test pour vérifier la navigation vers la route de détail
    it('should navigate to "detail/:id" redirects to DetailComponent', async () => {
        await router.navigate(['detail/1']); // Navigation vers la route de détail avec un ID
        expect(location.path()).toBe('/detail/1'); // Vérification du chemin
    });

    // Test pour vérifier la navigation vers la route de création
    it('should navigate to "create" redirects to FormComponent', async () => {
        await router.navigate(['create']); // Navigation vers la route de création
        expect(location.path()).toBe('/create'); // Vérification du chemin
    });

    // Test pour vérifier la navigation vers la route de mise à jour
    it('should navigate to "update/:id" redirects to FormComponent', async () => {
        await router.navigate(['update/1']); // Navigation vers la route de mise à jour avec un ID
        expect(location.path()).toBe('/update/1'); // Vérification du chemin
    });
});