require('dotenv').config();

module.exports = {
  mongodb: {
    url: process.env.DB_URI || '',
    databaseName: process.env.DB_NAME || '',
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};
