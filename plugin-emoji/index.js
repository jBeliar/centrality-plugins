const request = require('request-promise')

const url = query => `https://emoji.getdango.com/api/emoji?q=${query}`

const getEmojiList = query => request(url(query))
  .then(resp => {
    return JSON.parse(resp).results
      .map(item=> ({
        emoji: item.text
      })
    )
  })

/*****************************************************/
const name = 'Emoji'
const keyword = 'emoji'

const queryResults = async query => {
  const words = await getEmojiList(query)
  
  return words.map( word => ({
    /* path: word, */
    value: `${word.emoji}`,
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
