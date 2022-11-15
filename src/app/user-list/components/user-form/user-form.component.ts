import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {FormValidationService} from "../../../shared/services/form-validation.service";
import {GlobalDataService} from "../../../shared/services/global-data.service";
import {User} from "../../../shared/model/user.model";

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() userData!: User;
  readonly userRoles = [
    { val: 'ADMIN' },
    { val: 'USER' }
  ];
  currentUser: any | null = this.globalData.currentUser$.getValue();

  showPassword: boolean = false;

  userForm!: FormGroup;
  constructor(
    private formValidationService: FormValidationService,
    private globalData: GlobalDataService
  ) {

  }

  ngOnInit(): void {
    this.userForm = this.inituserForm;
  }

  get getFormData() {
    return { ...this.userForm.value, role: this.userForm.value?.role, photo: this.userForm.value?.photo };
  }

  private get inituserForm() {
    const passwordValidator = [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern(
        '(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
      ),
    ];
    const passwordConfirmValidator = [
      ...passwordValidator,
      this.passwordMatchValidator(),
    ];

    return new FormGroup(
      {
        name: new FormControl(this.userData?.name || '', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(60),
        ]),
        username: new FormControl(this.userData?.name || '', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(60),
        ]),
        email: new FormControl(
          {
            value: this.userData?.email || '',

            disabled: this.userData ? true : false,
          },
          [
            Validators.required,
            Validators.email,
            Validators.minLength(5),
            Validators.maxLength(30),
          ]
        ),
        role: new FormControl(this.userData?.role || '', []),
        gender: new FormControl(this.userData?.gender || '', []),
        photo: new FormControl(''),
        photoFile: new FormControl(''),
        password: new FormControl('', this.userData ? [] : passwordValidator),
        passwordConfirm: new FormControl(
          '',
          this.userData ? [] : passwordConfirmValidator
        ),
      }
    );
  }

  fieldHasError(fieldName: string): boolean {
    return this.formValidationService.fieldHasError(fieldName, this.userForm);
  }

  getErrorMessage(fieldName: string): string {
    return this.formValidationService.getErrorMessage(fieldName, this.userForm);
  }


  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordVal = this.userForm?.get('password')?.value;
      const forbidden = control.value !== passwordVal;
      return forbidden ? { mismatch: true } : null;
    };
  }

  handleFileInputChange(files: FileList | null) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userForm.patchValue({
        photo: e.target.result,
      });
      console.log(e.target.result);
    };
    reader.readAsDataURL(files![0]);
  }
}
