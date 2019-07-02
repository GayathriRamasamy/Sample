import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { NouisliderModule } from 'ng2-nouislider';
import { IffMdlTextFieldModule } from '../../iff-mdl/iff.mdl.text.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    NouisliderModule,
    IffMdlTextFieldModule,
    FormsModule
  ],
  declarations: [SliderComponent],
  exports: [SliderComponent],

})
export class SliderModule { }
