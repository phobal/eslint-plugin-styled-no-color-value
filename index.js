'use strict';

module.exports.rules = {
  'no-color-value': require(`${__dirname}/rules/no-color-value.js`)
};

module.exports.configs = {
  'recommended': {
    'rules': {
      'styled-no-color-value/no-color-value': 2,
    }
  }
};
