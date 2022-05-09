import { Component, Input, OnInit } from '@angular/core';
import { ContactMethod } from '@core/models/contact-method';

@Component({
  selector: 'cv-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @Input() contactMethods: Array<ContactMethod>;

  constructor() { }

  ngOnInit(): void {
  }

}
