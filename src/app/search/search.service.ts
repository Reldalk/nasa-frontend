import { Injectable, Testability } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {config} from '../../config';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  populateSearchArray(query, offset){
    return this.http
      .get('https://jons-projects.tech/nasa/api/' + `search?query=${query}&offset=${offset}`)
  }
  getCount(query){
    return this.http
      .get('https://jons-projects.tech/nasa/api/' + `search/count?query=${query}`)
  }
}

export class CountService {
  constructor(private http: HttpClient){}


}
