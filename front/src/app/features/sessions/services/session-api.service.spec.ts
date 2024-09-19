import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { expect } from '@jest/globals';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  // Configuration du module de test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importation du module de test pour HttpClient
      providers: [SessionApiService] // Fourniture du service à tester
    });
    service = TestBed.inject(SessionApiService); // Injection du service
    httpMock = TestBed.inject(HttpTestingController); // Injection du contrôleur de test HTTP
  });

  // Vérification des requêtes HTTP après chaque test
  afterEach(() => {
    httpMock.verify();
  });

  // Test pour vérifier que le service est créé
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test pour vérifier la récupération de toutes les sessions
  it('should fetch all sessions', () => {
    const mockSessions: Session[] = [
      { id: 1, name: 'Session 1', date: new Date(), description: 'Description 1', teacher_id: 1, users: [1, 2] },
      { id: 2, name: 'Session 2', date: new Date(), description: 'Description 2', teacher_id: 2, users: [3, 4] }
    ];

    service.all().subscribe(sessions => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  // Test pour vérifier la récupération des détails d'une session
  it('should fetch session details', () => {
    const mockSession: Session = { id: 1, name: 'Session 1', date: new Date(), description: 'Description 1', teacher_id: 1, users: [1, 2] };

    service.detail('1').subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  // Test pour vérifier la suppression d'une session
  it('should delete a session', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test pour vérifier la création d'une session
  it('should create a session', () => {
    const mockSession: Session = { id: 1, name: 'New Session', date: new Date(), description: 'New Description', teacher_id: 1, users: [1, 2] };

    service.create(mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(mockSession);
  });

  // Test pour vérifier la mise à jour d'une session
  it('should update a session', () => {
    const mockSession: Session = { id: 1, name: 'Updated Session', date: new Date(), description: 'Updated Description', teacher_id: 1, users: [1, 2] };

    service.update('1', mockSession).subscribe(session => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession);
  });

  // Test pour vérifier la participation à une session
  it('should participate in a session', () => {
    service.participate('1', 'user1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  // Test pour vérifier l'annulation de la participation à une session
  it('should unParticipate from a session', () => {
    service.unParticipate('1', 'user1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});