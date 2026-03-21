import { createWidget, widget, align, prop } from '@zos/ui'
import { back, push } from '@zos/router'
import { px } from '@zos/utils'
import { setInterval, clearInterval } from '@zos/timer'
import { create, id } from '@zos/media'
import { getHeartRate } from '@zos/sensor'

const W = 390, H = 390
const TIMES = [10, 15, 20, 25]
const DEFAULT_MUSIC = 'music/bell-meditation.mp3'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

Page({
  build() {
    const selectedIndex = globalThis.__selectedIndex ?? 0
    let remaining = TIMES[selectedIndex] * 60
    const totalDuration = TIMES[selectedIndex]
    let isPaused = false
    let timer = null

    // 健康数据收集
    let heartRates = []
    let maxHeartRate = 0
    let minHeartRate = 200
    const startTime = new Date()

    // 创建音频播放器
    const player = create(id.PLAYER)
    console.log('Audio player created')
    const musicFile = globalThis.selectedMusic || DEFAULT_MUSIC
    player.setSource(player.source.FILE, { file: musicFile })
    console.log('Audio source set to', musicFile)
    player.addEventListener(player.event.PREPARE, (result) => {
      console.log('Audio prepare event triggered, result:', result)
      if (result) {
        console.log('Audio prepare succeed, starting playback')
        player.start()
      } else {
        console.log('Audio prepare fail')
      }
    })
    player.addEventListener(player.event.COMPLETE, () => {
      console.log('Audio playback completed, restarting for loop')
      player.start()
    })
    console.log('Calling player.prepare()')
    player.prepare()

    createWidget(widget.FILL_RECT, {
      x: px(0), y: px(0),
      w: px(W), h: px(H),
      color: 0x0a0a1a,
    })

    createWidget(widget.TEXT, {
      x: px(0), y: px(40),
      w: px(W), h: px(50),
      text: '冥想中',
      text_size: px(28),
      color: 0x8888aa,
      align_h: align.CENTER_H,
    })

    createWidget(widget.STROKE_RECT, {
      x: px(95), y: px(100),
      w: px(200), h: px(200),
      radius: px(100),
      line_width: px(3),
      color: 0x3a3a7a,
    })

    const timeText = createWidget(widget.TEXT, {
      x: px(95), y: px(100),
      w: px(200), h: px(200),
      text: formatTime(remaining),
      text_size: px(52),
      color: 0xc0c0ff,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
    })

    const hintText = createWidget(widget.TEXT, {
      x: px(0), y: px(310),
      w: px(W), h: px(30),
      text: '专注呼吸，放松身心',
      text_size: px(18),
      color: 0x555577,
      align_h: align.CENTER_H,
    })

    // 暂停按钮
    const pauseBtn = createWidget(widget.BUTTON, {
      x: px(145), y: px(345),
      w: px(100), h: px(44),
      radius: px(22),
      normal_color: 0x333355,
      press_color: 0x444466,
      text: '⏸ 暂停',
      text_size: px(20),
      color: 0xaaaacc,
      click_func: () => {
        if (remaining <= 0) return
        isPaused = true
        clearInterval(timer)
        console.log('Pausing audio playback')
        player.pause()
        pauseBtn.setProperty(prop.VISIBLE, false)
        cancelBtn.setProperty(prop.VISIBLE, true)
        resumeBtn.setProperty(prop.VISIBLE, true)
        hintText.setProperty(prop.TEXT, '已暂停')
      },
    })

    // 取消按钮（默认隐藏）
    const cancelBtn = createWidget(widget.BUTTON, {
      x: px(30), y: px(335),
      w: px(130), h: px(55),
      radius: px(27),
      normal_color: 0x333333,
      press_color: 0x555555,
      text: '✕ 取消',
      text_size: px(22),
      color: 0xffffff,
      click_func: () => {
        clearInterval(timer)
        console.log('Stopping audio playback')
        player.stop()
        back()
      },
    })
    cancelBtn.setProperty(prop.VISIBLE, false)

    // 继续按钮（默认隐藏）
    const resumeBtn = createWidget(widget.BUTTON, {
      x: px(230), y: px(335),
      w: px(130), h: px(55),
      radius: px(27),
      normal_color: 0x5050cc,
      press_color: 0x6060ee,
      text: '▶ 继续',
      text_size: px(22),
      color: 0xffffff,
      click_func: () => {
        isPaused = false
        cancelBtn.setProperty(prop.VISIBLE, false)
        resumeBtn.setProperty(prop.VISIBLE, false)
        pauseBtn.setProperty(prop.VISIBLE, true)
        hintText.setProperty(prop.TEXT, '专注呼吸，放松身心')
        console.log('Resuming audio playback')
        player.start()
        startTimer()
      },
    })
    resumeBtn.setProperty(prop.VISIBLE, false)

    function startTimer() {
      timer = setInterval(() => {
        remaining -= 1
        
        // 每5秒收集一次心率数据
        if ((totalDuration * 60 - remaining) % 5 === 0) {
          try {
            const currentHeartRate = getHeartRate()
            if (currentHeartRate && currentHeartRate > 0) {
              heartRates.push(currentHeartRate)
              maxHeartRate = Math.max(maxHeartRate, currentHeartRate)
              minHeartRate = Math.min(minHeartRate, currentHeartRate)
              console.log('Heart rate collected:', currentHeartRate, 'bpm')
            } else {
              console.log('Heart rate not available:', currentHeartRate)
            }
          } catch (error) {
            console.log('Error collecting heart rate:', error)
          }
        }

        if (remaining <= 0) {
          clearInterval(timer)
          console.log('Meditation completed, stopping audio playback')
          player.stop()
          
          // 计算并保存健康数据
          const avgHeartRate = heartRates.length > 0 
            ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length)
            : 0
          const caloriesBurned = Math.round(totalDuration * 3) // 每分钟约3卡路里
          
          const healthData = {
            duration: totalDuration,
            avgHeartRate: avgHeartRate,
            startHeartRate: heartRates[0] || 0,
            maxHeartRate: maxHeartRate,
            minHeartRate: minHeartRate === 200 ? 0 : minHeartRate,
            caloriesBurned: caloriesBurned,
            timestamp: new Date().toLocaleString()
          }
          
          globalThis.meditationHealthData = healthData
          console.log('Health data saved:', healthData)
          
          timeText.setProperty(prop.TEXT, '完成 ✓')
          hintText.setProperty(prop.TEXT, '冥想结束，做得很好！')
          pauseBtn.setProperty(prop.VISIBLE, false)
          
          // 2秒后自动进入健康数据页面
          let redirectCount = 0
          const redirectTimer = setInterval(() => {
            redirectCount++
            if (redirectCount >= 2) {
              clearInterval(redirectTimer)
              push({ url: 'page/health' })
            }
          }, 1000)
        } else {
          timeText.setProperty(prop.TEXT, formatTime(remaining))
        }
      }, 1000)
    }

    startTimer()
  }
})
