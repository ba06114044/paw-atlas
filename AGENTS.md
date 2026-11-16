# AGENTS.md — PAW ATLAS 狗狗大全網站開發規則

> 這份文件是 AI coding agent 在修改專案前**必須閱讀**的工作規範。它不是網站文章，而是未來持續新增頁面、資料與功能的「共同約定」。

## 1. 專案定位（不可隨意改變）
- 名稱：**PAW ATLAS｜狗狗大全**。
- 目標：以繁體中文介紹常見犬種的起源、外觀、一般行為傾向、活動與照護考量，並保留可追溯資料來源。
- 對象：對狗狗有興趣、想初步比較犬種的普通讀者。
- 專案類型：**純靜態網站**，透過 GitHub Pages 部署；不需要 Colab、API Key、後端、資料庫或付費服務。
- 現有內容：20 種犬種教學摘要；有 4 張 AI 生成插畫，其餘犬種以文字圖卡顯示。
- 核心原則：犬種描述只是概略傾向，**不得把品種刻板印象當作個體必然特徵**，不可把 AI 插畫當成犬種標準照片。

## 2. 技術與檔案結構（不要無故引進框架）
```text
/
├── AGENTS.md                    ← AI 必讀規則
├── README.md                    ← 人類開發與部署說明
├── index.html                   ← 犬種列表、搜尋與體型篩選
├── breed.html                   ← 通用犬種詳情頁（?id=slug）
├── about.html                   ← 專案理念與新增內容方式
├── data/
│   └── breeds.js                ← 唯一的犬種資料來源
├── assets/
│   ├── css/site.css             ← 全站共用風格
│   ├── js/index.js              ← 首頁渲染／搜尋
│   ├── js/breed.js              ← 詳細頁渲染／引用來源
│   └── images/dogs/             ← 英文 kebab-case 檔名的 .webp 圖
└── scripts/
    └── check_content.py        ← 資料結構驗證
```
- 使用原生 HTML、CSS、JavaScript（ES2020 以內）。不可為了加一頁而改用 React、Next.js、資料庫、npm build 或 API。
- 所有內部連結必須使用相對路徑，例如 `breed.html?id=shiba-inu`、`assets/css/site.css`；不可把個人 GitHub 使用者名稱或 repository 名稱寫死在程式中。
- GitHub Pages 由 `main` branch `/ (root)` 發布，根目錄必須保留 `index.html`。

## 3. 全站視覺規則
- 語言：繁體中文（臺灣常用用語；兼容一般香港讀者），英文犬種名稱保留原文。
- 風格：溫暖、有編輯感的日系犬種圖鑑。背景奶油白 `#f7f4eb`、主文字深綠 `#1b302e`、輔色橘棕 `#d97652`、淡綠 `#dceae2`。
- Typography：優先 `DM Sans` + `Noto Sans TC`，並保留系統字型 fallback。
- 同一類型的內容必須沿用現有卡片、標題、按鈕、分隔線與間距，不另外開創互不相容的樣式。
- 手機與桌面皆應可用：桌面 4 欄卡片，手機至少 2 欄；文字不能溢出畫面。
- 所有內容需有語意 HTML；圖片必須有 `alt`；互動元素應可用鍵盤操作，焦點樣式不可刪除。
- 插畫一律註明「AI 生成示意，非犬種標準照片」。

## 4. `data/breeds.js` 資料契約（最重要）
- `window.DOG_BREEDS` 是**唯一真實資料來源（single source of truth）**。
- 檔案保持為 `window.DOG_BREEDS = [ { ... }, ... ];`，其中陣列內容需為合法 JSON（雙引號、不可留尾逗號）。
- 每筆資料都必須包含以下欄位，值均為**字串**（但 `featured` 為 boolean）：
  - `id`：英文小寫 kebab-case，例：`shiba-inu`；全站唯一，不可更名既有 ID。
  - `name`：繁體中文犬種名稱。
  - `english`：標準英文名稱。
  - `group`：犬種組別。
  - `origin`：起源地／背景（不確定時應明示）。
  - `size`：概略體型，依原始犬種摘要保留「玩具型／小型／小型至中型／中型／中大型／中型至大型／大型」等描述；首頁篩選將玩具型歸小型、中大型歸大型。
  - `appearance`：外觀與原有用途，1–2 句。
  - `temperament`：常見行為傾向，避免絕對化。
  - `activity`：活動與訓練需求，1–2 句。
  - `care`：照護提醒，避免診斷或保證。
  - `source`：實際可查證的 `https://` 犬種資料網址，不得虛構。
  - `disclaimer`：個體差異與專業諮詢提醒。
  - `summary`：卡片摘要，建議 25–80 個中文字。
  - `image`：可為空字串；有圖必須指向存在的 `assets/images/dogs/<id>.webp`。
  - `featured`：`true/false`，有插畫或精選犬種可設定 true。
- 絕不可為了填滿欄位而編造身高、體重、疾病盛行率、養育成本、資料來源或專業建議。
- **沒有找到可靠來源時，先保留待查，不要發布不確定內容。**

## 5. 新增犬種的固定流程（AI 每次都應照做）
1. 先閱讀 `AGENTS.md`、`README.md`，再檢查 `data/breeds.js` 是否已有相同犬種 ID／別名。
2. 找到可信、可公開核對的犬種資料（目前優先 AKC）。如果無法確認來源，停止新增並說明缺漏。
3. 依照資料契約在 `data/breeds.js` 陣列**新增一筆**，不要複製貼上整份 HTML。
4. 如果有使用者授權的圖片，將它裁成適合卡片的 WebP，放在 `assets/images/dogs/<id>.webp`，並填上 `image`；沒有圖片就填 `""`，讓網站顯示統一文字圖卡，不可亂配別的犬種圖片。
5. 執行 `python scripts/check_content.py`，並檢查首頁搜尋與犬種詳情頁 `breed.html?id=<id>`。
6. 桌面及手機檢查：無跑版、無空白內容、無壞連結、繁體中文正確、來源存在、插畫標示清楚。
7. 在回覆使用者時說明：新增了哪些檔案、來源是甚麼、測試結果、仍有甚麼不確定。

## 6. 修改或新增頁面時
- 優先共用 `assets/css/site.css`，重用 `.container`、`.section-kicker`、`.primary-button` 等元件樣式。
- 新頁請採用 `kebab-case.html` 檔名；導覽需在 `index.html`、`breed.html`、`about.html` 同步更新。
- 使用 `<main>`、適當標題階層 (`h1` 只有一個) 與可跳至主內容的連結。
- 所有新圖片必須壓縮，並加明確 `alt`，勿加入外部未授權圖庫連結。
- 如果只是新增犬種，**只能修改 `data/breeds.js` 與必要圖片，不應更改頁面模板**。這是檢驗規則可重複使用的關鍵。

## 7. 防呆與安全
- 不得把 Groq／OpenAI API Key、Colab Secrets、帳號憑證或個資上傳 GitHub。
- 網頁只顯示非敏感公開資料，不需要存取使用者位置、健康資訊或分析追蹤。
- 不要任意使用 `innerHTML` 生成不受信任的資料；現有 JavaScript 以 `textContent` 建立內容，請維持此做法。
- `source` 開新分頁時必須用 `rel="noopener noreferrer"`。
- 不要將教學犬種摘要描述成獸醫建議，也不可產生可疑醫療結論。
- 資料內容的版權與來源須保留；不大段複製外站文章。

## 8. 完成定義（Definition of Done）
每次提交前必須全部成立：
- [ ] `python scripts/check_content.py` 全部通過。
- [ ] `node --check assets/js/index.js`、`node --check assets/js/breed.js` 通過（若有 Node）。
- [ ] `node scripts/smoke_js.js` 通過：確認搜尋、體型篩選及詳細頁資料傳遞。
- [ ] `index.html` 開得出來，卡片數與資料一致，搜尋和體型篩選正常。
- [ ] 每個 `breed.html?id=<id>` 顯示正確名稱、五大欄位及來源。
- [ ] `about.html#how-to-add` 的規則示例仍符合現有程式。
- [ ] Desktop 與 375px mobile 排版可讀；鍵盤及圖片替代文字正確。
- [ ] 新增內容沒有無根據的健康保證、假引用或未獲授權的圖片。

## 9. AI 生成內容的透明度
此網站原型的程式、結構與部分文案由 AI 協助產生；作者需理解、修改、測試並對上傳內容負責。所有犬種插畫屬 AI 生成示意。AI 不能用「我已測試」取代實際執行；缺乏可驗證證據時需明說。
