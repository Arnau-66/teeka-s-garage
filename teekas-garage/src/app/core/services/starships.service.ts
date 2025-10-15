import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, throwError, forkJoin, of, switchMap } from "rxjs";
import { environment } from "../../../environments/environment";
import { 
    StarshipsResponse,
    StarshipDetailsResponse, 
    StarshipDetailsItem, 
    PersonResponse, 
    FilmResponse, 
    PilotItem, 
    FilmItem
 } from "../models/starships";

function localPublicShipImageUrl(id: number): string {
  return `/img/ships/${id}.png`;
}

function localPublicPilotImageUrl(id: number): string {
  return `/img/pilots/${id}.png`;
}

function idFromUrl(url: string): number {
    const match = url.match(/\/starships\/(\d+)\/?$/);
    return match ? Number(match[1]) : 0;
}

function toNumberOrNull(value: string): number | null {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function idFromUrlKind(url: string, kind: 'starships' | 'people' | 'films'): number {
    const m = url.match(new RegExp (`/${kind}/(\\d+)/?$`));
    return m ? Number(m[1]) : 0;
}

function shipImageUrl(id: number): string {
    return `https://starwars-visualguide.com/assets/img/starships/${id}.jpg`;
}

function characterImageUrl(id: number): string {
    return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
}

function mapStarshipDetails(raw: StarshipDetailsResponse): StarshipDetailsItem {
    
    const id = idFromUrlKind(raw.url, 'starships');
    
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
        starshipClass: raw.starship_class,
        pilotUrls: raw.pilots ?? [],
        filmUrls: raw.films ?? [],
        imageUrl: localPublicShipImageUrl(id),

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

    getPilotsByUrls(urls: string[]): Observable<PilotItem[]> {
        if (!urls?.length) return of([] as PilotItem[]);

        return forkJoin(urls.map(u => this.http.get<PersonResponse>(u))).pipe(
            map(people =>
                people.map(p => {
                    const id = idFromUrlKind(p.url, 'people');
                    return { id, name: p.name, imageUrl: localPublicPilotImageUrl(id)} as PilotItem;
                })
            ),
            catchError(() => of([] as PilotItem[]))
        );
    }

    getFilmsByUrls(urls: string[]): Observable<FilmItem[]> {
        if (!urls?.length) return of ([] as FilmItem[]);

        return forkJoin(urls.map(u => this.http.get<FilmResponse>(u))).pipe(
            map(films =>
                films.map(f => ({
                    id: idFromUrlKind(f.url, 'films'),
                    title: f.title,
                    episode: f.episode_id,
                    releaseDate: f.release_date,
                } as FilmItem))
            ),

            catchError(() => of ([] as FilmItem[]))
        );
    }

    getStarshipFullDetails(id: number) {
        return this.getStarshipDetails(id).pipe(
            switchMap(details =>
                forkJoin({
                    pilots: this.getPilotsByUrls(details.pilotUrls),
                    films: this.getFilmsByUrls(details.filmUrls),
                }).pipe(
                    map(({pilots, films}) => ({
                        ...details,
                        pilots,
                        films,
                    }))
                )
            )
        );
    }

}