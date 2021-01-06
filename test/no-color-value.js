'use strict'

const rule = require(`${__dirname}/../rules/no-color-value`)
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

ruleTester.run('no-color-value', rule, {
  valid: [],
  invalid: [],
})
