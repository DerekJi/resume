import { Component, Input, OnInit } from '@angular/core';
import { Experience } from '@core/models/Experience';

@Component({
  selector: 'cv-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {

  @Input() experiences: Array<Experience>;

  constructor() { }

  ngOnInit(): void {
  }

}
