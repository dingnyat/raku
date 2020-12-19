import {Track} from "./track";

export class Playlist {
  id: number;
  code: string;
  title: string;
  createdTime?: Date;
  createdBy?: any;
  tracks?: Track[];
}
