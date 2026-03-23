import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;   // 1 → 0
  decay: number;
  size: number;
}

@Component({
  standalone: false,
  selector: 'cv-particles-bg',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss']
})
export class ParticlesBgComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasEl!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private sparks: Spark[] = [];
  private animId = 0;
  private readonly count = 90;
  private readonly linkDist = 150;
  private readonly color = '0, 200, 255';
  private readonly headColor = '255, 80, 30';

  // Mouse trail state
  private mouseX = -9999;
  private mouseY = -9999;
  private lastSpawnX = -9999;
  private lastSpawnY = -9999;
  private readonly spawnDist = 8;  // min px moved before spawning new sparks

  private readonly resizeBound = () => this.resize();
  private readonly mouseBound = (e: MouseEvent) => this.onMouseMove(e);

  ngAfterViewInit(): void {
    this.ctx = this.canvasEl.nativeElement.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.resizeBound);
    window.addEventListener('mousemove', this.mouseBound);
    this.initParticles();
    this.draw();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.resizeBound);
    window.removeEventListener('mousemove', this.mouseBound);
  }

  private onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    const dx = this.mouseX - this.lastSpawnX;
    const dy = this.mouseY - this.lastSpawnY;
    if (Math.sqrt(dx * dx + dy * dy) < this.spawnDist) return;

    this.lastSpawnX = this.mouseX;
    this.lastSpawnY = this.mouseY;

    // Spawn a burst of sparks fanning out from the cursor
    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.2 + 0.3;
      // Offset spawn point 12-20px away from cursor so the orange head stays visible
      const offset = 12 + Math.random() * 8;
      this.sparks.push({
        x: this.mouseX + Math.cos(angle) * offset,
        y: this.mouseY + Math.sin(angle) * offset,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.028 + Math.random() * 0.022,
        size: Math.random() * 2.5 + 1,
      });
    }
  }

  private resize(): void {
    const c = this.canvasEl.nativeElement;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  private initParticles(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.particles = Array.from({ length: this.count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.5,
    }));
  }

  private draw(): void {
    this.animId = requestAnimationFrame(() => this.draw());
    const c = this.canvasEl.nativeElement;
    const ctx = this.ctx;
    const w = c.width;
    const h = c.height;

    ctx.clearRect(0, 0, w, h);

    // ── Background particles ──────────────────────────────
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, 0.85)`;
      ctx.fill();
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.linkDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${this.color}, ${(1 - dist / this.linkDist) * 0.35})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // ── Meteor / comet trail sparks ───────────────────────
    ctx.save();
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 0.94;
      s.vy *= 0.94;
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      const alpha = s.life;
      const radius = s.size * s.life;

      // Outer glow
      ctx.shadowBlur = 12 * s.life;
      ctx.shadowColor = `rgba(${this.headColor}, ${alpha})`;

      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius * 2.5);
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(0.35, `rgba(${this.headColor}, ${alpha * 0.8})`);
      grad.addColorStop(1, `rgba(${this.headColor}, 0)`);

      ctx.beginPath();
      ctx.arc(s.x, s.y, radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();

    // ── Cursor glow head ─────────────────────────────────
    if (this.mouseX > 0) {
      ctx.save();
      // Outer halo
      const haloGrad = ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, 24
      );
      haloGrad.addColorStop(0,   `rgba(${this.headColor}, 0.22)`);
      haloGrad.addColorStop(0.5, `rgba(${this.headColor}, 0.10)`);
      haloGrad.addColorStop(1,   `rgba(${this.headColor}, 0)`);
      ctx.beginPath();
      ctx.arc(this.mouseX, this.mouseY, 24, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Core glow
      const headGrad = ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, 14
      );
      headGrad.addColorStop(0,    `rgba(255, 200, 160, 1)`);
      headGrad.addColorStop(0.15, `rgba(${this.headColor}, 1)`);
      headGrad.addColorStop(0.55, `rgba(${this.headColor}, 0.6)`);
      headGrad.addColorStop(1,    `rgba(${this.headColor}, 0)`);

      ctx.shadowBlur = 18;
      ctx.shadowColor = `rgba(${this.headColor}, 0.95)`;
      ctx.beginPath();
      ctx.arc(this.mouseX, this.mouseY, 14, 0, Math.PI * 2);
      ctx.fillStyle = headGrad;
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }
}
