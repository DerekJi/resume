import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-rocket-cursor',
  standalone: false,
  template: `
    <div
      class="rocket-cursor"
      [class.rocket-visible]="visible"
      [style.left.px]="x"
      [style.top.px]="y"
      [style.transform]="cursorTransform"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 38" width="26" height="38" aria-hidden="true">
        <!-- Nose cone -->
        <path d="M10 0 L4 13 L16 13 Z" fill="#00c8ff"/>
        <!-- Body -->
        <rect x="5" y="12" width="10" height="14" rx="2" fill="#ccd6f6"/>
        <!-- Porthole -->
        <circle cx="10" cy="18" r="2.8" fill="#070c18" stroke="#00c8ff" stroke-width="1.2"/>
        <!-- Left fin -->
        <path d="M5 22 L0 32 L7 27 Z" fill="#00c8ff"/>
        <!-- Right fin -->
        <path d="M15 22 L20 32 L13 27 Z" fill="#00c8ff"/>
        <!-- Flame outer -->
        <ellipse cx="10" cy="30.5" rx="3.5" ry="5" fill="#ff8c00" opacity="0.88"/>
        <!-- Flame inner -->
        <ellipse cx="10" cy="31.5" rx="2" ry="3.5" fill="#ffdd00" opacity="0.95"/>
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RocketCursorComponent implements OnDestroy {
  x = -100;
  y = -100;
  angle = 0;
  visible = false;

  private lastX = 0;
  private lastY = 0;
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  get cursorTransform(): string {
    return `translate(-50%, -50%) rotate(${this.angle}deg)`;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      // atan2 returns 0=right; +90 converts so 0=up (rocket nose default direction)
      this.angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    }

    this.x = e.clientX;
    this.y = e.clientY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (!this.visible) {
      this.visible = true;
    }

    if (this.resetTimer) clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => {
      this.angle = 0;
      this.cdr.markForCheck();
    }, 250);

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
