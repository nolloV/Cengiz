import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionsModule } from './sessions.module';
import { ListComponent } from './components/list/list.component';
import { DetailComponent } from './components/detail/detail.component';
import { FormComponent } from './components/form/form.component';
import { SessionApiService } from './services/session-api.service';
import { SessionService } from 'src/app/services/session.service';
import { ActivatedRoute } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

describe('SessionsModule', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule, // Module de test pour HttpClient
                RouterTestingModule, // Module de test pour le routage
                SessionsModule // Module à tester
            ],
            providers: [
                SessionApiService, // Fourniture du service SessionApiService
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => '1' // Simule un ID de route '1'
                            }
                        },
                        params: of({ id: '1' }) // Simule l'observable des paramètres de la route
                    }
                },
                {
                    provide: SessionService,
                    useValue: {
                        sessionInformation: {
                            admin: true,
                            id: 1
                        }
                    }
                }
            ]
        }).compileComponents();
    });

    it('should create the module', () => {
        const module = TestBed.inject(SessionsModule);
        expect(module).toBeTruthy();
    });

    it('should declare ListComponent', () => {
        const fixture = TestBed.createComponent(ListComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should declare DetailComponent', () => {
        const fixture = TestBed.createComponent(DetailComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should declare FormComponent', () => {
        const fixture = TestBed.createComponent(FormComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
});
