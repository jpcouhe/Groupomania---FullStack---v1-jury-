import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Content } from "src/models/Content.model";

@Injectable({
    providedIn: "root",
})
export class ContentService {
    nbComments: any;
    content: any;

    constructor(private http: HttpClient, private router: Router) {}

    getComment(id: string, pageNumber: number, pageSize: number) {
        return this.http.get<Content[]>(
            "http://localhost:3003/api/comment/" + id + "/" + pageNumber + "/" + pageSize
        );
    }
    getPost(pageNumber: number, pageSize: number, categorie: string | undefined) {
        return this.http.get<Content[]>(
            "http://localhost:3003/api/post?start=" +
                pageNumber +
                "&limit=" +
                pageSize +
                "&category=" +
                categorie
        );
    }

    deletePost(id: string) {
        return this.http.delete<{ message: string }>("http://localhost:3003/api/post/" + id);
    }

    createPost(title: string, content: string | File, categorie: string) {
        if (typeof content === "string") {
            const post = { title: title, categorie: categorie, content: content };
            const formData = new FormData();
            formData.append("post", JSON.stringify(post));
            return this.http.post<{ message: string }>("http://localhost:3003/api/post/", formData);
        } else {
            const formData = new FormData();
            const post = { title: title, categorie: categorie };
            formData.append("post", JSON.stringify(post));
            formData.append("image", content);
            return this.http.post<{ message: string }>("http://localhost:3003/api/post/", formData);
        }
    }

    modifyPost(id: string, title: string, content: string | File, categorie: string) {
        if (typeof content === "string") {
            const post = { title: title, content: content, categorie: categorie };
            const formData = new FormData();
            formData.append("post", JSON.stringify(post));
            return this.http.put<{ message: string }>("http://localhost:3003/api/post/" + id, formData);
        } else {
            const formData = new FormData();
            const post = { title: title, categorie: categorie };
            formData.append("post", JSON.stringify(post));
            formData.append("image", content);
            return this.http.put<{ message: string }>("http://localhost:3003/api/post/" + id, formData);
        }
    }

    createComment(threadid: any, content: string | File) {
        if (typeof content === "string") {
            const formData = new FormData();
            const comment = { threadId: threadid, content: content };
            formData.append("comment", JSON.stringify(comment));
            return this.http.post<{ message: string }>("http://localhost:3003/api/comment/", formData);
        } else {
            const formData = new FormData();
            const comment = { threadId: threadid };
            formData.append("comment", JSON.stringify(comment));
            formData.append("image", content);
            return this.http.post<{ message: string }>("http://localhost:3003/api/comment/", formData);
        }
    }

    likePost(id: any, like: boolean) {
        return this.http.post<{ message: string }>("http://localhost:3003/api/like/" + id, {
            like: like ? 1 : 0,
        });
    }

    getNumberLike(id: any) {
        return this.http.get<any>("http://localhost:3003/api/like/" + id);
    }

    deleteComment(id: string) {
        return this.http.delete<{ message: string }>("http://localhost:3003/api/comment/" + id);
    }

    getNumberComment(id: any) {
        return this.http.get<any>("http://localhost:3003/api/comment/" + id + "/nb");
    }
}
