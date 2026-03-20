import { createWidget, widget, align, prop } from '@zos/ui'
import { back } from '@zos/router'
import { px } from '@zos/utils'

const W = 390, H = 390
const TIMES = [10, 15, 20, 25]
const DEFAULT_INDEX = 0
const ITEM_H = 190
const CONTAINER_H = H - 50
const PADDING = Math.floor((CONTAINER_H - ITEM_H) / 2)

let currentIndex = DEFAULT_INDEX
let itemBgs = []
let itemTexts = []

function refreshItems(index) {
  if (index === currentIndex) return
  currentIndex = index
  itemBgs.forEach((bg, i) => {
    bg.setProperty(prop.COLOR, i === currentIndex ? 0xffffff : 0xcccccc)
  })
  itemTexts.forEach((txt, i) => {
    txt.setProperty(prop.COLOR, i === currentIndex ? 0x000000 : 0x666666)
  })
}

Page({
  build() {
    currentIndex = DEFAULT_INDEX
    itemBgs = []
    itemTexts = []

    const container = createWidget(widget.VIEW_CONTAINER, {
      x: px(0),
      y: px(0),
      w: px(W),
      h: px(CONTAINER_H),
      scroll_enable: true,
      scroll_frame_func: (params) => {
        const scrolled = Math.abs(params.yoffset)
        const index = Math.min(Math.max(Math.round(scrolled / ITEM_H), 0), TIMES.length - 1)
        refreshItems(index)
      },
    })

    TIMES.forEach((t, i) => {
      const isSelected = i === currentIndex
      const y = PADDING + i * ITEM_H

      const bg = container.createWidget(widget.FILL_RECT, {
        x: px(45), y: px(y + 10),
        w: px(300), h: px(ITEM_H - 20),
        radius: px(30),
        color: isSelected ? 0xffffff : 0xcccccc,
      })

      const txt = container.createWidget(widget.TEXT, {
        x: px(45), y: px(y + 10),
        w: px(300), h: px(ITEM_H - 20),
        text: t + ' 分钟',
        text_size: px(32),
        color: isSelected ? 0x000000 : 0x666666,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
      })

      itemBgs.push(bg)
      itemTexts.push(txt)
    })

    // 透明占位卡片
    const extraCount = Math.ceil(PADDING / ITEM_H)
    for (let i = 0; i < extraCount; i++) {
      container.createWidget(widget.FILL_RECT, {
        x: px(45), y: px(PADDING + TIMES.length * ITEM_H + i * ITEM_H + 10),
        w: px(300), h: px(ITEM_H - 20),
        radius: px(30),
        color: 0x00000000,
      })
    }

    createWidget(widget.BUTTON, {
      x: px(30), y: px(H - 30),
      w: px(330), h: px(80),
      radius: px(30),
      normal_color: 0x5050cc,
      press_color: 0x6060ee,
      text: '确认',
      text_size: px(24),
      color: 0xffffff,
      click_func: () => {
        globalThis.__selectedIndex = currentIndex
        back()
      },
    })
  }
})
