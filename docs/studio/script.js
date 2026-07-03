async function hydrateInvestmentBrief() {
  const titleEl = document.querySelector("#investmentTitle");
  const summaryEl = document.querySelector("#investmentSummary");
  const linkEl = document.querySelector("#investmentLink");
  const statusEl = document.querySelector("#investmentStatus");

  if (!titleEl || !summaryEl || !linkEl || !statusEl) {
    return;
  }

  try {
    const response = await fetch("daily/latest.json", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const latest = await response.json();
    titleEl.textContent = latest.title || "投资简报";
    summaryEl.textContent = latest.summary || summaryEl.textContent;
    linkEl.href = latest.url || "daily/";
    linkEl.textContent = "阅读最新简报";
    statusEl.textContent = latest.date || "已更新";
  } catch (error) {
    // 本地 file:// 预览或还没有 latest.json 时，保留占位内容。
  }
}

hydrateInvestmentBrief();