import { Component, OnInit } from '@angular/core';
import { ScrollService } from '@core/scroll-spy.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private scroll: ScrollService,
  ) {
  }

  public navActive: string;

  public navItems = [
    { section: 'hero', displayName: 'Home' },
    { section: 'about', displayName: 'About' },
    // { section: 'expertise', displayName: 'Expertise' },
    { section: 'education', displayName: 'Education' },
    { section: 'experience', displayName: 'Experience' },
    { section: 'projects', displayName: 'My Projects' },
    { section: 'contact', displayName: 'Contact' },
  ];

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, true);
  }

  onScroll = (event): void => {
    const scrollTop = event.srcElement.scrollingElement.scrollTop;
    this.navActive = scrollTop > 5 ? 'active' : '';
  }

  scrollTo(section: string) {
    this.scroll.scrollTo(section);
  }

  isCurrentSection(section: string) {
    return this.scroll.currentSection === section;
  }
}
