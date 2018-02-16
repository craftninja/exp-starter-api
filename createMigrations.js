const fs = require('fs');

const config = {
  folder: './migrations/',
  scriptTypes: ['do', 'undo'],
  fileNameTemplate: '{timeStamp}.{scriptType}.{migrationName}.sql',
  timeStampTemplate: '{year}{month}{day}{hour}{minute}{second}',
};

/* eslint-disable no-console */
const createMigrations = () => {
  const rawMigrationName = process.argv[2] || '';

  if (rawMigrationName) {
    const migrationName = rawMigrationName
      .replace(/^./, str => str.toLowerCase())
      .replace(/\s+./g, str => str.trim().toUpperCase());

    const timeStamp = getTimeStamp();
    createMigrationScripts(migrationName, timeStamp);
  } else {
    console.log('Invalid migratin script name!');
  }
};

const createMigrationScripts = (migrationName, timeStamp) => {
  const scriptNameTemplateMap = {
    timeStamp: timeStamp,
    migrationName: migrationName
  };

  for (let i = 0; i < config.scriptTypes.length; i++) {
    scriptNameTemplateMap.scriptType = config.scriptTypes[i];
    const refinedMigrationName = formatTemplate(scriptNameTemplateMap, config.fileNameTemplate);
    const migrationFileName = `${config.folder}${refinedMigrationName}`;
    createFile(migrationFileName);
  }
};

const createFile = fileName => {
  fs.writeFile(fileName, '', (error) => {
    if (error) {
      console.log(error);
    }
    console.log(`Migration script ${fileName} created!`);
  });
};

const getTimeStamp = () => {
  const currentDate = new Date();
  const timeStampTemplateMap = {
    year: currentDate.getUTCFullYear(),
    month: round(currentDate.getUTCMonth() + 1),
    day: round(currentDate.getUTCDate()),
    hour: round(currentDate.getUTCHours()),
    minute: round(currentDate.getUTCMinutes()),
    second: round(currentDate.getUTCSeconds()),
  };
  return formatTemplate(timeStampTemplateMap, config.timeStampTemplate);
};

const round = (number) => {
  return Number(number) < 10 ? `0${number}` : number;
};

const formatTemplate = (templateMap, template) => {
  var refinedScriptName = template
    .replace(/{(.*?)}/g, (match, group) => {
      return templateMap[group];
    });
  return refinedScriptName;
};

createMigrations();
/* eslint-enable no-console */
