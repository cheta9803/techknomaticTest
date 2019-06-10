import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = environment.url;
  serviceUrl: {};
  constructor(
    private http: HttpClient
  ) {
    this.serviceUrl = {
      getAllRecords: this.url + 'getAllRecords',
      addEmployeeData: this.url + 'addEmployeeData'
    }
  }

  getServiceCall(params, url): Observable<any> {
    return this.http.get(`${this.serviceUrl[url]}?${params}`).pipe(
      tap((res: any) => {

      }),
      catchError(this.handleError('getService', []))
    )
  }

  postServiceCall(params, url): Observable<any> {
    return this.http.post(`${this.serviceUrl[url]}`, params).pipe(
      tap((res: any) => {

      }),
      catchError(this.handleError('postService', []))
    )
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
