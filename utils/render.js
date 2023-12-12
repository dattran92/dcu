const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const render = (viewName, data) => {
  const template = fs.readFileSync(path.join(__dirname, '../views', `${viewName}.template`), 'utf8');
  const html = mustache.render(template, data);
  return html;
}

module.exports = render;
