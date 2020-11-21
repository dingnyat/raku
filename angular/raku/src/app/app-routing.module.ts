import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadAudioComponent} from "./component/upload-audio/upload-audio.component";
import {Oauth2RedirectComponent} from "./component/oauth2-redirect/oauth2-redirect.component";
import {AuthGuard} from "./interceptor/auth.guard";
import {TrackDetailsComponent} from "./component/track-details/track-details.component";
import {YourTracksComponent} from "./component/your-tracks/your-tracks.component";

const routes: Routes = [
  {path: 'oauth2/redirect', component: Oauth2RedirectComponent},
  // phải đặt non-parameterised trước
  {path: ":username/tracks", component: YourTracksComponent, canActivate: [AuthGuard], data: {roles: ["member"]}},
  {path: ":username/:code", component: TrackDetailsComponent},
  {path: "upload", component: UploadAudioComponent, canActivate: [AuthGuard], data: {roles: ["member"]}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
