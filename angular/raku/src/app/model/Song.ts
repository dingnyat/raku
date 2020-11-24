import {Genre} from "./Genre";

export class Song {
  id?: number;
  title: string;
  code: string;
  ext: string;
  uploadTime: Date;
  description: string;
  privacy: string;
  imageUrl: string;
  composer: string;
  artist: string;
  duration: string;
  src: string;
  link: string;
  plays?: number;
  genres: Genre[];
  uploader?: any;
  tags?: string[];
  comments?: any[];
}
