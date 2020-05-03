import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EducationComponent } from '../education/education.component';



@NgModule({
  declarations: [EducationComponent],
  exports: [EducationComponent],
  imports: [
    CommonModule
  ]
})
export class EducationModule { }
