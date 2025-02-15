const databaseSchema = 'users';

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns void
   */
  async up(db) {
    console.log(`Starting migration: Adding 'discord_nickname' field to ${databaseSchema}...`);

    const result = await db.collection(databaseSchema).updateMany(
      {},
      {
        $set: { discord_nickname: '' },
        $currentDate: { updatedAt: true },
      },
    );

    console.log(`Migration completed: ${result.modifiedCount} documents updated.`);
  },

  /**
   * @param db {import('mongodb').Db}
   * @returns void
   */
  async down(db) {
    console.log(`Revert migration: Removing 'discord_nickname' field from ${databaseSchema}...`);

    const result = await db.collection(databaseSchema).updateMany(
      {},
      {
        $unset: { discord_nickname: '' },
        $currentDate: { updatedAt: true },
      },
    );

    console.log(`Migration reverted: ${result.modifiedCount} documents updated.`);
  }
};
