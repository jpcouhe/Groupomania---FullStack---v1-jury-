import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoriesService } from "src/app/services/categories.service";
import { catchError, EMPTY, Observable, tap, take } from "rxjs";
import { Category } from "src/models/Category.model";

@Component({
    selector: "app-insert-category",
    templateUrl: "./insert-category.html",
    styleUrls: ["./insert-category.scss"],
})
export class InsertCategoryComponent implements OnInit {
    categories: [Category];
    categoryForm!: FormGroup;
    constructor(private formBuilder: FormBuilder, private categorieService: CategoriesService) {}

    ngOnInit(): void {
        this.categoryForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.maxLength(10)]],
            slug: [null, [Validators.required]],
        });

        this.categorieService.categories$
            .pipe(
                tap((categorie) => {
                    this.categories = categorie;
                })
            )
            .subscribe();
    }

    createCategories() {
        const name = this.categoryForm.get("name")!.value;
        const slug = this.categoryForm.get("slug")!.value;

        this.categorieService.createCategories(name, slug).subscribe(() => {

            this.categorieService.categories$.next(this.categories);
        });
    }

    get name() {
        return this.categoryForm.controls["name"];
    }

    get slug() {
        return this.categoryForm.controls["slug"];
    }
}
