import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SessionsRoutingModule } from './sessions-routing.module';
import { expect } from '@jest/globals';

describe('SessionsRoutingModule', () => {
    let router: Router;
    let location: Location;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([]), SessionsRoutingModule]
        });

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        router.initialNavigation();
    });

    const testNavigation = async (path: string, expectedPath: string) => {
        await router.navigate([path]);
        expect(location.path()).toBe(expectedPath);
    };

    it('should navigate to "" redirects to ListComponent', async () => {
        await testNavigation('', '/');
    });

    it('should navigate to "detail/:id" redirects to DetailComponent', async () => {
        await testNavigation('detail/1', '/detail/1');
    });

    it('should navigate to "create" redirects to FormComponent', async () => {
        await testNavigation('create', '/create');
    });

    it('should navigate to "update/:id" redirects to FormComponent', async () => {
        await testNavigation('update/1', '/update/1');
    });
});