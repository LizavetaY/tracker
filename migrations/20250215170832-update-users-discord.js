const databaseSchema = 'users';

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns void
   */
  async up(db) {
    console.log(`Starting migration: Adding 'discordNickname' field to ${databaseSchema}...`);

    const result = await db.collection(databaseSchema).updateMany(
      {},
      {
        $set: { discordNickname: '' },
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
    console.log(`Revert migration: Removing 'discordNickname' field from ${databaseSchema}...`);

    const result = await db.collection(databaseSchema).updateMany(
      {},
      {
        $unset: { discordNickname: '' },
        $currentDate: { updatedAt: true },
      },
    );

    console.log(`Migration reverted: ${result.modifiedCount} documents updated.`);
  }
};
