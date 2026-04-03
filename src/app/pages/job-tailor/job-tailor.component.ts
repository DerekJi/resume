import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { marked } from 'marked';
import { TailorService } from '@core/tailor.service';

@Component({
  standalone: false,
  selector: 'cv-job-tailor',
  templateUrl: './job-tailor.component.html',
  styleUrls: ['./job-tailor.component.scss']
})
export class JobTailorComponent implements OnDestroy {
  readonly maxChars = 4000;

  jobDescription = '';
  markdownOutput = '';
  isLoading = false;
  errorMessage = '';
  isDone = false;
  jdCollapsed = false;

  private subscription: Subscription | null = null;
  private collapseTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private tailorService: TailorService,
    private sanitizer: DomSanitizer
  ) {}

  get charCount(): number {
    return this.jobDescription.length;
  }

  get canSubmit(): boolean {
    return this.jobDescription.trim().length > 0
      && this.charCount <= this.maxChars
      && !this.isLoading;
  }

  get sanitizedHtml(): SafeHtml {
    if (!this.markdownOutput) return '';
    const html = marked.parse(this.markdownOutput) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  generate(): void {
    if (!this.canSubmit) return;

    this.markdownOutput = '';
    this.errorMessage = '';
    this.isLoading = true;
    this.isDone = false;
    this.jdCollapsed = false;
    if (this.collapseTimer) { clearTimeout(this.collapseTimer); }

    this.subscription = this.tailorService.tailor(this.jobDescription).subscribe({
      next: (accumulated) => { this.markdownOutput = accumulated; },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.message ?? 'Something went wrong. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
        this.isDone = true;
        this.collapseTimer = setTimeout(() => { this.jdCollapsed = true; }, 300);
      }
    });
  }

  cancel(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.isLoading = false;
  }

  downloadMd(): void {
    if (!this.markdownOutput) return;
    const blob = new Blob([this.markdownOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'derek-ji-tailored-resume.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadPdf(): void {
    if (!this.markdownOutput) return;
    const html = marked.parse(this.markdownOutput) as string;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Derek Ji - Tailored Resume</title>
  <style>
    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.65;
      color: #1a1a1a;
      max-width: 760px;
      margin: 0 auto;
      padding: 1.5cm 2cm;
    }
    h1 { font-size: 22pt; border-bottom: 2px solid #1a1a1a; padding-bottom: 4px; margin-bottom: 4px; }
    h2 { font-size: 13pt; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #888; margin-top: 1.3em; margin-bottom: 0.4em; }
    h3 { font-size: 11pt; margin-bottom: 0.2em; margin-top: 0.9em; }
    ul, ol { margin: 0.3em 0; padding-left: 1.5em; }
    li { margin-bottom: 0.2em; }
    p { margin: 0.3em 0 0.6em; }
    strong { font-weight: bold; }
    hr { border: none; border-top: 1px solid #ccc; margin: 1em 0; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
${html}
</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 400);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.collapseTimer) { clearTimeout(this.collapseTimer); }
  }
}
