import { Component } from '@angular/core';
import { ScrollService } from '@core/scroll-spy.service';
declare var process: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  token = process.env['ACCESS_TOKEN'];

  constructor(
    private spyService: ScrollService
  ) {
  }

  onSectionChange(sectionId: string) {
    this.spyService.onSectionChange(sectionId);
  }
}
