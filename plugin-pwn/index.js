const request = require('request-promise')
const cheerio = require('cheerio')

const name = 'PWN dictionary'
const keyword = 'pwn'

const url = query => `https://sjp.pwn.pl/szukaj/${query}.html`

const removeSpaces = query => {
  return query.replace(/\s+[\n\r]/g, ', ').replace(/\s+/g,' ').trim()
}

const pwnContent = async response => {
  const $ = cheerio.load(response)
  let result = []

  $('.type-187126').each( (i,item) =>  result.push(cheerio(item).text().split('\n')))
  result = result.map( item => item.map(removeSpaces).filter(item => item.length).join('<br>') )
  return result.join('<br>')
}

const getContent = async query => {
  const response = await request.get(encodeURI(url(query)))
  return pwnContent(response)
}


const preview = async (query) => {
  if (!query) {
    return 'Enter the word to find in dictionary'
  }
  const result= await getContent(query)
  if (result) {
    return `<ol>${result}</ol>`
  } else {
    return `There is noword "${query}" in dictionary`
  }
}


exports.plugin = tools => {
  return {
    name,
    keyword,
    preview,
  }
}