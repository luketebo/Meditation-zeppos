import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'

// 轻量 AutoGUI 兼容实现，避免 @silver-zepp/autogui 在运行时 "API NOT EXIST"
export default class AutoGUI {
  static #padding = 4
  static #textSize = 24

  constructor() {
    this._cursorY = px(24)
    this._rows = []
  }

  static SetPadding(value) { this.#padding = value }
  static GetPadding() { return this.#padding }

  static SetTextSize(value) { this.#textSize = value }
  static GetTextSize() { return this.#textSize }

  rowLayout() { return this }
  newRow() {
    this._cursorY += px(8)
    return this
  }

  text(text, options = {}) {
    const x = options.x !== undefined ? options.x : px(15)
    const y = options.y !== undefined ? options.y : this._cursorY
    const w = options.w !== undefined ? options.w : px(360)
    const h = options.h !== undefined ? options.h : px(40)

    createWidget(widget.TEXT, {
      x,
      y,
      w,
      h,
      text,
      text_size: px(options.text_size || AutoGUI.GetTextSize()),
      color: options.color || 0xffffff,
      align_h: options.align_h || 1,
      align_v: options.align_v || 1,
      ...options,
    })

    if (options.y === undefined) {
      this._cursorY = y + h + px(10)
    }
    return this
  }

  button(text, click_func, options = {}) {
    const normalColor = options.normal_color || 0x007aff
    const pressColor = options.press_color || 0x0051a8
    const textColor = options.color || 0xffffff

    const x = options.x !== undefined ? options.x : px(15)
    const y = options.y !== undefined ? options.y : this._cursorY
    const w = options.w !== undefined ? options.w : px(360)
    const h = options.h !== undefined ? options.h : px(110)

    createWidget(widget.BUTTON, {
      x,
      y,
      w,
      h,
      radius: px(options.radius || 18),
      text,
      text_size: px(options.text_size || AutoGUI.GetTextSize()),
      color: textColor,
      normal_color: normalColor,
      press_color: pressColor,
      click_func,
      ...options,
    })

    if (options.y === undefined) {
      this._cursorY = y + h + px(10)
    }
    return this
  }

  fillRect(color) {
    createWidget(widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: px(390),
      h: px(390),
      color,
    })
    return this
  }

  render() {
    // createWidget 已经直接渲染，AutoGUI 模式无需再次渲染
    return this
  }
}
