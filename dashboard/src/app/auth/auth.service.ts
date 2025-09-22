import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, UserDTO } from '../models/models';


@Injectable({ providedIn: 'root' })
export class AuthService {
    private base = '/api'; // proxy to backend (set devServer proxy) or use full URL
    private _user: UserDTO | null = null;
    constructor(private http: HttpClient) {
    const raw = localStorage.getItem('user');
    if (raw) this._user = JSON.parse(raw);
}
    login(email: string, password: string) {
return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password });
}
setSession(res: LoginResponse) {
localStorage.setItem('token', res.access_token);
localStorage.setItem('user', JSON.stringify(res.user));
this._user = res.user;
}
currentUser() { return this._user; }
isLoggedIn() { return !!localStorage.getItem('token'); }
logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); this._user = null; }
}