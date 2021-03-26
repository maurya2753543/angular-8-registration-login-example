import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseService } from '../../app/shared/services/base.service';
import { HttpHeaders } from '@angular/common/http';
import { localStorageVariables, appApiPaths, authUserName, authPassword } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public authDetails;

  constructor(public baseService: BaseService) { }

  getQuestionBank(subLobId): Observable<any> {
    let options = this.getBearerToken();
    return this.baseService.get(appApiPaths.getQuestionBank + subLobId, options)
            .map((res: any) => {
              if(res.status == 200){
                return res.body;
              } else if(res.status == 204){
                return null;
              }
              else{
                return 'ERROR';
              }
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            });
  }

  uploadBulk(url, postBody: any): Observable<any> {
    let options = this.getBearerToken();
    return this.baseService.postWithAttachment(appApiPaths[url], postBody, options)
            .map((res) => {
              return res;
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            });
  }

  getAllLob(): Observable<any> {
    let options = this.getBearerToken();
    return this.baseService.get(appApiPaths.getAllLob , options)
            .map((res: any) => {
              if(res.status == 200){
                return res.body;
              } else if(res.status == 204){
                return null;
              }
              else{
                return 'ERROR';
              }
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            }); 
  }

  getSubLob(lobName): Observable<any> {
    let options = this.getBearerToken();
    return this.baseService.get(appApiPaths.getSubLob + lobName , options)
            .map((res: any) => {
              if(res.status == 200){
                return res.body;
              } else if(res.status == 204){
                return null;
              }
              else{
                return 'ERROR';
              }
            })
            .catch((error: Response) => Observable.throw(error))
            .finally(() => {
            }); 
  }

  getBearerToken() {
    this.authDetails = JSON.parse(localStorage.getItem(localStorageVariables.AuthInfo));
    let bearerServiceOption = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.authDetails.access_token,
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '-1'
    }),
    observe: 'response'
  }
  return bearerServiceOption;
  }

  getBasicToken(){
    let basicOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(authUserName +':'+ authPassword),
      'Cache-Control':  'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '-1'
    }),
    observe: 'response'
  };
  return basicOptions;
  }


}
