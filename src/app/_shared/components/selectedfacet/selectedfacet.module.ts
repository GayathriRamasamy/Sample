import { NgModule } from '@angular/core';
import { SelectedFacetComponent } from './selectedfacet.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';

@NgModule({
    declarations: [SelectedFacetComponent],
    imports: [CommonModule, FormsModule, TagInputModule],
    exports: [SelectedFacetComponent]
})
export class SelectedFacetModule { }
