import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {shareReplay} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  public async get(httpData: any):Promise<any> {
    try {
      const httpOptions = this.generateHttpOptions(
        httpData.params,
        httpData.headers
      );
      const result: any = await this.http
      .get(`${this.apiUrl}/${httpData.url}`, httpOptions)
      .pipe(shareReplay())
      .toPromise();
      return { success: true, data: result, error: null };
    } catch (error:any) {
      return { success: false, data: null, error };
    }
  }

  public async post(httpData: any) {
    try {
      const httpOptions = this.generateHttpOptions(
        httpData.params,
        httpData.headers
      );
      const result: any = await this.http
      .post(`${this.apiUrl}/${httpData.url}`, httpData.body, httpOptions)
      .pipe(shareReplay())
      .toPromise();
      return { success: true, data: result, error: null };
    } catch (error:any) {
      return { success: false, data: null, error };
    }
  }

  public async put(httpData: any) {
    try {
      const httpOptions = this.generateHttpOptions(
        httpData.params,
        httpData.headers
      );
      const result: any = await this.http
      .put(`${this.apiUrl}/${httpData.url}`, httpData.body, httpOptions)
      .pipe(shareReplay())
      .toPromise();
      return { success: true, data: result, error: null };
    } catch (error:any) {
      return { success: false, data: null, error };
    }
  }

  public async delete(httpData: any) {
    try {
      const result: any = await this.http
      .delete(`${this.apiUrl}/${httpData.url}`, httpData.body)
      .pipe(shareReplay())
      .toPromise();
      return { success: true, data: result, error: null };
    } catch (error:any) {
      return { success: false, data: null, error };
    }
  }

  private generateHttpOptions(params: any, headers: any) {
    const httpOptions: any = {};
    if (params) {
      let httpParams = new HttpParams();
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const paramValue = params[key];
          httpParams = httpParams.append(key, paramValue);
        }
      }
      httpOptions.params = httpParams;
    }
    if (headers) {
      let httpHeaders = new HttpHeaders();
      for (const key in headers) {
        if (Object.prototype.hasOwnProperty.call(headers, key)) {
          const headerValue = headers[key];
          httpHeaders = httpHeaders.append(key, headerValue);
        }
      }
      httpOptions.headers = httpHeaders;
    }
    return httpOptions;
  }
}
