import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, ElementRef, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
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

export class StarshipsListComponent implements OnInit, AfterViewInit {

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  starships = signal<StarshipsListItem[]>([]);

  currentPage = signal<number>(1);
  hasNext = signal<boolean>(false);
  hasPrev = signal<boolean>(false);

  activeIndex = signal<number>(0);
  currentShipImg: string | null = null;
  currentShipName: string | null = null;

  @ViewChild('carouselTrack') private trackEl?: ElementRef<HTMLUListElement>;

  private starshipsService = inject(StarshipsService);

  ngOnInit(): void {
    this.fetchPage(1);
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.scrollToActive());
  }

  fetchPage(page: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.starshipsService.getStarships(page).subscribe({
      next: (res: StarshipsResponse) => {
        this.starships.set(res.results);
        this.currentPage.set(page);
        this.hasNext.set(!!res.next);
        this.hasPrev.set(!!res.previous);

        this.setActiveIndex(0);
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

  nextPage(): void {
    if(this.hasNext()) this.fetchPage(this.currentPage() + 1);
  }

  prevPage(): void {
    if (this.hasPrev()) this.fetchPage(this.currentPage() - 1);
  }

  idFromUrl(url: string): number {
    const m = url.match(/\/starships\/(\d+)\/?$/);
    return m ? Number(m[1]) : 0;
  }

  private shipImageFrom(ship: StarshipsListItem): string {
    const id = this.idFromUrl(ship.url);
    return `/img/ships/${id}.png`;
  }

    setActiveIndex(i: number) {
    const list = this.starships();
    if (!list.length) return;

    const clamped = Math.max(0, Math.min(i, list.length - 1));
    this.activeIndex.set(clamped);

    const ship = list[clamped];
    this.currentShipName = ship?.name ?? null;
    this.currentShipImg  = ship ? this.shipImageFrom(ship) : null;

    this.scrollToActive();
  }

  goPrevInCarousel() { this.setActiveIndex(this.activeIndex() - 1); }
  goNextInCarousel() { this.setActiveIndex(this.activeIndex() + 1); }

  private scrollToActive() {
    const host = this.trackEl?.nativeElement;
    if (!host) return;

    const idx = this.activeIndex();
    const el = host.querySelector<HTMLElement>(`[data-idx="${idx}"]`);
    if (el) {
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }

  previewShip(ship: StarshipsListItem, idx: number) {
    this.currentShipName = ship.name;
    this.currentShipImg  = this.shipImageFrom(ship);
    this.activeIndex.set(idx);
  }

  clearPreview() {
    const i = this.activeIndex();
    const ship = this.starships()[i];
    this.currentShipName = ship?.name ?? null;
    this.currentShipImg  = ship ? this.shipImageFrom(ship) : null;
  }

}
