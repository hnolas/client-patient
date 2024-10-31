import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private apiUrl = 'http://localhost:8000';  // FastAPI URL

  constructor(private http: HttpClient) {}

  syncData(patientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync/push_clinic`, patientData);
  }

  getPatientData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sync/pull_patient_data`);
  }
}
