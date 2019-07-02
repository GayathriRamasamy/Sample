import { NgModule } from '@angular/core';
import { SearchTextComponent } from './search-text.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TiltlabelModule } from '../../../home/tiltlabel/tiltlabel.module';
// import { ProjectCategoryModule } from '../project-category.module';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
        // ProjectCategoryModule
        TiltlabelModule
    ],
    declarations: [SearchTextComponent],
    exports: [SearchTextComponent],
})
export class SearchTextModule {
    public static forRoot() {
        return {
            ngModule: SearchTextModule,
            providers: [],
        };
    }
}
