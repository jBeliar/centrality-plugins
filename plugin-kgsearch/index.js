
const request = require('request-promise')

const url = (query, key, langs) =>
  `https://kgsearch.googleapis.com/v1/entities:search?query=${query}&key=${key}&languages=${langs.join(',')}`;

const buildSection = (header, imageUrl, body, bodyUrl, url) => {
  const image = `<img src="${imageUrl}" style="max-width:100px;max-height:100px;float:left;margin-right:5px;">`
  const bodyLink = `<div><a href="${bodyUrl}">Wiki</a></div>`
  const link = `<div><a href="${url}">Url</a></div>`
  return `
  <div style="clear:left;">
    <div style="font-size:1rem;font-weight:bold;">${header}</div>
    <div>${imageUrl?image:''}${body}</div>
    ${bodyUrl?bodyLink:''}
    ${url?link:''}
  </div>
  `
}

const prepareItem = item => {
  return {
    header: `${item.name} ` + (item.description?`[${item.description}]`:''),
    imageUrl: item.image && item.image.contentUrl,
    body: item.detailedDescription && item.detailedDescription.articleBody,
    bodyUrl: item.detailedDescription && item.detailedDescription.url,
    url: item.url
  }
}

const prepareHTML = list => {
  return list.map(item => {
    return buildSection(item.header, item.imageUrl, item.body, item.bodyUrl, item.url)
  }).join('<hr style="clear:left;border-color:#252728;">')
}

/*****************************************************/
const name = 'Knowledge google graph'
const keyword = 'know'

exports.plugin = (tools, config) => {
  const preview = async (query, item, setInput) => {
    if (!query) {
      return 'Enter the word'
    }

    return request(url(query, config.key, config.langs))
      .then(result => JSON.parse(result).itemListElement.map(item => item.result))
      .then(list => list.filter(item => item.detailedDescription))
      .then(list => list.map(item => prepareItem(item)))
      .then(list => prepareHTML(list))
    
  }
  return {
    name,
    keyword,
    preview
  }
}
exports.id = 'kgsearch'
