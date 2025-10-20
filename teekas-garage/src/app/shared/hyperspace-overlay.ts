import {
  Component, ElementRef, ViewChild, Input, OnDestroy, AfterViewInit, NgZone,
  Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

const RAD = Math.PI / 180;
const randomInRange = (max: number, min: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const BASE_SIZE = 1;
const VELOCITY_INC = 1.01;
const VELOCITY_INIT_INC = 1.025;
const JUMP_VELOCITY_INC = 1.25;
const JUMP_SIZE_INC = 1.15;
const SIZE_INC = 1.01;

const WARP_COLORS = [
  [197, 239, 247],
  [25, 181, 254],
  [77, 5, 232],
  [165, 55, 253],
  [255, 255, 255],
];

function lerp(current: number, target: number, alpha: number) {
  return current + (target - current) * alpha;
}

class Star {
  STATE: {
    alpha: number; angle: number;
    iX?: number; iY?: number; iVX?: number; iVY?: number;
    active?: boolean;
    x: number; y: number; vX: number; vY: number; size: number;
  };

  constructor() {
    this.STATE = { alpha: Math.random(), angle: randomInRange(0, 360) * RAD } as any;
    this.reset();
  }

  reset() {
    const angle = randomInRange(0, 360) * RAD;
    const vX = Math.cos(angle);
    const vY = Math.sin(angle);
    const travelled =
      Math.random() > 0.5
        ? Math.random() * Math.max(window.innerWidth, window.innerHeight) + (Math.random() * (window.innerWidth * 0.24))
        : Math.random() * (window.innerWidth * 0.25);

    this.STATE = {
      ...this.STATE,
      iX: undefined, iY: undefined,
      active: !!travelled,
      x: Math.floor(vX * travelled) + window.innerWidth / 2,
      vX,
      y: Math.floor(vY * travelled) + window.innerHeight / 2,
      vY,
      size: BASE_SIZE,
      alpha: Math.random(),
      angle
    };
  }
}

const generateStarPool = (n: number) => Array.from({ length: n }, () => new Star());


@Component({
  selector: 'app-hyperspace-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hs-root" [class.show]="show">
      <canvas #cv></canvas>

      <button *ngIf="show && showButton" class="hs-btn" type="button" (click)="engage()">
        Engage Hyperdrive
      </button>

      <div class="hs-flash" [class.on]="flash"></div>
    </div>
  `,
  styleUrls: ['./hyperspace-overlay.scss']
})
export class HyperspaceOverlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv', { static: true }) cv!: ElementRef<HTMLCanvasElement>;
  @Input() show = false;
  @Input() showButton = true;
  @Input() durationMs = 2500;
  @Output() done = new EventEmitter<void>();

  private ctx!: CanvasRenderingContext2D;
  private rafId: number | null = null;
  private stars: Star[] = generateStarPool(300);

  
  private velocity = VELOCITY_INC;
  private velocityTarget = VELOCITY_INC;
  private sizeInc = SIZE_INC;
  private sizeIncTarget = SIZE_INC;
  private bgAlpha = 0;
  private bgAlphaTarget = 0;

  private initiating = false;
  private jumping = false;
  private initiateTimestamp?: number;

  flash = false;

  constructor(private zone: NgZone) {}

  
  ngAfterViewInit() {
    this.ctx = this.cv.nativeElement.getContext('2d')!;
    this.fitCanvas();
    window.addEventListener('resize', this.onResize);
    this.startLoop();
  }

  ngOnDestroy() {
    this.stopLoop();
    window.removeEventListener('resize', this.onResize);
  }

 
  startAutoSequence() {
    this.flash = false;
    this.initiate();
    setTimeout(() => this.enter(), 700);
  }


  engage() { this.startAutoSequence(); }

  private startLoop() {
    this.zone.runOutsideAngular(() => {
      const tick = () => {
        this.drawFrame();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  private stopLoop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  private onResize = () => {
    if (this._resizeTimer) clearTimeout(this._resizeTimer);
    this._resizeTimer = window.setTimeout(() => this.reset(), 150);
  };
  private _resizeTimer: number | null = null;

  private fitCanvas() {
    const c = this.cv.nativeElement;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    c.width = Math.floor(window.innerWidth * dpr);
    c.height = Math.floor(window.innerHeight * dpr);
    c.style.width = '100%';
    c.style.height = '100%';
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private reset() {
    this.stars = generateStarPool(300);
    this.fitCanvas();
  }

  private drawFrame() {
    const ctx = this.ctx;
    const w = this.cv.nativeElement.width / (window.devicePixelRatio || 1);
    const h = this.cv.nativeElement.height / (window.devicePixelRatio || 1);

 
    this.velocity = lerp(this.velocity, this.velocityTarget, 0.18);
    this.sizeInc = lerp(this.sizeInc, this.sizeIncTarget, 0.18);
    this.bgAlpha = lerp(this.bgAlpha, this.bgAlphaTarget, 0.18);

    ctx.clearRect(0, 0, w, h);

    if (this.bgAlpha > 0.001) {
      ctx.fillStyle = `rgba(31, 58, 157, ${this.bgAlpha})`;
      ctx.fillRect(0, 0, w, h);
    }

    
    const nonActive = this.stars.filter(s => !s.STATE.active);
    if (!this.initiating && nonActive.length > 0) nonActive[0].STATE.active = true;

    
    ctx.lineCap = 'round';
    for (const star of this.stars.filter(s => s.STATE.active)) {
      const { active, x, y, iX, iY, iVX, iVY, size, vX, vY } = star.STATE;

      
      const baseX = (iX ?? x);
      const baseY = (iY ?? y);
      if ((baseX < 0 || baseX > w || baseY < 0 || baseY > h) && active && !this.initiating) {
        star.reset();
        continue;
      }

      
      const newIX = this.initiating
        ? iX
        : (iX !== undefined && iVX !== undefined) ? iX + iVX : iX;

      const newIY = this.initiating
        ? iY
        : (iY !== undefined && iVY !== undefined) ? iY + iVY : iY;

      const newX = x + vX;
      const newY = y + vY;

      
      const caughtX = (newIX !== undefined) && ((vX < 0 && newIX < x) || (vX > 0 && newIX > x));
      const caughtY = (newIY !== undefined) && ((vY < 0 && newIY < y) || (vY > 0 && newIY > y));
      const caught = caughtX || caughtY;

      
      const nextSize = this.initiating
        ? size
        : size * ((iX !== undefined || iY !== undefined) ? SIZE_INC : this.sizeInc);
      const cappedSize = Math.min(nextSize, 6);

      star.STATE = {
        ...star.STATE,
        iX: caught ? undefined : newIX,
        iY: caught ? undefined : newIY,
        iVX: caught ? undefined : (iVX !== undefined ? iVX * VELOCITY_INIT_INC : iVX),
        iVY: caught ? undefined : (iVY !== undefined ? iVY * VELOCITY_INIT_INC : iVY),
        x: newX,
        vX: vX * this.velocity,
        y: newY,
        vY: vY * this.velocity,
        size: cappedSize,
      };

      
      let color = `rgba(255,255,255,${star.STATE.alpha})`;
      if (this.jumping) {
        const [r, g, b] = WARP_COLORS[randomInRange(0, WARP_COLORS.length - 1)];
        color = `rgba(${r},${g},${b},${star.STATE.alpha})`;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = star.STATE.size;

      const fromX = (star.STATE.iX !== undefined) ? star.STATE.iX : star.STATE.x;
      const fromY = (star.STATE.iY !== undefined) ? star.STATE.iY : star.STATE.y;

      if (Number.isFinite(fromX) && Number.isFinite(fromY)) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(star.STATE.x, star.STATE.y);
        ctx.stroke();
      }
    }
  }

  private setTargets(t: Partial<{ velocity: number; bgAlpha: number; sizeInc: number }>) {
    if (t.velocity !== undefined) this.velocityTarget = t.velocity;
    if (t.bgAlpha !== undefined) this.bgAlphaTarget = t.bgAlpha;
    if (t.sizeInc !== undefined) this.sizeIncTarget = t.sizeInc;
  }

  private initiate() {
    if (this.jumping || this.initiating) return;
    this.initiating = true;
    this.initiateTimestamp = Date.now();
    this.setTargets({ velocity: VELOCITY_INIT_INC, bgAlpha: 0.3 });

    for (const star of this.stars.filter(s => s.STATE.active)) {
      star.STATE = {
        ...star.STATE,
        iX: star.STATE.x,
        iY: star.STATE.y,
        iVX: star.STATE.vX,
        iVY: star.STATE.vY,
      };
    }
  }

  private jump() {
    this.bgAlpha = 0;
    this.setTargets({ velocity: JUMP_VELOCITY_INC, bgAlpha: 0.75, sizeInc: JUMP_SIZE_INC });
    this.jumping = true;

    setTimeout(() => (this.flash = true), Math.max(0, this.durationMs - 200));

    setTimeout(() => {
      this.jumping = false;
      this.flash = false;
      this.setTargets({ bgAlpha: 0, velocity: VELOCITY_INC, sizeInc: SIZE_INC });
      this.done.emit();
    }, this.durationMs);
  }

  private enter() {
    if (this.jumping) return;
    const t0 = this.initiateTimestamp ?? 0;
    this.initiating = false;
    this.initiateTimestamp = undefined;

    if (Date.now() - t0 > 600) this.jump();
    else this.setTargets({ velocity: VELOCITY_INC, bgAlpha: 0 });
  }
}
