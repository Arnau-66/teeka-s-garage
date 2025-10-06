import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { StarshipsService } from '../../../core/services/starships.service';
import { StarshipsListItem, StarshipsResponse } from '../../../core/models/starships';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-starships-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './starships-list.html',
  styleUrl: './starships-list.scss'
})

export class StarshipsListComponent implements OnInit {
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  starships = signal<StarshipsListItem[]>([]);

  private starshipsService = inject(StarshipsService);
  ngOnInit(): void {
    this.fetchPage(1);
  }

  fetchPage(page: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.starshipsService.getStarships(page).subscribe({
      next: (res: StarshipsResponse) => {
        this.starships.set(res.results);
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unexpected error';
        this.error.set(msg);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  idFromUrl(url: string): number {
    const m = url.match(/\/starships\/(\d+)\/?$/);
    return m ? Number(m[1]) : 0;
  }
}
