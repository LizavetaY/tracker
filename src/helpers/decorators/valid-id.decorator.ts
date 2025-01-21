import mongoose from 'mongoose';
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ValidId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const id = request.params?.id || '';

    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    return id;
  },
);