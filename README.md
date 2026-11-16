# PAW ATLAS｜狗狗大全

一個可以持續新增犬種內容的靜態網站，為課堂 `AGENTS.md`／GitHub Pages 作業製作。

## 專案做甚麼？
- **首頁**：20 種犬種卡片、名稱／特徵搜尋、體型篩選。
- **詳情頁**：`breed.html?id=shiba-inu` 等網址共用同一模板，顯示背景、外觀、行為、活動與照護摘要以及 AKC 參考連結。
- **關於頁**：網站目的、規則設計與「如何新增第 21 種狗狗」的可重複工作流程。
- **內容規則**：`AGENTS.md` 定義架構、視覺、資料欄位、命名、可靠來源與測試。

## 專案架構
```text
AGENTS.md                AI 維護守則（作業重點）
README.md                介紹、操作與部署
index.html               首頁
breed.html               共用犬種詳情頁
about.html               專案規則介紹
assets/css/site.css      視覺樣式
assets/js/index.js       搜尋、篩選、卡片
assets/js/breed.js       詳情頁
assets/images/dogs/      犬種圖片（有圖的犬種才有）
data/breeds.js           全站犬種資料
scripts/check_content.py 檢查資料內容
scripts/smoke_js.js     JavaScript 搜尋、篩選、詳情頁的簡易測試
```

## 在本機預覽
此站完全沒有後端。只要用瀏覽器打開 `index.html` 即可預覽。
如希望用本地網址測試，可於專案根目錄執行：
```bash
python -m http.server 8000
```
開啟 `http://localhost:8000/`。

## 如何增加新犬種？（規則可重複使用）
**請先叫 AI 閱讀 `AGENTS.md`。** 然後：
1. 確認資料來源可信且有實際 URL。
2. 於 `data/breeds.js` 增加一筆符合欄位規定的物件，`id` 使用英文小寫 `kebab-case`。
3. 如果沒有插畫，`image` 就保持 `""`；如果有，放入 `assets/images/dogs/<id>.webp`。
4. 執行 `python scripts/check_content.py` 和 `node scripts/smoke_js.js`。
5. 預覽首頁與 `breed.html?id=<id>`，檢查 RWD 和文字是否正確。

首頁卡片及詳情頁都會依 `data/breeds.js` 自動更新，不需複製 HTML。這便是這次 `AGENTS.md` 能讓 AI 快速完成新頁面的證據。

### 給 AI 的範例指令
> 請先完整閱讀 AGENTS.md 和 README.md。依照其中的資料契約，為網站新增一種有可靠來源的犬種。不要更改現有版面及其他犬種資料。請執行 scripts/check_content.py，並回報新增檔案、來源與測試結果。

## 如何部署 GitHub Pages
1. GitHub 建立一個**公開** repository，例如 `paw-atlas`。
2. 上傳本資料夾內的**全部檔案和資料夾**到 repository 根目錄，確保能直接看到 `index.html` 和 `AGENTS.md`。
3. 到 Repository `Settings` → `Pages` → `Build and deployment` → `Deploy from a branch`。
4. 選擇 `main` 和 `/(root)`，儲存。
5. 等部署完成後，按 GitHub Pages 的 **Visit site** 檢查真正的線上網址。

> GitHub Pages 的公開網址必須由 GitHub 實際部署結果確認；不要在發布前假裝已有公開網址。部署後檢查首頁、搜尋、犬種詳細頁、手機版。

## 內容與 AI 使用揭露
犬種教學摘要根據先前課堂 RAG 專案的 20 種犬種中文整理，資料參考 American Kennel Club（AKC）各犬種介紹，詳情頁保留連結。它們不是獸醫建議；請勿只憑品種決定飼養方式。

四張日系插畫（柴犬、柯基、黃金獵犬、哈士奇）為先前與 AI 合作生成的示意圖。網站結構、HTML/CSS/JavaScript、AGENTS.md 由 AI 協助草擬，需由學生確認、測試和理解後提交。

## 課堂繳交建議
- 專案簡介：PAW ATLAS 犬種知識圖鑑，採資料驅動的網站架構，可快速新增犬種。
- GitHub repository：`https://github.com/<你的帳號>/<repo>`（正式建立後填真實連結）。
- 公開網站：請以 Settings → Pages 產生的實際連結為準。
- AGENTS.md：於 GitHub 根目錄點選 `AGENTS.md` 即可展示。
- 規則如何幫助 AI：新增犬種只需遵守固定欄位、命名、來源與測試規則，即會自動出現在首頁及詳情模板。
