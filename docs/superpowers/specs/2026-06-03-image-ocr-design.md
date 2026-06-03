# 图片文字识别 (OCR) 工具 — 设计

日期：2026-06-03

## 目标

新增一个工具，识别并提取图片中的文字信息（OCR），全程在浏览器本地运行，图片不上传。

## 元数据

- **slug:** `image-ocr`
- **name:** 图片文字识别
- **description:** 识别并提取图片中的文字（OCR），支持中英文
- **category:** `encoding`（与 `image-base64` 同类）
- **icon:** `ScanText`（lucide-react，已确认存在）

## 引擎与依赖

- 新增依赖 `tesseract.js`，纯浏览器端 OCR。
- 通过动态 `import('tesseract.js')` 懒加载（与 `jsbarcode` 在 `barcode-gen` 中的模式一致），避免进入主包。
- 语言包：`chi_sim` + `eng`，由 tesseract.js 默认走官方 CDN（jsDelivr）按需拉取。不做自托管/离线语言包。

## 文件结构（遵循项目约定）

1. `src/tools/registry.ts` — 注册元数据（追加一行 + 导入 `ScanText` 图标）。
2. `src/components/dynamic-tool.tsx` — 追加 `image-ocr` 的 `next/dynamic` 导入。
3. `src/tools/image-ocr/logic.ts` — 纯函数，无 React、无 tesseract：
   - 语言配置常量（`chi_sim+eng`）。
   - `validateImageFile(file)`：校验类型（`image/*`）与大小上限，返回错误文案或 `null`。
   - `formatConfidence(n)`：置信度数值 → 百分比文案。
4. `src/tools/image-ocr/logic.test.ts` — vitest 覆盖 `validateImageFile` 与 `formatConfidence`。
5. `src/tools/image-ocr/index.tsx` — `'use client'` 组件，tesseract 调用与所有副作用隔离于此。

## 交互流程

1. 点击 / 拖拽上传图片（复用 `image-base64` 的 dropzone 模式），显示预览缩略图。
2. 点「开始识别」→ 动态加载 tesseract → 运行 OCR。
3. 识别中：显示**进度条**（tesseract `logger` 回调的 `progress` 0–1，仅 `status === 'recognizing text'` 时映射）。
4. 完成后：`Textarea` 输出识别文本；旁边显示**整体置信度**百分比。
5. 操作按钮：**复制文本** / **下载 .txt** / **清除**。

## 错误处理

- 非图片或超大文件：`validateImageFile` 返回文案，局部 error 提示，不启动 OCR。
- OCR 运行抛错：捕获后显示局部 error 文案；组件整体由 `ToolErrorBoundary` 兜底。

## 验证标准

- `logic.test.ts` 通过：校验非图片文件被拒、合法图片通过、置信度格式化正确。
- `npm run build` 成功（TypeScript + 静态生成新页面 `/tools/image-ocr`）。
- 手动：上传一张含中英文文字的图片，能识别出文本、显示进度与置信度、可复制/下载。

## 非目标 (YAGNI)

- 不做多语言勾选 UI（仅 chi_sim+eng）。
- 不做繁体、日韩等额外语言。
- 不做按区域/逐行框选、不导出富格式（仅纯文本）。
- 不做自托管离线语言包。
