import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobTailorComponent } from './job-tailor.component';

@NgModule({
  declarations: [JobTailorComponent],
  exports: [JobTailorComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class JobTailorModule { }
