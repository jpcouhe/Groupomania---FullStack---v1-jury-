import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { User } from "src/models/User.model";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Component({
    selector: "app-get-started",
    templateUrl: "./get-started.component.html",
    styleUrls: ["./get-started.component.scss"],
})
export class GetStartedComponent implements OnInit, OnDestroy {
    userComponent$!: Observable<User>;
    user: any;
    selectedFile: File | undefined;
    url: any = "";
    popup = false;

    constructor(
        @Inject(DOCUMENT) private _document: any,
        private router: Router,
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        const id = this.authService.getUserId();
        this.userService.getUserById(id);
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();
        this._document.body.classList.add("bodybg-color");
    }

    ngOnDestroy(): void {
        this._document.body.classList.add("bodybg-color");
    }

    onselectFile(event: any) {
        this.selectedFile = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
            this.url = event.target.result;
        };
    }

    setPopup() {
        this.popup = !this.popup;
    }

    setFiles(event: any) {
        this.selectedFile = undefined;
        this.url = event.target.currentSrc;
    }

    goToNextPage() {
        const id = this.authService.getUserId();

        let imgProfil;
        this.selectedFile ? (imgProfil = this.selectedFile) : (imgProfil = this.url);
        this.userService
            .updateUser(id, imgProfil, this.user.firstname, this.user.lastname)
            .pipe(
                tap(() => {
                    this.router.navigate(["/accueil/feed"]);
                }),
                catchError((error) => {
                    return EMPTY;
                })
            )
            .subscribe();
    }
}
