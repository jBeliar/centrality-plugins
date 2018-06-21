const request = require('request-promise')

const url = (action, query, key, params = '') =>
`https://translate.yandex.net/api/v1.5/tr.json/${action}?key=${key}&text=${encodeURIComponent(query)}${params}`

const detectLanguage = (query, key) => {
  return request(url('detect', query, key))
    .then(response => JSON.parse(response).lang)
}

const translate = (query, direction, key) => {
  return request(url('translate', query, key, `&lang=${direction}`))
}

/*****************************************************/
const name = 'Translate'
const keyword = 'tran'


exports.plugin = (tools, config) => {
  const preview = async (query, item, setInput) => {

    const { key, languages: {first, second }} = config

    const lang = await detectLanguage(query, key)
    const secondLang = lang === second ? first : second
    return translate(query, `${lang}-${secondLang}`, key)
      .then(response => JSON.parse(response).text)
      .then(text => text.map( (text, i) => `${i+1}. ${text}`).join('<br>') )
  }
  return {
    name,
    keyword,
    preview
  }
}
exports.id = 'translate'