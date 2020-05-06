import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  public currentSection = 'hero';

  constructor() { }

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section): void {
    document.querySelector('#' + section).scrollIntoView();
  }
}
