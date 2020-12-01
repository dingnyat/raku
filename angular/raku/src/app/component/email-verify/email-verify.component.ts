import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.css']
})
export class EmailVerifyComponent implements OnInit {
  msg: string;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.key) {
        this.authService.verifyEmailKey(params.key).subscribe(resp => {
          this.msg = resp.data;
        });
      }
    });
  }

}
