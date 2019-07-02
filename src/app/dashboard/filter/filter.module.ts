import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderModule } from '../../_shared/components/slider/slider.module';
import { NouisliderModule } from "ng2-nouislider";
import { AppMaterialModule } from '../../app.material.module' ;
import { MdlModule } from '@angular-mdl/core';
import { MatDatePickerModule } from '../../_shared/components/mat-date-picker/mat-date-picker.module';
import { SpdFilterComponent } from './scentPortfolio-filter/spd-filter.component';
import { ManagementFilterComponent } from './management-filter/management-filter.component';

import { FormsModule } from "@angular/forms";
import { FacetModule } from "../../_shared/components/facet/facet.module";
import { PumaMultiSelectModule } from 'src/app/_shared/components/puma-multiple-select/puma-multiselect.module';
@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    NouisliderModule,
    PumaMultiSelectModule,
    MatDatePickerModule,
    AppMaterialModule,
    FormsModule,
    FacetModule,
    MdlModule, 
   ],
  declarations: [SpdFilterComponent, ManagementFilterComponent],
  exports: [SpdFilterComponent, ManagementFilterComponent],
})
export class FilterModule { }
