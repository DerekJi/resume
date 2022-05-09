import { Component, Input, OnInit } from '@angular/core';
import { Resume } from '@core/models/resume';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() cv: Resume;

  constructor() { }

  ngOnInit(): void {
  }

}
