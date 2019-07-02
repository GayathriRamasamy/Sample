import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PumaMultiSelect } from "./puma-multiselect.component";
import { ClickOutsideDirective, ScrollDirective, StyleDirective } from "./close-multiselect.directive";
import { ListFilterPipe } from "./list-filter-pipe";
import { MdlModule } from "@angular-mdl/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";


@NgModule({
    imports: [CommonModule, FormsModule, MdlModule,
        NgbTooltipModule],
    declarations: [
        PumaMultiSelect,
        ClickOutsideDirective,
        ScrollDirective,
        StyleDirective,
        ListFilterPipe
    ],
    exports: [
        PumaMultiSelect,
        ClickOutsideDirective,
        ScrollDirective,
        StyleDirective,
        ListFilterPipe
    ]
})
export class PumaMultiSelectModule { }
