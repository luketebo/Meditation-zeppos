import { createWidget, widget } from '@zos/ui'
import { back } from '@zos/router'
import { px } from '@zos/utils'

const CARD_INFO = [
  { label: '10 分钟', desc: '自然呼吸', color: 0x6f9fff },
  { label: '15 分钟', desc: '森林放松', color: 0x7dd596 },
  { label: '20 分钟', desc: '波浪声', color: 0xfe9f5a },
  { label: '25 分钟', desc: '星空深度', color: 0xa68eff },
]

let currentIndex = Math.min(globalThis.__selectedIndex ?? 0, CARD_INFO.length - 1)

function selectCard(index) {
  if (CARD_INFO && index >= 0 && index < CARD_INFO.length) {
    currentIndex = index
    globalThis.__selectedIndex = index
    console.log('Selected card index:', index, 'time:', CARD_INFO[index].label)
    back()
  }
}

Page({
  build() {
    // 检查 CARD_INFO 是否存在
    if (!CARD_INFO || !Array.isArray(CARD_INFO) || CARD_INFO.length === 0) {
      console.error('CARD_INFO is not properly defined')
      return
    }

    // 背景
    createWidget(widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: px(390),
      h: px(450),
      color: 0x0a0d22,
    })

    // 标题
    createWidget(widget.TEXT, {
      x: px(15),
      y: px(24),
      w: px(360),
      h: px(40),
      text: '选择冥想卡片',
      text_size: px(30),
      color: 0xffffff,
      align_h: 1,
      align_v: 1,
    })

    // 当前选择提示
    const currentCard = CARD_INFO[currentIndex] || CARD_INFO[0]
    createWidget(widget.TEXT, {
      x: px(15),
      y: px(64),
      w: px(360),
      h: px(30),
      text: `当前：${currentCard.label}`,
      text_size: px(20),
      color: 0xcccccc,
      align_h: 1,
      align_v: 1,
    })

    // 创建滚动列表 - 使用正确的 Zepp OS API
    const scrollList = createWidget(widget.SCROLL_LIST, {
      x: px(0),
      y: px(100),
      w: px(390),
      h: px(290),
      item_height: px(140),
      item_space: px(10),
      data_array: CARD_INFO,
      data_count: CARD_INFO.length,
      data_type_config: [{
        start: 0,
        end: CARD_INFO.length - 1,
        type_id: 1
      }],
      data_type_config_count: 1,
      on_page: 1,
      item_click_func: (item, index) => {
        selectCard(index)
      },
      item_render_func: (item, index) => {
        const card = CARD_INFO[index]
        const selected = currentIndex === index

        return {
          x: px(20),
          y: px(10),
          w: px(350),
          h: px(120),
          radius: px(20),
          text: `${card.label}\n${card.desc}`,
          text_size: px(22),
          color: selected ? 0x000000 : 0xffffff,
          normal_color: selected ? 0xffffff : card.color,
          press_color: selected ? 0xd8d8d8 : 0x999999,
          align_h: 1,
          align_v: 1,
        }
      }
    })

    // 吸底回到顶部按钮
    createWidget(widget.BUTTON, {
      x: px(20),
      y: px(400),
      w: px(350),
      h: px(50),
      radius: px(25),
      text: '回到顶部',
      text_size: px(20),
      color: 0xffffff,
      normal_color: 0x333333,
      press_color: 0x555555,
      click_func: () => {
        console.log('回到顶部')
        if (scrollList && scrollList.scrollTo) {
          scrollList.scrollTo(0)
        }
      },
      align_h: 1,
      align_v: 1,
    })
  }
})
