import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadAudioComponent} from "./component/upload-audio/upload-audio.component";
import {Oauth2RedirectComponent} from "./component/oauth2-redirect/oauth2-redirect.component";
import {AuthGuard} from "./interceptor/auth.guard";
import {TrackDetailsComponent} from "./component/track-details/track-details.component";
import {YourTracksComponent} from "./component/your-tracks/your-tracks.component";
import {EmailVerifyComponent} from "./component/email-verify/email-verify.component";
import {ProfileComponent} from "./component/profile/profile.component";
import {PasswordResetComponent} from "./component/password-reset/password-reset.component";

const routes: Routes = [
  {path: 'oauth2/redirect', component: Oauth2RedirectComponent},
  {path: 'auth/email-verify', component: EmailVerifyComponent},
  {path: 'auth/reset-password', component: PasswordResetComponent},
  // phải đặt non-parameterised trước
  {path: "upload", component: UploadAudioComponent, canActivate: [AuthGuard], data: {roles: ["member"]}},
  {path: ":username", component: ProfileComponent},
  {path: ":username/tracks", component: YourTracksComponent, canActivate: [AuthGuard], data: {roles: ["member"]}},
  {path: ":username/:code", component: TrackDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
