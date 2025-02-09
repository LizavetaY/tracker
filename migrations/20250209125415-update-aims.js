const axios = require('axios');

const databaseSchema = 'aims';
const todosAPI = 'https://jsonplaceholder.typicode.com/todos';

module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @returns void
   */
  async up(db) {
    try {
      console.log(`Starting migration: Fetching 'todos' data from ${todosAPI}...`);

      const response = await axios.get(todosAPI);
      const todos = response?.data || [];

      const aims = await db.collection(databaseSchema).find().toArray();

      console.log(`Found ${aims.length} aims to update.`);

      // fake userId
      let counter = 1;

      for (const aim of aims) {
        const aimTodos = todos.filter(todo => todo?.userId === counter);
        
        const formattedAimTodos = aimTodos.map(todo => ({
          title: todo?.title || 'N/A',
          isCompleted: !!todo?.completed,
        }));
        
        await db.collection(databaseSchema).updateOne(
          { _id: aim._id },
          {
            $set: { todos: formattedAimTodos },
            $currentDate: { updatedAt: true },
          },
        );
        console.log(`Updated aim with id ${aim._id}`);

        counter += 1;
      }

      console.log('Migration completed.');
    } catch (error) {
      console.log(`Migration failed with error: ${error}`);
    }
  },

  /**
   * @param db {import('mongodb').Db}
   * @returns void
   */
  async down(db) {
    console.log(`Revert migration: Removing 'todos' fields from ${databaseSchema}...`);

    const result = await db.collection(databaseSchema).updateMany(
      {},
      {
        $unset: { todos: '' },
        $currentDate: { updatedAt: true },
      },
    );

    console.log(`Migration reverted: ${result.modifiedCount} documents updated.`);
  }
};
