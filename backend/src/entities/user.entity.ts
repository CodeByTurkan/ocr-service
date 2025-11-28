import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('User')
export class UserEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date; //diff

  @Column()
  citizenship: string;

  @Column()
  uin: string;

  // @Column({ nullable: true }).
  // documentUrl: string; // uploaded file's path
  // Əgər sən file-i serverdə saxlamırsansa və upload olunan file birbaşa OCR servisə gedirsə, o zaman:
  // file path lazım deyil. // file URL lazım deyil. // database-ə də save etməyəcəksən

  @Column()
  consent: boolean;
}
