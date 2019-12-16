import { NoticeService } from "./../../shared/services/notice.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { AuthenticationService } from "./../../shared/services/authentication.service";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  loginForm: FormGroup;
  returnUrl: String;
  isLoading: Boolean;
  error: String = "";

  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.invalid) {
      return;
    }
    this.error = "";
    this.isLoading = true;
    this.authService
      .login(
        this.loginForm.get("userName").value,
        this.loginForm.get("password").value
      )
      .pipe(first())
      .subscribe(
        data => {
          this.isLoading = false;
          console.log("data", data);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.isLoading = false;
          this.error = "Unable to login! Please check login details";

          console.log("error", error);
        }
      );
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.returnUrl =
      this.route.snapshot.queryParams["returnUrl"] || "/dashboard/default";
  }
}
