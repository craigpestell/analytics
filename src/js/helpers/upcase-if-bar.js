/**
 * Example block Handlebars helper.
 *
 * This example helper will capitalize the text in foo if foo="bar"
 *
 * Usage:
 *   { foo: 'bar' }
 *
 *   {{#upcase-if-bar foo}}{{this}}{{/upcase-if-bar}}
 *
 *   output: BAR
 *
 * @see http://handlebarsjs.com/block_helpers.html
 */
module.exports = (foo, options) => {
  if (foo === 'bar') {
    return options.fn(foo.toUpperCase());
  }

  return options.fn(this);
};
