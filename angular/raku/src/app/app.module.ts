import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TopMenuComponent} from './component/top-menu/top-menu.component';
import {MediaPlayerComponent} from './component/media-player/media-player.component';
import {ContentBodyComponent} from './component/content-body/content-body.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {PlyrModule} from "ngx-plyr";
import {AuthenticationService} from "./service/authentication.service";
import {JwtInterceptor} from "./interceptor/jwt.intercepter";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./interceptor/error.interceptor";
import {CookieService} from "ngx-cookie-service";
import {ProfileComponent} from './component/profile/profile.component';
import {UploadAudioComponent} from './component/upload-audio/upload-audio.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {UploadFormComponent} from './component/upload-audio/upload-form/upload-form.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatSelectModule} from "@angular/material/select";
import { SignInUpFormComponent } from './component/top-menu/sign-in-up-form/sign-in-up-form.component';
import {MatDialogModule} from "@angular/material/dialog";
import { Oauth2RedirectComponent } from './component/oauth2-redirect/oauth2-redirect.component';

export let InjectorInstance: Injector;

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    MediaPlayerComponent,
    ContentBodyComponent,
    ProfileComponent,
    UploadAudioComponent,
    UploadFormComponent,
    SignInUpFormComponent,
    Oauth2RedirectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    PlyrModule,
    MatTabsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    TagInputModule,
    MatDialogModule,
  ],
  providers: [
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    InjectorInstance = this.injector;
  }
}
