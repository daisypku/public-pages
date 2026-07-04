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
  const conclusion = candidates.find((node) => {
    const txt = textOf(node);
    return txt.includes("市场状态") && txt.includes("今日策略");
  });
  if (!conclusion) return [];
  return Array.from(conclusion.querySelectorAll("div"))
    .map(textOf)
    .filter(Boolean)
    .slice(0, 4);
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
    summaryEl.textContent = latest.summary || "最新投资简报已更新。";
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
      conclusionEl.innerHTML = conclusionLines.map((line) => `<p>${line}</p>`).join("");
      summaryEl.textContent = conclusionLines[0].replace(/^.*?市场状态：?/, "").trim() || summaryEl.textContent;
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