import { Component, Input, OnInit } from '@angular/core';
import { Certificate } from '@core/models/certificate';

@Component({
  standalone: false,
  selector: 'cv-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {

  @Input() certificates: Array<Certificate>;

  constructor() { }

  ngOnInit(): void { }

}
