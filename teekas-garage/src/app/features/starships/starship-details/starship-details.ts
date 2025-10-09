import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StarshipsService } from '../../../core/services/starships.service';
import { StarshipDetailsItem, PilotItem, FilmItem } from '../../../core/models/starships';

type StarshipDetailsVM = StarshipDetailsItem & {
  pilots: PilotItem[];
  films: FilmItem[];
}

@Component({
  selector: 'app-starship-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './starship-details.html',
  styleUrl: './starship-details.scss'
})

export class StarshipDetailsComponent implements OnInit{

  private vm = signal<StarshipDetailsVM | null>(null);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  starship = () => this.vm();

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

    this.starshipsService.getStarshipFullDetails(id).subscribe({
      next: (details) => {
        this.vm.set(details);     
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

  onImgError(ev: Event, fallback: string) {
    (ev.target as HTMLImageElement).src = fallback;
  }
}
