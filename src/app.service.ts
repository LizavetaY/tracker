import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection, Types } from 'mongoose';
import { CrudDto } from './dto/crud.dto';
import { CRUD } from './helpers/enums/crud.enum';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async crud(collectionName: string, crudDto: CrudDto): Promise<any> {
    const collection: Collection = this.connection.collection(collectionName);

    if (!collection) {
      throw new BadRequestException(`Collection ${collectionName} not found.`);
    }

    const crudOperation = crudDto.crudOperation || '';
    let result = null;

    switch (crudOperation) {
      case CRUD.Get:
        result = await collection.find({}).toArray();

        return result;
      case CRUD.Post:
        result = await collection.insertOne(crudDto.objectToCreateUpdate);

        return result.insertedId;
      case CRUD.Put:
        const updateObjectId = new Types.ObjectId(crudDto?.idToUpdateDelete || '');

        result = await collection.updateOne(
          { _id: updateObjectId },
          { $set: crudDto.objectToCreateUpdate },
        );

        return updateObjectId;
      case CRUD.Delete:
        const deleteObjectId = new Types.ObjectId(crudDto?.idToUpdateDelete || '');

        result = await collection.deleteOne({ _id: deleteObjectId });

        return deleteObjectId;
      default:
        return result;
    }
  }
}
