import { Component } from '@angular/core';
import { Resume } from '@core/models/resume';
import { ResumeService } from '@core/resume.service';
import { ScrollService } from '@core/scroll-spy.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public resume$: Observable<Resume>;

  constructor(
    private spyService: ScrollService,
    private resumeService: ResumeService,
  ) {
    this.resume$ = resumeService.fetch();
  }

  onSectionChange(sectionId: string) {
    this.spyService.onSectionChange(sectionId);
  }
}
