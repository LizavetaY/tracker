import mongoose from 'mongoose';
import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ValidObjectId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const id = request.params?.id || request.query?.id || '';

    if (!id) {
      return undefined;
    }

    const isValidObjectId = mongoose.isValidObjectId(id);

    if (!isValidObjectId) {
      throw new BadRequestException('Please enter correct id.');
    }

    return id;
  },
);