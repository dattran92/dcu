#! /usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const render = require('./utils/render');

const program = new Command();

program
  .name('dcu')
  .description(pkg.description)
  .version(pkg.version);

program.command('create-component')
  .argument('<name>', 'Component Name')
  .option('--no-css', 'Ignore css file')
  .action((name, options) => {    
    fs.mkdirSync(name);

    // index.js
    const indexContent = `import { default } from './${name}'`;
    fs.writeFileSync(path.join(name, 'index.js'), indexContent, 'utf8');

    // <name>.js
    const componentContent = render('CreateComponent', { name });
    fs.writeFileSync(path.join(name, `${name}.js`), componentContent, 'utf8');

    if (options.css) {
      // <name>.module.scss
      fs.writeFileSync(path.join(name, `${name}.module.scss`), '', 'utf8');
    }
  });




program.parse();
