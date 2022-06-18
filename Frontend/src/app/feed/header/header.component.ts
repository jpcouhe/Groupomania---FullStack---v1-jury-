import { Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { catchError, EMPTY, Observable, tap, take } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { ThemeService } from "src/app/services/theme.service";
import { ToggleService } from "src/app/services/toggle.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/models/User.model";
import { CategoryComponent } from "../category/category.component";
import { ProfilComponent } from "../profil/profil.component";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
    visible: boolean = false;

    // @Input() sideBar: CategoryComponent;
    url: any;
    user: User | undefined;
    userComponent$!: Observable<User>;
    dark: boolean;
    light: boolean;
    isMenuOpen = false;
    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private dialog: MatDialog,
        private themeService: ThemeService,
        private toggleService: ToggleService,
        public breakpointObserver: BreakpointObserver
    ) {}

    ngOnInit(): void {
        this.dark = false;
        this.userService.user$
            .pipe(
                tap((user) => {
                    this.user = user;
                })
            )
            .subscribe();

        this.breakpointObserver
            .observe(["(min-width: 424px)"])

            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.visible = false;
                }
            });
    }

    logOut() {
        this.authService
            .logout()
            .pipe(
                tap(() => {
                    this.router.navigate(["/login"]);
                }),
                catchError((error) => {
                    return EMPTY;
                })
            )
            .subscribe();
    }
    // toggleMenu(): void {
    //     this.isMenuOpen = !this.isMenuOpen;
    // }
    displayProfil() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "600px";
        dialogConfig.height = "600px";
        dialogConfig.maxWidth = "80%";
        this.dialog.open(ProfilComponent, dialogConfig);
    }
    toggleDarkTheme(): void {
        if (this.themeService.isDarkTheme()) {
            this.themeService.setLightTheme();
            this.light = true;
            this.dark = false;
        } else {
            this.themeService.setDarkTheme();
            this.light = false;
            this.dark = true;
        }
    }

    toggleBox(): void {
        this.visible = !this.visible;
        this.toggleService.setToggle(this.visible);
     
    }
}
