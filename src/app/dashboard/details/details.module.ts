
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetailsComponent } from "./details.component";
import { NgbDropdownModule , NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { FilterModule } from "../filter/filter.module";

@NgModule({
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbModule,
    FormsModule,
    FilterModule
  ],
  declarations: [DetailsComponent],
  exports: [DetailsComponent],
  entryComponents: [DetailsComponent]
})
export class DetailsModule { }
