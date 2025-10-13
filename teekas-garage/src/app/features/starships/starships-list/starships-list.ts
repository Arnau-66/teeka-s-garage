import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
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

  loading   = signal<boolean>(true);
  error     = signal<string | null>(null);
  starships = signal<StarshipsListItem[]>([]);

  currentPage = signal<number>(1);
  hasNext     = signal<boolean>(false);
  hasPrev     = signal<boolean>(false);

  activeIndex = signal<number>(0);

  @ViewChild('rack') private trackEl?: ElementRef<HTMLUListElement>;

  private starshipsService = inject(StarshipsService);
  private scrollLock = false;

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
      complete: () => this.loading.set(false),
    });
  }

  nextPage(): void { if (this.hasNext()) this.fetchPage(this.currentPage() + 1); }
  prevPage(): void { if (this.hasPrev()) this.fetchPage(this.currentPage() - 1); }

  idFromUrl(url: string): number {
    const m = url.match(/\/starships\/(\d+)\/?$/);
    return m ? Number(m[1]) : 0;
  }

  shipImageFrom(ship: StarshipsListItem): string {
    const id = this.idFromUrl(ship.url);
    return `/img/ships/${id}.png`;
  }

  setActiveIndex(i: number) {
    const list = this.starships();
    if (!list.length) return;

    const clamped = Math.max(0, Math.min(i, list.length - 1));
    this.activeIndex.set(clamped);
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
      this.scrollLock = true;
      el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      setTimeout(() => (this.scrollLock = false), 250);
    }
  }

  // Detecta cuál está más centrado cuando el usuario hace scroll manual
  onTrackScroll() {
    if (this.scrollLock) return;
    const host = this.trackEl?.nativeElement;
    if (!host) return;

    const children = Array.from(host.querySelectorAll<HTMLElement>('.ship-item'));
    if (!children.length) return;

    const rackRect = host.getBoundingClientRect();
    const rackCenterX = rackRect.left + rackRect.width / 2;

    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    children.forEach((el, idx) => {
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - rackCenterX);
      if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
    });

    if (bestIdx !== this.activeIndex()) {
      this.activeIndex.set(bestIdx);
    }
  }

  // Navegación por teclado
  @HostListener('window:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); this.goPrevInCarousel(); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); this.goNextInCarousel(); }
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = '/img/placeholders/ship-placeholder.png';
  }
}
