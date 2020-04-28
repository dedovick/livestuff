import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanalModel } from '../interfaces/canal-model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerApp {
  
  URL_BASE = 'https://live-stuff-server.herokuapp.com';
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  
  getEvents() {
    return this.http.get(this.URL_BASE + '/events');
  }

  addChannel(canal: CanalModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(this.URL_BASE + '/channels', JSON.stringify(canal), httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  getChannels() {
    return this.http.get(this.URL_BASE + '/channels');
  }


}
