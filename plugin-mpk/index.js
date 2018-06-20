

/*****************************************************/
const name = 'mpk'
const keyword = 'mpk'

const preview = async (query, item, setInput) => {
  return `<iframe src="http://www.rozkladzik.pl/krakow/" style="height:500px;width:680px;"></iframe>`  
}

exports.plugin = tools => {
  return {
    name,
    keyword,
    preview
  }
}
