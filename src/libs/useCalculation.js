import store from '@/store'

export function useCalculation (_options) {
  const operators = [
    {
      name: 'ternary',
      value: '?',
      handler: ([ a, b, c ]) => {
        console.log('a:', typeof a, a)
        console.log('b:',b)
        console.log('c:',c)
        console.log('a ? b : c:', +a ? b : c)
        return +a ? b : c
      }
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
  let options = {
    exceptionVariable: _options?.exceptionVariable || '',
    equation: _options?.equation || '',
    variables: _options?.variables || []
  }

  const variablesParser = () => {
    console.log('--- variablesParser ---')

    let result = options.equation
    console.log('options.variables:', options.variables)
    options.variables.map((variable) => {
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

  const recalculate = () => {
    console.log('--- recalculate ---')

    store.state.computedVariables
      .map((item, i) => {
        console.log('item:', item)

        options = {
          exceptionVariable: item.name,
          equation: item.equation,
          variables: [
            ...store.state.dataVariables,
            ...store.state.computedVariables
          ]
        }

        const value = (item.type === 0)
          ? +!!calculate() 
          : calculate()

        store.dispatch('addComputedVariable', {
          ...item,
          value,
          index: i
        })
      })
  }

  return {
    calculate,
    recalculate
  }
}