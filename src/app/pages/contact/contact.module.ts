import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { LcdNumberComponent } from './lcd-number/lcd-number.component';



@NgModule({
  declarations: [ContactComponent, LcdNumberComponent],
  exports: [ContactComponent],
  imports: [
    CommonModule
  ]
})
export class ContactModule { }
