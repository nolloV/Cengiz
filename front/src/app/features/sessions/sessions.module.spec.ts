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

describe('SessionsModule', () => {
    // Configuration du module de test
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule, // Importation du module de test pour HttpClient
                RouterTestingModule, // Importation du module de test pour le routage
                SessionsModule // Importation du module à tester
            ],
            providers: [
                SessionApiService, // Fourniture du service SessionApiService
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => '1' // Mock de paramMap.get pour retourner un ID simulé
                            }
                        }
                    }
                }, // Fourniture d'un mock pour ActivatedRoute
                {
                    provide: SessionService,
                    useValue: {
                        sessionInformation: {
                            admin: true,
                            id: 1
                        }
                    }
                } // Fourniture d'un mock pour SessionService
            ]
        }).compileComponents();
    });

    // Test pour vérifier que le module est créé
    it('should create the module', () => {
        const module = TestBed.inject(SessionsModule);
        expect(module).toBeTruthy();
    });

    // Test pour vérifier que ListComponent est déclaré
    it('should declare ListComponent', () => {
        const fixture = TestBed.createComponent(ListComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    // Test pour vérifier que DetailComponent est déclaré
    it('should declare DetailComponent', () => {
        const fixture = TestBed.createComponent(DetailComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    // Test pour vérifier que FormComponent est déclaré
    it('should declare FormComponent', () => {
        const fixture = TestBed.createComponent(FormComponent);
        const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
});