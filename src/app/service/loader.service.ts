import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class LoaderService {
    activeRequests$: BehaviorSubject<number>;
    isLoading$: Observable<boolean>;

    constructor() {
        this.activeRequests$ = new BehaviorSubject(0);
        this.isLoading$ = this.activeRequests$.pipe(map(requests => requests > 0));
    }

    public onRequestStart():void {
        setTimeout(() => this.activeRequests$.next(this.activeRequests$.value + 1), 10);
    }

    public onRequestEnd():void {
        setTimeout(() => this.activeRequests$.next(this.activeRequests$.value - 1), 10);
    }
}