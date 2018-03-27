const fs = require('fs');

const createMigrations = rawMigrationName => {
  if (!rawMigrationName) {
    console.error('Please include migration script name 😔'); // eslint-disable-line no-console
    return;
  }

  const migrationName = formatMigrationName(rawMigrationName);
  const timeStamp = getTimeStamp();

  const doMigrationFilePath = `./migrations/${timeStamp}.do.${migrationName}.sql`;
  const undoMigrationFilePath = `./migrations/${timeStamp}.undo.${migrationName}.sql`;
  createFile(doMigrationFilePath);
  createFile(undoMigrationFilePath);
};

const formatMigrationName = rawMigrationName => {
  const migrationName = rawMigrationName
    .replace(/^./, str => str.toLowerCase())
    .replace(/\s+./g, str => str.trim().toUpperCase());
  return migrationName;
};

const getTimeStamp = () => {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = ensureTwoDigits(currentDate.getUTCMonth() + 1);
  const day = ensureTwoDigits(currentDate.getUTCDate());
  const hour = ensureTwoDigits(currentDate.getUTCHours());
  const minute = ensureTwoDigits(currentDate.getUTCMinutes());
  const second = ensureTwoDigits(currentDate.getUTCSeconds());

  return year + month + day + hour + minute + second;
};

const ensureTwoDigits = number => (Number(number) < 10 ? `0${number}` : `${number}`);

const createFile = fileName => {
  fs.writeFile(fileName, '', error => {
    if (error) {
      console.log(error); // eslint-disable-line no-console
    }
    console.log(`File created ✨ ${fileName}`); // eslint-disable-line no-console
  });
};

const rawMigrationName = process.argv[2] || '';
createMigrations(rawMigrationName);
