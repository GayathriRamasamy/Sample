import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PeoplePickerComponent } from './people-picker.component';
// import { ProfilePictureComponent } from '../../components/profile-pic.component';
import { TagInputModule } from 'ngx-chips';
// import { SharedModule } from '../../../app.shared.module';
import { CommonModule } from '@angular/common';
import { ProfilePictureModule } from '../profile-image/profile-pic.module';
@NgModule({
    declarations: [PeoplePickerComponent],
    imports: [TagInputModule, FormsModule, ProfilePictureModule, CommonModule],  // , ],
    exports: [PeoplePickerComponent] // , ProfilePictureModule]
})
export class PeoplePickerModule {

}
