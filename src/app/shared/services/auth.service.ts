import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "./api.service";
import {GlobalDataService} from "./global-data.service";
import {NotificationService} from "./notification.service";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackMessage: NotificationService,
    private globalDataService: GlobalDataService
  ) {}

  async login(formData: any) {
    const body = new HttpParams()
    .set('username', formData.username)
    .set('password', formData.password);
    const httpData = { url: 'login', body: body, headers: {'Content-Type': 'application/x-www-form-urlencoded'} };
    const { success, data, error } = await this.apiService.post(httpData);
    if (success) {
      this.globalDataService.currentUser$.next(data);
      this.router.navigate(['']);
    } else {
      this.snackMessage.show({
        message: error?.message || 'Failed to login',
      });
    }
  }

  getCurrentUser() {
    const httpData = { url: 'rest/user/current'};
    return this.apiService.get(httpData);
  }
  logOut() {
    const httpData = { url: 'logout'};
    this.apiService.get(httpData);
    this.globalDataService.currentUser$.next(null);
    this.router.navigate(['/login']);
  }
}
