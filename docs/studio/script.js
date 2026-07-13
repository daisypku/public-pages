function textOf(node) {
  return (node?.textContent || "").replace(/\s+/g, " ").trim();
}

function firstByHeading(doc, selector, pattern) {
  return Array.from(doc.querySelectorAll(selector)).find((node) => pattern.test(textOf(node)));
}

function tableRows(table, limit = 6) {
  if (!table) return [];
  return Array.from(table.querySelectorAll("tr"))
    .slice(1, limit + 1)
    .map((row) => Array.from(row.querySelectorAll("td")).map(textOf))
    .filter((cells) => cells.length >= 2);
}

function renderMiniTable(target, rows, columns) {
  if (!target || !rows.length) return;
  target.innerHTML = rows
    .map((cells) => {
      const name = cells[0] || "";
      const value = cells[1] || "";
      const change = cells[2] || "";
      const changeClass = change.includes("-") ? "down" : change.includes("+") ? "up" : "";
      return `<div class="mini-row"><span>${name}</span><span>${value}</span><span class="${changeClass}">${change}</span></div>`;
    })
    .join("");
}

function extractConclusion(doc) {
  const candidates = Array.from(doc.querySelectorAll("body div"));
  for (const node of candidates) {
    const directLines = Array.from(node.children)
      .filter((child) => child.tagName === "DIV")
      .map(textOf)
      .filter(Boolean);
    const matchedLines = directLines.filter((line) =>
      line.includes("市场状态") || line.includes("最强方向") || line.includes("今日策略")
    );
    const hasConclusionShape = matchedLines.length >= 3;
    if (hasConclusionShape) return directLines.slice(0, 4);
  }
  return [];
}

function renderConclusionLine(line) {
  const normalized = line.replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+\s*/, "");
  const separatorIndex = normalized.search(/：|:/);
  if (separatorIndex < 0) return `<p><span>${normalized}</span></p>`;

  const label = normalized.slice(0, separatorIndex).trim();
  const body = normalized.slice(separatorIndex + 1).trim();
  return `<p><strong>${label}</strong><span>${body}</span></p>`;
}
function extractLiquidity(doc) {
  const heading = firstByHeading(doc, "h4", /市场流动性|Liquidity/);
  const box = heading?.parentElement;
  if (!box) return [];
  return Array.from(box.children)
    .filter((child) => child.tagName === "DIV")
    .map(textOf)
    .filter(Boolean)
    .slice(0, 4);
}

const PODCAST_READER_URL = "https://daisypku.github.io/public-pages/pod2wiki-reader/index.html";

function absoluteUrl(value, base) {
  return new URL(value, base).href;
}

function firstMeaningfulPodcastParagraph(runBlock) {
  const paragraphs = Array.from(runBlock.querySelectorAll("p")).map(textOf).filter(Boolean);
  return paragraphs.find((line) => !line.startsWith("来源：") && !line.startsWith("原链接：")) || paragraphs[0] || "今天没有新的完整摘要。";
}

async function hydratePodcastBrief() {
  const coverEl = document.querySelector("#podcastCover");
  const statusEl = document.querySelector("#podcastStatus");
  const titleEl = document.querySelector("#podcastFirstTitle");
  const summaryEl = document.querySelector("#podcastFirstSummary");
  const bulletsEl = document.querySelector("#podcastFirstBullets");
  const linkEl = document.querySelector("#podcastLink");
  if (!coverEl || !statusEl || !titleEl || !summaryEl || !bulletsEl || !linkEl) return;

  try {
    const indexResponse = await fetch(PODCAST_READER_URL, { cache: "no-store" });
    if (!indexResponse.ok) throw new Error("podcast index not found");
    const indexHtml = await indexResponse.text();
    const indexDoc = new DOMParser().parseFromString(indexHtml, "text/html");
    const latestLink = indexDoc.querySelector(".digest-card a[href]");
    if (!latestLink) throw new Error("latest podcast link not found");

    const articleUrl = absoluteUrl(latestLink.getAttribute("href"), PODCAST_READER_URL);
    const articleResponse = await fetch(articleUrl, { cache: "no-store" });
    if (!articleResponse.ok) throw new Error("podcast article not found");
    const articleHtml = await articleResponse.text();
    const articleDoc = new DOMParser().parseFromString(articleHtml, "text/html");

    const cover = articleDoc.querySelector(".article-postcard img") || indexDoc.querySelector(".hero-art img");
    if (cover?.getAttribute("src")) {
      coverEl.src = absoluteUrl(cover.getAttribute("src"), articleUrl);
      coverEl.alt = cover.getAttribute("alt") || "每日播客简报封面";
    }

    const dateText = textOf(articleDoc.querySelector(".page-date")) || textOf(latestLink.querySelector(".card-date"));
    statusEl.textContent = dateText ? `${dateText} 更新` : "已更新";

    const runBlock = articleDoc.querySelector(".run-block");
    if (!runBlock) throw new Error("podcast run block not found");

    const heading = textOf(runBlock.querySelector("h2"));
    const summary = firstMeaningfulPodcastParagraph(runBlock);
    const bullets = Array.from(runBlock.querySelectorAll("li")).map(textOf).filter(Boolean).slice(0, 3);

    titleEl.textContent = heading || "今日暂无完整摘要";
    summaryEl.textContent = summary;
    bulletsEl.innerHTML = bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    bulletsEl.hidden = bullets.length === 0;
    linkEl.href = articleUrl;
    linkEl.textContent = "阅读今日简报";
  } catch (error) {
    statusEl.textContent = "等待更新";
  }
}
async function hydrateInvestmentBrief() {
  const titleEl = document.querySelector("#investmentTitle");
  const summaryEl = document.querySelector("#investmentSummary");
  const linkEl = document.querySelector("#investmentLink");
  const statusEl = document.querySelector("#investmentStatus");
  const dashboardEl = document.querySelector("#investmentDashboard");
  const conclusionEl = document.querySelector("#investmentConclusion");
  const indicesEl = document.querySelector("#investmentIndices");
  const commoditiesEl = document.querySelector("#investmentCommodities");
  const liquidityEl = document.querySelector("#investmentLiquidity");

  if (!titleEl || !summaryEl || !linkEl || !statusEl) return;

  try {
    const response = await fetch("daily/latest.json", { cache: "no-store" });
    if (!response.ok) throw new Error("latest not found");

    const latest = await response.json();
    titleEl.textContent = latest.title || "投资简报";
    summaryEl.textContent = "自动同步每日早晚报中的公开市场摘要。";
    linkEl.href = latest.url || "daily/";
    linkEl.textContent = "阅读全文";
    statusEl.textContent = latest.date || "已更新";

    if (!latest.url) return;

    const reportResponse = await fetch(latest.url, { cache: "no-store" });
    if (!reportResponse.ok) return;

    const reportHtml = await reportResponse.text();
    const doc = new DOMParser().parseFromString(reportHtml, "text/html");

    const conclusionLines = extractConclusion(doc);
    if (conclusionLines.length && conclusionEl) {
      conclusionEl.innerHTML = conclusionLines.map(renderConclusionLine).join("");
      summaryEl.hidden = true;
    }

    const indicesHeading = firstByHeading(doc, "h3", /核心指数/);
    const indicesRows = tableRows(indicesHeading?.parentElement?.querySelector("table"), 6);
    renderMiniTable(indicesEl, indicesRows);

    const commoditiesHeading = firstByHeading(doc, "h3", /大宗商品/);
    const commoditiesRows = tableRows(commoditiesHeading?.parentElement?.querySelector("table"), 4);
    renderMiniTable(commoditiesEl, commoditiesRows);

    const liquidityLines = extractLiquidity(doc);
    if (liquidityLines.length && liquidityEl) {
      liquidityEl.innerHTML = liquidityLines.map((line) => `<p>${line}</p>`).join("");
    }

    if (dashboardEl && (conclusionLines.length || indicesRows.length || commoditiesRows.length || liquidityLines.length)) {
      dashboardEl.hidden = false;
    }
  } catch (error) {
    statusEl.textContent = "等待更新";
  }
}

const SEMI_HEATMAP_URL = "https://daisypku.github.io/supply-chain-data/supply_chain_heatmap.json";
const SEMI_SECTORS = {
  raw_mat: "源头原材料",
  ccl: "覆铜板 CCL",
  pcb: "PCB",
  ic_sub: "IC载板/ABF",
  cowos: "先进封装",
  optical_chip: "光芯片/光器件",
  optical_mod: "光模块",
  optical_infra: "光纤/设备",
  glass: "玻璃基板",
};
const SEMI_SECTOR_ORDER = Object.keys(SEMI_SECTORS);

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const IPO_FILINGS_URL = "../ipo-watch/data/filings.json";
const IPO_CALENDAR_URL = "../ipo-watch/data/calendar.json";

function parseDateOnly(value) {
  if (!value) return null;
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatShortDate(value) {
  const date = parseDateOnly(value);
  if (!date) return value || "--";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function filingDateValue(filing) {
  return parseDateOnly(filing.update_date || filing.publish_date || filing.collected_at)?.getTime() || 0;
}

function renderIpoRecent(filings) {
  const target = document.querySelector("#ipoRecentList");
  const status = document.querySelector("#ipoDisclosureStatus");
  if (!target) return;

  const items = (filings || [])
    .slice()
    .sort((a, b) => filingDateValue(b) - filingDateValue(a))
    .slice(0, 5);

  if (status) status.textContent = items[0]?.update_date || items[0]?.publish_date || "已更新";
  target.innerHTML = items.length
    ? items
        .map((item) => {
          const href = item.id ? `../ipo-watch/filings/${encodeURIComponent(item.id)}.html` : "../ipo-watch/";
          const meta = [item.board, item.industry, item.sponsor].filter(Boolean).join(" · ");
          return `<a class="ipo-item" href="${href}">
            <span class="ipo-date">${escapeHtml(formatShortDate(item.update_date || item.publish_date))}</span>
            <span><span class="ipo-name">${escapeHtml(item.issuer || item.title || "未命名项目")}</span><br><span class="ipo-meta">${escapeHtml(meta || item.document_type || "IPO 项目更新")}</span></span>
            <span class="ipo-status">${escapeHtml(item.status || item.exchange || "更新")}</span>
          </a>`;
        })
        .join("")
    : '<p class="ipo-empty">暂时没有可展示的披露项目。</p>';
}

function renderIpoCalendar(events) {
  const target = document.querySelector("#ipoCalendarList");
  if (!target) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(today.getDate() + 14);

  const items = (events || [])
    .map((event) => ({ ...event, dateObj: parseDateOnly(event.event_date) }))
    .filter((event) => event.dateObj && event.dateObj >= today && event.dateObj <= end)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 8);

  target.innerHTML = items.length
    ? items
        .map((item) => {
          const meta = [item.market, item.code, item.financing_total ? `募资 ${item.financing_total}` : ""].filter(Boolean).join(" · ");
          return `<a class="ipo-event" href="${escapeHtml(item.source_url || "../ipo-watch/")}" target="_blank" rel="noopener">
            <span class="ipo-date">${escapeHtml(formatShortDate(item.event_date))}</span>
            <span><span class="ipo-name">${escapeHtml(item.name || "未命名项目")}</span><br><span class="ipo-meta">${escapeHtml(meta || item.business || "IPO 日历事件")}</span></span>
            <span class="ipo-status">${escapeHtml(item.event_type || "日历")}</span>
          </a>`;
        })
        .join("")
    : '<p class="ipo-empty">未来两周暂无日历事项。</p>';
}

async function hydrateIpoWatch() {
  const recentTarget = document.querySelector("#ipoRecentList");
  const calendarTarget = document.querySelector("#ipoCalendarList");
  if (!recentTarget && !calendarTarget) return;

  try {
    const [filingsResponse, calendarResponse] = await Promise.all([
      fetch(IPO_FILINGS_URL, { cache: "no-store" }),
      fetch(IPO_CALENDAR_URL, { cache: "no-store" }),
    ]);
    if (!filingsResponse.ok || !calendarResponse.ok) throw new Error("IPO data not found");
    renderIpoRecent(await filingsResponse.json());
    renderIpoCalendar(await calendarResponse.json());
  } catch (error) {
    const status = document.querySelector("#ipoDisclosureStatus");
    if (status) status.textContent = "等待更新";
    if (recentTarget) recentTarget.innerHTML = '<p class="ipo-empty">IPO 披露数据暂时读取失败。</p>';
    if (calendarTarget) calendarTarget.innerHTML = '<p class="ipo-empty">IPO 日历暂时读取失败。</p>';
  }
}
function heatmapColor(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "#f1eadf";
  if (value >= 5) return "#c62828";
  if (value >= 2) return "#e53935";
  if (value >= 0.5) return "#ef5350";
  if (value > 0) return "#ffcdd2";
  if (value > -0.5) return "#c8e6c9";
  if (value > -2) return "#66bb6a";
  if (value > -5) return "#43a047";
  return "#2e7d32";
}

function isNeutralHeatmapTile(value) {
  return value === null || value === undefined || Number.isNaN(value) || Math.abs(value) < 0.5;
}

function formatPct(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function renderSemiHeatmap(data) {
  const body = document.querySelector("#semiHeatmapBody");
  const time = document.querySelector("#semiHeatmapTime");
  if (!body || !time) return;

  time.textContent = data.updated ? `更新时间：${data.updated}` : "已同步最新热力图数据";

  const grouped = new Map();
  (data.stocks || []).forEach((stock) => {
    if (!stock.sector) return;
    if (!grouped.has(stock.sector)) grouped.set(stock.sector, []);
    grouped.get(stock.sector).push(stock);
  });

  const groups = SEMI_SECTOR_ORDER
    .filter((sector) => grouped.has(sector))
    .map((sector) => {
      const stocks = grouped
        .get(sector)
        .slice()
        .sort((a, b) => Math.abs(b.change_pct || 0) - Math.abs(a.change_pct || 0))
        .slice(0, 4);
      const tiles = stocks
        .map((stock) => {
          const change = stock.change_pct;
          const neutral = isNeutralHeatmapTile(change) ? " neutral" : "";
          return `<div class="semi-tile${neutral}" style="background:${heatmapColor(change)}" title="${escapeHtml(stock.name)} ${formatPct(change)}">
            <div class="semi-tile-name">${escapeHtml(stock.name)}</div>
            <div class="semi-tile-value">${formatPct(change)}</div>
          </div>`;
        })
        .join("");
      return `<section class="semi-group"><h3 class="semi-group-title">${SEMI_SECTORS[sector]}</h3><div class="semi-tile-grid">${tiles}</div></section>`;
    });

  body.innerHTML = groups.length ? groups.join("") : "<p>热力图数据等待更新。</p>";
}

async function hydrateSemiHeatmap() {
  const body = document.querySelector("#semiHeatmapBody");
  const time = document.querySelector("#semiHeatmapTime");
  if (!body || !time) return;

  try {
    const response = await fetch(SEMI_HEATMAP_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("heatmap not found");
    const data = await response.json();
    renderSemiHeatmap(data);
  } catch (error) {
    time.textContent = "等待更新";
    body.innerHTML = "<p>产业链交易热力图暂时读取失败，可以打开项目查看完整页面。</p>";
  }
}
hydratePodcastBrief();
hydrateInvestmentBrief();
hydrateSemiHeatmap();
hydrateIpoWatch();
