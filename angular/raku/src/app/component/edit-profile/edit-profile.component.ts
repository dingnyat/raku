import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {faCamera, faTimes} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  @ViewChild('AvatarImage') AvatarImage: ElementRef;
  @ViewChild('UploadImageInp') UploadImageInp: ElementRef;

  faTimes = faTimes;
  faCamera = faCamera;

  user: User;
  image: File;
  imageBase64: string;

  constructor(private userService: UserService,
              public dialogRef: MatDialogRef<EditProfileComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    this.userService.getMyAllInfo().subscribe(resp => {
      if (resp.success) {
        this.user = resp.data;
      }
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  update() {
    let formData = new FormData();
    formData.append("id", this.user.id);
    formData.append("name", this.user.name);
    formData.append("city", this.user.city);
    formData.append("country", this.user.country);
    formData.append("bio", this.user.bio);

    if (this.image != null) {
      // @ts-ignore
      formData.append("cropData", JSON.stringify($(this.AvatarImage.nativeElement).guillotine("getData")));
      formData.append("image", this.image);
    }
    this.userService.updateUserProfile(formData).subscribe(resp => {
      if (resp.success) {
        this.dialogRef.close(resp);
      }
    });
  }

  openUploadImage() {
    const e: HTMLElement = this.UploadImageInp.nativeElement;
    e.click();
  }

  handleUploadImage(event) {
    if (event.target.files[0]) {
      this.image = event.target.files[0];
    }
    if (this.image) {
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.image);
    }
  }

  _handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.imageBase64 = btoa(binaryString);
    setTimeout(() => {
      // @ts-ignore
      $(this.AvatarImage.nativeElement).guillotine({width: 260, height: 260, init: {scale: 0.3}});
      console.log("dadsad");
    }, 30);
  }
}
