import 'dotenv/config'
import linebot from 'linebot'
import axios from 'axios'
// import fs from 'fs'

// import dd from './json/test.js'

import bubble from './bubble.js'
import { scheduleJob } from 'node-schedule'
// import animalList from './json/animalList.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 1.建立一個整理過的資料
const bubbles = []
const a = async () => {
  const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=1000&$skip=0')
  // const data = dd
  // fs.writeFileSync('test.json', JSON.stringify(data))

  // 判斷黃金獵犬
  // const animalVariety = dd.filter((it) => {
  //   return it.animal_Variety === '黃金獵犬'
  // })

  // 判斷顏色 .map把資料做加工辨識
  // const newList = dd.map((animal) => {
  //   return animal.animal_colour
  // })
  // console.log(newList)
  // const total

  // const newList = dd.map((animal) => {
  //   const out = {}
  //   out.c = animal.animal_colour
  //   out.kind = animal.animal_kind === '貓' ? '貓咪' : '狗狗'
  //   return out
  // })
  // console.log(newList)

  // 全國動物收容管理系統 :https://asms.coa.gov.tw/Amlapp/App/Default.aspx
  const msg = data.map(animal => {
    const out = {}
    out.img = animal.album_file
    out.size = animal.animal_bodytype === 'SMALL' ? '小型' : (animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型')
    out.color = animal.animal_colour
    out.variety = (animal.animal_Variety === '混種貓' || (animal.animal_Variety === '混種狗')) ? '米克斯' : animal.animal_Variety
    out.gender = animal.animal_sex === 'M' ? '公' : (animal.animal_sex === 'F' ? '母' : '未輸入')
    out.kind = animal.animal_kind === '狗' ? '犬' : '貓'
    out.id = animal.animal_subid
    out.place = animal.animal_place
    out.add = animal.shelter_address
    out.tel = animal.shelter_tel
    out.webId = animal.animal_id
    return out
  })
  // fs.writeFileSync('animalList.json', JSON.stringify(msg))
  // 4.把3移進來 才會一起等
  // 3.陣列裝bubble 並把2放進來
  bubbles.length = 0
  // 隨機號碼0~999 最大999
  const r = Math.floor(Math.random() * 100)
  for (let i = r; i < (r + 12); i++) {
    let it = i
    if (i > 100) {
      it = i - 100
    } console.log(it)
    const animal = msg[it]
    // console.log(animal.size + animal.color + animal.variety + animal.gender + animal.kind)
    // console.log(animal.place)
    // console.log(animal.add)
    const out = JSON.parse(JSON.stringify(bubble))
    out.hero.url = animal.img || 'https://upload.wikimedia.org/wikipedia/commons/8/83/Solid_white_bordered.svg'

    out.body.contents[0].text = (animal.size + animal.color + animal.variety + animal.gender + animal.kind)

    out.body.contents[1].contents[0].contents[1].text = animal.place
    out.body.contents[1].contents[1].contents[1].text = animal.add

    const copyText = `---
\n我的小名:${animal.size + animal.color + animal.variety + animal.gender + animal.kind}\n收容編號:${animal.id}
\n收容所名稱:${animal.place}  \n收容所電話:${animal.tel} \n收容所地址:${animal.add} \n---`

    out.footer.contents[0].action.fillInText = copyText

    const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${animal.webId}&AcceptNum=${animal.id}&PageType=Adopt`
    out.footer.contents[1].action.uri = web
    bubbles.push(out)
  }
  // fs.writeFileSync('tt2.json', JSON.stringify(bubbles))

  bot.on('message', e => {
    if (e.message.type !== 'text') return
    e.reply([
      { type: 'text', text: e.message.text }])
  })

  bot.broadcast([
    { type: 'text', text: '早安~我們來啦~~~' },
    {
      type: 'flex',
      altText: '毛孩推播~',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    }
  ]
  )
}
scheduleJob(
  ' * 6 * * *', a
)

// https://developers.line.biz/en/reference/messaging-api/#postback-action
// fillInText能複製內容的按鈕

// 3.陣列裝bubble 並把2放進來
// const bubbles = []
// for (let i = 1; i <= 4; i++) {
//   const animal = data[i]
//   console.log(animal.size + animal.color + animal.variety + animal.gender + animal.kind)
//   console.log(animal.place)
//   console.log(animal.add)
//   const out = JSON.parse(JSON.stringify(bubble))
//   out.hero.url = animal.img

//   out.body.contents[0].text = (animal.size + animal.color + animal.variety + animal.gender + animal.kind)

//   out.body.contents[1].contents[0].contents[1].text = animal.place
//   out.body.contents[1].contents[1].contents[1].text = animal.add

//   const copyText = `---
// \n我的小名:${animal.size + animal.color + animal.variety + animal.gender + animal.kind}\n收容編號:${animal.id}
// \n收容所名稱:${animal.place}  \n收容所電話:${animal.tel} \n收容所地址:${animal.add} \n---`

//   out.footer.contents[0].action.fillInText = copyText

//   const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${animal.webId}&AcceptNum=${animal.id}&PageType=Adopt`
//   out.footer.contents[1].action.uri = web

//   bubbles.push(out)
// }

// 2.練習對整理過的資料作處理
// const animal = animalList[0]
// console.log(animal.size + animal.color + animal.variety + animal.gender + animal.kind)
// console.log(animal.place)
// console.log(animal.add)

// bubble.contents.hero.url = animal.img

// bubble.contents.body.contents[0].text = (animal.size + animal.color + animal.variety + animal.gender + animal.kind)

// bubble.contents.body.contents[1].contents[0].contents[1].text = animal.place
// bubble.contents.body.contents[1].contents[1].contents[1].text = animal.add

// const copyText = `---
// \n我的小名:${animal.size + animal.color + animal.variety + animal.gender + animal.kind}\n收容編號:${animal.id}
// \n收容所名稱:${animal.place}  \n收容所電話:${animal.tel} \n收容所地址:${animal.add} \n---`

// bubble.contents.footer.contents[0].action.fillInText = copyText

// const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${animal.webId}&AcceptNum=${animal.id}&PageType=Adopt`
// bubble.contents.footer.contents[1].action.uri = web
// bot.on('message', e => {
//   if (e.message.type !== 'text') return
//   e.reply([
//     { type: 'text', text: e.message.text },
//     {
//       type: 'flex',
//       altText: 'this is a flex message',
//       contents: {
//         type: 'carousel',
//         contents: bubbles
//       }
//     }
//   ])
// })

bot.listen('/', process.env.PORT || 3003, () => {
  console.log('機器人啟動')
})
