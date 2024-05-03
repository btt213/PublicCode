import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email, password){
    return this.http.post<any>(`http://localhost:8080/authenticate`, { email, password })
      .pipe(map(response => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        this.currentUserSubject.next(response.data);
        return response;
      }));
  }

  checkEmail(email){

    return this.http.get<any>(`http://localhost:8080/checkAccountExists`, {params: {email: email} })
      .pipe(map(response => {
        return response;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  updateUser(details: any) {
    localStorage.setItem('currentUser', JSON.stringify(details));
    this.currentUserSubject.next(details);
  }
  checkPassword(email: string, password: string) {
    return this.http.post<any>(`http://localhost:8080/checkPassword`, { email: email, password: password})
      .pipe(map(response => {
        return response;
      }));
  }
}
