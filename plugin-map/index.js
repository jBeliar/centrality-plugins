const name = 'Maps'
const keyword = 'map'


exports.plugin = (tools, config) => {
  const preview = query => {
    if (!query) {
      return
    }
    return `
    <iframe
      width="100%"
      height="410px"
      frameborder="0" style="border:0"
      src="https://www.google.com/maps/embed/v1/place?key=${config.key}&q=${query}&maptype=satellite" allowfullscreen>
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