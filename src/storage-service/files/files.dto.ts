import { IsOptional } from 'class-validator';
export class FilesDTO {
  id: number;
  url: string;
  name: string;

  @IsOptional()
  content: BinaryType;

}
