export interface StarshipListItem {
    name: string;
    model: string;
    url: string;
}

export interface StarshipRespone {
    count: number;
    next: string | null;
    previous: string | null;
    results: StarshipListItem[];
}