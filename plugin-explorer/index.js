const { readdir, lstat } = require('fs')
const { join } = require('path')

const read = path => new Promise((resolve, reject) => {
  readdir(path, function (err, files) {
    if (err) {
      reject(err)
      return
    }
    resolve(files.map(file => join(path, file)))
  })
})

const getContextDirectory = query => {
  const splittedQuery = query.split('\\')
  if (splittedQuery.length < 2) {
    return ''
  }
  return splittedQuery.slice(0, splittedQuery.length - 1).join('\\')
}

const isFile = p => {
  return new Promise( (resolve, reject) => {
    lstat(p, (err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve(stats.isFile())
    })
  })
}

let cached = null
let directory = ''
const desktopPath = join(require('os').homedir(), 'Desktop').split('C:\\')[1]

const getDesktopPath = query => {
  return desktopPath + query.split('Desktop')[1]
}

const currentDirectoryPath = '>>>>>>>'

const dirEntity = {
  _path: currentDirectoryPath, value: '>>>', icon: ''
}

/*****************************************************/
const name = 'Explorer'
const keyword = '::'

exports.plugin = tools => {
  const queryResults = async query => {
    if (query.startsWith('Desktop')) {
      query = getDesktopPath(query)
    }
    const context = getContextDirectory(query)
    if ( !query.endsWith('\\') && cached != null && context === directory) {
      return tools.filterList(cached, query.split('\\')[query.split('\\').length - 1])
    }
    directory = context
    const items = await read(`C:\\${context.trim()}`)
    cached = items.map(item => ({
      _path: item,
      value: item.split('\\')[item.split('\\').length - 1],
      icon: ''
    }))
    return [ dirEntity, ...tools.filterList(cached, query.split('\\')[query.split('\\').length - 1])]
  }
  const onEnter = async (query, item, setInput) => {
    if (item._path === currentDirectoryPath){
      return tools.openExternal('C:\\' + query)
    }
    const isPathToFile = await isFile(item._path)
    if (isPathToFile) {
      return tools.openExternal(item._path)
    }
    return setInput(item._path.split('C:\\').join(`${keyword} `) + '\\')
  }
  return {
    name,
    keyword,
    queryResults,
    onEnter
  }
}