import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header.component';
import { AppMaterialModule } from 'src/app/app.material.module';
import { NgbDropdownModule , NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FilterModule } from '../filter/filter.module';
import { SelectedFacetModule } from '../../_shared/components/selectedfacet/selectedfacet.module';
import { FacetModule } from '../../_shared/components/facet/facet.module';
import {IffMdlModule} from '../../_shared/iff-mdl/iff.mdl.module';
import {IffMdlTextFieldModule} from '../../_shared/iff-mdl/iff.mdl.text.module';
import { PipeModule } from 'src/app/_shared/pipes/pipe.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    FilterModule,
    NgbDropdownModule,
    NgbModule.forRoot(),
    SelectedFacetModule,
    FacetModule,
    IffMdlModule,
    IffMdlTextFieldModule,
    PipeModule,
    FormsModule
  ],
  declarations: [HeaderComponent],
  exports : [
    HeaderComponent
  ]
})
export class HeaderModule { }
