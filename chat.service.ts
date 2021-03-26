import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
@Injectable()
export class ChatService {
  //https://ssonlineassessment.mybluemix.net/api
  private baseURL: string = "https://ssonlineassessment.mybluemix.net/api";
  private token: string = "63db21b6d636493ebd96662f21c3206d";

  constructor(private http: Http, private sharedService: SharedService){}

  public getResponse(query: string){
    let data = {
      query : query,
      lang: 'en',
      sessionId: '1234567'
    }
    let headers = new Headers();
    headers.append('Authorization', `Bearer ${this.token}`);

    return this.http
      .post(`${this.baseURL}`, data, {headers: headers})
      .map(res => {
        return res.json()
      })
  }

  sendmsgtowatson(data:any):Observable<any>{
    return this.http.post(`${this.baseURL}`+'/message',data).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }

  setSession():Observable<any>{
    return this.http.get(`${this.baseURL}`+'/session').map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }
  getQuestions():Observable<any>{
    let body ={token:JSON.parse(localStorage.getItem('AuthInfo')).access_token,
  userid:JSON.parse(localStorage.getItem('AuthInfo')).userDetail.username};
    return this.http.post(`${this.baseURL}`+'/customQuestions',body).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }
  getCategoryList():Observable<any>{
    let body ={token:JSON.parse(localStorage.getItem('AuthInfo')).access_token,
  userid:JSON.parse(localStorage.getItem('AuthInfo')).userDetail.username};
    return this.http.post(`${this.baseURL}`+'/getUserQuesCategoryList',body).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }
  getUserCatWiseReport(categoryname):Observable<any>{
    let body ={token:JSON.parse(localStorage.getItem('AuthInfo')).access_token,
  userid:JSON.parse(localStorage.getItem('AuthInfo')).userDetail.username,categoryname:categoryname};
    return this.http.post(`${this.baseURL}`+'/getUserCatWiseReport',body).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }
  getUserCategoryReport():Observable<any>{
    let body ={token:JSON.parse(localStorage.getItem('AuthInfo')).access_token,
  userid:JSON.parse(localStorage.getItem('AuthInfo')).userDetail.username};
    return this.http.post(`${this.baseURL}`+'/getUserCategoryReport',body).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }
  // getUserCategoryReport
  fetchlob():Observable<any>{
    let body ={token:JSON.parse(localStorage.getItem('AuthInfo')).access_token,
  userid:JSON.parse(localStorage.getItem('AuthInfo')).userDetail.username};
    return this.http.post(`${this.baseURL}`+'/getLob',body).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }
  getUserAssessmentByLob(selectedlobid):Observable<any>{
    let body ={token:JSON.parse(localStorage.getItem('AuthInfo')).access_token,
  userid:JSON.parse(localStorage.getItem('AuthInfo')).userDetail.username,lobid:selectedlobid};
    return this.http.post(`${this.baseURL}`+'/getUserAssessmentByLob',body).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }
  getUserAssessmentHistory(lobid,assessmentid,type):Observable<any>{
    let body ={token:JSON.parse(localStorage.getItem('AuthInfo')).access_token,
  userid:JSON.parse(localStorage.getItem('AuthInfo')).userDetail.username,lobid:lobid,assessmentid:assessmentid,type:type};
    return this.http.post(`${this.baseURL}`+'/getUserAssessmentHistory',body).map(res=>{return res.json()}).pipe(
      catchError(this.handleError)
    );
  }

 
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

}
