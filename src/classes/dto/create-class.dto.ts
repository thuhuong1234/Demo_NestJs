import { IsNotEmpty } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  nameClass: string;
  memberOfClass: number;
}
