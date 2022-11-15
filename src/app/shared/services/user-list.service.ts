import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {GlobalDataService} from "./global-data.service";
import {NotificationService} from "./notification.service";
import { v4 as uuidv4 } from 'uuid';
import {User} from "../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(
    private apiService: ApiService,
    private snackMessage: NotificationService,
    private globalDataService: GlobalDataService
  ) {}

  async getAllUsers(): Promise<any[]> {
    const currentUser: any | null =
      this.globalDataService.currentUser$.getValue();

    const httpData: any = {
      url: 'rest/user?role='+currentUser?.role,
    };
    const { success, error, data } = await this.apiService.get(httpData);
    if (success && data?.length > 0) {
      return data;
    } else {
      this.snackMessage.show({
        message: error?.message || 'Failed to fetch users',
      });
      return [];
    }
  }

  async addNewUser(
    formData: any
  ): Promise<{ success: boolean; user: any }> {
    const userUUID = uuidv4();

    const body = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      name: formData.name,
      role: formData.role,
      gender: formData.gender,
      photo: formData.photo
    } as User;
    const httpData: any = {
      url: 'rest/user',
      body: body,
    };
    const { success, data, error } = await this.apiService.post(httpData);
    if (success) {

      this.snackMessage.show({
        message: `User (${formData?.fullName}) has been created`,
      });
      return { success: true, user: data };
    } else {
      this.snackMessage.show({
        message: error?.message || 'Failure during register',
      });
      return { success: false, user: data };
    }
  }

  async updateUser(
    user: any
  ): Promise<{ success: boolean; user: any }> {
    const httpData: any = {
      url: `rest/user/${user.id}`,
      body: user,
    };
    const { success, error, data } = await this.apiService.put(httpData);
    if (success) {
      return { success: true, user: user };
    } else {
      this.snackMessage.show({
        message: error?.message || 'Failure during update',
      });
      return { success: false, user: data };
    }
  }
  async deleteUser(
    userID: number
  ): Promise<{ success: boolean; user: any }> {
    const httpData: any = {
      url: `rest/user/${userID}`,
    };
    const { success, error, data } = await this.apiService.delete(httpData);
    if (success) {
      return { success: true, user: data };
    } else {
      this.snackMessage.show({
        message: error?.message || 'Failure during update',
      });
      return { success: false, user: data };
    }
  }
}
