import { Component, Input, OnInit } from '@angular/core';
import { HumanName } from '@core/models/humanName';
import { Resume } from '@core/models/resume';

@Component({
  standalone: false,
  selector: 'cv-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input() cv: Resume;

  public get name(): HumanName {
    return this.cv.name;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
