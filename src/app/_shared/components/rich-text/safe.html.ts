import { DomSanitizer } from "@angular/platform-browser";
import { Pipe as NgPipe, PipeTransform } from '@angular/core';

@NgPipe({ name: 'safeHtml' })

export class SafeHtml implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    public transform(html): any {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
