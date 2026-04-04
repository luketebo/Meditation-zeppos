import { createWidget, deleteWidget, widget, align, prop, setStatusBarVisible } from '@zos/ui'
import { back, push } from '@zos/router'
import { px } from '@zos/utils'
import { setInterval, clearInterval } from '@zos/timer'
import { create, id } from '@zos/media'
import { getHeartRate } from '@zos/sensor'

const W = 390
const H = 390
const TIMES = [10, 15, 20, 25]
const DEFAULT_MUSIC = 'music/bell-meditation.mp3'

function formatTime(seconds) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60).toString().padStart(2, '0')
  const s = (safe % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

setStatusBarVisible(false)

Page({
  build() {
    const selectedIndex = globalThis.__selectedIndex ?? 0
    const totalSeconds = (TIMES[selectedIndex] || 10) * 60
    let remaining = totalSeconds
    let isPaused = false
    let timer = null

    // Health data
    const heartRates = []
    let maxHeartRate = 0
    let minHeartRate = 200

    // Audio
    const player = create(id.PLAYER)
    const musicFile = globalThis.selectedMusic || DEFAULT_MUSIC
    player.setSource(player.source.FILE, { file: musicFile })
    player.addEventListener(player.event.PREPARE, (result) => {
      if (result) player.start()
    })
    player.addEventListener(player.event.COMPLETE, () => {
      player.start()
    })
    player.prepare()

    // Background
    createWidget(widget.FILL_RECT, {
      x: px(0),
      y: px(0),
      w: px(W),
      h: px(H),
      color: 0x070b14,
    })

    // Top progress bar track
    const progressX = px(45)
    const progressY = px(36)
    const progressWidthRaw = W - 90
    const progressW = px(progressWidthRaw)
    const progressH = px(8)
    createWidget(widget.FILL_RECT, {
      x: progressX,
      y: progressY,
      w: progressW,
      h: progressH,
      color: 0x14253e,
    })
    let progressFill = null

    const statusText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(56),
      w: px(W),
      h: px(34),
      text: '冥想中',
      text_size: px(22),
      color: 0x2b79ff,
      align_h: align.CENTER_H,
    })

    const subtitleText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(98),
      w: px(W),
      h: px(32),
      text: '放松身心',
      text_size: px(20),
      color: 0xf0f4fb,
      align_h: align.CENTER_H,
    })

    const timeText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(196),
      w: px(W),
      h: px(72),
      text: formatTime(remaining),
      text_size: px(58),
      color: 0xffffff,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
    })

    const btnSize = px(86)
    const btnY = px(302)
    const leftX = px(62)
    const centerX = px((W - 86) / 2)
    const rightX = px(W - 62 - 86)
    const btnNormal = 0x2b2f38
    const btnPress = 0x3a3f4a

    const cancelBtn = createWidget(widget.BUTTON, {
      x: leftX,
      y: btnY,
      w: btnSize,
      h: btnSize,
      radius: px(43),
      normal_color: btnNormal,
      press_color: btnPress,
      text: 'X',
      text_size: px(32),
      color: 0xffffff,
      click_func: () => {
        clearInterval(timer)
        player.stop()
        back()
      },
    })
    cancelBtn.setProperty(prop.VISIBLE, false)

    const pauseBtn = createWidget(widget.BUTTON, {
      x: centerX,
      y: btnY,
      w: btnSize,
      h: btnSize,
      radius: px(43),
      normal_color: btnNormal,
      press_color: btnPress,
      text: '||',
      text_size: px(30),
      color: 0xffffff,
      click_func: () => {
        if (remaining <= 0) return
        isPaused = true
        player.pause()
        pauseBtn.setProperty(prop.VISIBLE, false)
        cancelBtn.setProperty(prop.VISIBLE, true)
        resumeBtn.setProperty(prop.VISIBLE, true)
        statusText.setProperty(prop.TEXT, '已暂停')
        subtitleText.setProperty(prop.TEXT, '放松一下，再继续')
      },
    })

    const resumeBtn = createWidget(widget.BUTTON, {
      x: rightX,
      y: btnY,
      w: btnSize,
      h: btnSize,
      radius: px(43),
      normal_color: btnNormal,
      press_color: btnPress,
      text: '>',
      text_size: px(34),
      color: 0xffffff,
      click_func: () => {
        isPaused = false
        player.start()
        cancelBtn.setProperty(prop.VISIBLE, false)
        resumeBtn.setProperty(prop.VISIBLE, false)
        pauseBtn.setProperty(prop.VISIBLE, true)
        statusText.setProperty(prop.TEXT, '冥想中')
        subtitleText.setProperty(prop.TEXT, '放松身心')
      },
    })
    resumeBtn.setProperty(prop.VISIBLE, false)

    function updateProgressBar() {
      const ratio = Math.max(0, remaining / totalSeconds)
      const widthRaw = Math.max(0, Math.floor(progressWidthRaw * ratio))
      if (progressFill) {
        deleteWidget(progressFill)
      }
      progressFill = createWidget(widget.FILL_RECT, {
        x: progressX,
        y: progressY,
        w: px(widthRaw),
        h: progressH,
        color: 0x2b79ff,
      })
    }

    function finishMeditation() {
      clearInterval(timer)
      player.stop()

      const avgHeartRate = heartRates.length
        ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
        : 0

      globalThis.meditationHealthData = {
        duration: totalSeconds / 60,
        avgHeartRate,
        startHeartRate: heartRates[0] || 0,
        maxHeartRate,
        minHeartRate: minHeartRate === 200 ? 0 : minHeartRate,
        caloriesBurned: Math.round((totalSeconds / 60) * 3),
        timestamp: new Date().toLocaleString(),
      }

      statusText.setProperty(prop.TEXT, '已完成')
      subtitleText.setProperty(prop.TEXT, '做得很好，感受你的平静')
      timeText.setProperty(prop.TEXT, '00:00')
      pauseBtn.setProperty(prop.VISIBLE, false)
      resumeBtn.setProperty(prop.VISIBLE, false)
      cancelBtn.setProperty(prop.VISIBLE, false)
      updateProgressBar()

      let redirectCount = 0
      const redirectTimer = setInterval(() => {
        redirectCount += 1
        if (redirectCount >= 2) {
          clearInterval(redirectTimer)
          push({ url: 'page/health' })
        }
      }, 1000)
    }

    timer = setInterval(() => {
      if (isPaused) return

      remaining -= 1
      timeText.setProperty(prop.TEXT, formatTime(remaining))
      updateProgressBar()

      if ((totalSeconds - remaining) % 5 === 0) {
        try {
          const hr = getHeartRate()
          if (hr && hr > 0) {
            heartRates.push(hr)
            maxHeartRate = Math.max(maxHeartRate, hr)
            minHeartRate = Math.min(minHeartRate, hr)
          }
        } catch (e) {
          console.log('heart-rate read fail', e)
        }
      }

      if (remaining <= 0) {
        finishMeditation()
      }
    }, 1000)

    updateProgressBar()
  },
})
