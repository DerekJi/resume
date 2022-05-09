import { Component, Input, OnInit } from '@angular/core';
import { Education } from '@core/models/education';

@Component({
  selector: 'cv-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  @Input() educations: Array<Education>;

  constructor() { }

  ngOnInit(): void {
  }

}
