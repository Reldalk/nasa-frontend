import { Injectable, Testability } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BaseService {
  constructor(private http: HttpClient) {}

  populateMonthArray(start, end){
    return this.http
      .get('https://jons-projects.tech/nasa/api/' + `month?start=${start}&end=${end}`);
  }
}