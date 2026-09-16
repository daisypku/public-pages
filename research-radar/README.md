# 预测市场研究雷达

每天北京时间09:00由GitHub Actions采集Kalshi和Polymarket公开行情，生成完整HTML日报并更新现有GitHub Pages。标准库Python，零模型调用，无平台订阅或模型API密钥。

页面：https://daisypku.github.io/public-pages/prediction-radar/

## 日报

包括最多5个研究精选、重点事件每日跟踪、当前概率与1/7/14日百分点变化、14天趋势图、研究问题模板、来源和覆盖状态、历史日报。保留原始合约标题，正文说明为中文；不进行新闻归因。固定重点不受新选题重复过滤影响。同主题两平台可同时出现，不平均概率。

## 执行

Python 3.10以上，无第三方依赖。在research-radar目录执行：

```sh
python -m unittest -v
python radar.py --root runtime --site ../docs/prediction-radar
```

修改config.json可调整关键词、阈值和manual_event_ids（平台:事件ID）。模型默认关闭。

## 持久化与发布

Actions每天计划09:00北京时间运行，GitHub可能延迟。支持手动运行及代码变更触发。程序把滚动45天的精简每日快照、关注状态、精选记录与HTML/JSON报告提交回main。失败重跑不抹掉同一天已经采集的观测。原始API响应仅保留在Actions artifact中3天。通过GITHUB_TOKEN显式dispatch已有pages.yml发布完整docs目录，不修改其他页面，无需额外密钥。运行权限为contents:write、actions:write。

采集部分失败也生成完整但标注覆盖不足的报告，并将运行标记为失败。全部失败不以旧数据充数。电脑无需开机，Codex每日任务已暂停。

## 模型接口占位

model_hook.py定义Enricher协议，未来provider可以接收结构化日报，返回带来源的注释。默认model.enabled=false，绝不读取密钥或请求模型。显式开启但没有provider时直接报错。未来的新闻、归因、专题分析都作为注释层扩展，不覆盖价格和计算结果。当前HTML无需模型即可完整生成。

## 口径与局限

Polymarket当前为outcomePrices、历史为CLOB价格；Kalshi当前与历史均为YES买卖报价中点。基准只取目标时刻前6小时内最近观测，缺失不填零。API采集时间不是最后成交时间；宽价差、低成交不触发自动强信号。成交量单位按平台分别显示，不直接相加比较。成交倍数需要前7个不同日期。历史补取有数量上限，其余逐日累积。

关键词初筛可能漏检或误分，可以调整。市场到期时间不是核实过的政策公告时间。新选题7天内重复要求较上次精选至少3个百分点新变化，固定重点不受此限制。自动信号保留14天，用户手动指定不会自动移除。此前关注但本次消失的事件列为状态待核实，不把缺失当结算。
