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

  spy(event, scrollSpyConatiner: string): void {
    let currentSection: string;
    const children = document.querySelector(scrollSpyConatiner).children;
    const scrollTop = event.target.scrollingElement.scrollTop;
    const parentOffset = 60;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < children.length; i++) {
      const element = children[i].children[0] as HTMLElement;
      if ((element.offsetTop - parentOffset) <= scrollTop) {
          currentSection = element.id;
      }
    }
    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
    }
}
}
