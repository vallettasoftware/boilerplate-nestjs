import { Exclude } from 'class-transformer';

export class User {
  id: string;
  email: string;
  @Exclude({ toPlainOnly: true })
  password?: string;
}
