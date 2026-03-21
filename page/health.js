import { createWidget, widget, align, prop } from "@zos/ui";
import { back } from "@zos/router";
import { px } from "@zos/utils";

const W = 390,
    H = 390;

Page({
    build() {
        // 获取存储的健康数据
        const healthData = globalThis.meditationHealthData || {
            duration: 0,
            avgHeartRate: 0,
            startHeartRate: 0,
            maxHeartRate: 0,
            minHeartRate: 0,
            caloriesBurned: 0,
            timestamp: "暂无数据",
        };

        createWidget(widget.FILL_RECT, {
            x: px(0),
            y: px(0),
            w: px(W),
            h: px(H),
            color: 0x0a0a1a,
        });

        // 标题
        createWidget(widget.TEXT, {
            x: px(0),
            y: px(20),
            w: px(W),
            h: px(40),
            text: "健康数据",
            text_size: px(32),
            color: 0x8888aa,
            align_h: align.CENTER_H,
        });

        // 冥想时长
        createWidget(widget.TEXT, {
            x: px(20),
            y: px(80),
            w: px(150),
            h: px(30),
            text: "冥想时长",
            text_size: px(18),
            color: 0x888888,
        });

        createWidget(widget.TEXT, {
            x: px(220),
            y: px(80),
            w: px(150),
            h: px(30),
            text: `${healthData.duration}分钟`,
            text_size: px(20),
            color: 0xc0c0ff,
            align_h: align.RIGHT,
        });

        // 分割线
        createWidget(widget.STROKE_RECT, {
            x: px(20),
            y: px(125),
            w: px(350),
            h: px(0),
            line_width: px(1),
            color: 0x333355,
        });

        // 平均心率
        createWidget(widget.TEXT, {
            x: px(20),
            y: px(145),
            w: px(150),
            h: px(30),
            text: "平均心率",
            text_size: px(18),
            color: 0x888888,
        });

        createWidget(widget.TEXT, {
            x: px(220),
            y: px(145),
            w: px(150),
            h: px(30),
            text: `${healthData.avgHeartRate} bpm`,
            text_size: px(20),
            color: 0xc0c0ff,
            align_h: align.RIGHT,
        });

        // 分割线
        createWidget(widget.STROKE_RECT, {
            x: px(20),
            y: px(190),
            w: px(350),
            h: px(0),
            line_width: px(1),
            color: 0x333355,
        });

        // 最高心率
        createWidget(widget.TEXT, {
            x: px(20),
            y: px(210),
            w: px(150),
            h: px(30),
            text: "最高心率",
            text_size: px(18),
            color: 0x888888,
        });

        createWidget(widget.TEXT, {
            x: px(220),
            y: px(210),
            w: px(150),
            h: px(30),
            text: `${healthData.maxHeartRate} bpm`,
            text_size: px(20),
            color: 0xff8888,
            align_h: align.RIGHT,
        });

        // 分割线
        createWidget(widget.STROKE_RECT, {
            x: px(20),
            y: px(255),
            w: px(350),
            h: px(0),
            line_width: px(1),
            color: 0x333355,
        });

        // 最低心率
        createWidget(widget.TEXT, {
            x: px(20),
            y: px(275),
            w: px(150),
            h: px(30),
            text: "最低心率",
            text_size: px(18),
            color: 0x888888,
        });

        createWidget(widget.TEXT, {
            x: px(220),
            y: px(275),
            w: px(150),
            h: px(30),
            text: `${healthData.minHeartRate} bpm`,
            text_size: px(20),
            color: 0x88ff88,
            align_h: align.RIGHT,
        });

        // 分割线
        createWidget(widget.STROKE_RECT, {
            x: px(20),
            y: px(320),
            w: px(350),
            h: px(0),
            line_width: px(1),
            color: 0x333355,
        });

        // 卡路里消耗
        createWidget(widget.TEXT, {
            x: px(20),
            y: px(340),
            w: px(150),
            h: px(30),
            text: "卡路里",
            text_size: px(18),
            color: 0x888888,
        });

        createWidget(widget.TEXT, {
            x: px(220),
            y: px(340),
            w: px(150),
            h: px(30),
            text: `${healthData.caloriesBurned} kcal`,
            text_size: px(20),
            color: 0xc0c0ff,
            align_h: align.RIGHT,
        });

        // 返回按钮
        createWidget(widget.BUTTON, {
            x: px(30),
            y: px(340),
            w: px(330),
            h: px(60),
            radius: px(30),
            normal_color: 0x333355,
            press_color: 0x444466,
            text: "← 返回",
            text_size: px(20),
            color: 0xaaaacc,
            click_func: () => {
                back();
            },
        });
    },
});
