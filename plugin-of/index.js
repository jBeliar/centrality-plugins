const request = require('request-promise')
const cheerio = require('cheerio')

const getQuestionsUrl = id => `https://api.stackexchange.com/2.2/questions/${id}/answers?site=stackoverflow&filter=withbody&sort=votes`
const url = t => `https://www.google.com/search?q=site%3Astackoverflow.com+${t}&sourceid=chrome&ie=UTF-8`

const styles = `
<style>
  pre {background-color:#eff0f1;overflow:auto;max-height:600px;width:90%;}
  p *{max-width:100%;box-sizing:border-box;}
  .question-item {padding:5px;margin-bottom:5px;border: solid green 5px;}
  .question-item__title {border-bottom: solid green 5px;}
</style>

`

const prepareTitle = title => {
  const index = title.lastIndexOf(' - Stack ')
  return index > 0 ? title.slice(0, index) : title
}

/*****************************************************/
const name = 'StackOverflow'
const keyword = 'of'

const queryResults = async query => {
  if (query === '') {
    return []
  }
  
  return request(url(query)).then(result => {
    const $ = cheerio.load(result)    
    const resultContainers = $('.g')
    return resultContainers.map((i, item) => {
      const titleNode = $(item).find('.r>a')
      const title = `${titleNode.text()}`
      return {
        title: title,
        url: titleNode.attr('href').match(/\/url\?q\=([^&]*)/)[1]
      }
    }).toArray()
  }).then(items => items.map(item => ({
      _path: item.url,
      value: prepareTitle(item.title)
    })))
}

const preview = async (query, item, setInput) => {
  if (!query) {
    return 'Enter the word'
  }
  if (item) {
    const question_id = item._path.match(/https:\/\/stackoverflow.com\/[a-z]+\/(\d+)/)[1]
    return request(getQuestionsUrl(question_id), { gzip: true, json: true })
      .then(json => json.items)
      .then(items => styles +
        items.map(item =>
        `<div class="question-item">
          <div class="question-item__title">${item.score}</div>
          ${item.body}
        </div>`
      ).join(''))
  }
}

const config = {
  async: true
}

exports.plugin = (tools, _config) => {
  return {
    name,
    keyword,
    preview,
    queryResults,
    config
  }
}
exports.id = 'of'
