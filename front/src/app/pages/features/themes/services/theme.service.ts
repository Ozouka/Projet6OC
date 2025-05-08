import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme, ThemeRequest } from '../interfaces/theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private pathService = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  public getThemes(): Observable<Theme[]> {
    return this.httpClient.get<Theme[]>(`${this.pathService}/themes`, {
      headers: this.getHeaders()
    });
  }

  public createTheme(themeRequest: ThemeRequest): Observable<Theme> {
    return this.httpClient.post<Theme>(`${this.pathService}/themes`, themeRequest, {
      headers: this.getHeaders()
    });
  }

  public subscribeToTheme(themeId: number): Observable<Theme> {
    return this.httpClient.post<Theme>(`${this.pathService}/themes/${themeId}/subscribe`, {}, {
      headers: this.getHeaders()
    });
  }

  public unsubscribeFromTheme(themeId: number): Observable<Theme> {
    return this.httpClient.delete<Theme>(`${this.pathService}/themes/${themeId}/subscribe`, {
      headers: this.getHeaders()
    });
  }
}
