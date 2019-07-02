// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement, NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
// import { async } from '@angular/core/testing';
// import { AppData } from '../../../app.data';
// import { Observable } from 'rxjs/Observable';
// import { AppBroadcastService } from '../../../app.broadcast.service';
// import { MockAppBroadcastService } from '../../../testing/MockAppBroardcastService';
// import { NgbDatepicker, NgbDatepickerModule, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { format } from 'path';
// import { PumaDatePickerComponent, PumaDatePickerService } from '.';

// describe('puma date picker Component', () => {
//     let comp: PumaDatePickerComponent;
//     let fixture: ComponentFixture<PumaDatePickerComponent>;
//     let de: DebugElement;
//     beforeAll(() => {
//     });
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 PumaDatePickerComponent
//             ],
//             imports: [
//                 ReactiveFormsModule,
//                 FormsModule,
//                 NgbDatepickerModule,
//             ],
//             providers: [
//                 { provide: AppBroadcastService, useClass: MockAppBroadcastService },
//                 ChangeDetectorRef,
//                 { provide: PumaDatePickerService, useValue: true }
//             ],
//             schemas: [NO_ERRORS_SCHEMA]
//         }).compileComponents();

//         fixture = TestBed.createComponent(PumaDatePickerComponent);
//         de = fixture.debugElement;
//         comp = fixture.componentInstance;
//     }));
//     beforeEach(() => {
//     });
//     it('should create puma date picker component', () => {
//         // expect(comp).toBeTruthy();
//     });
// });
