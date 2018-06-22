const request = require('request-promise')

const name = 'NPM'
const keyword = 'npm'

const npmImg = 'https://www.idaszak.com/assets/img/npm.png'

const url = query => `https://registry.npmjs.org/${query}/latest`

const queryResults = async query => {
  const lastQuery = query.split(' ')[query.split(' ').length-1]
  const packages = await request.get(`https://registry.npmjs.org/-/v1/search?text=${lastQuery}`)
    .then( resp => JSON.parse(resp).objects)
  return packages.map( pack => ({
    path: pack.package.links.repository,
    value: pack.package.name,
    icon: npmImg
  }))
}

const preview = async (query, item) => {
  if (!query) {
    return 'Enter the word to find package'
  }
  const queries = query.replace(/\s+/g, ' ').split(' ')
  const packs = await Promise.all(queries.map(q => {
    return request.get(encodeURI(url(q))).catch(err => {}).then(resp => JSON.parse(resp || '{}'))
  }))
  return packs.map( (pack,i) => pack.name?`
      <div style="font-size:25px;"><b>${pack.name}</b> (${pack.version})</div>
      <div>${pack.description}</div>
    `:
      `<div>There is no <b>"${queries[i]}"</b> package</div>`
    ).join('<hr style="border: 1px solid black;"/>')
}

exports.plugin = tools => {
  return {
    name,
    keyword,
    preview,
    queryResults
  }
}