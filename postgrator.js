if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
if (!process.env.MIGRATE_TO) {
  process.env.MIGRATE_TO = 'max';
}

const path = require('path');
const postgrator = require('postgrator');

postgrator.setConfig({
  migrationDirectory: path.join(__dirname, '/migrations'),
  driver: 'pg',
  connectionString: process.env.DATABASE_URL,
});

// migrate to version specified, or supply 'max' to go all the way up
postgrator.migrate(process.env.MIGRATE_TO, function(err, migrations) {
  /* eslint-disable no-console */
  if (err) {
    console.log(err);
  } else {
    if (migrations) {
      console.log(
        ['*******************']
          .concat(migrations.map(migration => `checking ${migration.filename}`))
          .join('\n')
      );
    }
  }
  /* eslint-enable no-console */
  postgrator.endConnection(() => {});
});
