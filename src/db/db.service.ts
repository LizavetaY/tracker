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

    switch (crudDto.operation) {
      case CRUD.Get:
        return collection.find(crudDto.filter || {}).toArray();
      case CRUD.Post:
        return collection.insertOne(crudDto.body || {});
      case CRUD.Put:
        const updateObjectId = new Types.ObjectId(id);

        return collection.updateOne(
          { _id: updateObjectId },
          { $set: crudDto.body },
        );
      case CRUD.Delete:
        const deleteObjectId = new Types.ObjectId(id);

        return collection.deleteOne({ _id: deleteObjectId });
      default:
        return null;
    }
  }
}
