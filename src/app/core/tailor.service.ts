import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TailorService {
  private readonly endpoint = `${environment.vedaApiUrl}/api/public/resume/tailor`;

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
            observer.error(new Error(`HTTP ${res.status}: ${body}`));
            return;
          }

          const reader = res.body!.getReader();
          const decoder = new TextDecoder();
          let accumulated = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              observer.complete();
              break;
            }
            accumulated += decoder.decode(value, { stream: true });
            observer.next(accumulated);
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            observer.error(err);
          }
        });

      // Teardown: abort fetch when the subscription is unsubscribed
      return () => controller.abort();
    });
  }
}
