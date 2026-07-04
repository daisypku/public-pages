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

hydrateInvestmentBrief();