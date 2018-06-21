const request = require('request-promise')
const qs = require('querystring')

const getUrl = (u, json) => u + '?' + qs.stringify(json)

const getList = (key, regionCode) => {
  return request(getUrl("https://www.googleapis.com/youtube/v3/videos", {
      part: 'snippet',
      chart: 'mostPopular',
      kind: 'youtube#videoListResponse',
      maxResults: 10,
      regionCode,
      key
    })).then(data => {
    const list = JSON.parse(data).items.map(item => Object.assign({}, item.snippet, {id: item.id}))
    return list.map(item => {
      return {
        path: `https://www.youtube.com/watch?v=${item.id}`,
        value: item.localized.title,
        icon: item.thumbnails.default.url
      }
    })    
  })
}


/*****************************************************/
const name = 'YT Trending'
const keyword = 'trend'

exports.plugin = (tools, config) => {
  const queryResults = async query => {
    return getList(config.key, config.regionCode)
  }
  return {
    name,
    keyword,
    queryResults,
  }
}
exports.id = 'yttrending'