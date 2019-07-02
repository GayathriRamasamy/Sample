import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
// import { FragranceSearchComponent } from './fragrancesearch/fragrancesearch.component';
// import { ProjectSearchComponent } from './projectsearch/projectsearch.component';

import { AllSearchComponent } from './allsearch/allsearch.component';
// import { SearchResultsComponent } from './print-search-results/search-results.component';
// import { FragranceSearchResolver } from './fragrancesearch/fragrancesearch.resolve';
// import { ProjectSearchResolver } from './projectsearch/projectsearch.resolve';

// import { AuthGuard } from '../_shared/okta/auth.guard';
// import { ScentportfolioSearchComponent } from './scentportfoliosearch/scentportfoliosearch.component';
// import { ScentPortfolioSearchResolver } from './scentportfoliosearch/scentportfoliosearch.resolve';

export const routes: Routes = [
    {
        path: '', component: SearchComponent, children: [
            // { path: '', redirectTo: 'fragrances', pathMatch: 'full', canActivateChild: [AuthGuard] },
            // {
            //     path: 'fragrances', component: FragranceSearchComponent, resolve: { FragranceSearchResult: FragranceSearchResolver }
            // },
            // {
            //     path: 'projects', component: ProjectSearchComponent, resolve: { ProjectSearchResult: ProjectSearchResolver }
            // },
            // {
            //     path: 'scentportfolios', component: ScentportfolioSearchComponent, resolve: { ScentPortfolioSearchResult: ScentPortfolioSearchResolver }
            // },
            {
                path: 'all', component: AllSearchComponent, 
            },
            // {
            //     path: 'printsearchresults', component: SearchResultsComponent,
            // }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }