import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.css']
})
export class EmailVerifyComponent implements OnInit {
  msg: string;
  faCheckCircle = faCheckCircle;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService, private title: Title) {
  }

  ngOnInit(): void {
    this.title.setTitle("Account verification || Raku");
    this.route.queryParams.subscribe(params => {
      if (params.key) {
        this.authService.verifyEmailKey(params.key).subscribe(resp => {
          this.msg = resp.data;
        });
      }
    });
  }

}
