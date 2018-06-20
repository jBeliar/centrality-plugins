const { exec } = require('child_process')
const { existsSync, writeFile } = require('fs')
const icon = 'https://static.filehorse.com/icons/developer-tools/visual-studio-code-icon-32.png'
let cached = []

const mapValues = arr => arr.map(item => {
  const splitedPath = item.split('\\') 
  return {
    value: splitedPath[splitedPath.length - 1],
    path: item,
    icon
  }
})

const cleanPathsForType = (json, type) => {
  const paths = json.openedPathsList[type]
  const exists = []
  paths.forEach(path => {
    if (existsSync(path)) {
      exists.push(path)
    }
  })
  json.openedPathsList[type] = exists
}

const cleanPaths = (json, types, vsCodeStorageUrl) => {
  types.forEach(type => cleanPathsForType(json, type))
  writeFile(vsCodeStorageUrl, JSON.stringify(json, null, 4), err => err && console.log(err))
}

/*****************************************************/
const name = 'VS-Code Apps'
const keyword = 'app'

exports.plugin = (tools, config) => {
  const cleanConfigFiel = async () => {
    const jsonSettings = await tools.loadJsonAsync(config.vscodeStorage)
    cleanPaths(jsonSettings, ['files', 'workspaces'], vsCodeSto)
  }
  const init = async () => {
    const workspaces = await tools.loadJsonAsync(config.vscodeStorage)
      .then( storage => storage.openedPathsList.workspaces)
      .then(workspaces => workspaces.filter(workspace => typeof workspace === 'string'))
    cached = mapValues(workspaces)
  }
  const onEnter = (query, item) => {
    if (query === '-clean') {
      return cleanConfigFiel()
    }
    exec(`code "${item.path}"`)
  }
  const queryResults = query => {
    return tools.filterList(cached, query)
  }
  return {
    name,
    keyword,
    init,
    queryResults,
    onEnter
  }
}
exports.id = 'app'
