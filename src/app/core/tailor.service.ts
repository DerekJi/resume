import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TailorService {
  private readonly baseUrl = `${environment.vedaApiUrl}/api/public/resume`;

  constructor(private ngZone: NgZone) {}

  /**
   * Lightweight health probe — resolves true when server is ready, false on any error.
   * Used to detect cold-start before issuing the heavyweight tailor request.
   */
  ping(): Promise<boolean> {
    return fetch(`${this.baseUrl}/ping`, { method: 'GET' })
      .then(res => res.ok)
      .catch(() => false);
  }

  /**
   * Sends a Job Description to VedaAide and streams back a tailored Markdown resume.
   * Each emission is the full accumulated Markdown text so far (suitable for live rendering).
   *
   * Runs the fetch loop outside Angular's zone to avoid triggering change detection on
   * every streaming token; re-enters the zone only for observer emissions.
   */
  tailor(jobDescription: string): Observable<string> {
    return new Observable(observer => {
      const controller = new AbortController();

      this.ngZone.runOutsideAngular(() => {
        fetch(`${this.baseUrl}/tailor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription }),
          signal: controller.signal
        })
          .then(async res => {
            if (!res.ok) {
              const body = await res.text().catch(() => res.statusText);
              this.ngZone.run(() => { if (!observer.closed) observer.error(new Error(`HTTP ${res.status}: ${body}`)); });
              return;
            }

            const reader = res.body!.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                this.ngZone.run(() => { if (!observer.closed) observer.complete(); });
                break;
              }
              accumulated += decoder.decode(value, { stream: true });
              const snapshot = accumulated;
              this.ngZone.run(() => { if (!observer.closed) observer.next(snapshot); });
            }
          })
          .catch(err => {
            if (err.name !== 'AbortError') {
              this.ngZone.run(() => { if (!observer.closed) observer.error(err); });
            }
          });
      });

      // Teardown: abort fetch when the subscription is unsubscribed
      return () => controller.abort();
    });
  }
}
