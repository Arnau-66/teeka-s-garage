import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { StarshipsResponse } from "../models/starships";

@Injectable({ providedIn: 'root'})
export class StarshipsService {
    private readonly primaryBase = environment.apiPrimary;
    private readonly fallbackBase = environment.apiFallback;

    constructor(private http: HttpClient) {}

    getStarships(page: number = 1): Observable<StarshipsResponse> {
        const primaryUrl = `${this.primaryBase}/starships/?page=${page}`;
        const fallbackUrl = `${this.fallbackBase}/starships/?page=${page}`;

         return this.http.get<StarshipsResponse>(primaryUrl).pipe(
            
            catchError(primaryErr => {
                return this.http.get<StarshipsResponse>(fallbackUrl).pipe(
                
                catchError(fallbackErr => {
                    const message = '[API] Primary and fallback starships endpoints failed';
                    console.error(message, { primaryErr, fallbackErr });
                    return throwError(() => new Error(message));
                    })
                );
            })
        );
    }

    
}