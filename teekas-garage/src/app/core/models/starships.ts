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