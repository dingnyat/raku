import {Genre} from "./Genre";

export class Song {
  id?: number;
  title: string;
  code: string;
  uploadTime: Date;
  description: string;
  privacy: string;
  imageUrl: string;
  composer: string;
  duration: string;
  src: string;
  view?: number;
  genres: Genre[];
}
