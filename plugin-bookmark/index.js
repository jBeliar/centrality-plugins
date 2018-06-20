const { flattenDeep } = require('lodash')

const chromeImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNrs1DESgCAQQ1Hw/nf43hQbCwtQZLPaJDM0zIZ5zVLLOK1oU3uXW/k5BhhggAEGGGCAAQYYEAXs50lJezhcZpmYlwLozPMVgJsO2QAmemQBeNFFDWChjwpAYJOIAhCsM6sAhH/K8K1DgAEArhFVVCT2FpEAAAAASUVORK5CYII="

let bookmarks;
const name = 'Bookmarks'
const keyword = 'b'

const objBookmarksToArray = children => {
  return children.map( child => {
    if (child.type === 'folder') {
      return objBookmarksToArray(child.children)
    } else if (child.type === 'url') {
      return {
        value: child.name,
        path: child.url,
        icon: chromeImg
      }
    }
  })
}

exports.plugin = (tools, config) => {
  const onEnter = (query, item) => {
    tools.openExternal(item.path)  
  }

  const init = async () => {
    const bookmarksJSON = await tools.loadJsonAsync(config.url)
    const nestedBookmarks = bookmarksJSON.roots.bookmark_bar.children;
    bookmarks = flattenDeep(objBookmarksToArray(nestedBookmarks))
  }

  const queryResults = query => {
    return tools.filterList(bookmarks, query)
  }

  return {
    name,
    keyword,
    init,
    queryResults,
    onEnter
  }
}
exports.id = 'bookmark'