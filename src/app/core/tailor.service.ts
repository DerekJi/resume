import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TailorService {
  private readonly endpoint = `${environment.vedaApiUrl}/api/public/resume/tailor`;

  constructor(private ngZone: NgZone) {}

  /**
   * Sends a Job Description to VedaAide and streams back a tailored Markdown resume.
   * Each emission is the full accumulated Markdown text so far (suitable for live rendering).
   */
  tailor(jobDescription: string): Observable<string> {
    return new Observable(observer => {
      const controller = new AbortController();

      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
        signal: controller.signal
      })
        .then(async res => {
          if (!res.ok) {
            const body = await res.text().catch(() => res.statusText);
            this.ngZone.run(() => observer.error(new Error(`HTTP ${res.status}: ${body}`)));
            return;
          }

          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          let accumulated = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              this.ngZone.run(() => observer.complete());
              break;
            }
            accumulated += decoder.decode(value, { stream: true });
            const snapshot = accumulated;
            this.ngZone.run(() => observer.next(snapshot));
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            this.ngZone.run(() => observer.error(err));
          }
        });

      // Teardown: abort fetch when the subscription is unsubscribed
      return () => controller.abort();
    });
  }
}
