import { Injectable } from '@angular/core';
import { RequestOptions, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Error } from '../interfaces/error.interface';
import { ServerResponse } from '../interfaces/server-response.interface';
import { appVariables } from './../../app.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(public http: HttpClient) {
  }
  get(url, option?:any) {
    // Helper service to start ng2-slim-loading-bar progress 
    if(option){
      return this.http.get(url, option).map((res) => {
        //return this.handleResponse(res);
        return res;
      }).catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
    }else{
      return this.http.get(url).map((res: Response) => {
        //return this.handleResponse(res);
        return res;
      }).catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
    }
  }

  options(url) {
    // Helper service to start ng2-slim-loading-bar progress bar
    return this.http.options(url).map((res: Response) => {
      return this.handleResponse(res);
    }).catch((error: Response) => Observable.throw(error))
      .finally(() => {
        // stop ng2-slim-loading-bar progress bar
      });
  }

  post(url, postBody: any, options?:any) {
    if (options) {
      //add options in post parameters
      return this.http.post(url, postBody, options)
        .map((res) => {
          //return this.handleResponse(res);
          return res;
        })
        .catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
    } else {
      return this.http.post(url, postBody)
        .map((res) => {
          return this.handleResponse(res);
        })
        .catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
    }
  }
  
  postWithAttachment(url, postBody: any, options?:any) {
    const formData = new FormData();
    Object.keys(postBody).forEach(key => {
      formData.append(key, postBody[key]);
    });
          return this.http.post(url, formData, options)
        .map((res) => {
          //return this.handleResponse(res);
          return res;
        })
        .catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
  }

  
  patch(url, postBody: any, options?: RequestOptions) {
    return this.http.patch(url, postBody)
      .map((res: Response) => {
        return this.handleResponse(res);
      })
      .catch((error: Response) => Observable.throw(error))
      .finally(() => {
      });
  }

  delete(url) {
    return this.http.delete(url).map((res: Response) => {
      return this.handleResponse(res);
    }).catch((error: Response) => Observable.throw(error))
      .finally(() => {
      });
  }

  deleteWithBody(url, postBody: any, options?: RequestOptions){
    
      return this.http.post(url, postBody)
        .map((res: Response) => {
          return this.handleResponse(res);
        })
        .catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
    
  }

  put(url, putData, options?:any) {
    if(options){
      return this.http.put(url, putData, options).map((res) => {
        //return this.handleResponse(res);
        return res;
      }).catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
    }else{
      return this.http.put(url, putData).map((res: Response) => {
        return this.handleResponse(res);
      }).catch((error: Response) => Observable.throw(error))
        .finally(() => {
        });
    }
    
  }


  upload(url: string, file: File) {
    const formData: FormData = new FormData();
    if (file) {
      formData.append('files', file, file.name);
    }
    return this.post(url, formData);
  }


  formUrlParam(url, data) {
    let queryString: string = '';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (!queryString) {
          queryString = `?${key}=${data[key]}`;
        } else {
          queryString += `&${key}=${data[key]}`;
        }
      }
    }
    return url + queryString;
  }


  handleResponse(res) {
    // My API sends a new jwt access token with each request,
    // so store it in the local storage, replacing the old one.
    //this.refreshToken(res);
    const data = res;
    if (data.error) {
      const error: Error = { error: data.error, message: data.message };
    } else {
      return data;
    }
  }


  refreshToken(res: Response) {
    const token = res.headers.get(appVariables.accessTokenServer);
    if (token) {
      localStorage.setItem(appVariables.accessTokenLocalStorage, `${token}`);
    }
  }
}