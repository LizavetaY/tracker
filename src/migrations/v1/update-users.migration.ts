import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

async function updateUsersMigration() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const uri = configService.get('DB_URI');
  const databaseName = configService.get('DB_NAME');
  const databaseSchema = 'users';

  const client = new MongoClient(uri);

  try {
    console.log('Connecting to database...');
    await client.connect();

    const database = client.db(databaseName);
    const collection = database.collection(databaseSchema);

    console.log(`Starting migration: Adding 'surname' field to ${databaseSchema}...`);
    const result = await collection.updateMany(
      {},
      {
        $set: { surname: '' },
        $currentDate: { updatedAt: true },
      }
    );

    console.log(`Migration completed: ${result.modifiedCount} documents updated.`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Database connection closed.');

    await appContext.close();
  }
}

updateUsersMigration();