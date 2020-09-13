import { Component } from '@angular/core';
import { ScrollService } from '@core/scroll-spy.service';
import {getInput} from '@actions/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly token: string = getInput('ACCESS_TOKEN');

  constructor(
    private spyService: ScrollService
  ) {
  }

  onSectionChange(sectionId: string) {
    this.spyService.onSectionChange(sectionId);
  }
}
