import { Component } from '@angular/core';
import { ScrollService } from '@core/scroll-spy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private spyService: ScrollService
  ) {
  }

  onSectionChange(sectionId: string) {
    this.spyService.onSectionChange(sectionId);
  }
}
