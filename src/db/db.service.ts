import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection, Types } from 'mongoose';
import { CRUD } from './enums/crud.enum';
import { ICrudParams } from 'src/helpers/types';

@Injectable()
export class DBService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async crud({ id, crudDto }: ICrudParams): Promise<any> {
    const collection: Collection = this.connection.collection(crudDto.collection);

    if (!collection) {
      throw new BadRequestException(`Collection ${crudDto.collection} not found.`);
    }

    const crudOperation = crudDto.operation || '';
    let result = null;

    switch (crudOperation) {
      case CRUD.Get:
        result = await collection.find(crudDto.filter || {}).toArray();

        return result;
      case CRUD.Post:
        result = await collection.insertOne(crudDto.body || {});

        return result?.insertedId;
      case CRUD.Put:
        const updateObjectId = new Types.ObjectId(id);

        result = await collection.updateOne(
          { _id: updateObjectId },
          { $set: crudDto.body },
        );

        return updateObjectId;
      case CRUD.Delete:
        const deleteObjectId = new Types.ObjectId(id);

        result = await collection.deleteOne({ _id: deleteObjectId });

        return deleteObjectId;
      default:
        return result;
    }
  }
}
