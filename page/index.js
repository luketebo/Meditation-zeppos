import { createWidget, widget, align } from '@zos/ui'
import { push } from '@zos/router'
import { px } from '@zos/utils'

const W = 390, H = 390
const TIMES = [10, 15, 20, 25]

Page({
  build() {
    const selectedIndex = globalThis.__selectedIndex ?? 0
    createWidget(widget.TEXT, {
      x: px(0), y: px(70),
      w: px(W), h: px(50),
      text: '冥想时间',
      text_size: px(38),
      color: 0x888888,
      align_h: align.CENTER_H,
    })

    // createWidget(widget.TEXT, {
    //   x: px(0), y: px(130),
    //   w: px(W), h: px(20),
    //   text: '专注当下，放松身心',
    //   text_size: px(20),
    //   color: 0x888888,
    //   align_h: align.CENTER_H,
    // })

    createWidget(widget.BUTTON, {
      x: px(45), y: px(140),
      w: px(300), h: px(190),
      radius: px(30),
      normal_color: 0xffffff,
      press_color: 0xdddddd,
      text: TIMES[selectedIndex] + ' 分钟',
      text_size: px(44),
      color: 0x000000,
      click_func: () => push({ url: 'page/select' }),
    })

    createWidget(widget.BUTTON, {
      x: px(30), y: px(360),
      w: px(330), h: px(80),
      radius: px(35),
      normal_color: 0x5050cc,
      press_color: 0x6060ee,
      text: '▶  开始冥想',
      text_size: px(33),
      color: 0xffffff,
      click_func: () => {
        push({
          url: 'page/meditation',
          params: JSON.stringify({ minutes: TIMES[globalThis.__selectedIndex ?? 0] }),
        })
      },
    })
  },
})
