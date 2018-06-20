const request = require('request-promise')
const xml2js = require('xml2js')

const name = 'Geekweek reader'
const keyword = 'geek'

const dateToView = date => {
  const dateAndTime = new Date(date)
    .toLocaleDateString("pl-Pl", {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).split(', ')

    const today = new Date().getDate()
    const style = today === new Date(date).getDate() ? ' style="color:#660000;"' : ''

    return `<span${style}>${dateAndTime[0]}<br/>${dateAndTime[1]}</span>`
}

const geekweekUrl = 'http://www.geekweek.pl/rss-popularne/'

const fetchRSS = url => new Promise( (resolve, reject) => {
  request({
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:45.0) Gecko/20100101 Firefox/45.0',
        accept: 'text/html,application/xhtml+xml'
      },
      pool: false,
      followRedirect: true

    }).then( xml => {
      const parser = new xml2js.Parser({ trim: false, normalize: true, mergeAttrs: true });
      parser.addListener("error", err => {
        reject(err)
      });
      parser.parseString(xml, (err, result) => {
        resolve(result)
      });
    })
  })

const getList = async () => {
  const rawArr = await fetchRSS(geekweekUrl).then( response => response.rss.channel[0].item)
  return rawArr
  .sort( ( a, b ) =>
      new Date(b.pubDate[0]).getTime() - new Date(a.pubDate[0]).getTime()
  ).map(item => ({
    path: item.link[0],
    value: item.title[0],
    icon: 'https://image.ibb.co/jfRBGS/geekweek.png',
    addition: dateToView(item.pubDate[0])
  }))
}

let cached = null

exports.plugin = tools => { 
  const onEnter = async (query, item) => {
    tools.openExternal(item.path)
  }
  const queryResults = async query => {
    if (!cached) {
      cached = await getList()
    }
    return tools.filterList(cached, query)
  }
  return {
    name,
    keyword,
    queryResults,
    onEnter
  }
}