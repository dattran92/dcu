#! /usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const render = require('./utils/render');
const { snakecase } = require('stringcase');

const program = new Command();

program
  .name('dcu')
  .description(pkg.description)
  .version(pkg.version);

program.command('create-component')
  .argument('<name>', 'Component Name')
  .option('-p, --path [path]', 'Path to component')
  .option('--no-css', 'Ignore css file')
  .option('--no-locale', 'Ignore locale file')
  .action((name, options) => {
    const basePath = path.join(options.path || '', name);
    fs.mkdirSync(basePath);

    // index.js
    const indexContent = `import { default } from './${name}'`;
    fs.writeFileSync(path.join(basePath, 'index.js'), indexContent, 'utf8');

    // <name>.js
    const componentContent = render('CreateComponent', { name });
    fs.writeFileSync(path.join(basePath, `${name}.js`), componentContent, 'utf8');

    // <name>.module.scss
    if (options.css) {
      fs.writeFileSync(path.join(basePath, `${name}.module.scss`), '', 'utf8');
    }

    // locales/en.json
    if (options.locale) {
      fs.mkdirSync(path.join(basePath, 'locales'));
      const localeContent = render('locale', { name: snakecase(name) });
      fs.writeFileSync(
        path.join(basePath, 'locales', 'en.json'), 
        localeContent, 
        'utf8',
      );
    }
  });




program.parse();
