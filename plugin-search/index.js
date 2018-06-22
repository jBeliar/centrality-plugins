const icon = 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/search-128.png'
const searches = [
  { value: 'Allegro', path: 'https://allegro.pl/listing?order=qd&&offerTypeBuyNow=1&stan=nowe&string='},
  { value: 'Amazon', path: 'https://www.amazon.com/s?url=search-alias=aps&field-keywords='},
  { value: 'DevDocs', path: 'http://devdocs.io/#q='},
  { value: 'DuckDuckGo', path: 'https://duckduckgo.com/?q='},
  { value: 'DuckDuckGoLucky', path: 'https://duckduckgo.com/?kl=pl-pl&q=!ducky+'},
  { value: 'Giphy', path: 'https://giphy.com/search/'},
  { value: 'GitHub', path: 'https://github.com/search?utf8=%E2%9C%93&q='},
  { value: 'Google', path: 'https://www.google.com/search?q='},
  { value: 'GoogleLucky', path: 'http://www.google.com/webhp?#btnI=I&q='},
  { value: 'GoogleImages', path: 'https://www.google.com/search?tbm=isch&q='},
  { value: 'GoogleMaps', path: 'https://www.google.com/maps?q='},
  { value: 'MozillaDeveloperNetwork', path: 'https://mdn.io/'},
  { value: 'NPM', path: 'https://www.npmjs.com/search?q='},
  { value: "Packagist", path: 'https://packagist.org/search/?q='},
  { value: 'GoogleTranslate', path: 'https://translate.google.com/?text='},
  { value: 'Twitter', path: 'https://twitter.com/search?q='},
  { value: 'StackOverflow', path: 'https://stackoverflow.com/search?q='},
  { value: 'UrbanDictionary', path: 'https://www.urbandictionary.com/define.php?term='},
  { value: 'Wikipedia', path: 'https://pl.wikipedia.org/wiki/Specjalna:Szukaj/'},
  { value: 'WikipediaEng', path: 'https://wikipedia.org/wiki/Special:Search/'},
  { value: 'WolframAlpha', path: 'https://www.wolframalpha.com/input/?i='},
  { value: 'YouTube', path: 'https://www.youtube.com/results?search_query='},
  { value: 'Thingiverse', path: 'http://www.thingiverse.com/search?q='},
]

const _ = string => (string||'').toLowerCase()
const mapSearches = () => searches.map( s => ({
  value: s.value,
  icon
}))

/*****************************************************/
const name = 'Master search'
const keyword = '>'

exports.plugin = tools => {
  const queryResults = async query => {
    const searchName = query.split(' ')[0]
    return tools.filterList(mapSearches(searches), searchName)
  }
  
  const onEnter = async (query, item, setInput) => {
    const searchQuery = query.split(' ').slice(1).join(' ')
    if (item) {
      setInput(`> ${_(item.value)} ${searchQuery}`)
      const search = searches.find(s => _(s.value) === _(item.value))
      searchQuery && tools.openExternal(search.path + searchQuery)
    }
  }
  return {
    name,
    keyword,
    queryResults,
    onEnter
  }
}
