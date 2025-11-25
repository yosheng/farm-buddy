# Farm Buddy Pro - 完整開發部署指南

這是一個基於 **Vite + React + TypeScript + Ant Design** 的現代化後台管理系統，支援本地開發和 Docker 容器化部署。

## 📋 目錄

- [項目簡介](#項目簡介)
- [前置需求](#前置需求)
- [本地開發](#本地開發)
- [Docker 部署](#docker-部署)
- [ESLint 配置](#eslint-配置)
- [常見問題](#常見問題)

## 項目簡介

**Farm Buddy Pro** 是一套功能完整的後台管理系統模板，包含：

- ⚛️ React 18.3+ 與 TypeScript 最新版本
- ⚡ Vite 7 高效打包工具（HMR 熱更新）
- 🎨 Ant Design Pro Components 5.x UI 組件庫
- 🔗 TanStack React Query 5 數據請求和緩存
- 🛣️ React Router 7 路由管理
- 📦 UnoCSS 原子化 CSS 框架
- ✅ ESLint + Prettier 代碼規範
- 🧪 Vitest 單元測試框架
- 🐳 Docker 多階段構建

## 前置需求

### 本地開發
- Node.js 18+ （推薦 20 LTS）
- npm 9+ 或 yarn 3.6+

### Docker 部署
- Docker 20.10+
- Docker Compose 1.29+（可選，用於本地測試）

## 本地開發

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發服務器

```bash
npm run dev
```

開發服務器會在 `http://localhost:5173` 啟動，並自動代理 API 請求到 `http://localhost:5200`。

**功能特性：**
- 熱模塊更新（HMR）即時預覽代碼變更
- TypeScript 類型檢查
- ESLint 實時代碼檢查

### 3. 構建生產版本

```bash
npm run build
```

此命令會執行：
1. TypeScript 編譯檢查（`tsc -b`）
2. Vite 優化構建（`vite build`）
3. 生成最優化的 `dist` 目錄

### 4. 預覽生產構建

```bash
npm run preview
```

本地預覽生產環境構建結果，便於驗證生產環境表現。

### 5. 運行測試

```bash
npm test
```

使用 Vitest 運行單元測試，支援 watch 模式監聽文件變更。

### 6. 代碼檢查和格式化

```bash
# 檢查代碼規範
npm run lint

# 自動修復代碼
npm run lint:fix
```

### 7. 預提交檢查

項目配置了 Husky + lint-staged，在提交代碼時自動運行：
- ESLint 檢查
- Prettier 格式化
- TypeScript 類型檢查

```bash
# 初始化 Husky hooks
npm run prepare
```

## Docker 部署

### 項目結構

```
.
├── Dockerfile              # 多階段 Docker 構建配置
├── .dockerignore          # Docker 忽略文件列表
├── nginx.conf             # Nginx 反向代理配置
├── vite.config.ts         # Vite 配置（支持環境變量）
├── package.json           # 項目依賴配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 本文檔
```

### 環境變量

#### 開發環境（.env.development）

```env
VITE_API_BASE_URL=http://localhost:5200
```

開發時 API 請求由 Vite proxy 代理。

#### 生產環境（.env.production）

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

指定生產環境的 API 後端地址。

#### Docker 運行時環境變量

在運行 Docker 容器時，可以通過環境變量覆蓋 API 地址：

- `VITE_API_TARGET`: API 後端服務地址

### 構建 Docker 鏡像

#### 基礎構建（使用默認 API 地址）

```bash
docker build -t farm-buddy-pro:latest .
```

#### 指定 API 地址構建

```bash
docker build \
  --build-arg VITE_API_TARGET=https://api.yourdomain.com \
  -t farm-buddy-pro:latest .
```

### 運行 Docker 容器

#### 基礎運行

```bash
docker run -p 80:80 farm-buddy-pro:latest
```

應用將在 `http://localhost` 訪問。

#### 指定 API 地址運行

```bash
docker run \
  -e VITE_API_TARGET=https://api.yourdomain.com \
  -p 80:80 \
  farm-buddy-pro:latest
```

#### 自定義端口運行

```bash
docker run -p 8080:80 farm-buddy-pro:latest
```

應用將在 `http://localhost:8080` 訪問。

#### 後台運行

```bash
docker run \
  -d \
  --name farm-buddy-pro \
  -p 80:80 \
  farm-buddy-pro:latest
```

#### 在本地訪問宿主機 API

```bash
docker run \
  -e VITE_API_TARGET=http://host.docker.internal:5200 \
  -p 80:80 \
  farm-buddy-pro:latest
```

### Docker Compose 部署

創建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_TARGET=http://api:3000
    depends_on:
      - api
    networks:
      - app-network

  api:
    image: your-api-image:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

啟動服務：

```bash
docker-compose up -d
```

查看日誌：

```bash
docker-compose logs -f web
```

停止服務：

```bash
docker-compose down
```

### Dockerfile 多階段構建詳解

#### 第一階段：構建（Build）

```dockerfile
FROM node:latest AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
```

- 使用完整的 Node.js 鏡像
- 安裝所有依賴（包括 devDependencies）
- 執行 TypeScript 編譯和 Vite 打包
- 生成優化的 `dist` 目錄

#### 第二階段：生產（Production）

```dockerfile
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
ENV VITE_API_TARGET=http://api:3000
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- 使用輕量級 Nginx 鏡像作為生產環境
- 只複製構建結果，不包含源代碼和依賴
- 設置 Nginx 反向代理和靜態文件服務
- **最終鏡像體積遠小於直接使用 Node 鏡像**（約減少 90%）

### Nginx 配置說明

`nginx.conf` 提供了以下功能：

1. **靜態文件服務**
   - 提供 HTML、CSS、JavaScript、圖片等資源
   - 設置 1 年長期緩存策略

2. **Gzip 壓縮**
   - 自動壓縮 CSS、JavaScript 等文本資源
   - 減少傳輸大小約 70%

3. **API 代理**
   - `/api` 路徑的請求轉發到後端服務
   - 支持 WebSocket 升級
   - 傳遞客戶端真實 IP

4. **SPA 路由支持**
   - 所有未找到的路由請求重定向到 `index.html`
   - 支持 React Router 等單頁應用

5. **Health Check**
   - `/health` 端點用於容器健康檢查

### Docker 常用命令

```bash
# 查看鏡像列表
docker images

# 查看容器列表
docker ps -a

# 查看容器日誌
docker logs farm-buddy-pro

# 實時查看日誌
docker logs -f farm-buddy-pro

# 進入容器內部
docker exec -it farm-buddy-pro /bin/bash

# 刪除容器
docker rm farm-buddy-pro

# 刪除鏡像
docker rmi farm-buddy-pro:latest

# 清理未使用資源
docker system prune -a
```

## ESLint 配置

### 技術方案

本項目使用了兩種官方的 React 快速刷新方案：

- **@vitejs/plugin-react** 使用 [Babel](https://babeljs.io/) 實現快速刷新
- **@vitejs/plugin-react-swc** 使用 [SWC](https://swc.rs/) 實現快速刷新（推薦）

### 推薦配置

如果開發生產應用，建議啟用類型感知的 lint 規則：

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs..

      // 推薦配置（基礎）
      ...tseslint.configs.recommendedTypeChecked,
      // 或使用更嚴格的規則
      ...tseslint.configs.strictTypeChecked,
      // 或添加風格規則
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs..
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

### React 特定規則

還可以安裝 React 專用的 ESLint 插件：

```bash
npm install --save-dev eslint-plugin-react-x eslint-plugin-react-dom
```

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs..
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

## 常見問題

### Q: 開發時如何訪問本地 API？

A: 開發環境使用 Vite proxy，自動轉發到 `http://localhost:5200`。修改 `vite.config.ts` 的 `proxy.target` 即可。

### Q: Docker 容器內如何訪問宿主機 API？

A: 使用特殊域名 `host.docker.internal`：

```bash
docker run \
  -e VITE_API_TARGET=http://host.docker.internal:5200 \
  -p 80:80 \
  farm-buddy-pro:latest
```

### Q: 如何減小 Docker 鏡像體積？

A: 項目已採用多階段構建，最終鏡像只包含 Nginx 和構建結果，體積已最優化。如需進一步優化：

```bash
# 使用 alpine 版本的 Nginx（不推薦，可能有兼容性問題）
# docker build --build-arg BASE_IMAGE=nginx:alpine -t farm-buddy-pro:slim .
```

### Q: 如何在生產環境使用 HTTPS？

A: 在 Nginx 前面配置反向代理（如 Caddy、Nginx）處理 SSL 證書。

### Q: 如何監控 Docker 容器資源使用？

A: 使用 `docker stats` 命令：

```bash
docker stats farm-buddy-pro
```

### Q: TypeScript 編譯出錯怎麼辦？

A: 運行類型檢查：

```bash
# 在根目錄運行
npm run build

# 或僅檢查類型（不構建）
npx tsc -b --noEmit
```

### Q: 鏡像構建失敗？

A: 嘗試以下步驟：

```bash
# 清除 Docker 快取
docker build --no-cache -t farm-buddy-pro:latest .

# 檢查 Node.js 依賴
npm ci  # 使用 package-lock.json 精確安裝

# 驗證 package.json 依賴
npm audit
```

## 部署建議

### 本地開發
```bash
npm install
npm run dev
```

### 預提交檢查
```bash
npm run lint:fix
npm test
npm run build
```

### 容器化部署
```bash
docker build -t farm-buddy-pro:latest .
docker run -p 80:80 farm-buddy-pro:latest
```