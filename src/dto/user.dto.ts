import { IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @Length(1, 255)
  name!: string;
}
