'use strict';

/**
 * Builds a spec object and writes to output to spec.json
 * This allows us to write the spec in separate folders and files
 */

const promisify = require('util').promisify;
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const specPath = path.resolve(__dirname, './spec');
const specYaml = path.resolve(specPath, )
const tmpYaml = {};

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const throwErr = err => { throw err; };

function concatSpecFiles(dir) {
  readdir(dir)
    .then(itemNames => {
      itemNames.forEach(name => {
        if (name.endsWith('.yml') || name.endsWith('.yaml')) {
          const filePath = path.resolve(specPath, dir, name);
          readFile(filePath)
            .then(data => {
              tempYaml[dir] = tempYaml[dir] ? tempYaml[dir] + data : data;
            })
            .catch(throwErr);
        }
      });
    });
}

readdir(specPath)
  .then(itemNames => {
    itemNames.forEach(name => {
      const itemPath = path.resolve(specPath, name);
      stat(itemPath)
        .then(stats => {
          if (stats.isDirectory()) {
            concatSpecFiles(name);
          }
        })
        .catch(throwErr);
    })
  })
  .catch(throwErr);
