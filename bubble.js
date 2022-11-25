export default {
  type: 'bubble',
  header: {
    type: 'box',
    layout: 'vertical',
    contents: []
  },
  hero: {
    type: 'image',
    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
    size: 'full',
    aspectRatio: '18:11',
    aspectMode: 'fit'
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Brown Cafe',
        weight: 'bold',
        size: 'xl'
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '開放認養時間:',
                size: 'sm',
                flex: 0,
                color: '#888888'
              },
              {
                type: 'text',
                text: '2022-11-23',
                size: 'md',
                margin: 'xxl',
                wrap: true
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'text',
                text: '認養狀態:',
                size: 'sm',
                flex: 0,
                color: '#888888'
              },
              {
                type: 'text',
                text: '已開放',
                margin: 'lg',
                size: 'md',
                align: 'center'
              }
            ]
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '是否絕育:',
                size: 'sm',
                flex: 0,
                color: '#888888'
              },
              {
                type: 'text',
                text: 'hello, world',
                margin: 'lg',
                align: 'center'
              }
            ]
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '我在:',
                size: 'sm',
                flex: 0,
                color: '#888888'
              },
              {
                type: 'text',
                size: 'xs',
                text: '高雄市壽山動物保護教育園區',
                offsetStart: 'none',
                offsetEnd: 'none',
                align: 'center'
              }
            ],
            margin: 'sm'
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: '地址:',
                size: 'sm',
                flex: 0,
                color: '#888888'
              },
              {
                type: 'text',
                size: 'xs',
                text: '高雄市壽山動物保護教育園區',
                offsetStart: 'none',
                offsetEnd: 'none',
                align: 'center'
              }
            ]
          }
        ]
      },
      {
        type: 'box',
        layout: 'vertical',
        margin: 'xs',
        spacing: 'sm',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'separator',
                margin: 'lg',
                color: '#FF7F50'
              },
              {
                type: 'text',
                text: '藍胸背，雙耳嚴重發炎耳膿，< 收容編號111072903將於111.11.4(五)開放認養 > 欲認養者，請於早上10:00-10:10，攜帶身分證件(需年滿20歲且無棄養紀錄或違反動保法等)至臨櫃登記，完成登記者，始得參與認養，若登記人數為兩位以上（含），將進行抽籤程序。 註：中籤者攜帶動物離開時，請自備犬隻專用牽繩或胸背帶、運輸籠等。',
                wrap: true,
                size: 'sm',
                margin: 'sm'
              },
              {
                type: 'separator',
                margin: 'sm',
                color: '#FF7F50'
              }
            ],
            margin: 'none'
          }
        ]
      }
    ]
  },
  footer: {
    type: 'box',
    layout: 'vertical',
    spacing: 'sm',
    contents: [{
      type: 'button',
      style: 'link',
      height: 'sm',
      action: {
        type: 'postback',
        label: '複製我的資訊',
        data: 'hello',
        inputOption: 'openKeyboard',
        fillInText: '---\nName: \nPhone: \nBirthday: \n---'
      }
    }],
    flex: 0
  }
}
