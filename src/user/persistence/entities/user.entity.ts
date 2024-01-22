import { Exclude } from 'class-transformer';
import { User } from '../../domain/user';
import { BaseEntity, PrimaryColumn } from 'typeorm';

export class UserEntity extends BaseEntity implements User {
  @PrimaryColumn()
  id: string;

  email: string;

  @Exclude({ toPlainOnly: true })
  password?: string;
}
