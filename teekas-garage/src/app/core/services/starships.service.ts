import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { StarshipsResponse, StarshipDetailsResponse, StarshipDetailsItem } from "../models/starships";

function idFromUrl(url: string): number {
    const match = url.match(/\/starships\/(\d+)\/?$/);
    return match ? Number(match[1]) : 0;
}

function toNumberOrNull(value: string): number | null {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function mapStarshipDetails(raw: StarshipDetailsResponse): StarshipDetailsItem {
    return {
        id: idFromUrl(raw.url),
        name: raw.name,
        model: raw.model,
        manufacturer: raw.manufacturer,
        costInCredits: toNumberOrNull(raw.cost_in_credits),
        length: toNumberOrNull(raw.length),
        maxAtmospheringSpeed: toNumberOrNull(raw.max_atmosphering_speed),
        crew: raw.crew,
        passengers: raw.passengers,
        cargoCapacity: raw.cargo_capacity,
        consumables: raw.consumables,
        hyperdriveRating: raw.hyperdrive_rating,
        mglt: raw.MGLT,
        starshipClass: raw.starship_class
    };    
}

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

    getStarshipDetails(id: number): Observable<StarshipDetailsItem> {
        const primaryUrl = `${this.primaryBase}/starships/${id}/`;
        const fallbackUrl = `${this.fallbackBase}/starships/${id}/`;

        return this.http.get<StarshipDetailsResponse>(primaryUrl).pipe(
            map(raw => mapStarshipDetails(raw)),
            catchError(primaryErr => {
                return this.http.get<StarshipDetailsResponse>(fallbackUrl).pipe(
                    map(raw => mapStarshipDetails(raw)),
                    catchError(fallbackErr => {
                        const message = '[API] Primary and fallback starship detail endpoints failed';
                        console.log(message, { primaryErr, fallbackErr});
                        return throwError(() => new Error(message));
                    })    
                );
            })
        );
    }

}