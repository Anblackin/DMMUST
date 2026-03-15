# 宿舍管理系统 UI 定制说明

## 修改概览

根据提供的学校系统 CSS 代码，已将宿舍管理系统的 UI 进行了全面的样式定制，使其与学校系统保持一致的视觉风格。

## 主要修改内容

### 1. 颜色主题定制

#### Element UI 主题色 (`src/styles/element-variables.scss`)
- **主色调**: `#1890ff` → `#2F509A` (学校系统主色)
- **成功色**: `#13ce66` → `#67C23A`
- **警告色**: `#FFBA00` → `#E6A23C`
- **危险色**: `#ff4949` → `#F56C6D`

#### 项目变量 (`src/styles/variables.scss`)
- **蓝色**: `#324157` → `#2F509A`
- **浅蓝色**: `#3a71a8` → `#3b64c1`
- **红色**: `#c03639` → `#FD3647`
- **绿色**: `#30b08f` → `#27975B`
- **黄色**: `#fec171` → `#f2d155`
- **菜单激活色**: `#409eff` → `#2F509A`

### 2. 头部导航栏样式 (`src/layout/components/Navbar.vue`)

- **背景色**: 改为 `#2F509A` (学校系统头部颜色)
- **高度**: 保持 `50px` (与学校系统一致)
- **文字颜色**: 改为白色 `#fff`
- **悬停效果**: 改为 `rgba(255, 255, 255, 0.1)`
- **头像尺寸**: `40px` → `32px` (圆形头像)
- **间距**: 调整为学校系统的间距标准

### 3. 全局样式 (`src/styles/index.scss`)

#### 字体
- 改为学校系统字体:
  ```css
  "Microsoft YaHei", tahoma, Simsun, "Arial Unicode MS", Mingliu, Arial, Helvetica
  ```

#### 按钮样式
- **主按钮**:
  - 背景色: `#2F509A`
  - 字体大小: `14px`
  - 高度: `32px`
  - 最小宽度: `68px`
  - 悬停: `#3b64c1`

- **默认按钮**:
  - 边框色: `#2F509A`
  - 文字色: `#2F509A`
  - 悬停: `#3b64c1`

#### 下拉菜单
- 悬停背景色: `#E7F0FE`
- 悬停文字色: `#2F509A`

### 4. 学校系统主题文件 (`src/styles/school-theme.scss`)

创建了专门的主题文件，包含以下样式类:

#### 头部相关
- `.wmr-wm-app-header` - 应用头部
- `.wmr-user-info` - 用户信息区域
- `.wmr-link-button` - 链接按钮
- `.hv-bright` - 悬停高亮效果

#### 组件样式
- `.wmr-badge` - 徽章样式
- `.wmr-create-menu` - 创建菜单
- `.wmr-create-button` - 创建按钮
- `.wmr-ui` - Element UI 组件样式覆盖

#### Element UI 组件覆盖
- 按钮 (`.el-button`)
- 单选框 (`.el-radio`)
- 复选框 (`.el-checkbox`)
- 选择器 (`.el-select`)
- 输入框 (`.el-input`)
- 表格 (`.el-table`)
- 表单 (`.el-form`)
- 对话框 (`.el-dialog`)
- 消息提示 (`.el-message`)

### 5. 布局尺寸

- **侧边栏宽度**: `210px` (保持不变)
- **头部高度**: `50px`
- **按钮高度**: `32px`
- **表格行高**: `50px`
- **表单标签字体**: `14px`

## 颜色参考

### 学校系统主要颜色
```scss
// 主色调
$primary-color: #2F509A;
$primary-hover: #3b64c1;

// 功能色
$success-color: #67C23A;
$warning-color: #E6A23C;
$danger-color: #F56C6C;
$info-color: #909399;

// 辅助色
$bg-hover: rgba(255, 255, 255, 0.1);
$dropdown-hover: #E7F0FE;
$border-color: #C6C6C6;
$divider-color: #EAEAEA;
```

## 使用建议

### 1. 自定义组件
如果需要创建新的组件，建议使用以下 CSS 类名保持一致性:

- 头部组件: `.wmr-*`
- 用户相关: `.wmr-user-*`
- 按钮相关: `.wmr-button-*`
- 徽章: `.wmr-badge`

### 2. 悬停效果
统一使用以下悬停效果:
```css
&:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
```

### 3. 字体大小
- 正文: `14px`
- 标题: `16px`
- 小号文字: `12px`

### 4. 间距标准
- 小间距: `8px`
- 中间距: `16px`
- 大间距: `32px`

## 注意事项

1. **浏览器兼容性**: 所有修改都兼容主流浏览器
2. **响应式设计**: 已添加移动端响应式样式
3. **主题切换**: 支持不同环境的主题切换 (dev/uat/pro)
4. **可维护性**: 使用 SCSS 变量，便于后续调整

## 下一步建议

1. **测试**: 在不同浏览器中测试显示效果
2. **对比**: 与学校系统进行对比微调
3. **优化**: 根据实际使用情况进行样式优化
4. **文档**: 补充更多组件的使用文档

## 文件清单

修改的文件:
- `src/styles/element-variables.scss` - Element UI 主题色
- `src/styles/variables.scss` - 项目变量
- `src/styles/index.scss` - 全局样式
- `src/layout/components/Navbar.vue` - 头部组件

新增的文件:
- `src/styles/school-theme.scss` - 学校系统主题文件

## 更新日期

2026-03-14
