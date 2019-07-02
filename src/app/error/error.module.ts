import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UsernotfoundComponent } from './usernotfound/usernotfound.component';
import { NoContentComponent } from './no-content.component';

@NgModule({
    declarations: [
        ErrorComponent,
        UnauthorizedComponent,
        UsernotfoundComponent,
        NoContentComponent
    ],
    imports: [
        CommonModule
    ],
    entryComponents: [
        ErrorComponent
    ]
})
export class ErrorModule {

}
