import { NgModule } from '@angular/core';
import { FacetComponent } from './facet.component';
import { CommonModule } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [FacetComponent],
    imports: [CommonModule, MdlModule, FormsModule, NgbCollapseModule],
    exports: [FacetComponent, NgbCollapseModule]
})
export class FacetModule { }
