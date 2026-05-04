# 演示文档：配置管理（Trunking）与变更管理流程

负责人角色：运维工程师

## 1. 目标

本演示文档用于支持 Presentation 中的实际操作流程，覆盖以下内容：
- 配置管理（Trunking）实践
- 变更管理流程
- 团队成员个人贡献点展示

## 2. 配置管理（Trunking）实际操作流程

### 2.1 Trunking 模式说明

Trunking 也称为主干开发。该仓库当前采用 `main` 作为主干分支，所有稳定发布的代码最终合并到 `main`。

### 2.2 典型流程

1. **从主干创建特性分支**
   - `git checkout main`
   - `git pull origin main`
   - `git checkout -b feature/<功能名>`

2. **在特性分支上开发**
   - 完成业务功能、代码、测试、文档补充
   - 例如：`feature/user-auth`、`feature/dormitory-management`

3. **持续与主干同步**
   - 定期执行 `git fetch origin`
   - 运行 `git merge origin/main` 或 `git rebase origin/main`
   - 确保分支与 `main` 保持兼容

4. **创建 Pull Request / 合并请求**
   - 提交代码至远程仓库
   - 发起 PR/ MR 请求代码审查
   - 执行代码规范检查与测试脚本

5. **合并到主干**
   - 审查通过后合并到 `main`
   - 采用 `git merge --no-ff` 保留合并历史
   - 触发构建/测试验证

### 2.3 本仓库功能分支示例

基于项目中的功能模块，常见特性分支应包括：

- `feature/user-auth`
- `feature/student-profile`
- `feature/attendance-tracking`
- `feature/late-return-management`
- `feature/cleaning-records`
- `feature/dormitory-evaluation`
- `feature/floor-management`
- `feature/room-management`
- `feature/admin-role-management`
- `feature/visitor-management`
- `feature/dashboard-reporting`
- `feature/ui-enhancement`
- `hotfix/login-issue`
- `docs/readme-update`
- `release/v1.0`

主干分支：`main`

## 3. 变更管理实际操作流程

### 3.1 变更类型

- 代码变更：新特性、修复 BUG、性能优化
- 文档变更：需求说明、设计文档、测试结果、演示材料
- 配置变更：构建脚本、部署配置、环境变量

### 3.2 变更管理步骤

1. **提交变更请求**
   - 通过 Issue 或任务工具记录变更目标与范围
   - 描述变更原因、影响范围、风险点

2. **变更评审与批准**
   - 团队成员评审需求与实现方案
   - 定义验收标准与测试覆盖范围

3. **实施变更**
   - 在特性分支完成开发与测试
   - 更新相关文档和变更记录

4. **验收与合并**
   - 完成代码评审与回归测试
   - 合并到 `main`
   - 若变更涉及配置或部署，执行发布前验证

5. **变更归档**
   - 将变更记录写入项目文档或变更日志
   - 更新 RTM、WBS、任务网络等对应内容

## 4. 展示团队个人贡献点

本项目中每位成员的贡献点建议按以下角色维度展开：

### 4.1 功能开发

- 学生信息管理：实现学生信息的创建、修改、删除和查询功能
- 宿舍信息管理：实现宿舍信息管理、楼层管理、房间分配与舍友匹配
- 早起/晚归统计：实现起床打卡、晚归登记、懒床率统计功能
- 宿舍评价：实现宿舍评分、评价维度和评价记录管理
- 访客管理：实现访客登记与管理功能

### 4.2 后端与接口实现

- Koa 服务搭建：实现 Koa 应用、路由、JWT 认证、中间件配置
- 数据库设计：定义 Sequelize 模型、MySQL 数据库连接与初始化
- 权限控制：实现管理员/超级管理员权限与用户信息校验
- 接口文档：整理后端 API 接口、请求参数与返回示例

### 4.3 前端与交互实现

- 页面布局：实现 Vue + Element UI 的整体页面结构与导航
- 组件开发：完成宿舍选择器、记录表格、级联选择器等复用组件
- 状态管理：实现 Vuex 状态管理与路由权限控制
- 数据展示：实现统计数据页面、报表展示和用户个人信息页

### 4.4 测试与质量保障

- 单元测试：编写前端单元测试与测试脚本
- 代码规范：执行代码 lint、格式化和静态检查
- 运行验证：完成本地开发、构建和部署测试流程

### 4.5 文档与演示支持

- 需求文档：整理需求分析、功能列表和系统架构说明
- 操作手册：编写项目运行环境、安装和启动说明
- 演示材料：准备 Trunking 流程、变更管理流程和团队贡献说明

## 5. Presentation 展示建议

### 5.1 配置管理展示

- 演示命令：
  - `git checkout main`
  - `git pull origin main`
  - `git checkout -b feature/<name>`
  - `git commit -m "feat: ..."`
  - `git push origin feature/<name>`
- 展示远程分支与上游同步关系
- 用当前仓库 `main` 与 `origin/2026-05-04-pzx8` 说明 Trunking 实例

### 5.2 变更管理展示

- 演示流程图：Issue → 评审 → 开发分支 → PR → 合并 → 验收
- 展示文档关联：RTM、WBS、Task Network、RMMM
- 演示如何将变更写入 `docs` 或 `README`

### 5.3 个人贡献演示

- 每位成员展示一条具体工作内容：
  - `Anblackin`：功能开发与业务实现
  - `WizardU`：文档与演示支持
  - `yutan`：项目基础搭建与初始化
- 若实际团队有更多成员，可按角色扩展为前端、后端、测试、产品

## 6. 结论

本演示以 `main` 为 Trunk，按特性分支进行变更开发。变更管理强调需求记录、评审、测试与合并后归档。每位团队成员既要说明自己代码贡献，也要说明文档或管理贡献，以体现协作价值。
