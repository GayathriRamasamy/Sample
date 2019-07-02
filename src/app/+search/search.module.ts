import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import {NgxPaginationModule} from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { NouisliderModule } from 'ng2-nouislider';
import { SearchComponent } from './search.component';
import { routes, SearchRoutingModule } from './search.routes';
import { AllSearchModule } from './allsearch/allsearch.module';

// import { PipeModule } from '../shared/pipes/app.pipes.module';
// import { SharedModule } from '../app.shared.module';
// import { HeaderComponent } from './header/header.component';
// import { FragranceSearchModule } from './fragrancesearch';
// import { ProjectSearchModule } from './projectsearch/projectsearch.module';
// import { SearchResultsModule } from './print-search-results/search-results.module';

@NgModule({
    declarations: [
        SearchComponent,
        // HeaderComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SearchRoutingModule,
        // PipeModule.forRoot(),
        // SharedModule,
        // FragranceSearchModule,
        // ProjectSearchModule,
       
        AllSearchModule,
        // SearchResultsModule
    ],
    providers: []
})
export class SearchModule {

}
