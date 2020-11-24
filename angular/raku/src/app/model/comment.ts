export class Comment {
  id: number;
  content: string;
  time: Date;
  uploader: any;
  children: Comment[];
}
