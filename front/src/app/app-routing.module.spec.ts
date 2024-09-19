import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { MeComponent } from './components/me/me.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { SessionService } from './services/session.service';
import { BehaviorSubject } from 'rxjs';
import { expect } from '@jest/globals';

describe('AppRoutingModule', () => {
    let router: Router;
    let location: Location;
    let sessionService: SessionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([]), AppRoutingModule],
            declarations: [MeComponent, NotFoundComponent],
            providers: [
                {
                    provide: AuthGuard,
                    useValue: {
                        canActivate: () => true // Simule que l'utilisateur est authentifié
                    }
                },
                {
                    provide: UnauthGuard,
                    useClass: class {
                        constructor(private router: Router, private sessionService: SessionService) { }
                        canActivate() {
                            if (this.sessionService.isLogged) {
                                this.router.navigate(['rentals']);
                                return false;
                            }
                            return true;
                        }
                    },
                    deps: [Router, SessionService]
                },
                {
                    provide: SessionService,
                    useValue: {
                        isLogged: false, // Simule que l'utilisateur n'est pas authentifié
                        $isLogged: () => new BehaviorSubject<boolean>(false).asObservable(),
                        logIn: jest.fn(),
                        logOut: jest.fn()
                    }
                }
            ]
        });

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        sessionService = TestBed.inject(SessionService);

        router.initialNavigation();
    });

    it('should navigate to "sessions" redirects to sessions module', async () => {
        await router.navigate(['sessions']);
        expect(location.path()).toBe('/sessions');
    });

    it('should navigate to "me" redirects to MeComponent', async () => {
        await router.navigate(['me']);
        expect(location.path()).toBe('/me');
    });

    it('should navigate to "404" redirects to NotFoundComponent', async () => {
        await router.navigate(['404']);
        expect(location.path()).toBe('/404');
    });

    it('should redirect unknown paths to "404"', async () => {
        await router.navigate(['unknown']);
        expect(location.path()).toBe('/404');
    });
});