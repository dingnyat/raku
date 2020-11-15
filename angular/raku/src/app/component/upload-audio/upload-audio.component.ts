import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-upload-audio',
  templateUrl: './upload-audio.component.html',
  styleUrls: ['./upload-audio.component.css']
})
export class UploadAudioComponent implements OnInit {

  @ViewChild('FileChooserInput') FileChooserInput: ElementRef;

  selectedFiles: Array<File> = null;

  constructor() {
  }

  ngOnInit(): void {
  }

  openFileChooser() {
    const e: HTMLElement = this.FileChooserInput.nativeElement;
    e.click();
  }

  handleFilesInput(event) {
    this.selectedFiles = Array.from(event.target.files);
  }


}
