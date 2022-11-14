import { IsNotEmpty } from 'class-validator';

export class Todo {
  _id: string;
  @IsNotEmpty()
  title: string;
  isCompleted: boolean;
}
