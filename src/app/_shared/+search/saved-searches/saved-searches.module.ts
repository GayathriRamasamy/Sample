import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavedSearchesComponent } from './saved-searches.component';
import { SelectedFacetModule } from '../../../_shared/components/selectedfacet/selectedfacet.module';
import { FormsModule } from "@angular/forms";
import {IffMdlModule} from '../../iff-mdl/iff.mdl.module';
import {IffMdlTextFieldModule} from '../../iff-mdl/iff.mdl.text.module';

@NgModule({
  imports: [
    CommonModule,
    SelectedFacetModule,
    FormsModule,
    IffMdlModule,
    IffMdlTextFieldModule
  ],
  declarations: [SavedSearchesComponent],
  exports: [
    SavedSearchesComponent
  ],
  entryComponents: [SavedSearchesComponent]
})
export class SavedSearchesModule { }
