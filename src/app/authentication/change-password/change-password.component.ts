import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isLoading: boolean;

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.confirmationValidator]]
    });
  }

  submitForm() {
    for (const i of Object.keys(this.changePasswordForm.controls)) {
      this.changePasswordForm.controls[i].markAsDirty();
      this.changePasswordForm.controls[i].updateValueAndValidity();
    }

    if (this.changePasswordForm.invalid) {
      return;
    }

    const password = this.passwordControl().value as string;
    this.isLoading = true;

    this.authService.changePassword(password)
      .subscribe(value => {
        this.isLoading = false;
        this.authService.logout();
      }, error => {
        this.isLoading = false;
      });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.changePasswordForm.controls.confirmPassword.updateValueAndValidity());
  }


  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.changePasswordForm.controls.newPassword.value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  passwordControl(): AbstractControl {
    return this.changePasswordForm.get('newPassword');
  }
}
