# Main UI Slices

这些素材裁自 `assets/ui-mockups/main-gameplay.png`，用于把主对局界面从“CSS 仿风格”推进到“切图还原”。

## 素材用途

- `chrome-topbar.png`：顶部黑漆金线栏纹理。
- `frame-character.png`：左侧人物面板边框来源。
- `frame-event.png`：中央案卷面板边框来源。
- `frame-world.png`：右侧关系朝局面板边框来源。
- `tray-hand.png`：底部手牌托盘边框来源。
- `frame-card.png` / `frame-card-wide.png`：手牌与牌库卡牌边框来源。
- `plaque-red.png`：红色标题牌匾。
- `plaque-green.png`：绿色标题牌匾。
- `button-dark.png`：深色按钮框。
- `portrait-official.png`：人物面板官员肖像。
- `paper-tile.png`：纸面纹理。
- `desk-tile.png`：桌面背景纹理。

## 说明

目前是第一版切图还原：素材已经被 `styles.css` 引用为面板边框、标题牌匾、卡牌框和背景纹理。由于原效果图里的文字已经烘焙进图片，当前实现优先使用边缘和纹理切片，真实文字仍由 DOM 渲染，避免文字双影。
