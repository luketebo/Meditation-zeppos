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
    })

    const itemConfig = CARD_INFO.map((card, idx) => ({
      type_id: idx + 1,
      item_height: px(140),
      item_bg_color: card.color,
      item_bg_radius: px(20),
      text_view: [
        { x: px(20), y: px(20), w: px(320), h: px(40), key: 'label', color: 0x000000, text_size: px(26) },
        { x: px(20), y: px(70), w: px(320), h: px(32), key: 'desc', color: 0x111111, text_size: px(20) },
      ],
      text_view_count: 2,
    }))

    // 创建滚动列表 - 按官方 SCROLL_LIST 配置渲染
    const scrollList = createWidget(widget.SCROLL_LIST, {
      x: px(0),
      y: px(100),
      w: px(390),
      h: px(290),
      item_space: px(10),
      item_config: itemConfig,
      item_config_count: itemConfig.length,
      data_array: CARD_INFO,
      data_count: CARD_INFO.length,
      data_type_config: CARD_INFO.map((_, idx) => ({ start: idx, end: idx, type_id: idx + 1 })),
      data_type_config_count: CARD_INFO.length,
      on_page: 1,
      item_click_func: (list, index) => selectCard(index),
    })

  }
})
