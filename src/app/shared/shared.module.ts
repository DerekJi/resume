import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticlesBgComponent } from './particles/particles.component';
import { RevealDirective } from './reveal.directive';

@NgModule({
  declarations: [ParticlesBgComponent, RevealDirective],
  exports: [ParticlesBgComponent, RevealDirective],
  imports: [CommonModule]
})
export class SharedModule { }
