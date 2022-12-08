import 'dotenv/config'
import linebot from 'linebot'
import axios from 'axios'
// import fs from 'fs'

// import dd from './json/test.js'

import bubble from './bubble.js'
import express from 'express'
import wakeUpDyno from './wakeUpDyno.js'
const app = express()
// import { scheduleJob } from 'node-schedule'
// import animalList from './json/animalList.js'

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
//* *******
const get = async () => {
  try {
    const { data } = await axios.get('https://')
    console.log(data)
  } catch (error) {
    return Error(error)
  }
}
const run = async () => {
  try {
    await get()
    console.log('get success')
  } catch (error) {
    console.log(error)
  }
}
run()

// 1.建立一個整理過的資料
const bubbles = []

let todayData

const init = async () => {
  try {
    // {data} 直接把物件的key是data的取出來
    const { data } = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=2000&$skip=0')
    const msg = data.map(animal => {
      const out = {}
      out.img = animal.album_file
      out.size = animal.animal_bodytype === 'SMALL' ? '小型' : (animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型')
      out.color = animal.animal_colour
      out.variety = (animal.animal_Variety.includes('混種貓') || (animal.animal_Variety.includes('混種犬')) || (animal.animal_Variety.includes('混種狗'))) ? '米克斯' : animal.animal_Variety.trim()
      out.gender = animal.animal_sex === 'M' ? '公' : (animal.animal_sex === 'F' ? '母' : '未輸入')
      out.kind = animal.animal_kind === '狗' ? '犬' : (animal.animal_kind === '貓' ? '貓' : '其他')
      // 此id為收容編號
      out.id = animal.animal_subid
      out.place = animal.animal_place
      out.add = animal.shelter_address
      out.tel = animal.shelter_tel

      // 11/25新增資訊
      // out.webId = animal.animal_id
      out.sterilization = animal.animal_sterilization === 'T' ? '已絕育' : (animal.animal_sterilization === 'F' ? '未絕育' : '未輸入')
      out.status = animal.animal_status === 'OPEN' ? '開放認養' : animal.animal_status === 'ADOPTED' ? '已認養' : animal.animal_status === 'OTHER' ? '其他' : animal.animal_status === 'NONE' ? '未公告' : '回天堂了..'
      out.opendate = animal.animal_opendate === '' ? '時間未定' : animal.animal_opendate
      out.remark = animal.animal_remark === '' ? '無資料備註' : animal.animal_remark
      return out
    })
    todayData = msg
    console.log('init OK' + todayData.length)
  } catch (err) {
    return Error(err)
  }
}
init()

// // 抓當下資料並廣播
// const broadcast = async () => {
//   // 抓當下資料並更新
//   await init()
//   // const data = dd
//   // fs.writeFileSync('test.json', JSON.stringify(data))

//   // 判斷黃金獵犬
//   // const animalVariety = dd.filter((it) => {
//   //   return it.animal_Variety === '黃金獵犬'
//   // })

//   // 判斷顏色 .map把資料做加工辨識
//   // const newList = dd.map((animal) => {
//   //   return animal.animal_colour
//   // })
//   // console.log(newList)
//   // const total

//   // const newList = dd.map((animal) => {
//   //   const out = {}
//   //   out.c = animal.animal_colour
//   //   out.kind = animal.animal_kind === '貓' ? '貓咪' : '狗狗'
//   //   return out
//   // })
//   // console.log(newList)

//   // 全國動物收容管理系統 :https://asms.coa.gov.tw/Amlapp/App/Default.aspx
//   // const msg = data.map(animal => {
//   //   const out = {}
//   //   out.img = animal.album_file
//   //   out.size = animal.animal_bodytype === 'SMALL' ? '小型' : (animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型')
//   //   out.color = animal.animal_colour
//   //   out.variety = (animal.animal_Variety === '混種貓' || (animal.animal_Variety === '混種犬')) ? '米克斯' : animal.animal_Variety
//   //   out.gender = animal.animal_sex === 'M' ? '公' : (animal.animal_sex === 'F' ? '母' : '未輸入')
//   //   out.kind = animal.animal_kind === '狗' ? '犬' : (animal.animal_kind === '貓' ? '貓' : '其他')
//   //   // 此id為收容編號
//   //   out.id = animal.animal_subid
//   //   out.place = animal.animal_place
//   //   out.add = animal.shelter_address
//   //   out.tel = animal.shelter_tel
// 11/25新增資訊
// out.webId = animal.animal_id
// out.sterilization = animal.animal_sterilization === 'T' ? '已絕育' : (animal.animal_sterilization === 'F' ? '未絕育' : '未輸入')
// out.status = animal.animal_status === 'OPEN' ? '開放認養' : animal.animal_status === 'ADOPTED' ? '已認養' : animal.animal_status === 'OTHER' ? '其他' : animal.animal_status === 'NONE' ? '未公告' : '回天堂了..'
// out.opendate = animal.animal_opendate
// out.remark = animal.animal_remark
//
//   //   return out
//   // })

//   // fs.writeFileSync('animalList.json', JSON.stringify(msg))
//   // 4.把3移進來 才會一起等
//   // 3.陣列裝bubble 並把2放進來
//   bubbles.length = 0
//   // 隨機號碼0~999 最大999
//   const r = Math.floor(Math.random() * 100)
//   for (let i = r; i < (r + 12); i++) {
//     let it = i
//     if (i > 100) {
//       it = i - 100
//     }
//     // console.log(it)
//     const animal = todayData[it]
//     // console.log(animal.size + animal.color + animal.variety + animal.gender + animal.kind)
//     // console.log(animal.place)
//     // console.log(animal.add)
//     const out = JSON.parse(JSON.stringify(bubble))
//     out.hero.url = animal.img || 'https://i.imgur.com/yfhkJ0F.jpg'

//     out.body.contents[0].text = (animal.size + animal.color + animal.variety + animal.gender + animal.kind)

//     out.body.contents[1].contents[0].contents[1].text = animal.place
//     out.body.contents[1].contents[1].contents[1].text = animal.add

//     const copyText = `---
// \n我的小名:${animal.size + animal.color + animal.variety + animal.gender + animal.kind}\n收容編號:${animal.id}
// \n收容所名稱:${animal.place}  \n收容所電話:${animal.tel} \n收容所地址:${animal.add} \n---`

//     out.footer.contents[0].action.fillInText = copyText

//     const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${animal.webId}&AcceptNum=${animal.id}&PageType=Adopt`
//     out.footer.contents[1].action.uri = web
//     out.hero.action.uri = web
//     bubbles.push(out)
//   }
//   // fs.writeFileSync('tt2.json', JSON.stringify(bubbles))

//   bot.broadcast([
//     // { type: 'text', text: '目前是ngrok測試' },
//     { type: 'text', text: '早安~我們來啦~~~' },
//     {
//       type: 'flex',
//       altText: '毛孩推播~',
//       contents: {
//         type: 'carousel',
//         contents: bubbles
//       }
//     }

//   ]
//   )
// }

// scheduleJob(
//   ' 00 08 1 * *', broadcast
// )

// -------------毛孩顏色-------------

// -------------------------------------------------------5.輸入條件搜尋--------------------------------------------------------

bot.on('message', async (e) => {
  if (e.message.type !== 'text') return
  // ----2個字回應
  try {
    if (e.message.text.length === 2 && e.message.type === 'text') {
      await init()
      bubbles.length = 0
      // 隨機號碼0~999 最大999
      const r = Math.floor(Math.random() * 100)
      for (let i = r; i < (r + 12); i++) {
        let it = i
        if (i > 100) {
          it = i - 100
        }
        // console.log(it)
        const animal = todayData[it]
        const out = JSON.parse(JSON.stringify(bubble))
        out.hero.url = animal.img || 'https://i.imgur.com/yfhkJ0F.jpg'

        out.body.contents[0].text = (animal.size + animal.color + animal.variety + animal.gender + animal.kind)

        // 11/25新增資訊
        // 開放認養時間
        out.body.contents[1].contents[0].contents[1].text = animal.opendate
        // 是否開放認養
        out.body.contents[1].contents[1].contents[1].text = animal.status

        // 絕育
        out.body.contents[1].contents[2].contents[1].text = animal.sterilization

        // 收容所
        out.body.contents[1].contents[3].contents[1].text = animal.place
        // 收容所地址
        out.body.contents[1].contents[4].contents[1].text = animal.add
        // 備註
        out.body.contents[2].contents[0].contents[1].text = (`收容編號:${animal.id}
        ${animal.remark}
        `)

        const copyText = `---
      \n我的小名:${animal.size + animal.color + animal.variety + animal.gender + animal.kind}\n收容編號:${animal.id}\n開放認養時間:${animal.opendate}
      \n收容所名稱:${animal.place}  \n收容所電話:${animal.tel} \n收容所地址:${animal.add} \n---`

        out.footer.contents[0].action.fillInText = copyText

        // 11/25等之後新網站有更新我在調整
        // const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${animal.webId}&AcceptNum=${animal.id}&PageType=Adopt`
        // out.footer.contents[1].action.uri = web
        // out.hero.action.uri = web
        bubbles.push(out)
        // console.log(bubbles)
      }
      // fs.writeFileSync('test.json', JSON.stringify(bubbles))
      console.log(e.message.text)
      // console.log(bubble)
      e.reply([
        { type: 'text', text: `${e.message.text}，我們來囉~` },
        {
          type: 'flex',
          altText: '隨機12隻毛孩',
          contents: {
            type: 'carousel',
            contents: bubbles
          }
        }
      ])

      return
    }
    if (e.message.text.length > 2 && e.message.type === 'text') {
      // !讓網址就過濾的資料
      // 中型/黑/貓/新北市
      // 1.體型 animal_bodytype /顏色 animal_colour /種類 animal_kind /地址 shelter_address
      // 2.網址轉碼 encodeURI編碼 (中文轉成UTF-8) ，decodeURI(UTF-8轉中文)
      // 3.放入搜尋
      const searchText = e.message.text.split(['/'])
      // console.log(searchText[0])
      // console.log(searchText[1])
      // console.log(searchText[2])
      // console.log(searchText[3])
      const bodyType = searchText[0] === '小型' ? 'SMALL' : searchText[0] === '中型' ? 'MEDIUM' : 'BIG'

      // 編碼的使用例子 const encodedStr = encodeURI('這是中文字串')
      const encoded0 = encodeURI(bodyType)
      const encoded1 = encodeURI(searchText[1])
      const encoded2 = encodeURI(searchText[2])

      const Http = `https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=3000&$skip=0&animal_bodytype=${encoded0}&animal_colour=${encoded1}&animal_kind=${encoded2}`
      // console.log(Http)

      // {data} 直接把物件的key是data的取出來
      const { data } = await axios.get(`${Http}`)
      const msg = data.map(animal => {
        const out = {}
        out.img = animal.album_file
        out.size = animal.animal_bodytype === 'SMALL' ? '小型' : (animal.animal_bodytype === 'MEDIUM' ? '中型' : '大型')
        out.color = animal.animal_colour
        out.variety = (animal.animal_Variety.includes('混種貓') || (animal.animal_Variety.includes('混種犬')) || (animal.animal_Variety.includes('混種狗'))) ? '米克斯' : animal.animal_Variety.trim()
        out.gender = animal.animal_sex === 'M' ? '公' : (animal.animal_sex === 'F' ? '母' : '未輸入')
        out.kind = animal.animal_kind === '狗' ? '犬' : (animal.animal_kind === '貓' ? '貓' : '其他')
        // 此id為收容編號
        out.id = animal.animal_subid
        out.place = animal.animal_place
        out.add = animal.shelter_address
        out.tel = animal.shelter_tel
        // 11/25新增資訊
        // out.webId = animal.animal_id
        out.sterilization = animal.animal_sterilization === 'T' ? '已絕育' : (animal.animal_sterilization === 'F' ? '未絕育' : '未輸入')
        out.status = animal.animal_status === 'OPEN' ? '開放認養' : animal.animal_status === 'ADOPTED' ? '已認養' : animal.animal_status === 'OTHER' ? '其他' : animal.animal_status === 'NONE' ? '未公告' : '回天堂了..'
        out.opendate = animal.animal_opendate === '' ? '時間未定' : animal.animal_opendate
        out.remark = animal.animal_remark === '' ? '無資料備註' : animal.animal_remark
        return out
      })
      // 將包含過濾過資料的物件更新進todayData
      todayData = msg

      bubbles.length = 0
      // -------------------新增過濾 純色搜尋--------------------------------------------------------

      // -------------------新增地址 shelter_address搜尋--------------------------------------------------------
      const write = todayData.filter(texts => {
        return new RegExp(searchText[3]).test(texts.add) && searchText[1].length + 1 === texts.color.length
        // new RegExp(searchText[3]).test(texts.add)
      }
      )
      // console.log(todayData) // ngrok 有
      console.log(e.message.text)// ngrol 有
      // console.log(write) // ngrol 有
      // console.log(typeof e.message.text)// ngrol 有
      // console.log(write.length)
      // --------------------------用write.length的長度=0 --------------------------------------------------
      if (write.length === 0) {
        // fs.writeFileSync('test.json', JSON.stringify(bubbles))
        e.reply(
          {
            type: 'text',
            text: `建議更改體型或顏色再搜尋看看，
沒有您搜尋的毛孩喔~`
          })
        return
      }
      // --------------------------用write.length的長度 <=12 --------------------------------------------------
      if (write.length <= 12) {
        for (let i = 0; i < write.length; i++) {
          const out = JSON.parse(JSON.stringify(bubble))
          out.hero.url = write[i].img || 'https://i.imgur.com/yfhkJ0F.jpg'

          out.body.contents[0].text = (write[i].size + write[i].color + write[i].variety + write[i].gender + write[i].kind)
          // 11/25新增資訊
          // 開放認養時間
          out.body.contents[1].contents[0].contents[1].text = write[i].opendate
          // 是否開放認養
          out.body.contents[1].contents[1].contents[1].text = write[i].status

          // 絕育
          out.body.contents[1].contents[2].contents[1].text = write[i].sterilization

          // 收容所
          out.body.contents[1].contents[3].contents[1].text = write[i].place
          // 收容所地址
          out.body.contents[1].contents[4].contents[1].text = write[i].add
          // 備註
          out.body.contents[2].contents[0].contents[1].text = (`收容編號:${write[i].id}
          ${write[i].remark}
          `)

          const copyText = `---
      \n我的小名:${write[i].size + write[i].color + write[i].variety + write[i].gender + write[i].kind}\n收容編號:${write[i].id}\n開放認養時間:${write[i].opendate}
      \n收容所名稱:${write[i].place}  \n收容所電話:${write[i].tel} \n收容所地址:${write[i].add} \n---`

          out.footer.contents[0].action.fillInText = copyText
          // 11/25等之後新網站有更新我在調整
          // const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${write[i].webId}&AcceptNum=${write[i].id}&PageType=Adopt`
          // out.footer.contents[1].action.uri = web
          // out.hero.action.uri = web
          bubbles.push(out)
          // fs.writeFileSync('test.json', JSON.stringify(bubbles))
          console.log(bubbles)
          // console.log(write.length)
        } e.reply(([
          { type: 'text', text: `搜尋到${write.length}隻毛孩喔~` },
          {
            type: 'flex',
            altText: `查詢${searchText[0] + searchText[1] + searchText[2] + (searchText[3] || '')} 的毛孩`,
            contents: {
              type: 'carousel',
              contents: bubbles
            }
          }
        ]))
        return
      }
      // console.log(searchText[0])
      // console.log(searchText[1])
      // console.log(searchText[2])
      // console.log(searchText[3])
      // --------------------------用write.length的長度取隨機數 >12 --------------------------------------------------

      if (write.length > 12) {
        // 如果write.length=13
        //  舉例1.(0.01*13)=0.13，無條件捨去 index=0
        //  舉例2.(0.99*13)=12.9，無條件捨去 index=12
        const index = Math.floor(Math.random() * write.length)
        // console.log(index)

        for (let i = index; i < (index + 12); i++) {
          // 1. i=0 ;i<(0+12);i++ =>0,1,2,3,4,5,6,7,8,9,10,11
          // 2. i=12 ;i<(12+12);i++=>12,13,14,15,16,17,18,19,20,21,22,23 (爆了)
          let it = i
          // 2. 如果i=13 -> >=13 ->13-13 =>it=0
          // 2. 如果i=14 -> >=13 ->14-13 =>it=1
          if (i >= (write.length)) {
            it = i - index
          }
          // console.log(it)
          const num = write[it]
          // console.log(num)
          const out = JSON.parse(JSON.stringify(bubble))
          out.hero.url = num.img || 'https://i.imgur.com/yfhkJ0F.jpg'

          out.body.contents[0].text = (num.size + num.color + num.variety + num.gender + num.kind)

          // 11/25新增資訊
          // 開放認養時間
          out.body.contents[1].contents[0].contents[1].text = num.opendate
          // 是否開放認養
          out.body.contents[1].contents[1].contents[1].text = num.status

          // 絕育
          out.body.contents[1].contents[2].contents[1].text = num.sterilization

          // 收容所
          out.body.contents[1].contents[3].contents[1].text = num.place
          // 收容所地址
          out.body.contents[1].contents[4].contents[1].text = num.add
          // 備註
          out.body.contents[2].contents[0].contents[1].text = (`收容編號:${num.id}
          ${num.remark}
          `)

          const copyText = `---
      \n我的小名:${num.size + num.color + num.variety + num.gender + num.kind}\n收容編號:${num.id}\n開放認養時間:${num.opendate}
      \n收容所名稱:${num.place}  \n收容所電話:${num.tel} \n收容所地址:${num.add} \n---`

          out.footer.contents[0].action.fillInText = copyText

          // 11/25等之後新網站有更新我在調整
          // const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${num.webId}&AcceptNum=${num.id}&PageType=Adopt`
          // out.footer.contents[1].action.uri = web
          // out.hero.action.uri = web
          bubbles.push(out)
          // console.log(write.length)
          // console.log(bubbles)
        } e.reply(([
          {
            type: 'text', text: `搜尋到${write.length}隻毛孩喔~
這是其中12隻喔~`
          },
          {
            type: 'flex',
            altText: `查詢${searchText[0] + searchText[1] + searchText[2] + (searchText[3] || '')} 的毛孩`,

            contents: {
              type: 'carousel',
              contents: bubbles
            }
          },
          {
            type: 'template',
            altText: `查詢${searchText[0] + searchText[1] + searchText[2] + (searchText[3] || '')} 的毛孩`,
            template: {
              type: 'confirm',
              text: '再隨機12隻',
              actions: [
                {
                  type: 'message',
                  label: '好',
                  text: `${searchText[0] + '/' + searchText[1] + '/' + searchText[2] + '/' + (searchText[3] || '')
                    }`
                },
                {
                  type: 'postback',
                  label: '先不用',
                  data: '1'
                }
              ]
            }
          }
        ]))
      }
      // ngrok http 3000 --region jp
      //       {
      //         if (write) {
      //           const out = JSON.parse(JSON.stringify(bubble))
      //           out.hero.url = write.img || 'https://i.imgur.com/yfhkJ0F.jpg'

      //           out.body.contents[0].text = (write.size + write.color + write.variety + write.gender + write.kind)

      //           out.body.contents[1].contents[0].contents[1].text = write.place
      //           out.body.contents[1].contents[1].contents[1].text = write.add

      //           const copyText = `-- -
      // \n我的小名:${write.size + write.color + write.variety + write.gender + write.kind}\n收容編號:${write.id}
      // \n收容所名稱:${write.place}  \n收容所電話:${write.tel} \n收容所地址:${write.add} \n---`

      //           out.footer.contents[0].action.fillInText = copyText

      //           const web = `https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=${write.webId}&AcceptNum=${write.id}&PageType=Adopt`
      //           out.footer.contents[1].action.uri = web
      //           out.hero.action.uri = web
      //           // console.log(out) // ngrol 有
      //           bubbles.push(out)
      //           e.reply(([
      //             { type: 'text', text: e.message.text },
      //             {
      //               type: 'flex',
      //               altText: '查詢~',
      //               contents: {
      //                 type: 'carousel',
      //                 contents: bubbles
      //               }
      //             }
      //           ]))
      //         } else {
      //           e.reply('毛孩可能被領養囉~請找別隻喔~')
      //         }
      //       }
    }
  } catch (error) {
    console.log(error)
    e.reply('政府開放資料在更新請稍晚再試~')
  }
})

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

//   const copyText = `-- -
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

// 自動喚醒避免heroku睡眠，我才能半夜抓剛好整天的資料 (上網找的方法)
const linebotParser = bot.parser()
app.post('/linewebhook', linebotParser)
// app.listen(4001, () => {
//   wakeUpDyno(process.env.WAKEUP_URL) // will start once server starts
// })
app.post('/', () => {
  wakeUpDyno(process.env.WAKEUP_URL)
  console.log('機器人啟動')
})
app.listen()
app.listen(process.env.PORT || 3000)
// app.listen('/', process.env.PORT || 3000, () => {
//   console.log('機器人啟動')
// })
// https://true.onrender.com/linewebhook

// ,
// {
//   type: 'button',
//   style: 'link',
//   height: 'sm',
//   action: {
//     type: 'uri',
//     label: '我的網站',
//     uri: ''
//   }
// }
// https://asms.coa.gov.tw/Amlapp/App/AnnounceList.aspx?Id=282171&AcceptNum=1111103C10&PageType=Adopt
