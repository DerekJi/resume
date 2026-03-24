import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticlesBgComponent } from './particles/particles.component';
import { RevealDirective } from './reveal.directive';
import { RocketCursorComponent } from './rocket-cursor/rocket-cursor.component';

@NgModule({
  declarations: [ParticlesBgComponent, RevealDirective, RocketCursorComponent],
  exports: [ParticlesBgComponent, RevealDirective, RocketCursorComponent],
  imports: [CommonModule]
})
export class SharedModule { }
