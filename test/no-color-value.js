'use strict'

const rule = require(`${__dirname}/../rules/no-color-value`)
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()

const parserOptions = { ecmaVersion: 8, sourceType: 'module' }

ruleTester.run('no-color-value', rule, {
  valid: [
    {
      code: 'styled.button`height: 200px; width: 300px;`',
      parserOptions,
    },
  ],
  invalid: [
    {
      code: 'styled.span`color: #159bd5; cursor: pointer; a { color: #fff; }`',
      parserOptions,
      errors: [
        {
          messageId: 'no-color-value',
        },
      ],
    },
  ],
})
