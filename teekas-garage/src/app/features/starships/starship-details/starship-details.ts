import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StarshipsService } from '../../../core/services/starships.service';
import { StarshipDetailsItem } from '../../../core/models/starships';

@Component({
  selector: 'app-starship-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './starship-details.html',
  styleUrl: './starship-details.scss'
})

export class StarshipDetailsComponent implements OnInit{
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  starship = signal<StarshipDetailsItem | null>(null);

  private route = inject(ActivatedRoute);
  private starshipsService = inject(StarshipsService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);
      this.fetchDetails(id);
    } else {
      this.error.set('No starship ID provided');
      this.loading.set(false);
    }
  }

  private fetchDetails(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.starshipsService.getStarshipDetails(id).subscribe({
      next: (details: StarshipDetailsItem) => {
        this.starship.set(details);     
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Unexpected error';
        this.error.set(msg);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
