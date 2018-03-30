const wrapExport = require('./async-wrap-exports');
const directReference = require('./change-direct-references.js');
const injectExports = require('./inject-slt-components');
const glob = require('glob');
const fs = require('fs');
const fse = require('fs-extra');
const jscodeshift = require('jscodeshift').withParser('flow');
const prettier = require('prettier');
const prettierConfig = require('../prettier.config.js');

function read(path) {
  var source = fs.readFileSync(path, 'utf8').toString();
  return source;
}

function write(path, source) {
  return fs.writeFileSync(path, source);
}

function asyncIcons() {
  // Make icons async:
  return new Promise(resolve => {
		console.log("Start converting Icons to async");
    write(
      './material-ui/packages/material-ui-icons/src/index.js',
      prettier.format(
        wrapExport(
          {
            source: read('./material-ui/packages/material-ui-icons/src/index.js'),
            path: './material-ui/packages/material-ui-icons/src/index.js',
          },
          { jscodeshift: jscodeshift },
        ),
        prettierConfig,
      ),
    );
    console.log('Icons have been converted to async');
    resolve();
  });
}

function asyncComponents() {
  // Make all components async:
  return new Promise((resolve, reject) => {
		console.log('Start converting components to async');
    glob('./material-ui/src/!(styles)/index.js', function(err, files) {
      if (err) {
        reject(err);
      }
      var out;
      for (var i = 0; i < files.length; i++) {
        out = wrapExport({ source: read(files[i]), path: files[i] }, { jscodeshift: jscodeshift });
        write(files[i], prettier.format(out, prettierConfig));
      }
      console.log('Components have been converted to async');
			resolve();
    });
  });
}

function directReferences() {
  // Change direct references to use async references:
  return new Promise((resolve, reject) => {
		console.log('Start changing direct references');
    glob('./material-ui/src/*/!(*.spec).js', function(err, files) {
      if (err) {
        reject(err);
      }
      var out;
      for (var i = 0; i < files.length; i++) {
        out = directReference(
          { source: read(files[i]), path: files[i] },
          { jscodeshift: jscodeshift },
        );
        write(files[i], prettier.format(out, prettierConfig));
      }
      console.log('Direct references have been changed to reference the async components');
      resolve();
    });
  });
}

function changeBabel() {
  return new Promise(resolve => {
		console.log("Start changing ./material-ui/.babelrc");
    var babelrc = eval(`(${read('./material-ui/.babelrc')})`);
    if (babelrc.plugins.indexOf('dynamic-import-node') === -1) {
      babelrc.plugins.push('dynamic-import-node');
    }
		if (babelrc.plugins.indexOf('dynamic-import-webpack') === -1) {
      babelrc.plugins.push('dynamic-import-webpack');
    }
    write('./material-ui/.babelrc', JSON.stringify(babelrc, null, '\t'));
    console.log('Changes to ./material-ui/.babelrc have been made');
    resolve();
  });
}

// START
// Copy over slt-ui ./src directory into material-ui
fse
  .copy('./src', './material-ui/src')
  .then(() => {
    console.log('slt-ui src files copied into material-ui src');
  })
	.then(changeBabel)
  .then(asyncIcons)
  .then(asyncComponents)
  .then(directReferences)
  .then(injectExports)
  .catch(err => console.error(err));