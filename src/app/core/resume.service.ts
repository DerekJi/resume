import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Resume } from './models/resume';
import { MyResume } from './resume/my-resume';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor() { }

  public fetch(): Observable<Resume> {
    return of(MyResume);
  }
}
