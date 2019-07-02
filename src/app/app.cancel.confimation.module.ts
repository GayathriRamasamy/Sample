import { NgModule } from '@angular/core';
import { AppCancelConfirmationDialogComponent, AppCancelConfirmationDialogService } from './app.cancel.confirmation.dialog.service';

@NgModule({
    declarations: [AppCancelConfirmationDialogComponent],
    exports: [AppCancelConfirmationDialogComponent],
    entryComponents: [AppCancelConfirmationDialogComponent]
})
export class AppCancelConfimationModule {
    public static forRoot() {
        return {
            ngModule: AppCancelConfimationModule,
            providers: [AppCancelConfirmationDialogService],
        };
    }
}
