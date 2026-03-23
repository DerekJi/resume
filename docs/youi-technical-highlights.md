# Youi Insurance — 技术亮点文档

> **内部参考文档。** 从 JIRA 项目 AP（Advisor Portal）和 YD2（YouiDirect 2 / DCQ）挖掘整理，结合两个代码库的代码证据，分析痛点与改进。  
> 暂不发布到简历页面。

---

## 背景

| 产品 | JIRA | 时间段 | 技术栈 |
|------|------|--------|--------|
| **Advisor Portal (AP)** | `AP-*` | 2023.01 – 2024.01 | .NET 8, Angular, ScreenDriver BFF, PAS, Summit, Azure Redis/SignalR |
| **Direct Customer Quotes (DCQ)** | `YD2-*` | 2024.02 至今 | .NET 8, Angular 20, ScreenDriver BFF, PAS/Summit, Azure, Elastic APM |

两个产品均采用 **ScreenDriver** BFF 架构：C# 定义 Flow/Step/Control，Angular 动态渲染界面。

---

## 面试重点精选（Senior Engineer 能力体现）

> 以下四个案例最能体现系统性思维与 Senior-level 工程判断力，适合在面试中重点展开。  
> 描述刻意以通用技术语言呈现，不依赖对具体代码库的了解。

---

### ★ 案例一：多实例环境下的分布式缓存一致性问题

**背景**

系统部署在云端多个横向扩展的应用实例上，某核心业务数据使用了**实例本地内存缓存**（In-Memory Cache）。

**问题**

负载均衡将同一用户前后两次请求分发到不同实例时，第二个实例的本地缓存为空，返回了错误的空数据——数据实际存在，只是在另一个实例里。问题是**间歇性的**，测试环境难以稳定复现，但生产环境持续出现，给业务方造成困扰。

**根因分析**

通过云端日志关联请求路由路径，确认不是数据本身的问题，而是**系统架构层面的设计缺陷**：缓存粒度不匹配部署形态——单机缓存遇上了多实例部署。

**解决过程**

1. 将问题数据从实例本地内存迁移到**分布式共享缓存（Redis）**，所有实例共享同一份数据
2. 迁移中遇到额外技术挑战：框架使用了复杂的多态继承对象图，标准 JSON 序列化器与 Redis 不兼容；通过实现自定义序列化工厂绕过框架限制，确保序列化稳定
3. 问题从根本上消除，水平扩展不再引入数据不一致

**亮点**

- 识别出"代码无误、架构有误"的间歇性问题——这类问题比纯代码 bug 更难定位
- 解决方案同时处理了主问题（缓存粒度）和次生技术障碍（序列化兼容性），而非只打补丁

---

### ★ 案例二：异步后端协调——消除 Time-of-Check/Time-of-Use 竞态

**背景**

工作流引擎调用外部核心业务系统（Policy Administration System）写入数据。该系统是异步处理架构：API 返回 HTTP 200 仅代表"请求已接收"，**并不保证数据已完成写入**。

**问题**

原有设计将"提交写入"和"跳转到展示界面"放在同一个步骤里。由于外部系统异步处理，后续界面加载数据时，写入可能尚未完成，导致用户看到空白或过期数据——这是典型的 **TOCTOU 竞态条件**（检查时刻 ≠ 使用时刻）。

**解决过程**

1. 将"提交 + 展示"拆成两个串行的独立步骤：
   - **Step 1**：仅负责向外部系统发起写入请求
   - **Step 2**：以轮询+超时策略确认外部系统完成写入后，才允许流程前进
2. 对存在多个并发后端 Job 的结算流程，引入**聚合等待门控**：收集所有 Job 的完成信号，全部就绪才放行
3. 引入合理的超时和重试策略（Polly），避免无限等待
4. 此模式被推广为整个系统的异步任务协调规范

**亮点**

- 把一个"界面 bug"的根因准确归类为"异步协调缺失"，避免了治标不治本
- 设计的解决范式具有复用性，影响超出了单个功能点

---

### ★ 案例三：四层弹性决策引擎——业务路由的系统设计

**背景**

在用户进入结算流程时，系统需要实时决定：该用户**继续全程在线自助**，还是**转接人工呼叫中心**。决策信号来自外部 CRM 系统，但同时要满足多种约束。

**问题**

朴素设计（每次都调一次外部 API 决策）无法满足以下业务需求：

- 续保/已缓存用户不需要重复决策（性能 + 幂等）
- 用户已在 UI 中主动选择过，应尊重其意愿（用户体验）
- 测试/QA 场景需要强制覆盖决策，不能依赖外部 API（可测试性）
- 外部 API 偶发不可用时，不能中断用户流程（弹性）
- 每次决策都需要被记录，供数据分析使用（可观测性）

**解决过程**

设计了一个**四层级联决策链**（短路求值，满足条件即停止）：

```
1. 缓存层       → 续保/复水会话直接复用历史决策，跳过后续层
2. 用户意愿层   → 用户已通过弹窗主动选择时，尊重用户决定
3. Feature Flag → 测试人员/呼叫中心可通过配置强制覆盖，无须真实外部调用
4. 外部 API 层  → 前三层均未命中时，实时查询外部 CRM；查询失败时降级为"继续在线"
```

每次决策完成后记录结构化事件（含决策原因和渠道结果），供 BI 分析渠道分配效率和转化漏斗。

**亮点**

- 一个决策引擎同时满足了**正确性、可测试性、弹性、可观测性**四个维度，而非单纯实现功能
- 优雅降级模式（外部 API 失败不影响用户体验）是系统设计成熟度的体现

---

### ★ 案例四：生产事故响应——静默 Breaking Change + 幂等性双重保障

**背景**

系统结算流程的最后一步需要调用外部核心业务系统完成"创建并确认保单"操作。此操作**不可逆**，重复执行会导致数据错误。

**问题一：静默 Breaking Change**

外部系统团队**未升级 API 版本**，悄然新增了对某个字段的校验规则：原来发送空数组是合法的，新规则要求字段完全缺失而非为空。系统沿用原有合法 payload，在生产环境触发了**超过 100 次请求失败**，影响真实用户的购买完成。

**根本原因排查过程**：

1. 通过分布式追踪日志筛选该错误码的所有失败请求
2. 对比成功请求与失败请求的请求体差异（diff）
3. 精确定位到**一个字段的序列化行为差异**——有核保条件时永远成功，无核保条件时永远失败

**问题二：幂等性**

如果该操作失败后自动重试，或用户网络超时后重新提交，可能重复执行，导致重复保单数据。

**解决过程**

- **紧急修复**：调整序列化逻辑——无数据时完全省略字段，而非发送空集合（one-line fix, maximum impact）
- **系统性加固**：全面对比系统发送的所有字段与外部 API 实际需要的字段，剔除冗余字段，缩小未来静默 breaking change 的爆炸半径
- **幂等性保障**：操作完成后（无论成功或失败）设置持久化完成标志，后续重试请求检测到标志后直接跳过；用 try/catch/finally 确保标志在任意异常路径下都能被正确写入
- **可观测性**：引入成功率指标采集并关联到每次请求，生产事故从此可被实时监控

**亮点**

- 从"改一行代码"出发，推进到"系统性加固外部依赖契约 + 操作幂等性"——体现了 Senior 工程师在修 bug 时同步修体系的习惯
- 同时处理了两类不同性质的可靠性问题：外部依赖变更防御 + 内部幂等性保障

---

## Advisor Portal (AP) — 2023

---

### 1. 异步任务解耦：消除 PAS 竞态条件

**Ticket：** AP-2670 · AP-2692

#### 痛点

PAS（Policy Admin Service）是异步处理系统：调用 API 后数据写入不即时完成。  
原有的 `CreatePolicyholderTask` 是"发射后不管"设计——调用完 PAS API 立即跳转下一界面，导致：
- Hub Flow 展示时，ABN、地址、姓名等字段显示为空或过期数据
- Final Details 多个后端任务仍在运行时，Verification Step 就提前出现

#### 代码证据

```csharp
// CreatePolicyholderTask.cs（ap/src/Youi.AdvisorPortal.Flows.Sbi）
public override async Task ExecuteAsync(NewPolicyFlow data)
{
    if (!string.IsNullOrWhiteSpace(Context.PolicyNumber))
    {
        if (data.Policyholder.PolicyBelongToWhom == FlowsLookup.PolicyBelongToWhomValue.Business)
            await _policyAdminRestClient.Policy.SetPolicyholderBusiness(...);
        else
            await _policyAdminRestClient.People.UpdatePolicyholder(...);

        SetResponseAwaitable(); // 标记"等待 PAS 异步完成"，阻止流程提前跳转
    }
}
```

#### 改进

1. 将 `CreatePolicyholderTask` 拆为两个串行任务：一发请求，一轮询等待
2. Hub Flow 入口被第二个任务门控，PAS 返回成功后才允许跳转
3. Verification Step 同理：所有 Final Details 后台 Job 全部完成后才放行
4. 此模式成为整个 AP 异步任务协调的标准范式

---

### 2. 分布式缓存：修复多 Pod 核保消息不同步

**Ticket：** AP-2560

#### 痛点

AP 部署在 Azure 多个 Pod 上，核保（UW）消息存储在 **Pod 本地 `IMemoryCache`**。  
负载均衡将后续请求路由到不同 Pod 时，该 Pod 缓存为空，返回空核保列表——顾问看到"干净"清单，实际上应有警告，影响业务合规。

#### 代码证据

```csharp
// Program.cs（ap/src/Youi.AdvisorPortal.Api）
builder.AddRedisHybridCacheFoundations(ConnectionStringNames.Redis, cacheBuilder =>
{
    // ScreenDriver DTO 涉及复杂继承，System.Text.Json 有兼容问题
    // 改用 Newtonsoft.Json + 自定义转换器确保序列化稳定
    var jsonSerializer = JsonSerializer.CreateDefault();
    jsonSerializer.Converters.Add(new LookupValueJsonConverter());
    cacheBuilder.AddSerializerFactory(
        new NewtonsoftHybridCacheSerializerFactory(jsonSerializer));
});
```

#### 改进

- 将核保消息迁移到 Azure Redis（`AddRedisHybridCacheFoundations`，所有 Pod 共享同一份缓存）
- 彻底消除水平扩展时数据不一致
- 同时解决 Redis 与 ScreenDriver DTO 的 JSON 序列化兼容问题（自定义序列化工厂）

---

### 3. 地址服务迁移：以内部服务替代第三方 Experian

**Ticket：** AP-2636

#### 痛点

AP 提供 Experian（第三方）和 Youi 内部两条地址输入路径。Experian 返回的建议存在质量问题（邮编与城区不匹配），导致写入 PAS 的地址数据错误。

#### 改进

- 将默认地址输入从 Experian 切换为 Youi 内部地址服务（精度优先）
- Experian 降为次选手动输入路径
- 修改 ScreenDriver 地址控件配置和集成层，实现无缝切换

---

### 4. AutoMapper 全面替换手写映射器

**Ticket：** AP-2760 · AP-2759 · AP-2754 · AP-2753 · AP-2740

#### 痛点

`PostRiskMapper`、`GetRiskMapper`、`RiskDetailToCoverSummaryMapper`、`PolicyDetailToSummaryTabMapper`、`AddressMapper` 五个类均为手写逐属性赋值：零测试覆盖、维护成本高、新增字段易遗漏。

#### 代码证据

```csharp
// ap/src/Youi.AdvisorPortal.Common/Mapper/MapperExtension.cs
using AutoMapper; // 统一 Mapper 扩展

// ap/src/Youi.AdvisorPortal.Flows.Administration/.../SaveUnderwritingOverridesTask.cs
using AutoMapper; // UW 相关任务也统一使用 IMapper
```

#### 改进

- 五个 Mapper 类全部改用 AutoMapper Profile
- 代码量大幅减少，映射关系清晰可读
- 每个 Mapper 补充 NUnit + Shouldly 单元测试，覆盖所有属性映射路径
- 建立统一映射注册模式，后续新增映射无需手写转换逻辑

---

### 5. 单元测试分支覆盖率提升至 ≥85%

**Ticket：** AP-2908 · AP-2907 · AP-2906 · AP-2895 · AP-2894

#### 痛点

`IErrorStates`、`UnderwritingMessageExtensions`、`PasRiskExtensions`、`BasePolicyFlowContext` 等核心领域类分支覆盖率远低于 85% 工程标准，被静态分析工具标记为"风险热点"，CI 门控无法通过。

#### 改进

- 针对每个决策分支（null 检查、枚举转换、条件逻辑）编写 NUnit/Shouldly 测试
- 包括边界条件：空集合、枚举越界、并发场景
- 覆盖率提升到绿色区间，被设为 PR 门槛，防止后续代码劣化

---

### 6. 核保重新触发机制

**Ticket：** AP-2592

#### 痛点

顾问在 People 子流程（联系人、被保人）中修改信息后返回 Hub Cover Summary 时，核保检查不会重新触发。修改了职业、出生日期等字段若影响保费，顾问无法收到警告，存在业务合规风险。

#### 改进

- 在 People Flow 退出时设置"已修改"脏标志
- Hub Flow 入口检测到该标志后，自动触发核保编排任务
- 单元测试验证脏标志的设置/清除生命周期，确保幂等性

---

### 7. 开发环境稳定化：指向 Summit TEST/TRAIN 的 PoC

**Ticket：** AP-2213

#### 痛点

Summit DEV 环境因频繁部署更新或意外数据损坏而不可用，曾多次导致整个 AP 团队无法本地调试，严重阻塞开发进度。

#### 改进

- 调查并记录了将本地开发实例连接到更稳定的 Summit TEST（及 TRAIN）环境的完整方案
- 产出可复现的 PoC 文档，经全体 AP 团队成员验证通过
- 成为 AP 团队推荐的本地开发工作流，显著减少环境阻塞时间

---

### 8. 数据仓库时间戳修复：本地时间 → UTC

**Ticket：** AP-2978

#### 痛点

`QUOTE.CREATION` 事件发出的时间戳为本地时间（AEST/AEDT），而数据仓库中其他所有事件均为 UTC+00:00。跨事件 JOIN 时时间序列报表产生 10 小时偏差，导致 BI 分析结论错误。

#### 改进

- 将 `QUOTE.CREATION` 事件时间戳修改为 UTC
- 部署前与 BI 分析师确认下游影响，确保数据管道平滑过渡

---

### 9. 404 页面守卫：URL 缺少 Policy Number 时优雅降级

**Ticket：** AP-2699

#### 痛点

顾问直接访问缺少/格式错误 Policy Number 的 Flow URL 时，应用在流程初始化深层抛出未处理异常，界面崩溃，没有任何提示信息。

#### 改进

- 在 Hub/Risk/Checkout Flow 入口增加 Policy Number 守卫
- 早期检测无效 URL 并路由到描述性 404 页面
- 消除了未处理异常路径，改善顾问体验

---

### 10. 重构 LookupDataServiceFactory：降低圈复杂度

**Ticket：** AP-2822

#### 痛点

`LookupDataServiceFactory` 被静态分析工具标记为"风险热点"：高圈复杂度 + 覆盖率不足，难以维护且容易引入隐性 bug。

#### 改进

- 将大段 if-else 条件派发逻辑重构为注册表（Registry）模式
- 圈复杂度从红色降至绿色
- 补充 NUnit 测试达到分支覆盖要求

---

## Direct Customer Quotes (DCQ / YD2) — 2024 至今

---

### 11. 架构落地：Stratos ScreenDriver 深度研究与文档化

**Ticket：** YD2-11 · YD2-13 · YD2-14

#### 痛点

加入 DCQ 团队时，Stratos ScreenDriver 架构对新成员极不透明：Flow Engine、ScreenDriver 控件、Yoda 设计系统与各外部服务的关系均无系统文档，新人上手成本极高。

#### 改进

- 产出 ScreenDriver 架构代码示例文档（Flow Engine → ScreenDriver → Yoda 三层关系）
- 梳理 SBI 模块完整依赖图谱：ProGet 内部 NuGet、PAS、Summit、Lookups、Consent、LaunchDarkly、认证、日志
- 建立 GitHub Actions CI/CD 基线（`pr-ci.yml`）、NUnit+NSubstitute 单元测试脚手架、Playwright E2E 测试配置
- 这三张票奠定了 DCQ 整个团队的开发规范基础

---

### 12. 架构决策：SignalR → 轮询

**Ticket：** YD2-1805

#### 痛点

DCQ 最初使用 SignalR WebSocket 将后端状态变更（如"PAS Risk 已创建"）实时推送到 Angular 前端：
- BFF 需维护 Hub 连接、连接组、连接生命周期，复杂度高
- 移动设备网络抖动时频繁出现 WebSocket 断线 bug
- 每次部署需处理连接状态优雅断开/重连

#### 代码证据

```csharp
// CreateAndAcceptRiskTask.cs（dcq）— 改为主动轮询确认 Risk 已创建
internal async Task EnsureRiskCreatedAsync(string policyNumber)
{
    // The polling Retry Strategy is set in ConfigurePolicyAdmin (Polly)
    var risk = await policyAdminService.GetVehRiskAsync(policyNumber);
    if (risk is null)
        Logger.LogError("Cannot find the created risk for policy {PolicyNumber}", policyNumber);
}
```

#### 改进

- 移除 SignalR，改为 Angular 客户端对关键操作进行轮询
- 轮询重试策略集中配置在 `ConfigurePolicyAdmin`（Polly），统一管理
- 前端连接复杂度清零，生产断线 bug 不再出现
- BFF 架构更简洁，可测试性更高

---

### 13. FlowState ID 不匹配：根因分析与修复

**Ticket：** YD2-1825

#### 痛点

Elastic 生产日志持续出现 `FlowState ID mismatch` 错误，请求被 `UnauthorizedAccessException` 拒绝，用户流程中断。

#### 代码证据

```csharp
// SessionValidator.cs（dcq/src/...Core/Services）
public void EnsureFlowStateIdMatches(Guid expectedFlowStateId)
{
    var actualFlowStateId = GetGuidFromCurrentUser(appAuthenticationOptions.FlowStateClaimType);
    if (expectedFlowStateId != actualFlowStateId)
    {
        logger.LogError(
            "FlowState Id mismatch for {PolicyNumber}. Expected: {ExpectedFlowStateId}, Actual: {ActualFlowStateId}",
            policyNumber, expectedFlowStateId, actualFlowStateId);
        throw new UnauthorizedAccessException("FlowState Id does not match token.");
    }
}
```

#### 改进

- 通过日志分析定位根因：浏览器回退导致客户端持有旧版 FlowState ID（内存快照），而服务端已更新
- 修复：前端在回退导航时强制从服务器重新获取权威 FlowState ID，不再使用缓存快照
- 同时加入 `EnsureSessionUniquenessIdMatches` 防止并发会话冲突

---

### 14. 策略号码提前创建：移入 INIT 流程

**Ticket：** YD2-1616

#### 痛点

策略号码（Policy Number）原先在用户填完车辆信息后才创建，导致：
- 前几步骤无稳定身份标识，事件日志无法关联
- 无法在早期步骤就生成含 `policyNumber` 的 JWT 令牌
- 报价恢复（Resume）时缺乏锚点

#### 代码证据

```csharp
// InitializeService.cs（dcq/src/...Api/Services/Initialize）
// INIT 阶段：调用 CreatePolicyAsync() 立即创建策略号码
var createPolicyResult = await provider.CreatePolicyAsync();

// 轮询确认策略已在 PAS 创建完成
if (policyCreated)
{
    var policy = await pasService.GetPolicyAsync(createPolicyResult!.PolicyNumber);
    if (policy == null)
        return new InitializeResult(false, $"Policy {createPolicyResult.PolicyNumber} was not found after creation.");
}

// 同时标记合成流量，防止机器人污染指标
if (metricService.IsSyntheticTraffic())
    quoteMetaData.IsSyntheticsBot = true;

// INIT 完成后即将 policyNumber 编入 JWT，所有后续步骤均可安全校验
var entityData = await provider.CreateFlowModelAsync(quoteMetaData, sessionId, createPolicyResult);
```

#### 改进

- 策略号码在第一步（INIT）就创建，整个会话有统一身份标识
- 从第 1 步起即携带 `policyNumber`，数据仓库可完整关联报表
- INIT 同时颁发含 `policyNumber` 的 JWT，后续所有步骤均可安全校验

---

### 15. SF 决策模型：在线 vs 呼叫中心智能路由

**Ticket：** YD2-1733 · YD2-1743 · YD2-1744 · YD2-1745

#### 痛点

DCQ 最初对所有用户提供相同的全在线报价体验，部分高风险/复杂场景客户强制走在线流程导致转化率低和客户体验差。

#### 代码证据

```csharp
// SwitchFlowService.cs（dcq/src/...Flows.Core/Services）— 四层决策链
public async Task<SwitchFlowDecision> GetSwitchFlowDecision(BaseFlowModel flowModel)
{
    // 1. 续保/复水报价：直接复用已有决策
    if (flowModel.SwitchFlowDecision == SwitchFlowDecision.ContinueOnline || flowModel.IsRehydrated)
        return SwitchFlowDecision.ContinueOnline;

    // 2. 用户已通过弹窗自主选择：尊重用户决策
    if (flowModel.HasClientMadeSwitchFlowDecision)
        return flowModel.SwitchFlowDecision;

    // 3. LaunchDarkly Feature Flag 覆盖（QA/呼叫中心测试用）
    var result = GetDecisionOverride(flowModel);

    // 4. Summit API 实时查询：BusinessOpenClientCallable + SwitchFlowResult
    if (result == SwitchFlowDecision.None)
    {
        if (!flowModel.AvailableToAcceptLeads.GetValueOrDefault())
            return SwitchFlowDecision.ContinueOnline;
        result = await GetSummitDecisionAsync(flowModel);
    }
    return result;
}

// 每次路由决策记录 SalesChannelCalculated 事件
private void LogSalesChannelCalculated(...)
{
    var reason = summitDecision.AllocationPath switch
    {
        AllocationPaths.BusinessClosed              => SalesChannelSelectionReason.Closed,
        AllocationPaths.BusinessOpenClientCallable  => SalesChannelSelectionReason.Callable,
        AllocationPaths.BusinessOpenClientNotCallable => SalesChannelSelectionReason.NotCallable,
        _ => throw new NotImplementedException()
    };
    quoteKeyEventRecorder.RecordQuoteSalesChannelCalculated(...);
}
```

#### 改进

- **四层决策链**：缓存 → 用户选择 → Feature Flag 覆盖 → Summit 实时查询
- 查询 Summit 两个端点：`BUSINESS_OPEN_CLIENT_CALLABLE`（是否接受呼叫）和 `SWITCH_FLOW_LEAD_TYPE`（路由结果）
- `OverrideSfDecisionModel` LaunchDarkly Flag 支持 QA/呼叫中心免 Summit 测试
- 每次路由决策记录 `QuoteSalesChannelCalculated` 事件，BI 可分析渠道分配效率
- Summit 调用失败时降级为"继续在线"，保证用户体验不中断

---

### 16. Lead Gen 集成：Summit 潜在客户创建与邮件重激活

**Ticket：** YD2-1610 · YD2-1576 · YD2-1642

#### 痛点

被路由到呼叫中心的用户，如果呼叫中心 3 次拨打失败，线索永久丢失——无自动化重激活机制。

#### 改进

- 接入 Summit `GenericLeadCreate` API，在 SF 决策后创建呼叫中心 Lead 记录（复用 SBI 相同接口）
- 与 Summit 团队协同（PRC 15349）扩展 Summit，支持"重激活邮件"逻辑：3 次联系失败后自动给用户发送续接链接
- Lead Gen 分三阶段发布（Phase 3：工作日 10am–4pm 全自动，非工作时段纯在线），通过 Feature Flag 控制
- 这是 DCQ 与 Summit 最深度的双向接口改造之一

---

### 17. Elastic APM：分布式追踪精准过滤 & 合成流量隔离

**Ticket：** YD2-1609 · YD2-1861

#### 痛点一（YD2-1609）

Elastic RUM SDK 默认向**所有**出站请求注入 `traceparent` 头，包括对第三方 API（Google Maps、GTM）的请求：
- 第三方服务不接受该非标头，触发 CORS 错误
- Trace Context 泄露到 Youi 基础设施之外

#### 改进（YD2-1609）

- 配置 RUM SDK 仅对目标为 DCQ BFF 的请求注入 `traceparent` 头
- 第三方请求 CORS 恢复正常，端到端追踪链路（Angular → BFF → PAS）完整保留

#### 痛点二（YD2-1861）

Elastic APM Synthetics 每分钟探测 DCQ 端点，合成请求污染延迟直方图和转化漏斗指标，导致报表数据失真。

#### 代码证据

```csharp
// SyntheticTrafficMiddleware.cs（dcq/src/...Api/Middleware）
public async Task InvokeAsync(HttpContext context)
{
    if (context.Request.Headers.TryGetValue(HttpContextItems.UserAgentHeader, out var userAgent) &&
        userAgent.ToString().StartsWith(
            HttpContextItems.SyntheticUserAgentPrefix, // "YouiInsurance/Synthetics"
            StringComparison.OrdinalIgnoreCase))
    {
        context.Items[HttpContextItems.IsBotKey] = true; // 标记为合成流量
        _logger.LogInformation("Synthetic traffic identified...");
    }
    await _next(context);
}

// MetricService.cs — 所有指标记录前跳过合成流量
public bool IsSyntheticTraffic() =>
    httpContextAccessor.HttpContext?.Items
        .TryGetValue(HttpContextItems.IsBotKey, out var isBot) == true
    && isBot is bool botFlag && botFlag;
```

#### 改进（YD2-1861）

- `SyntheticTrafficMiddleware` 识别 `YouiInsurance/Synthetics` User-Agent，标记请求
- `MetricService` 中所有指标记录前检查此标志，合成流量自动跳过
- 合成流量仍正常记录日志（用于 SLA 监控），但不影响业务报表
- INIT 阶段同样检查并记录 `quoteMetaData.IsSyntheticsBot`

---

### 18. 可观测性：精确埋点 `PROVISIONAL.WAYPOINT.REACHED` & GTM 隐私合规

**Ticket：** YD2-1591 · YD2-1753 · YD2-1770

#### 痛点

- 数据仓库团队无法确定用户"到达有价值报价节点"的精确时刻，`step-reached` 事件粒度过粗，漏斗锚点不可靠
- GTM 营销再定向需要用户 PII，直接发送明文不符合隐私合规（GDPR/APA）

#### 代码证据

```csharp
// AnalyticsConstants.cs（dcq/src/...Core/Constants）
public const string ProvisionalWaypointReached = "PROVISIONAL.WAYPOINT.REACHED";
public const string QuoteLegacyIntentMilestoneReached = "QUOTE.LEGACY.INTENT.MILESTONE.REACHED";

// InsuranceHistoryPreTask.cs — Parking 步骤触发 Waypoint（onlyOnce 保证幂等）
BaseWorkflowTaskService.LogAnalyticsEvent(
    AnalyticsConstants.ProvisionalWaypointReached, data, Context, onlyOnce: true);

// RecordLegacyMilestoneReachedTask.cs — 支付后触发里程碑事件
LogIfNotCompleted(LoggingCompletionNames.KEYEVENT_QUOTELEGACYINTENTMILESTONEREACHED, () =>
{
    quoteKeyEventRecorder.RecordQuoteLegacyIntentMilestoneReached(
        SalesChannel.Online, data.ConsentId, data.Sqid,
        data.ConsumerProduct, data.SummitQuoteNumber, ...);
});
```

```typescript
// analytics-manager.service.ts（dcq Angular）— SHA-256 哈希 PII
import { sha256 } from 'js-sha256';

// 发送 GTM 事件前，对邮箱/手机做哈希，原始数据不离开 Youi 基础设施
this.angulartics2Gtm.pushLayer({
  event: 'online-quote-complete',
  hashedQuoteData: {
    email: sha256(policyholder.email),
    phone: sha256(policyholder.phone),
  }
});
```

#### 改进

- `PROVISIONAL.WAYPOINT.REACHED` 在 Parking 步骤触发，`onlyOnce: true` 防止重复计数，成为 BI 漏斗主锚点
- `LogIfNotCompleted` 幂等模式：用户前进/后退反复操作不会重复触发里程碑
- GTM 事件仅发送 SHA-256 哈希摘要，可用于再定向匹配但无法还原原始 PII
- 全面审计所有 Activity Logger 事件（YD2-1753），标准化命名，补充缺失事件点

---

### 19. 报价续接：基于 Blob 上下文的智能路由 & 购买后锁定

**Ticket：** YD2-1582 · YD2-1648

#### 痛点一（YD2-1582）

用户通过邮件链接重新进入报价流程时，只能从头开始，无法回到上次离开的步骤，严重影响完成率。

#### 改进（YD2-1582）

- BFF 读取 Blob/SEED 中存储的 FlowState 上下文，识别用户上次完成的步骤
- 智能路由：直接带用户到下一个待完成步骤，不重走已完成步骤
- 覆盖边界场景：会话过期、支付步骤未完成、购买后浏览器回退

#### 痛点二（YD2-1648）

用户完成支付到达确认页后，点击浏览器回退键可以回到报价流程，绕过"已售出保单不可编辑"锁定，存在重复提交风险。

#### 改进（YD2-1648）

- 诊断：锁定检查从 Cosmos DB 读取，但支付完成后锁定状态仅写入了 Summit，未及时同步回 Cosmos
- 修复锁定状态写入时序，添加服务端每次流程转时的"已接受状态"二次校验
- 对已接受保单的任何 Flow 操作请求均返回拒绝，防止重复 Risk 创建

---

### 20. 内存泄漏修复：Youi Foundations 升级

**Ticket：** YD2-1854

#### 痛点

Elastic APM Dashboard 显示 SEED 服务内存持续线性增长，高负载后不回落，最终导致 OOM 重启，影响服务稳定性。

#### 改进

- 通过 APM 内存火焰图定位到 Youi Foundations 内部库（版本 < 2.08）存在内存泄漏
- 升级至 ≥ v2.08 补丁版本
- 升级后 APM Dashboard 确认内存增长曲线完全消失，服务恢复稳定

---

### 21. PAS API 可靠性：生产异常根因分析与修复

**Ticket：** YD2-1900 · YD2-1910 · YD2-1921

#### 痛点（YD2-1900）

PAS 团队在未做 API 版本升级的情况下新增 `ConditionsOfCover` 字段校验规则。DCQ 沿用原有 payload，导致生产环境 **117 次 `create-and-accept-risk` 请求失败**，影响真实用户购买。

#### 代码证据

```csharp
// CreateAndAcceptRiskTask.cs（dcq）— 完整错误处理与幂等保护
try
{
    var payload = context.ResolveMapper<IVehCreateAndAcceptRiskRequestMapper>()
        .Map(seed.Data, context);
    await policyAdminService.CreateAndAcceptRiskAsync(policyNumber, payload);
    data.FinalConfirmation.CreateAndAcceptRiskSuccessful = true;

    MetricService.RecordCreateAndAcceptRisk(tags); // 记录指标跟进成功率
    await EnsureRiskCreatedAsync(policyNumber);    // 轮询确认 Risk 已创建
}
catch (Exception ex)
{
    Logger.LogError(ex, "Failed to create and accept risk for policy {PolicyNumber}", policyNumber);
    data.FinalConfirmation.CreateAndAcceptRiskSuccessful = false;
}
finally
{
    data.CreateAndAcceptRiskCompleteFlag = true; // 防止重复执行（幂等保护）
}
```

#### 改进

- 通过 Elastic 日志定位 `ConditionsOfCover` 为触发字段，无核保条件时不再发送该字段（而非发送空数组）
- 紧急修复部署，117 次失败归零
- 系统性对比 DCQ payload 与 PAS API 合同（YD2-1921），清理所有冗余字段，降低 PAS 悄然收紧校验的未来爆雷风险
- 调查 `Refit.ValidationApiException` 集群（YD2-1910），每类错误条件对应前置输入校验，并在 DCQ 侧给用户友好提示

---

### 22. SBI 生产回归：流水线环境变量修复

**Ticket：** YD2-1923 · YD2-1754

#### 痛点

SBI v1.1.35 上线后立即在所有非生产环境失效（回滚 v1.1.34 后恢复）。症状为 Summit API 行为异常，根因隐蔽。

#### 改进

- 排查发现 `IsProduction` 标志（控制 Summit 生产/测试行为切换）在 v1.1.35 CI 流水线新增构建阶段时未继承环境变量注入
- 修复流水线，在 DEV 验证后重新发布
- 根本修复（YD2-1754）：将 `IsProduction` 判断从构建时变量改为**运行时环境名称检测**，彻底消除流水线参数配置遗漏的可能性

---

### 23. SBI ScreenDriver 框架升级与 DCQ 对齐

**Ticket：** YD2-1810

#### 痛点

SBI 的 ScreenDriver 版本落后于 DCQ VEH，存在大量 SBI 专属自定义控件和 workaround，随框架演进越来越难维护。

#### 改进

- 将 SBI ScreenDriver NuGet 包和 Angular npm 包升级到与 DCQ VEH 一致的版本
- 删除已被框架原生支持的 SBI 自定义控件，改用标准 ScreenDriver 等效实现
- 评估了将 SBI 迁入 DCQ Monorepo 的可行性（作为 MCL 集成方式的前期调研）

---

### 24. SBI Profile Service 反序列化修复

**Ticket：** YD2-1792

#### 痛点

`Youi.Integration.ProfileService` 存在 bug：以 leading-zero 字符串格式存储的手机号（如 `"0412345678"`）在反序列化时被识别为整数，leading zero 被截断，触发 `FormatException`，导致 SBI 用户联系信息写入失败。

#### 改进

- 升级到 Profile Service 补丁版本
- 补充反序列化单元测试，防止同类回归

---

### 25. 摩托车险（MCL）：全新产品线从零搭建

**Ticket：** YD2-1718 · YD2-1853 · YD2-1857 · YD2-1928 · YD2-1929 · YD2-1967 · YD2-1878 · YD2-1876 · YD2-1872

#### 描述

在 DCQ 中从零构建摩托车险（MCL）产品线，完整覆盖从架构脚手架到 PAS 核保的全链路。

**脚手架和架构（YD2-1857、YD2-1928）**

按照 VEH 模块的 ScreenDriver 模块模式，创建新的 DCQ 模块：Flow Definition、Step Controller、Process Controller、Flow Model。

```csharp
// dcq/src/Stratos.Youi.Direct.Customer.Quotes.Flows.Motorcycle
// Constants/StepNames.cs — 步骤路由定义
public const string MotorcycleCondition = "motorcycle-condition";
// Constants/CoverOptionDisplayItems.cs — 三种险种选项 COMP / TPFT / TP
// Services/UnderwritingService.cs — MCL 核保逻辑（ConditionsOfCover 水合）
// Validators/ — EmailValidator、DateOfBirthValidator、MobileNumberValidator
```

**SEED 数据模型（YD2-1718）**

基于 `PersonalisedRiskModel` 基类创建 MCL 专属 SEED 数据模型，支持 MCL 风险数据跨步骤持久化。

**车辆查询 API V2（YD2-1853）**

接入 Vehicle Service V2 端点（`/v2/motorcycles/makes`、`/v2/motorcycles/models`），与 VEH 的汽车查询接口分离。

**核保集成（YD2-1967）**

对接 PAS 核保端点进行 MCL 风险评估，`UnderwritingService.cs` 中实现 `ConditionsOfCover` 水合和 Special Condition 处理。

**广告追踪（YD2-1929）**

将 URL 参数中的 UTM/adResponse 数据同步到 SEED，复用 VEH 的追踪设计模式。

**流程步骤（YD2-1878/1876/1872）**

构建就业信息、驾驶事故历史（含条件展示逻辑）、使用类型等步骤，使用 LaunchDarkly Feature Flag（`ReleaseMotorcycleFlow`）控制发布节奏。

---

### 26. GitHub Copilot 仓库指令文档

**Ticket：** YD2-1778

#### 背景

DCQ 仓库没有系统性开发规范文档，AI 辅助工具生成代码质量参差不齐，新成员上手慢。

#### 改进

- 撰写并合并了完整的 `.github/copilot-instructions.md`，涵盖：构建/测试命令、项目结构、架构模式、代码风格约定、集成开发指引、健康检查标准
- 依据 GitHub 官方自定义指令文档规范配置，确保 VS Code 和 GitHub PR 页面均能加载
- 提升全团队 AI 辅助编程的代码生成准确性（本文档展示的项目即为实例之一）

---

## 技术主题汇总

| 主题 | 相关 Ticket | 核心价值 |
|------|-------------|----------|
| 异步任务编排 | AP-2670, AP-2692 | 消除 PAS 竞态，确保界面数据一致性 |
| 分布式缓存 | AP-2560 | 修复多 Pod 核保消息不同步 |
| 可观测性与分布式追踪 | YD2-1591, YD2-1609, YD2-1753, YD2-1770, YD2-1861 | 精准漏斗指标、端到端追踪、隐私合规分析 |
| Lead Gen & Summit 集成 | YD2-1610, YD2-1576, YD2-1642, YD2-1733–1745 | 智能渠道路由、呼叫中心交接、邮件重激活 |
| PAS API 可靠性 | YD2-1900, YD2-1910, YD2-1921 | 消除生产 400/500，payload 合同收敛 |
| 架构决策 | YD2-1805, YD2-1616, YD2-1825 | SignalR→轮询、策略号前置、FlowState 同步修复 |
| 报价续接 | YD2-1582, YD2-1648 | 智能路由续接、支付后锁定完整性 |
| 新产品线（MCL） | YD2-1718, 1853, 1857, 1928, 1929, 1967 | 摩托车险从脚手架到核保的全链路 |
| 代码质量 | AP-2760–2822 | AutoMapper 落地、85% 分支覆盖率、热点重构 |
| DevOps / 平台 | YD2-14, YD2-1923, YD2-1754, YD2-1778 | CI/CD 基线、生产模式标志、Copilot 指令 |
