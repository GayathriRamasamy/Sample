import { NgModule } from '@angular/core';
import { PanelCollapseComponent } from './panelcollapse.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [PanelCollapseComponent],
    imports: [CommonModule],  // , ProfilePictureModule],
    exports: [PanelCollapseComponent], // , ProfilePictureModule]
    entryComponents: [PanelCollapseComponent]
})
export class PanelCollapseModule {

}
