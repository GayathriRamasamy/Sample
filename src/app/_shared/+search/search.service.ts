import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Observable } from "rxjs";
import { AppDataService } from "src/app/_services";


@Injectable()
export class SearchService {
    public constructor(private http: HttpClient, private appData: AppDataService) { }

    public fetchSearchFilter(listId: string): Observable<any> {
        // return this.appData.getData(this.appData.url.getUserPreferencesSearchById, [listId]);
        return this.http.get(this.appData.url.serviceUrl + 'userpreferences/search/filters/' + listId);
    }
}
