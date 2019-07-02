import { NgModule } from "@angular/core";
import { MdlIconModule, MdlButtonModule } from "@angular-mdl/core";
import { FormsModule } from "@angular/forms";
import { CommonModule, UpperCasePipe } from "@angular/common";
import { IffMdlTextFieldComponent } from "./iff.mdl.text.component";
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [MdlIconModule, MdlButtonModule, FormsModule, CommonModule, NgbPopoverModule],
    exports: [IffMdlTextFieldComponent],
    declarations: [IffMdlTextFieldComponent],
    providers: [ UpperCasePipe ]
})
export class IffMdlTextFieldModule {
    public static forRoot() {
        return {
            ngModule: IffMdlTextFieldModule,
            providers: []
        };
    }
}
