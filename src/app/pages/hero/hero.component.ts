import { Component, Input, OnInit } from '@angular/core';
import { Certificate } from '@core/models/certificate';
import { HumanName } from '@core/models/humanName';
import { Resume } from '@core/models/resume';

@Component({
  selector: 'cv-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input() cv: Resume;

  public get name(): HumanName {
    return this.cv.name;
  }

  public get certs(): Array<Certificate> {
    return this.cv.certificates;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
