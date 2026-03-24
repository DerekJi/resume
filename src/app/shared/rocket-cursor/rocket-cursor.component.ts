import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';

/** Selectors that trigger the hover (crosshair) state */
const HOVER_SELECTORS = 'a, button, [role="button"], input, textarea, select, label, [tabindex]';

@Component({
  selector: 'app-rocket-cursor',
  standalone: false,
  template: `
    <div
      class="rocket-cursor"
      [class.rocket-visible]="visible"
      [class.rocket-hover]="hovering"
      [style.left.px]="x"
      [style.top.px]="y"
      [style.transform]="cursorTransform"
    >
      <!-- Default: rocket -->
      <svg *ngIf="!hovering"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 38" width="26" height="38" aria-hidden="true">
        <path d="M10 0 L4 13 L16 13 Z" fill="#00c8ff"/>
        <rect x="5" y="12" width="10" height="14" rx="2" fill="#ccd6f6"/>
        <circle cx="10" cy="18" r="2.8" fill="#070c18" stroke="#00c8ff" stroke-width="1.2"/>
        <path d="M5 22 L0 32 L7 27 Z" fill="#00c8ff"/>
        <path d="M15 22 L20 32 L13 27 Z" fill="#00c8ff"/>
        <ellipse cx="10" cy="30.5" rx="3.5" ry="5" fill="#ff8c00" opacity="0.88"/>
        <ellipse cx="10" cy="31.5" rx="2" ry="3.5" fill="#ffdd00" opacity="0.95"/>
      </svg>

      <!-- Hover: crosshair / target -->
      <svg *ngIf="hovering"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
        <!-- Outer circle -->
        <circle cx="16" cy="16" r="13" fill="none" stroke="#00c8ff" stroke-width="1.5" opacity="0.9"/>
        <!-- Inner circle -->
        <circle cx="16" cy="16" r="5" fill="none" stroke="#00e5ff" stroke-width="1.5"/>
        <!-- Centre dot -->
        <circle cx="16" cy="16" r="1.8" fill="#00e5ff"/>
        <!-- Cross hairs -->
        <line x1="16" y1="1"  x2="16" y2="9"  stroke="#00c8ff" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="16" y1="23" x2="16" y2="31" stroke="#00c8ff" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="1"  y1="16" x2="9"  y2="16" stroke="#00c8ff" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="23" y1="16" x2="31" y2="16" stroke="#00c8ff" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
  `,
  styles: [`
    :host { pointer-events: none; }

    .rocket-cursor {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99999;
      pointer-events: none;
      user-select: none;
      opacity: 0;
      transition: transform 0.08s linear, opacity 0.2s;
      will-change: transform, left, top;
    }

    .rocket-cursor.rocket-visible {
      opacity: 1;
    }

    /* crosshair spins slowly when hovering */
    .rocket-cursor.rocket-hover svg {
      animation: crosshair-spin 4s linear infinite;
    }

    @keyframes crosshair-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RocketCursorComponent implements OnDestroy {
  x = -100;
  y = -100;
  angle = 0;
  visible = false;
  hovering = false;

  private lastX = 0;
  private lastY = 0;

  get cursorTransform(): string {
    // crosshair has its own spin animation; skip rotation transform when hovering
    return this.hovering
      ? 'translate(-50%, -50%)'
      : `translate(-50%, -50%) rotate(${this.angle}deg)`;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      this.angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    }

    this.x = e.clientX;
    this.y = e.clientY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (!this.visible) { this.visible = true; }

    // Detect hover over interactive elements
    const target = e.target as Element;
    this.hovering = !!target?.closest(HOVER_SELECTORS);

    this.cdr.markForCheck();
  }

  @HostListener('document:mouseleave')
  onMouseLeave(): void {
    this.visible = false;
    this.cdr.markForCheck();
  }

  @HostListener('document:mouseenter')
  onMouseEnter(): void {
    this.visible = true;
    this.cdr.markForCheck();
  }
}

