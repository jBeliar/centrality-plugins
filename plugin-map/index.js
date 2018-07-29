const name = 'Maps'
const keyword = 'map'


exports.plugin = (tools, config) => {
  const preview = query => {
    if (!query) {
      return
    }
    return `
    <iframe src="https://www.google.com/maps/embed/v1/place?key=${config.key}&q=${query}&maptype=satellite">
    </iframe>
    `
  }
  return {
    name,
    keyword,
    preview,
  }
}
exports.id = 'map'