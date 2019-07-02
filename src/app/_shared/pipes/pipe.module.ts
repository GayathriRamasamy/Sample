import { NgModule } from '@angular/core';
import { MatchSorterPipe } from './matchSorter.pipe';

@NgModule({
    declarations: [
        MatchSorterPipe
    ],
    exports: [
       MatchSorterPipe
    ]
})
export class PipeModule {
}
