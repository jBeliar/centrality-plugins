const postScript = `
setTimeout(() => {
  document.querySelector('webview').executeJavaScript(\`
    const script = document.createElement('script');
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = () => {
      $('#wob_wc').show().parentsUntil('body').andSelf().siblings().hide(1);
      document.querySelector('#center_col').style.margin = 0;
      document.querySelector('#cnt').style.padding = 0;
      document.body.style.overflow = 'hidden';
      document.getElementById('footcnt').remove()
    }
  \`)   
})`

/*****************************************************/
const name = 'Weather'
const keyword = 'weather'

exports.plugin = (tools, config) => {
  const preview = async (query, item, setInput) => {
    const city = query ? query : config.defaultCity
    return Promise.resolve(`<webview src="https://www.google.pl/search?q=pogoda+${city}" style="height:500px;"></webview>`)
      .then(content => {
        eval(postScript)
        return content
      })
  }
  return {
    name,
    keyword,
    preview
  }
}
exports.id = 'weather'