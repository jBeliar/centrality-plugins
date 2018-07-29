

/*****************************************************/
const name = 'mpk'
const keyword = 'mpk'

const preview = async (query, item, setInput) => {
  return `<iframe src="http://www.rozkladzik.pl/krakow/"></iframe>`  
}

exports.plugin = tools => {
  return {
    name,
    keyword,
    preview
  }
}
