import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../shared/services/notification.service";
import {UserModalComponent} from "./components/user-modal/user-modal.component";
import {UserListService} from "../shared/services/user-list.service";
import {User} from "../shared/model/user.model";
import {GlobalDataService} from "../shared/services/global-data.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userList!: any[];
  constructor(
    private userListService: UserListService,
    private dialog: MatDialog,
    private messageService: NotificationService,
    private globalData: GlobalDataService,
  ) {}

  isAdminUser: boolean = false;

  async ngOnInit() {
    this.userList = await this.userListService.getAllUsers();
    this.globalData.currentUser$.subscribe(data=>{
      this.isAdmin();
    })
  }

  isAdmin(){
    this.isAdminUser = this.globalData.currentUser$.getValue()?.role == 'ADMIN';
    return this.isAdminUser;
  }

  async createNewUser() {
    try {
      const { success, userData } = await this.openUserModal();
      if (success) {
        this.userList.push(userData);
      }
    } catch (error: any) {
      this.messageService.show({
        message: error?.message || 'An error occoured when creating new user',
      });
    }
  }

  async updateUser(user: any) {
    try {
      const { success, userData } = await this.openUserModal(user);
      if (success) {
        const userIndex = this.userList.findIndex(
          (usr) => usr?.id === user?.id
        );
        if (userIndex >= 0) {
          this.userList[userIndex] = userData;
          this.messageService.show({
            message: `User (${userData?.fullName}) has been updated successfully`,
            duration: 4000,
          });
        }
      }
    } catch (error: any) {
      this.messageService.show({
        message: error?.message || 'An error occoured when updating  user',
      });
    }
  }
  async deleteUser(userData: User) {
    const { success } = await this.userListService.deleteUser(userData?.id || 0);
    if (success) {
      const userIndex = this.userList.findIndex(
        (usr) => usr.id === userData?.id
      );
      if (userIndex >= 0) {
        this.userList.splice(userIndex, 1);
        this.messageService.show({
          message: `User (${userData?.name}) has been removed successfully`,
        });
      }
    }
  }

  private async openUserModal(user?: any) {
    const userDialog = this.dialog.open(UserModalComponent, {
      width: '450px',
      maxWidth: '100%',
      data: user,
      disableClose: true,
    });
    return await userDialog.afterClosed().toPromise();
  }

}
