import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionInformation } from '../../auth/components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public isLogged = false;
  private sessionInformation: SessionInformation | undefined;

  private isLoggedSubject = new BehaviorSubject<boolean>(this.getLoggedStatusFromStorage());

  constructor() {
    this.isLogged = this.getLoggedStatusFromStorage();
  }

  public logIn(response: any): void {
    localStorage.setItem('token', response.token);
    this.sessionInformation = response.sessionInformation;
    this.isLogged = true;
    localStorage.setItem('isLogged', 'true');
    localStorage.setItem('sessionInformation', JSON.stringify(response.sessionInformation));
    this.isLoggedSubject.next(true);
  }

  public logOut(): void {
    this.sessionInformation = undefined;
    this.isLogged = false;
    localStorage.removeItem('isLogged');
    localStorage.removeItem('sessionInformation');
    this.isLoggedSubject.next(false);
  }

  public getLoggedStatusFromStorage(): boolean {
    return localStorage.getItem('isLogged') === 'true';
  }

  public getSessionInformation(): SessionInformation | undefined {
    if (!this.sessionInformation) {
      const storedSession = localStorage.getItem('sessionInformation');
      if (storedSession) {
        this.sessionInformation = JSON.parse(storedSession);
      }
    }
    return this.sessionInformation;
  }

  public $isLogged(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }
}
