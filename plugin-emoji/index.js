
const request = require('request-promise')

const url = query => `https://www.emojidex.com/api/v1/search/emoji?code_cont=${query}`

const getEmojiList = query => request(url(query))
  .then(resp => {
    return JSON.parse(resp).emoji.filter(e => e.moji).map(item=> ({
      emoji: item.moji,
      name: item.code
    }))
  })

/*****************************************************/
const name = 'Emoji'
const keyword = 'emoji'

const queryResults = async query => {
  const words = await getEmojiList(query)
  
  return words.map( word => ({
    /* path: word, */
    value: `${word.emoji} ${word.name}`,
    icon: ''
  }))
}

exports.plugin = tools => {

  const onEnter = async (query, item, setInput) => {
    tools.copy(item.value.split(' ')[0])
    setInput('')
  }
  return {
    name,
    keyword,
    onEnter,
    queryResults
  }
}
