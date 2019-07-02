import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons/faChevronCircleDown";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons/faStarHalfAlt";
import { faTh } from "@fortawesome/free-solid-svg-icons/faTh";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import { NgModule } from "@angular/core";

library.add(
    faAngleDown,
    faPlus,
    faSearch,
    faChevronCircleDown,
    faBell,
    faTimesCircle,
    faStar,
    faStarHalfAlt,
    faTh,
    faList,
    faTimes
    );

@NgModule({
    imports: [FontAwesomeModule],
    exports: [FontAwesomeModule]
})
export class AppFontAwesomeModule { }
