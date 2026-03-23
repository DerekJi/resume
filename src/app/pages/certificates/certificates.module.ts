import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificatesComponent } from './certificates.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CertificatesComponent],
  exports: [CertificatesComponent],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class CertificatesModule { }
