import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {
    PumaDatePickerComponent,
    ClosePumaDatePickerDirective,
    SetMinMaxDateDirective,
    StartEndDateModelChangeDirective,
    PumaDatePickerService,
    DueDateDirective
} from './index';
@NgModule({
    imports: [NgbModule.forRoot(), FormsModule, CommonModule],
    declarations: [PumaDatePickerComponent, SetMinMaxDateDirective,
        StartEndDateModelChangeDirective, ClosePumaDatePickerDirective,
        DueDateDirective,
    ],
    providers: [PumaDatePickerService],
    exports: [PumaDatePickerComponent, DueDateDirective,
        SetMinMaxDateDirective, StartEndDateModelChangeDirective,
        ClosePumaDatePickerDirective
    ]
})
export class PumaDatePickerModule {

}
