import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('file')
export class FilesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  url: string;

  @Column('text', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  content: BinaryType;


}
