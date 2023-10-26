import store from '@/store'

export function useCalculation (options) {
  const operators = [
    {
      name: 'ternary',
      value: '?',
      handler: ([ a, b, c ]) => (a ? b : c)
    },
    {
      name: 'multiplication',
      value: '*',
      handler: ([ a, b ]) => (+a * +b)
    },
    {
      name: 'division',
      value: '/',
      handler: ([ a, b ]) => (a / b)
    },
    {
      name: 'addition',
      value: '+',
      handler: ([ a, b ]) => (+a + +b)
    },
    {
      name: 'substraction',
      value: '-',
      handler: ([ a, b ]) => (+a - +b)
    }
  ]

  const variablesParser = () => {
    // console.log('--- variablesParser ---')

    const variables = [
      ...store.state.dataVariables,
      ...store.state.computedVariables
    ]

    let result = options.equation
    variables.map((variable) => {
      if (variable.name === options.exceptionVariable) return

      const regexp = new RegExp(variable.name, 'g')
      result = result.replaceAll(regexp, variable.value)
    })

    return result
  }

  const expParser = (expString, operator) => {
    // console.log('--- expParser ---')

    const isTernary = (operator.name === 'ternary')

    const regexpString = isTernary
      ? `((\\d+)\\${operator.value}(\\d+):(\\d+))`
      : `((\\d+)\\${operator.value}(\\d+))`

    const regexp = new RegExp(regexpString)

    const matched = expString.match(regexp)

    if (!matched) return false

    const result = {
      str: matched[1]
    }

    const args = [
      matched[2],
      matched[3],
    ]

    if (isTernary) {
      args.push(matched[4])
    }

    result.value = operator.handler(args)
    return result
  }

  const calculateExp = (expString) => {
    // console.log('--- calculateExp ---')
    let result

    operators.map((operator) => {
      result = expParser(expString, operator)

      if (result) {
        expString = expString.replace(result.str, result.value.toString())
        expString = calculateExp(expString)
      }
    })

    return expString
  }

  const bracketsParser = (equation) => {
    // console.log('--- bracketsParser ---')
    
    equation = equation.replaceAll(' ', '')
    const result = equation.match(/\((.*)\)/)

    if (result) {
      const expResult = bracketsParser(result[1])
      equation = equation.replace(result[0], expResult)
      return calculateExp(equation)
    }
      
    return calculateExp(equation)
  }

  const calculate = () => {
    const arithmeticString = variablesParser()
    return bracketsParser(arithmeticString)
  }

  return {
    calculate
  }
}