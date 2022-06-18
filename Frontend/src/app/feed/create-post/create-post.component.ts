import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/models/User.model";
import { FormPostComponent } from "../form-post/form-post.component";

@Component({
    selector: "app-create-post",
    templateUrl: "./create-post.component.html",
    styleUrls: ["./create-post.component.scss"],
})
export class CreatePostComponent implements OnInit {
    user: User | undefined;
    user$!: Observable<User>;
    constructor(
        private router: Router,
        private userService: UserService,
        private authService: AuthService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
   
        this.userService.user$.pipe(
            tap((user) => {
                this.user = user;
            })
        ).subscribe();
    }

    displayForm() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "600px";
        dialogConfig.maxWidth = "80%";
        dialogConfig.hasBackdrop = true;
        this.dialog.open(FormPostComponent, dialogConfig);
    }
}
