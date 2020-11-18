import {Component, Inject, OnInit} from '@angular/core';
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OAuthRespToken} from "../../../model/OAuthRespToken";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AuthenticationService} from "../../../service/authentication.service";
import {CookieService} from "ngx-cookie-service";
import {AppSettings} from "../../../global/app-settings";
import * as moment from 'moment';

@Component({
  selector: 'app-sign-in-up-form',
  templateUrl: './sign-in-up-form.component.html',
  styleUrls: ['./sign-in-up-form.component.css']
})
export class SignInUpFormComponent implements OnInit {

  faTimes = faTimes;
  faFacebook = faFacebook;
  faGoogle = faGoogle;
  loginForm: FormGroup;

  oAuthToken: OAuthRespToken;

  hasError: boolean;
  authenError: boolean;

  isLogin: boolean;

  labels: any;
  registerForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<SignInUpFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private authService: AuthenticationService,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
    if (this.data.type == 'signup') {
      this.showRegister();
    } else {
      this.showLogin();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  login() {
    this.authenError = false;
    if (!this.loginForm.invalid) {
      this.hasError = false;
      this.authService.login(this.loginForm.controls.loginUsername.value, this.loginForm.controls.loginPassword.value).subscribe(resp => {
        if (resp.success) {
          this.oAuthToken = resp.data as OAuthRespToken;
          if (this.oAuthToken != null) {
            this.cookieService.set(AppSettings.COOKIE_TOKEN_NAME, this.oAuthToken.token,
              moment(new Date()).add(this.oAuthToken.expireTime, 'ms').toDate());
            this.dialogRef.close("login_success");
          }
        }
      }, error => {
        this.authenError = true;
      });
    } else {
      this.hasError = true;
    }
  }

  showRegister() {
    this.isLogin = false;
    this.hasError = false;
    this.registerForm = new FormGroup({
      regName: new FormControl('', Validators.required),
      regUsername: new FormControl('', Validators.required),
      regPassword: new FormControl('', Validators.required),
      regRepeatPassword: new FormControl('', Validators.required),
      regEmail: new FormControl('', Validators.required),
    });
    this.labels = {
      dialogTitle: "Sign Up",
      hasAccountBtnLbl: "Sign in now!",
      hasAccountTitle: "Have an account yet?",
    };
  }

  showLogin() {
    this.hasError = false;
    this.authenError = false;
    this.isLogin = true;
    this.loginForm = new FormGroup({
      loginUsername: new FormControl('', Validators.required),
      loginPassword: new FormControl('', Validators.required)
    });
    this.labels = {
      dialogTitle: "Sign In",
      hasAccountBtnLbl: "Sign up now!",
      hasAccountTitle: "Haven't an account yet?",
    };
  }

  register() {
    if (!this.registerForm.invalid) {
      this.hasError = false;
      const signUpReq = {
        name: this.registerForm.controls.regName.value,
        username: this.registerForm.controls.regUsername.value,
        password: this.registerForm.controls.regPassword.value,
        email: this.registerForm.controls.regEmail.value,
      };
      this.authService.register(signUpReq).subscribe(resp => {
        if (resp.success) {
          this.dialogRef.close(signUpReq);
        }
      }, error => {
      });
    } else {
      this.hasError = true;
    }
  }

  oauthGoogle() {
    location.href = AppSettings.GOOGLE_AUTH_URL;
  }

  oauthFacebook() {
    location.href = AppSettings.FACEBOOK_AUTH_URL;
  }
}
