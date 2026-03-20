import { createWidget, widget, align } from '@zos/ui'
import { back } from '@zos/router'
import { px } from '@zos/utils'
import { setInterval, clearInterval } from '@zos/timer'

const W = 390, H = 390

Page({
  build() {
    const params = JSON.parse(this.state?.params || '{"minutes":5}')
    let remaining = params.minutes * 60

    // 背景
    createWidget(widget.FILL_RECT, {
      x: px(0), y: px(0),
      w: px(W), h: px(H),
      color: 0x0a0a1a,
    })

    // 标题
    createWidget(widget.TEXT, {
      x: px(0), y: px(80),
      w: px(W), h: px(50),
      text: '冥想中',
      text_size: px(28),
      color: 0x8888aa,
      align_h: align.CENTER_H,
    })

    // 外圆装饰
    createWidget(widget.STROKE_RECT, {
      x: px(95), y: px(140),
      w: px(200), h: px(200),
      radius: px(100),
      line_width: px(3),
      color: 0x3a3a7a,
    })

    // 倒计时文字
    const timeText = createWidget(widget.TEXT, {
      x: px(95), y: px(140),
      w: px(200), h: px(200),
      text: formatTime(remaining),
      text_size: px(52),
      color: 0xc0c0ff,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
    })

    // 提示文字
    const hintText = createWidget(widget.TEXT, {
      x: px(0), y: px(355),
      w: px(W), h: px(35),
      text: '专注呼吸，放松身心',
      text_size: px(20),
      color: 0x555577,
      align_h: align.CENTER_H,
    })

    // 倒计时逻辑
    const timer = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        clearInterval(timer)
        timeText.setProperty(widget.TEXT, { text: '完成 ✓' })
        hintText.setProperty(widget.TEXT, { text: '冥想结束，做得很好！' })
      } else {
        timeText.setProperty(widget.TEXT, { text: formatTime(remaining) })
      }
    }, 1000)

    // 点击屏幕退出
    createWidget(widget.CLICK_AREA, {
      x: px(0), y: px(0),
      w: px(W), h: px(H),
      func: () => {
        clearInterval(timer)
        back()
      },
    })
  }
})

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
