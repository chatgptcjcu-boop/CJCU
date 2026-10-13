# CJCU 網頁目錄專案 (GitHub Pages)

本專案提供日期目錄分頁導覽系統，將 Google Apps Script (GAS) 網頁整合呈現於 GitHub Pages。

## 📁 目錄結構說明

```text
CJCU/
├── index.html            # 總目錄入口首頁（左側日期導覽列、右側嵌入分頁）
├── 2026-10-13/           # 2026-10-13 專屬日期目錄
│   └── index.html        # 嵌入 GAS 網頁的專屬分頁
└── README.md             # 專案說明文件
```

## 🚀 部署到 GitHub Pages 方式

1. 將本專案的所有檔案（`index.html`、`2026-10-13/`、`README.md`）上傳至本儲存庫 [`CJCU`](https://github.com/chatgptcjcu-boop/CJCU) 的 `main` 分支根目錄。
2. 前往儲存庫的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下：
   - Source 選擇 **Deploy from a branch**
   - Branch 選擇 `main`，路徑選擇 `/(root)`
   - 點選 **Save**。
4. 稍等 1-2 分鐘後，即可透過專屬網址瀏覽：
   `https://chatgptcjcu-boop.github.io/CJCU/`
   或直接瀏覽今日分頁：
   `https://chatgptcjcu-boop.github.io/CJCU/2026-10-13/`

## ➕ 如何新增其他日期的目錄分頁

若未來有新版本需要依日期記錄：
1. 建立新的資料夾（例如 `2026-10-14/`）。
2. 在該資料夾內放入複製自 `2026-10-13/index.html` 的檔案，並修改對應的標題或 GAS 網址。
3. 在根目錄的 `index.html` 左側選單加入該日期的連結即可。
