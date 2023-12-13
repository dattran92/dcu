#! /usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const render = require('./utils/render');
const { snakecase, uppercase, camelcase } = require('stringcase');

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
    const indexContent = `export { default } from './${name}'\n`;
    fs.writeFileSync(path.join(basePath, 'index.js'), indexContent, 'utf8');

    // <name>.js
    const componentContent = render(
      'CreateComponent', 
      { name, has_locale: options.locale, has_css: options.css },
    );
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

program.command('create-redux')
  .argument('<name>', 'module Name')
  .option('-p, --path [path]', 'Path to redux', 'src/redux')
  .option('--actions-path [actionsPath]', 'Path to actions', 'actions')
  .option('--constants-path [constantsPath]', 'Path to constants', 'constants')
  .option('--reducers-path [reducersPath]', 'Path to reducers', 'reducers')
  .option('--sagas-path [sagasPath]', 'Path to sagas', 'sagas')
  .option('--selectors-path [selectorsPath]', 'Path to selectors', 'selectors')
  .action((name, options) => {
    const constantsPath = path.join(options.path, options.constantsPath);
    const actionsPath = path.join(options.path, options.actionsPath);
    const reducersPath = path.join(options.path, options.reducersPath);
    const sagasPath = path.join(options.path, options.sagasPath);
    const selectorsPath = path.join(options.path, options.selectorsPath);

    const uppercaseName = uppercase(snakecase(name));

    // constants/{name}.constants.js
    const constantContent = `export const ${uppercaseName}_ACTION = '${uppercaseName}_ACTION'\n`;
    fs.writeFileSync(
      path.join(constantsPath, `${name}.constants.js`), 
      constantContent, 
      'utf8',
    );

    // reducers/{name}.reducer.js
    const reducerContent = render('reducer', {
      name,
      uppercase_name: uppercaseName,
    });
    fs.writeFileSync(
      path.join(reducersPath, `${name}.reducer.js`),
      reducerContent, 
      'utf8',
    );

    // selectors/{name}.selectors.js
    const selectorName = camelcase(`get_${name}`);
    const selectorContent = `export const ${selectorName} = (state) => state.${name}\n`;
    fs.writeFileSync(
      path.join(selectorsPath, `${name}.selectors.js`),
      selectorContent, 
      'utf8',
    );

    // actions/{name}.actions.js
    const actionContent = '';
    fs.writeFileSync(
      path.join(actionsPath, `${name}.actions.js`),
      actionContent, 
      'utf8',
    );

    // sagas/{name}.saga.js}
    const sagaContent = render('saga', { name });
    fs.writeFileSync(
      path.join(sagasPath, `${name}.saga.js`), 
      sagaContent, 
      'utf8'
    );
  });


program.parse();
