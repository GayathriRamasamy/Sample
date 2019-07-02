import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RichTextComponent } from './rich-text.component';
import { QuillModule } from 'ngx-quill';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtml } from './safe.html';

@NgModule({
  imports: [FormsModule, CommonModule, QuillModule, NgbPopoverModule],
  declarations: [RichTextComponent, SafeHtml],
  exports: [RichTextComponent]
})
export class RichTextModule { }
