const postcss = require('postcss')
const {
  isStyledTagname,
  getNodeStyles,
  isValidRule,
} = require('../utils/index')

const create = (context) => {
  return {
    TaggedTemplateExpression: (node) => {
      if (isStyledTagname(node)) {
        try {
          const root = postcss.parse(getNodeStyles(node))
          const result = isValidRule(root, true)
          result.forEach((r) => {
            if (!r.isValid) {
              return context.report({
                node,
                messageId: 'no-color-value',
                loc: r.loc,
              })
            }
          })
        } catch (e) {
          return true
        }
      }
    },
  }
}

module.exports = {
  meta: {
    messages: {
      'no-color-value':
        '请使用主题文件中定义的颜色值（Use the color values defined in the theme file）',
    },
  },
  create,
}
