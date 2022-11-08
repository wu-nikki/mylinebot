import 'dotenv/config'
import linebot from 'linebot'
// import axios from 'axios'
// import fs from 'fs'

import dd from './json/test.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const a = async () => {
  // const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=100&$skip=0')
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
  const msg = dd.map((animal) => {
    const out = {}
    out.img = animal.album_file
    out.size = animal.animal_bodytype === 'SMALL' ? '小型' : (animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型')
    out.color = animal.animal_colour
    out.variety = (animal.animal_Variety === '混種貓' || (animal.animal_Variety === '混種狗')) ? '米克斯' : animal.animal_Variety
    out.gender = animal.animal_sex === 'M' ? '公' : (animal.animal_sex === 'F' ? '母' : '未輸入')
    out.kind = animal.animal_kind === '狗' ? '犬' : '貓'
    out.place = animal.animal_place
    out.add = animal.shelter_address
    out.tel = animal.shelter_tel
    return out
  })
  console.log(msg)
}
a()

bot.listen('/', process.env.PORT || 3000, () => {
  console.log('機器人啟動')
})
