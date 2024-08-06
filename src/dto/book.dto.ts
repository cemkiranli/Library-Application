import { IsString, Length } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @Length(1, 255)
  name!: string;
}
