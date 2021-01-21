import {AppService} from "../service/app.service";
import {InjectorInstance} from "../app.module";
import {Component} from "@angular/core";
import {User} from "../model/user";

@Component({
  selector: 'base-controller',
  template: ''
})
export class BaseController {

  appService: AppService = InjectorInstance.get<AppService>(AppService);

  loggedInUser: User;

  constructor() {
    this.loggedInUser = this.appService.getCurrentUser();
    this.appService.userObs.subscribe(user => {
      this.loggedInUser = user;
    })
  }

}
