export interface StarshipsListItem {
    name: string;
    model: string;
    url: string;
}

export interface StarshipsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: StarshipsListItem[];
}

export interface StarshipDetailsResponse {
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables:string;
    hyperdrive_rating: string;
    MGLT: string;
    starship_class: string;
    url: string;
    pilots: string[];
    films: string[];
}

export interface StarshipDetailsItem {
    id: number;
    name: string;
    model: string;
    manufacturer: string;
    costInCredits: number | null;
    length: number | null;
    maxAtmospheringSpeed: number | null;
    crew: string;
    passengers: string;
    cargoCapacity: string;
    consumables: string;
    hyperdriveRating: string;
    mglt: string;
    starshipClass: string; 
    pilotUrls: string[];
    filmUrls: string[];
    imageUrl: string;  
}

export interface PersonResponse {
    name: string;
    url: string;
}

export interface FilmResponse {
    title: string;
    episode_id: number;
    release_date: string;
    url: string;
}

export interface PilotItem {
    id: number;
    name: string;
    imageUrl: string;
}

export interface FilmItem {
    id: number;
    title: string;
    episode: number;
    releaseDate: string;
}