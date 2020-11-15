import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UploadAudioComponent} from "./component/upload-audio/upload-audio.component";
import {Oauth2RedirectComponent} from "./component/oauth2-redirect/oauth2-redirect.component";


const routes: Routes = [
  {path: 'oauth2/redirect', component: Oauth2RedirectComponent},
  {path: "upload", component: UploadAudioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
