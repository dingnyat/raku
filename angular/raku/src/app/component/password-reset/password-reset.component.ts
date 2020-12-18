import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {Title} from "@angular/platform-browser";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  reset = false;
  sendMailMsg: any;

  token: string;
  password: string;
  confirmPassword: string;

  unmatchPassword = false;
  msg: any;
  faCheckCircle = faCheckCircle;
  email: string;
  faExclamationCircle = faExclamationCircle;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService, private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle("Reset your password || Raku");
    this.route.queryParams.subscribe(params => {
      this.reset = params['reset'];
      if (params['token']) {
        this.token = params['token'];
      }
    });
  }

  resetPassword() {
    if (!this.unmatchPassword) { // todo validate password đi
      this.authService.resetPassword({token: this.token, newPassword: this.password}).subscribe(resp => {
        this.msg = resp;
      })
    }
  }

  onConfirmPasswordChange() {
    this.unmatchPassword = this.password != this.confirmPassword;
  }

  sendResetPasswordLink() { // todo validate email
    this.authService.sendResetPasswordEmail(this.email).subscribe(resp => {
      this.sendMailMsg = resp;
    })
  }
}
