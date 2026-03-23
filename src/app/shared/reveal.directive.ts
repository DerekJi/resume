import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[cvReveal]' })
export class RevealDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.el.nativeElement.classList.add('cv-reveal');
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.el.nativeElement.classList.add('cv-revealed');
          this.observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
