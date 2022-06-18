import { Component, ElementRef, HostBinding, Input, OnInit } from "@angular/core";
import { Category } from "src/models/Category.model";
import { CategoriesService } from "../../services/categories.service";
import { catchError, EMPTY, Observable, tap, take } from "rxjs";
import { ToggleService } from "src/app/services/toggle.service";
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout";

@Component({
    selector: "app-category",
    templateUrl: "./category.component.html",
    styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
    categories: [Category];
    isMenuOpen: boolean;

    constructor(
        private categorieService: CategoriesService,
        private toggleService: ToggleService,
        public breakpointObserver: BreakpointObserver,
        private el: ElementRef
    ) {}
    ngOnChanges() {
        this.toggleService.$toggle.subscribe((val: any) => {
            this.isMenuOpen = val;
        });
    }
    ngOnInit(): void {
        this.categorieService.getAllCategories();

        this.categorieService.categories$
            .pipe(
                tap((categories) => {
                    this.categories = categories;
                }),
                catchError((error) => {
                    return EMPTY;
                })
            )
            .subscribe();

        this.toggleService.$toggle.subscribe((val: any) => {
            this.isMenuOpen = val;
        });

        this.breakpointObserver
            .observe(["(min-width: 424px)"])

            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.toggleService.setToggle(false);
                }
            });
    }

}
