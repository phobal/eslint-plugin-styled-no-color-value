function isStyledTagname(node) {
  return (
    (node.tag.type === 'Identifier' && node.tag.name === 'css') ||
    (node.tag.type === 'MemberExpression' &&
      node.tag.object.name === 'styled') ||
    (node.tag.type === 'CallExpression' &&
      (node.tag.callee.name === 'styled' ||
        (node.tag.callee.object &&
          ((node.tag.callee.object.callee &&
            node.tag.callee.object.callee.name === 'styled') ||
            (node.tag.callee.object.object &&
              node.tag.callee.object.object.name === 'styled')))))
  )
}

function getNodeStyles(node) {
  const [firstQuasi, ...quasis] = node.quasi.quasis
  // remove line break added to the first quasi
  const lineBreakCount = node.quasi.loc.start.line - 1
  let styles = `${'\n'.repeat(lineBreakCount)}${' '.repeat(
    node.quasi.loc.start.column + 1
  )}${firstQuasi.value.raw}`

  // replace expression by spaces and line breaks
  quasis.forEach(({ value, loc }, idx) => {
    const prevLoc = idx === 0 ? firstQuasi.loc : quasis[idx - 1].loc
    const lineBreaksCount = loc.start.line - prevLoc.end.line
    const spacesCount =
      loc.start.line === prevLoc.end.line
        ? loc.start.column - prevLoc.end.column + 2
        : loc.start.column + 1
    styles = `${styles}${' '}${'\n'.repeat(lineBreaksCount)}${' '.repeat(
      spacesCount
    )}${value.raw}`
  })

  return styles
}

const hasColorPropKeys = [
  'color',
  'background-color',
  'background',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'box-shadow',
  'text-shadow',
  'fill',
]

const cssColorRegx = /(#[a-f0-9]{8}|#[a-f0-9]{6}|#[a-f0-9]{3}|rgb *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *\)|rgba *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *,\s?(0?.\d+|0|1)? *\)|black|green|silver|gray|olive|white|yellow|maroon|navy|red|blue|purple|teal|fuchsia|aqua)$/i

function isValidAtomicRule(node) {
  const currentProp = node.prop
  const currentValue = node.value
  if (
    hasColorPropKeys.includes(currentProp) &&
    cssColorRegx.test(currentValue)
  ) {
    const loc = {
      start: {
        line: node.source.start.line,
        column: node.source.start.column - 1,
      },
      end: {
        line: node.source.end.line,
        column: node.source.end.column - 1,
      },
    }

    return { isValid: false, loc }
  }
  return { isValid: true }
}

let result = []
function isValidRule(rule, isFirst) {
  if (isFirst) result = []
  rule.nodes.forEach((node) => {
    if (node.type === 'rule') {
      isValidRule(node)
    } else {
      result.push(isValidAtomicRule(node))
    }
  })
  return result
}

exports.isStyledTagname = isStyledTagname
exports.getNodeStyles = getNodeStyles
exports.isValidRule = isValidRule
