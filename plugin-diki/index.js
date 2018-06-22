const request = require('request-promise')
const cheerio = require('cheerio')

const name = 'Diki translator'
const keyword = 'd'

const url = 'https://www.diki.pl/slownik-angielskiego?q='

const removeSpaces = query => {
  return query.replace(/\s+[\n\r]/g, ', ').replace(/\s+/g,' ').trim()
}

const div = (value, type) => {

  let result = value
  if (type) {
    result = `<${type}>${result}</${type}>`
  }
  return `<div>${result}</div>`
}
const b = value => `<b>${value}</b>`

const queryResults = async query => {
  const encodedQuery = encodeURIComponent(query)
  const words = await request.get(`https://www.diki.pl/dictionary/autocomplete?q=${encodedQuery}&langpair=en%3A%3Apl`)
  return JSON.parse(words).map( word => ({
    path: word,
    value: word,
    icon: 'https://www.diki.pl/images/favicon/diki/favicon-32x32.png'
  }))
}

const dikiContent = async response => {
  const $ = cheerio.load(response)
  const dictionaryEntries = $('.diki-results-left-column .dictionaryEntity')

  const audioUrl = 'http://www.diki.pl' + cheerio($('.audioIcon').get(0)).attr('data-audio-url')

  let result = ''
  dictionaryEntries.each((i, elem) => {
    const entrySection = cheerio(elem)

    entrySection.children().each( (j, elemm) => {
      const entry = cheerio(elemm)
      const entryType = entry.attr('class')
      switch (entryType) {
        case 'hws':
          const trans = removeSpaces(entrySection.find('.hws>h1>span.hw').text().trim())
          result += div(b(''+(i+1)+'.'+ trans))
          break;
        case 'partOfSpeechSectionHeader':
          const speechHeader = cheerio(entry).find('span').text().toUpperCase()
          result += div(speechHeader)
          break;
        case 'vf':
          result += div(entry.text(), 'mark')
          break;
        case 'foreignToNativeMeanings':
        case 'nativeToForeignEntrySlices':
        case 'hiddenNotForChildrenMeaning':
          entry.children('li').each(
            (i, lineItem) => {
              let line = cheerio(lineItem)
                .children('span.hw')
                .toArray().map(d => cheerio(d).text()).join(', ')

              if (line.length === 0) {
                line = cheerio(lineItem).find('span.hiddenNotForChildrenMeaning')
                  .children('span.hw')
                  .toArray().map(d => cheerio(d).text()).join(', ')

              }

              result += div('⭕ '+ line)

              const line2 = cheerio(lineItem)
                .find('.nativeToForeignMeanings>li>.hw')
                .toArray().map(d => div('&nbsp;&nbsp;&nbsp;&nbsp;⚪ '+ cheerio(d).text()) ).join('')
              result += line2
            }
          )
          break;
      }
    })
  })
  return { result, audioUrl }
}

const getContent = async query => {
  const response = await request.get(url + encodeURIComponent(query))
  return dikiContent(response)
}


const preview = async (query, item, setInput) => {
  if (!query) {
    return 'Enter the word to translate'
  }
  const q = item ? item.value : query
  setInput(`d ${q}`)
  const { result, audioUrl } = await getContent(q)
  if (result) {
    new Audio(audioUrl).play()
    return `<ol>${result}</ol>`
  } else {
    return `There is no translation for the word "${query}"`
  }
}

exports.plugin = tools => {
  return {
    name,
    keyword,
    preview,
    queryResults
  }
}