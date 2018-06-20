const request = require('request-promise')
const cheerio = require('cheerio')

const name = 'Currency converter'
const keyword = '$'

const url = (amount, curr1, curr2) =>
  `https://finance.google.com/finance/converter?a=${amount}&from=${curr1}&to=${curr2}`

const getContent = async(amount, curr1, curr2) => {
  const response = await request.get(url(amount, 'usd'/* curr1 */, 'pln'/* curr2 */))
  const $ = cheerio.load(response)
  return $('#currency_converter_result').text().trim()
}

/* const isValidQuery = (amount, curr1, curr2) => {
  if (
    !amount || !curr1 || !curr2 ||
    isNaN(amount) ||
    curr1.length != 3 || curr2.length != 3
  ) {
    return false
  } else {
    return true
  }
} */

const preview = async query => {
  const [amount, curr1, curr2] = query.split(' ')
  // if (!isValidQuery(amount, curr1, curr2) ) {
  //   return 'Enter this pattern: $ [amount] [currency1] [currency2]'
  // }
  const content = await getContent(amount, curr1, curr2)
  return content ?
    content :
    'Incorrect curency<br>Enter this pattern: $ [amount] [currency1] [currency2]'
}
exports.plugin = tools => {
  return {
    name,
    keyword,
    preview
  }
}