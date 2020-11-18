import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadAudioComponent} from "./component/upload-audio/upload-audio.component";
import {Oauth2RedirectComponent} from "./component/oauth2-redirect/oauth2-redirect.component";
import {AuthGuard} from "./interceptor/auth.guard";


const routes: Routes = [
  {path: 'oauth2/redirect', component: Oauth2RedirectComponent},
  {path: "upload", component: UploadAudioComponent, canActivate: [AuthGuard], data: {roles: ["member"]}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
