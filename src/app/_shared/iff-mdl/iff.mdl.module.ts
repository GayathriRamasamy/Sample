import {
    AfterContentInit,
    Component,
    ChangeDetectorRef,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    ModuleWithProviders,
    NgModule,
    Output,
    QueryList,
    ViewChild,
    ViewEncapsulation,
    HostListener
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdlPopoverModule, MdlPopoverComponent } from '@angular-mdl/popover/index';
import { MdlOptionComponent } from '@angular-mdl/select/option';

import { IffMdlSelectComponent, MDL_SELECT_VALUE_ACCESSOR } from './iff.mdl.select.component';
import { IffMdlTextFieldModule } from './iff.mdl.text.module';

@NgModule({
    imports: [
        CommonModule,
        MdlPopoverModule,
        IffMdlTextFieldModule,
        FormsModule
    ],
    exports: [
        IffMdlSelectComponent, MdlOptionComponent
    ],
    declarations: [
        IffMdlSelectComponent, MdlOptionComponent
    ],
    providers: [
        MDL_SELECT_VALUE_ACCESSOR
    ]
})
export class IffMdlModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: IffMdlModule,
            providers: []
        };
    }
}
