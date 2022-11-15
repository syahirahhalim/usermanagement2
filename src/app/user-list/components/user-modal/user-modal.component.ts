import {Component, Inject, OnInit} from '@angular/core';
import {UserListService} from "../../../shared/services/user-list.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../../shared/model/user.model";

@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  constructor(
    private userListService: UserListService,
    private dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  async save(formData: User) {
    const { success, user } = this.data
      ? await this.userListService.updateUser({
        ...this.data,
        fullName: formData?.name,
        photo: formData?.photo,
        gender: formData?.gender
      })
      : await this.userListService.addNewUser(formData);
    if (success) {
      this.dialogRef.close({ success: true, userData: formData });
    }
  }
  ngOnInit(): void {}

}
