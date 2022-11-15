import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {GlobalDataService} from "../../../shared/services/global-data.service";
import {User} from "../../../shared/model/user.model";

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  private readonly userRoles = environment?.userRoles;
  @Input() userList!: User[];
  @Output() update = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();
  isAdminUser = false;

  constructor(private globalData: GlobalDataService) {}

  ngOnInit(): void {
    this.globalData.currentUser$.subscribe(data=>{
      this.isAdmin();
    })
  }
  visualizeUserRole(roleIndex: number | undefined): string {
    return this.userRoles[roleIndex ? roleIndex : 0];
  }

  isOwner(user: User): boolean {
    return this.globalData.currentUser$.getValue()?.id === user?.id;
  }

  trackByFn(index: number, user: User): number {
    return user?.id;
  }
  isAdmin(){
    this.isAdminUser = this.globalData.currentUser$.getValue()?.role == 'ADMIN';
    return this.isAdminUser;
  }

}
