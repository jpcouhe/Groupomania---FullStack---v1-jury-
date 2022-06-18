// Gros Fichier qui nous permet de créer des méthodes Accessibles à Tout nos modules et les importants dans le Constructeur

import { TOUCH_BUFFER_MS } from "@angular/cdk/a11y/input-modality/input-modality-detector";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    //Pour le Guard
    isLoggedIn: boolean = false;
    private access_token = "";
    private userId = "";
    private tokenType = "";
    private expire = "";
    private role = "";

    constructor(private http: HttpClient, private router: Router) {}

    createUser(email: string, password: string, lastname: string, firstname: string) {
        return this.http.post<{ message: string }>("http://localhost:3003/api/auth/signup", {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
        });
    }

    loginUser(email: string, password: string) {
        return this.http
            .post<{
                userId: string;
                access_token: string;
                token_type: string;
                expires_in: string;
            }>("http://localhost:3003/api/auth/login", {
                email: email,
                password: password,
            })
            .pipe(
                tap(({ userId, access_token, token_type, expires_in }) => {
                    this.userId = userId;
                    this.access_token = access_token;
                    this.tokenType = token_type;
                    this.expire = expires_in;
                    this.isLoggedIn = true;
                })
            );
    }

    getToken() {
        return this.access_token;
    }

    getUserId() {
        return this.userId;
    }

    logout() {
        return this.http
            .post<{ message: string }>("http://localhost:3003/api/auth/logout", this.access_token)
            .pipe(
                tap(() => {
                    this.isLoggedIn = false;
                    this.access_token = "";
                    this.userId = "";
                    this.tokenType = "";
                    this.expire = "";
                })
            );
    }
}
