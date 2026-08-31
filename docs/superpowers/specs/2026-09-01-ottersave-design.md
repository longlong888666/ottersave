# OtterSave 设计文档（Spec）

- 日期：2026-09-01
- 状态：已确认（用户逐节过目批准）
- 目标：AI 海外建站第一站 —— 金融工具站 OtterSave，广告流量型变现，动森治愈风

## 1. 品牌与定位

- 品牌名：OtterSave
- 域名：ottersave.com（已查可用，待注册）
- 吉祥物：Ollie the Otter —— 圆润小海獭，怀里抱一颗最喜欢的小石头（代表攒下的每一笔），仰泳姿态。原创 IP，规避版权。
- 一句话定位："A cozy way to watch your savings grow" —— 把存钱变成一场轻松的小游戏。
- 目标用户：美国 25-45 岁，搜储蓄/退休/复利计算器的普通人，被金融术语劝退的人群。
- 品牌语调：温暖俏皮，但数字 100% 严谨（"你的钱在海獭式收集，数字绝不卖萌"）。
- 中文传播名：海獭储蓄所（仅内部/中文渠道使用，站点内容全英文）。

## 2. 视觉系统（动森治愈风）

- 配色（马卡龙低饱和，全站不用深色、不用刺眼纯色）：
  - 奶油白底 `#FFF9EF`
  - 薄荷绿主色 `#7BC8A6`
  - 天空蓝 `#A8D8F0`
  - 珊瑚粉 `#F5B8A9`
  - 奶油黄 `#F9E29C`
  - 柔和深褐文字 `#4A3F35`
- 字体：`Baloo 2`（圆润展示字，标题）+ `Nunito`（正文）。
- 图形：原创 SVG 小元素 —— 海獭、贝壳、小石头、金币、小树苗、云朵、波浪。全部自创。
- 微交互（游戏感核心）：
  - 拖滑块时数字实时跳动
  - 点"计算"→ 金币/小石头撒落轻动画 → 结果以游戏结算面板样式弹出
  - 储蓄目标达成时，页面角落小树苗长成大树（彩蛋）
  - 结算面板带奖励文案（如"再存 X 年，你的小树就长大啦！"）
- 移动优先，大字大按钮。

## 3. 产品结构（5 个工具）

### 首页
- Ollie logo + 副标题 "Savings, but make it cozy."
- 5 个工具卡片入口（各配小插画）：复利、退休储蓄、储蓄目标、72 法则、投资回报
- 底部：关于 / 隐私政策 / 联系页面（广告联盟审核必备）

### 工具模板（统一"输入 → 计算 → 游戏结算"）
1. **Compound Interest Calculator（复利计算器）** —— 主力工具
   - 输入：初始本金、每月追加、年收益率、年限
   - 输出：终值 + 本金/利息拆解 + 增长曲线图 + "X 年后翻倍"提示
2. **Retirement Savings Calculator（退休储蓄计算器）**
   - 输入：当前年龄、预计退休年龄、当前存款、月存、年收益率
   - 输出：退休时总额、每月可花额度（4% 法则）、进度条
3. **Savings Goal Calculator（储蓄目标计算器）**
   - 输入：目标金额、已有存款、每月能存、年收益率
   - 输出：达成所需月数/年数 + "每天只需存 $X"
4. **Rule of 72 Calculator（72 法则计算器）**
   - 输入：年收益率
   - 输出：翻倍年数 + 趣味解释
5. **Investment Return Calculator（投资回报计算器）**
   - 输入：一次性投入 + 每月定投 + 年限 + 收益率
   - 输出：终值、总投入、总收益、定投 vs 一次性对比

### 每页公共元素（SEO + 变现）
- H1 含关键词（如 "Compound Interest Calculator"）
- 计算器本体（纯前端，本地计算，无后端）
- 结果面板 + 分享按钮（生成 OtterSave 风格分享卡片）
- 3-5 条 FAQ（结构化数据，抢 AI Overview / 精选摘要）
- 相关工具互链
- 广告位预留（上线初期不挂，流量起来后加 AdSense）

## 4. 技术方案

- 技术栈：Astro + Tailwind CSS，静态站，纯前端无后端无数据库
- 部署：Cloudflare Pages（免费，全球 CDN）；域名 Porkbun/Namecheap 注册（约 $10-15/年），DNS 接 Cloudflare
- 路由：/compound-interest-calculator/、/retirement-savings-calculator/、/savings-goal-calculator/、/rule-of-72-calculator/、/investment-return-calculator/
- 图表：Chart.js；分享卡片用原生 Canvas 生成
- 扩展性：工具共用一套组件，加新工具只写新页面（1-2 天/个）

## 5. SEO / 变现计划

- 第 1 月：上线 5 工具 + FAQ，提交 Google Search Console + sitemap，申请 AdSense
- 第 2-3 月：按 GSC 数据扩长尾页面（如 compound interest calculator monthly、retirement savings by age 30），每页 400-600 字品牌化说明
- 第 4-6 月：月 PV 5 万+ 评估换 Mediavine/Ezoic；继续扩工具（401k、RMD、dividend 等）
- 变现分层：AdSense 兜底 → 高级广告联盟 → 分享卡片品牌水印传播
- 红线：不批量灌纯 AI 文章；每页都有真实可用的计算器（E-E-A-T 信号）

## 6. 里程碑

- M1（第 1 周）：域名 + 部署 + 首页 + 复利计算器上线
- M2（第 2 周）：剩余 4 个计算器 + FAQ + sitemap + Search Console + AdSense 申请
- M3（第 3-6 周）：按数据扩 10-20 个长尾页，迭代视觉文案
- M4（第 2-3 月）：单月 PV 破 1 万
- M5（第 6 月）：月 PV 5 万+ / 广告收入 $200-500/月，决定放大或卖站

## 7. 风险与对策

- 金融 YMYL，纯 AI 内容可能被压 → 人类审校 + 真实计算器 + 引用权威公式来源
- 广告联盟审核门槛 → 上线即有完整隐私政策/关于页，内容真实
- 计算准确性 → 每个计算器配单元测试（TDD），用金融标准公式（复利 FV 公式等）
- 版权 → 吉祥物/插画全部原创，不碰任天堂素材
