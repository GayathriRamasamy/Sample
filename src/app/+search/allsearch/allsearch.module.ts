import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllSearchComponent } from './allsearch.component';
// import { FragranceSearchModule } from '../fragrancesearch/fragrancesearch.module';
// import { ScentPortfolioSearchModule } from '../scentportfoliosearch/scentportfoliosearch.module';
// import { FragranceSearchResultsModule } from '../fragrancesearch/fragrance-results/fragrance-results.module';
// import { ProjectSortModule } from '../projectsearch/project-sort/project-sort.module';
// import { ProjectSearchListModule } from '../projectsearch/project-search-list/project-search-list.module';

@NgModule({
    declarations: [
        AllSearchComponent
    ],
    imports: [
        CommonModule,
        // FragranceSearchResultsModule,
        // ProjectSortModule,
        // ProjectSearchListModule,
        // ScentPortfolioSearchModule
    ],
    exports: []
})
export class AllSearchModule {

}
