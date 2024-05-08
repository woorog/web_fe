import { PartialType } from '@nestjs/swagger';
import { CreateProblemDto } from './createProblem.dto';

export class UpdateProblemDto extends PartialType(CreateProblemDto) {}
