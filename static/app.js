// IDH Regenerative Coffee Program — standalone dashboard (no build step, no npm).
// Data comes from data.generated.js (derived from shared/indicators.json).

// ---------- Theme ----------
function currentTheme() {
  const stamped = document.documentElement.getAttribute('data-theme');
  if (stamped === 'dark' || stamped === 'light') return stamped;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function isDarkMode() {
  return currentTheme() === 'dark';
}
function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('idh-theme', next);
  render();
}
(function initTheme() {
  const stored = localStorage.getItem('idh-theme');
  if (stored === 'light' || stored === 'dark') document.documentElement.setAttribute('data-theme', stored);
})();

// ---------- Palette ----------
const SERIES_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
const SERIES_DARK = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];
function seriesPalette() {
  return isDarkMode() ? SERIES_DARK : SERIES_LIGHT;
}
function chartChrome() {
  const dark = isDarkMode();
  return {
    surface: dark ? '#1a1a19' : '#fcfcfb',
    textPrimary: dark ? '#ffffff' : '#0b0b0b',
    textSecondary: dark ? '#c3c2b7' : '#52514e',
    textMuted: '#898781',
    gridline: dark ? '#2c2c2a' : '#e1e0d9',
    baseline: dark ? '#383835' : '#c3c2b7',
  };
}

// ---------- Sidebar icons ----------
const DASHBOARD_ICONS = {
  overview: '📊',
  'farmer-mobilization': '🧑‍🌾',
  'regen-practices': '🌱',
  'soil-health': '🌍',
  'water-management': '💧',
  biodiversity: '🦋',
  'climate-ghg': '🌡️',
  livelihood: '💰',
  others: '📁',
};

// Implementing partners — illustrative names for the Partner filter. In the
// real schema this maps to the `partner` / `partner_master` tables.
const PARTNERS = [
  { id: 'p1', name: "Coorg Organic Growers' Cooperative" },
  { id: 'p2', name: 'Malabar AgriTech Foundation' },
  { id: 'p3', name: 'Western Ghats Livelihoods Trust' },
  { id: 'p4', name: 'Hassan Farmer Producer Company' },
  { id: 'p5', name: 'Wayanad Sustainable Agriculture Society' },
  { id: 'p6', name: 'Idukki Hill Farmers Collective' },
];

// ---------- Filters ----------
const state = {
  dashboardId: 'overview',
  filters: { stateId: undefined, districtId: undefined, blockId: undefined, partnerId: undefined, dateFrom: undefined, dateTo: undefined },
  mapLayer: 'beneficiaries',
};

function filterScale(filters) {
  const key = JSON.stringify([filters.stateId, filters.districtId, filters.blockId, filters.partnerId, filters.dateFrom, filters.dateTo]);
  if (key === JSON.stringify([undefined, undefined, undefined, undefined, undefined, undefined])) return 1;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return 0.55 + ((hash % 1000) / 1000) / 2.2;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(value);
}

// ---------- Geography (for filters + map widget) ----------
// The program operates in the Western Ghats coffee belt: Karnataka (Kodagu,
// Chikmagalur, Hassan) and Kerala (Wayanad, Idukki). District/block names are
// real administrative units; beneficiary counts are illustrative and sum to the
// same 26,162 total used by the "Farmers Enrolled" KPI (from the logic sheet's
// manually-verified count) so the map and the KPI cards agree.
const GEOGRAPHY = {
  states: [
    {
      id: '1', name: 'Karnataka', beneficiaries: 19000, partners: 11, center: [75.7, 13.6],
      districts: [
        { id: '11', name: 'Kodagu', beneficiaries: 9000, partners: 5, center: [75.73, 12.42],
          blocks: [
            { id: '111', name: 'Madikeri', beneficiaries: 4000, center: [75.74, 12.42], villages: [{ name: 'Madikeri Cluster 1', beneficiaries: 2200 }, { name: 'Madikeri Cluster 2', beneficiaries: 1800 }] },
            { id: '112', name: 'Virajpet', beneficiaries: 3200, center: [75.81, 12.20], villages: [{ name: 'Virajpet Cluster 1', beneficiaries: 1700 }, { name: 'Virajpet Cluster 2', beneficiaries: 1500 }] },
            { id: '113', name: 'Somwarpet', beneficiaries: 1800, center: [75.85, 12.58], villages: [{ name: 'Somwarpet Cluster 1', beneficiaries: 1000 }, { name: 'Somwarpet Cluster 2', beneficiaries: 800 }] },
          ] },
        // Real district polygon (guneetnarula/indian-district-boundaries) spells this "Chikkamagaluru".
        { id: '12', name: 'Chikkamagaluru', beneficiaries: 6500, partners: 4, center: [75.77, 13.32],
          blocks: [
            { id: '121', name: 'Mudigere', beneficiaries: 2700, center: [75.64, 13.13], villages: [{ name: 'Mudigere Cluster 1', beneficiaries: 1500 }, { name: 'Mudigere Cluster 2', beneficiaries: 1200 }] },
            { id: '122', name: 'Koppa', beneficiaries: 2200, center: [75.36, 13.53], villages: [{ name: 'Koppa Cluster 1', beneficiaries: 1200 }, { name: 'Koppa Cluster 2', beneficiaries: 1000 }] },
            { id: '123', name: 'Sringeri', beneficiaries: 1600, center: [75.25, 13.42], villages: [{ name: 'Sringeri Cluster 1', beneficiaries: 900 }, { name: 'Sringeri Cluster 2', beneficiaries: 700 }] },
          ] },
        { id: '13', name: 'Hassan', beneficiaries: 3500, partners: 2, center: [76.1, 13.0],
          blocks: [
            { id: '131', name: 'Sakleshpur', beneficiaries: 2200, center: [75.78, 12.94], villages: [{ name: 'Sakleshpur Cluster 1', beneficiaries: 1200 }, { name: 'Sakleshpur Cluster 2', beneficiaries: 1000 }] },
            { id: '132', name: 'Belur', beneficiaries: 1300, center: [75.87, 13.16], villages: [{ name: 'Belur Cluster 1', beneficiaries: 700 }, { name: 'Belur Cluster 2', beneficiaries: 600 }] },
          ] },
      ],
    },
    {
      id: '2', name: 'Kerala', beneficiaries: 7162, partners: 5, center: [76.4, 10.7],
      districts: [
        { id: '21', name: 'Wayanad', beneficiaries: 5000, partners: 3, center: [76.13, 11.68],
          blocks: [
            { id: '211', name: 'Mananthavady', beneficiaries: 2000, center: [76.00, 11.80], villages: [{ name: 'Mananthavady Cluster 1', beneficiaries: 1100 }, { name: 'Mananthavady Cluster 2', beneficiaries: 900 }] },
            { id: '212', name: 'Sulthan Bathery', beneficiaries: 1800, center: [76.27, 11.65], villages: [{ name: 'Sulthan Bathery Cluster 1', beneficiaries: 1000 }, { name: 'Sulthan Bathery Cluster 2', beneficiaries: 800 }] },
            { id: '213', name: 'Vythiri', beneficiaries: 1200, center: [76.05, 11.55], villages: [{ name: 'Vythiri Cluster 1', beneficiaries: 650 }, { name: 'Vythiri Cluster 2', beneficiaries: 550 }] },
          ] },
        { id: '22', name: 'Idukki', beneficiaries: 2162, partners: 2, center: [76.95, 9.85],
          blocks: [
            { id: '221', name: 'Devikulam', beneficiaries: 900, center: [77.10, 10.07], villages: [{ name: 'Devikulam Cluster 1', beneficiaries: 500 }, { name: 'Devikulam Cluster 2', beneficiaries: 400 }] },
            { id: '222', name: 'Peermade', beneficiaries: 700, center: [76.97, 9.57], villages: [{ name: 'Peermade Cluster 1', beneficiaries: 400 }, { name: 'Peermade Cluster 2', beneficiaries: 300 }] },
            { id: '223', name: 'Udumbanchola', beneficiaries: 562, center: [77.05, 9.85], villages: [{ name: 'Udumbanchola Cluster 1', beneficiaries: 300 }, { name: 'Udumbanchola Cluster 2', beneficiaries: 262 }] },
          ] },
      ],
    },
  ],
};

// Real district-level TopoJSON per state (guneetnarula/indian-district-boundaries).
// Object key inside each topology matches the lowercase state slug.
const STATE_TOPO = {
  Karnataka: { url: 'https://cdn.jsdelivr.net/gh/guneetnarula/indian-district-boundaries@master/topojson/state-wise/karnataka.json', key: 'karnataka' },
  Kerala: { url: 'https://cdn.jsdelivr.net/gh/guneetnarula/indian-district-boundaries@master/topojson/state-wise/kerala.json', key: 'kerala' },
};

// ---------- Sidebar ----------
function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  DASHBOARDS.forEach((d) => {
    const btn = document.createElement('button');
    btn.className = 'sidebar-link' + (d.id === state.dashboardId ? ' active' : '');
    btn.innerHTML = `<span class="sidebar-icon">${DASHBOARD_ICONS[d.id] || '•'}</span>${d.label}`;
    btn.onclick = () => {
      state.dashboardId = d.id;
      render();
    };
    nav.appendChild(btn);
  });
}

// ---------- Filter bar ----------
function renderFilterBar() {
  const el = document.getElementById('filter-bar');
  const s = GEOGRAPHY.states.find((x) => x.id === state.filters.stateId);
  const d = s && s.districts.find((x) => x.id === state.filters.districtId);

  el.innerHTML = `
    <label>State
      <select id="f-state">
        <option value="">All States</option>
        ${GEOGRAPHY.states.map((x) => `<option value="${x.id}" ${x.id === state.filters.stateId ? 'selected' : ''}>${x.name}</option>`).join('')}
      </select>
    </label>
    <label>District
      <select id="f-district" ${!s ? 'disabled' : ''}>
        <option value="">All Districts</option>
        ${s ? s.districts.map((x) => `<option value="${x.id}" ${x.id === state.filters.districtId ? 'selected' : ''}>${x.name}</option>`).join('') : ''}
      </select>
    </label>
    <label>Block
      <select id="f-block" ${!d ? 'disabled' : ''}>
        <option value="">All Blocks</option>
        ${d ? d.blocks.map((x) => `<option value="${x.id}" ${x.id === state.filters.blockId ? 'selected' : ''}>${x.name}</option>`).join('') : ''}
      </select>
    </label>
    <label>Partner
      <select id="f-partner">
        <option value="">All Partners</option>
        ${PARTNERS.map((p) => `<option value="${p.id}" ${p.id === state.filters.partnerId ? 'selected' : ''}>${p.name}</option>`).join('')}
      </select>
    </label>
    <label>From <input type="date" id="f-from" value="${state.filters.dateFrom || ''}" /></label>
    <label>To <input type="date" id="f-to" value="${state.filters.dateTo || ''}" /></label>
    ${Object.values(state.filters).some(Boolean) ? '<button class="theme-toggle" id="f-clear">Clear filters</button>' : ''}
  `;

  document.getElementById('f-state').onchange = (e) => {
    state.filters = {
      dateFrom: state.filters.dateFrom,
      dateTo: state.filters.dateTo,
      partnerId: state.filters.partnerId,
      stateId: e.target.value || undefined,
    };
    render();
  };
  document.getElementById('f-district').onchange = (e) => {
    state.filters.districtId = e.target.value || undefined;
    state.filters.blockId = undefined;
    render();
  };
  document.getElementById('f-block').onchange = (e) => {
    state.filters.blockId = e.target.value || undefined;
    render();
  };
  document.getElementById('f-partner').onchange = (e) => {
    state.filters.partnerId = e.target.value || undefined;
    render();
  };
  document.getElementById('f-from').onchange = (e) => {
    state.filters.dateFrom = e.target.value || undefined;
    render();
  };
  document.getElementById('f-to').onchange = (e) => {
    state.filters.dateTo = e.target.value || undefined;
    render();
  };
  const clearBtn = document.getElementById('f-clear');
  if (clearBtn) clearBtn.onclick = () => { state.filters = {}; render(); };
}

// ---------- Chart rendering ----------
let chartInstances = [];
function destroyCharts() {
  chartInstances.forEach((c) => {
    try { c.destroy && c.destroy(); } catch (e) { /* noop */ }
  });
  chartInstances = [];
}

function scaledResult(ind) {
  const scale = filterScale(state.filters);
  if (ind.result.type === 'kpi') {
    return { type: 'kpi', value: Math.round(ind.result.value * scale) };
  }
  return { type: 'series', series: ind.result.series.map((s) => ({ label: s.label, value: Math.round(s.value * scale) })) };
}

function getIndicatorSeries(id) {
  const ind = INDICATORS.find((i) => i.id === id);
  if (!ind) return [];
  const r = scaledResult(ind);
  return r.type === 'series' ? r.series : [];
}

function renderHighchartsColumn(container, data) {
  const chrome = chartChrome();
  const palette = seriesPalette();
  const chart = Highcharts.chart(container, {
    chart: { type: 'column', backgroundColor: 'transparent', height: 240, style: { fontFamily: 'system-ui, sans-serif' } },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      categories: data.map((d) => d.label),
      lineColor: chrome.baseline,
      tickColor: chrome.baseline,
      labels: { style: { color: chrome.textSecondary, fontSize: '11px' } },
    },
    yAxis: { title: { text: undefined }, gridLineColor: chrome.gridline, labels: { style: { color: chrome.textMuted, fontSize: '11px' } } },
    legend: { enabled: false },
    tooltip: {
      backgroundColor: chrome.surface,
      borderColor: chrome.gridline,
      style: { color: chrome.textPrimary },
      formatter: function () { return '<b>' + this.x + '</b>: ' + Highcharts.numberFormat(this.y, 0); },
    },
    plotOptions: {
      column: {
        borderRadius: 5, borderWidth: 0, pointPadding: 0.1, groupPadding: 0.1,
        colorByPoint: true, colors: palette,
        dataLabels: { enabled: true, style: { color: chrome.textSecondary, fontSize: '10.5px', textOutline: 'none', fontWeight: '600' } },
      },
    },
    series: [{ type: 'column', name: 'Count', data: data.map((d) => d.value) }],
  });
  chartInstances.push(chart);
}

// Clean pie/donut: no inline slice labels (they truncate and clutter at this card
// size) — identity comes from the legend, magnitude/percent from the tooltip.
function renderEChartsPie(container, data, donut) {
  const chrome = chartChrome();
  const palette = seriesPalette();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const chart = echarts.init(container);
  chart.setOption({
    color: palette,
    textStyle: { fontFamily: 'system-ui, sans-serif' },
    tooltip: {
      trigger: 'item',
      backgroundColor: chrome.surface,
      borderColor: chrome.gridline,
      textStyle: { color: chrome.textPrimary },
      formatter: (p) => `<b>${p.name}</b>: ${p.value.toLocaleString('en-IN')} (${p.percent}%)`,
    },
    legend: {
      show: true, bottom: 0, left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8,
      textStyle: { color: chrome.textSecondary, fontSize: 11 },
      type: data.length > 4 ? 'scroll' : 'plain',
    },
    series: [{
      type: 'pie',
      radius: donut ? ['48%', '75%'] : '75%',
      center: ['50%', '42%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: chrome.surface, borderWidth: 2, borderRadius: 4 },
      label: { show: false },
      labelLine: { show: false },
      emphasis: { scale: true, scaleSize: 6 },
      data: data.map((d) => ({ name: d.label, value: d.value })),
    }],
    graphic: donut
      ? [
          { type: 'text', left: 'center', top: '36%', style: { text: total.toLocaleString('en-IN'), fontSize: 22, fontWeight: 700, fill: chrome.textPrimary, textAlign: 'center' } },
          { type: 'text', left: 'center', top: '45%', style: { text: 'total', fontSize: 10, fill: chrome.textMuted, textAlign: 'center' } },
        ]
      : [],
  });
  chartInstances.push(chart);
}

function indicatorCardHtml(ind) {
  const tooltip = [ind.logic, ind.notes ? `Note: ${ind.notes}` : ''].filter(Boolean).join('\n\n').replace(/"/g, '&quot;');
  return `
    <div class="indicator-card" data-id="${ind.id}">
      <div class="indicator-card-header">
        <div class="indicator-title">${ind.indicator}</div>
        <span class="info-dot" title="${tooltip}">i</span>
      </div>
      <div class="indicator-body" id="body-${ind.id}"></div>
    </div>
  `;
}

function mountIndicatorBody(ind) {
  const result = scaledResult(ind);
  const body = document.getElementById(`body-${ind.id}`);
  if (result.type === 'kpi') {
    body.className = 'indicator-body';
    body.innerHTML = `<div class="kpi-value">${formatNumber(result.value)}</div>`;
    return;
  }
  const container = document.createElement('div');
  container.className = 'chart-container';
  body.innerHTML = '';
  body.appendChild(container);
  if (ind.chartType === 'column') renderHighchartsColumn(container, result.series);
  // All distribution charts render as clean donuts (no bare pies) — a single
  // consistent, more legible visual language across the dashboard.
  else renderEChartsPie(container, result.series, true);
}

// ---------- Dashboard grid ----------
function renderDashboardGrid() {
  const content = document.getElementById('dashboard-content');
  const items = INDICATORS.filter((i) => i.dashboard === state.dashboardId);
  const subDashboards = [];
  const seen = new Map();
  items.forEach((i) => {
    if (!seen.has(i.subDashboard)) {
      seen.set(i.subDashboard, []);
      subDashboards.push(i.subDashboard);
    }
    seen.get(i.subDashboard).push(i);
  });

  let html = '<div class="banner">Standalone preview build — mock data only, no backend/database connection. See the <code>backend/</code> + <code>frontend/</code> folders for the full production app (needs Node.js).</div>';
  if (state.dashboardId === 'overview') {
    html += renderMapWidgetShell();
    html += renderFeatureChartsShell();
  }
  // KPI tiles and charts are grouped into separate grids per section — mixing
  // them in one grid stretches short KPI cards to match tall chart cards,
  // leaving a lot of empty space under the number.
  subDashboards.forEach((name) => {
    const sectionItems = seen.get(name);
    const kpis = sectionItems.filter((i) => i.chartType === 'kpi');
    const charts = sectionItems.filter((i) => i.chartType !== 'kpi');
    html += `<h2 class="sub-dashboard-title">${name}</h2>`;
    if (kpis.length) html += `<div class="kpi-row">${kpis.map(indicatorCardHtml).join('')}</div>`;
    if (charts.length) html += `<div class="indicator-grid">${charts.map(indicatorCardHtml).join('')}</div>`;
  });
  content.innerHTML = html;

  items.forEach(mountIndicatorBody);
  if (state.dashboardId === 'overview') {
    mountMapWidget();
    mountFeatureCharts();
  }
}

// ---------- Feature visuals: Sankey flow + Sunburst geographic reach ----------
function renderFeatureChartsShell() {
  return `
    <div class="feature-grid">
      <div class="indicator-card chart-card-wide">
        <div class="indicator-card-header">
          <div class="indicator-title">Program Engagement Flow</div>
          <span class="info-dot" title="How farmers move through the program: enrollment → training → adopting at least one regenerative practice → which practice categories they land in.">i</span>
        </div>
        <div class="chart-container-tall" id="sankey-chart"></div>
      </div>
      <div class="indicator-card chart-card-wide">
        <div class="indicator-card-header">
          <div class="indicator-title">Geographic Reach — State → District → Block</div>
          <span class="info-dot" title="Beneficiary distribution across the program's operating geography. Click a ring segment to zoom in.">i</span>
        </div>
        <div class="chart-container-tall" id="sunburst-chart"></div>
      </div>
    </div>
  `;
}

function mountFeatureCharts() {
  mountSankeyChart();
  mountSunburstChart();
}

function mountSankeyChart() {
  const container = document.getElementById('sankey-chart');
  if (!container || typeof Highcharts === 'undefined' || !Highcharts.seriesTypes.sankey) return;
  const chrome = chartChrome();
  const palette = seriesPalette();

  const engagement = getIndicatorSeries('ovw-05');
  const practices = getIndicatorSeries('ovw-07');
  if (engagement.length < 3 || practices.length === 0) return;

  const trainedVal = engagement[1].value;
  const adoptingVal = engagement[2].value;

  const data = [
    ['Enrolled', 'Trained', trainedVal],
    ['Trained', 'Adopted 1+ Practice', adoptingVal],
    ...practices.map((p) => ['Adopted 1+ Practice', p.label, p.value]),
  ];

  const chart = Highcharts.chart(container, {
    chart: { height: 360, backgroundColor: 'transparent', style: { fontFamily: 'system-ui, sans-serif' } },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      backgroundColor: chrome.surface, borderColor: chrome.gridline, style: { color: chrome.textPrimary },
      pointFormat: '{point.fromNode.name} → {point.toNode.name}: <b>{point.weight:,.0f}</b>',
    },
    series: [{
      type: 'sankey',
      name: 'Engagement flow',
      keys: ['from', 'to', 'weight'],
      data,
      nodePadding: 16,
      colors: palette,
      nodeWidth: 18,
      dataLabels: { style: { color: chrome.textPrimary, textOutline: 'none', fontSize: '11px', fontWeight: '600' } },
    }],
  });
  chartInstances.push(chart);
}

function buildSunburstData() {
  return GEOGRAPHY.states.map((s) => ({
    name: s.name,
    value: s.beneficiaries,
    children: s.districts.map((d) => ({
      name: d.name,
      value: d.beneficiaries,
      children: d.blocks.map((b) => ({ name: b.name, value: b.beneficiaries })),
    })),
  }));
}

function mountSunburstChart() {
  const container = document.getElementById('sunburst-chart');
  if (!container || typeof echarts === 'undefined') return;
  const chrome = chartChrome();
  const palette = seriesPalette();
  const chart = echarts.init(container);
  chart.setOption({
    tooltip: { formatter: (p) => `<b>${p.name}</b>: ${p.value.toLocaleString('en-IN')} beneficiaries` },
    series: [{
      type: 'sunburst',
      radius: ['12%', '92%'],
      center: ['50%', '52%'],
      color: palette,
      data: buildSunburstData(),
      label: { color: chrome.textPrimary, fontSize: 10, minAngle: 8 },
      itemStyle: { borderColor: chrome.surface, borderWidth: 1.5 },
      levels: [
        {},
        { r0: '12%', r: '45%', label: { fontSize: 12, fontWeight: 700 } },
        { r0: '45%', r: '70%', label: { fontSize: 10.5 } },
        { r0: '70%', r: '92%', label: { fontSize: 9.5, rotate: 'tangential' } },
      ],
    }],
  });
  chartInstances.push(chart);
}

// ---------- India map widget (Highcharts Maps, focused on program states, with graceful fallback) ----------
function currentGeoLevel() {
  const s = GEOGRAPHY.states.find((x) => x.id === state.filters.stateId);
  const d = s && s.districts.find((x) => x.id === state.filters.districtId);
  const b = d && d.blocks.find((x) => x.id === state.filters.blockId);
  return { state: s, district: d, block: b, level: b ? 'block' : d ? 'district' : s ? 'state' : 'region' };
}

function renderMapWidgetShell() {
  const { state: s, district: d, block: b } = currentGeoLevel();
  const crumbs = [{ label: 'Program Region', clear: 'all' }];
  if (s) crumbs.push({ label: s.name, clear: 'state' });
  if (d) crumbs.push({ label: d.name, clear: 'district' });
  if (b) crumbs.push({ label: b.name, clear: null });

  const crumbHtml = crumbs.map((c, idx) => {
    const sep = idx > 0 ? '<span class="breadcrumb-sep">/</span>' : '';
    if (idx === crumbs.length - 1) return `${sep}<span class="breadcrumb-current">${c.label}</span>`;
    return `${sep}<button class="breadcrumb-link" data-clear="${c.clear}">${c.label}</button>`;
  }).join('');

  return `
    <div class="map-widget">
      <div class="map-widget-header">
        <div class="breadcrumbs" id="map-breadcrumbs">${crumbHtml}</div>
        <div class="layer-toggle" id="map-layer-toggle">
          <button data-layer="beneficiaries" class="${state.mapLayer !== 'partners' ? 'active' : ''}">Beneficiaries</button>
          <button data-layer="partners" class="${state.mapLayer === 'partners' ? 'active' : ''}">Partners</button>
        </div>
      </div>
      <div class="map-widget-body">
        <div class="map-widget-main" id="map-main"></div>
        <aside class="map-widget-sidebar" id="map-sidebar"></aside>
      </div>
    </div>
  `;
}

function choroplethColor(pct) {
  const stops = [
    { pct: 0, c: [210, 30, 95] }, { pct: 0.25, c: [152, 50, 75] }, { pct: 0.5, c: [152, 55, 55] },
    { pct: 0.75, c: [152, 60, 40] }, { pct: 1, c: [152, 65, 25] },
  ];
  const clamped = Math.max(0, Math.min(1, pct));
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (clamped >= a.pct && clamped <= b.pct) {
      const t = (clamped - a.pct) / (b.pct - a.pct || 1);
      const h = a.c[0] + (b.c[0] - a.c[0]) * t, s = a.c[1] + (b.c[1] - a.c[1]) * t, l = a.c[2] + (b.c[2] - a.c[2]) * t;
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
  return `hsl(${stops[4].c[0]}, ${stops[4].c[1]}%, ${stops[4].c[2]}%)`;
}

function mountMapSidebar() {
  const sidebar = document.getElementById('map-sidebar');
  const totalBeneficiaries = GEOGRAPHY.states.reduce((s, x) => s + x.beneficiaries, 0);
  const totalPartners = GEOGRAPHY.states.reduce((s, x) => s + x.partners, 0);
  const totalDistricts = GEOGRAPHY.states.reduce((s, x) => s + x.districts.length, 0);

  const legend = state.mapLayer === 'partners'
    ? `<div class="map-legend"><div class="map-legend-title">Partner presence</div><div class="map-legend-note">Circle size scales with number of implementing partners per state.</div></div>`
    : `<div class="map-legend"><div class="map-legend-title">Beneficiary density</div><div class="map-legend-ramp">${[0, 0.25, 0.5, 0.75, 1].map((p) => `<span style="background:${choroplethColor(p)}"></span>`).join('')}</div><div class="map-legend-scale"><span>Low</span><span>High</span></div></div>`;

  sidebar.innerHTML = `
    ${legend}
    <div class="map-coverage">
      <div class="map-coverage-title">Program coverage</div>
      <div class="map-coverage-row"><span>States</span><b>${GEOGRAPHY.states.length}</b></div>
      <div class="map-coverage-row"><span>Districts</span><b>${totalDistricts}</b></div>
      <div class="map-coverage-row"><span>Beneficiaries</span><b>${totalBeneficiaries.toLocaleString('en-IN')}</b></div>
      <div class="map-coverage-row"><span>Partners</span><b>${totalPartners}</b></div>
    </div>
  `;
}

function mountMapWidget() {
  document.querySelectorAll('#map-breadcrumbs [data-clear]').forEach((btn) => {
    btn.onclick = () => {
      const clear = btn.getAttribute('data-clear');
      if (clear === 'all') { state.filters.stateId = undefined; state.filters.districtId = undefined; state.filters.blockId = undefined; }
      if (clear === 'state') { state.filters.districtId = undefined; state.filters.blockId = undefined; }
      if (clear === 'district') { state.filters.blockId = undefined; }
      render();
    };
  });
  document.querySelectorAll('#map-layer-toggle button').forEach((btn) => {
    btn.onclick = () => { state.mapLayer = btn.getAttribute('data-layer'); render(); };
  });

  mountMapSidebar();

  const { level, state: s, district: d, block: b } = currentGeoLevel();
  const main = document.getElementById('map-main');

  // The map itself carries the drill-down through region → state → district →
  // block (real district polygons + block-level bubble markers). Only the leaf
  // level — villages/GPs inside a block — falls back to a plain card grid,
  // since no public polygon data exists at that granularity.
  if (level === 'block') {
    renderGeoCardGrid(main, b.villages, false, null);
    return;
  }

  main.innerHTML = '<div id="map-canvas"></div><div class="loading-state" id="map-loading">Loading map…</div>';
  if (level === 'region') loadRegionMap();
  else if (level === 'state') loadStateMap(s);
  else loadDistrictMap(s, d);
}

function renderGeoCardGrid(main, nodes, clickable, onSelect) {
  main.innerHTML = `<div class="geo-card-grid">${nodes.map((n, idx) => `
    <${clickable ? 'button' : 'div'} class="geo-card${clickable ? '' : ' geo-card-static'}" data-idx="${idx}">
      <div class="geo-card-name">${n.name}</div>
      <div class="geo-card-value">${n.beneficiaries.toLocaleString('en-IN')} beneficiaries</div>
    </${clickable ? 'button' : 'div'}>`).join('')}</div>`;
  if (clickable) {
    main.querySelectorAll('[data-idx]').forEach((el) => {
      el.onclick = () => onSelect(nodes[Number(el.getAttribute('data-idx'))]);
    });
  }
}

// India (state-level) GeoJSON — try a couple of public sources in order, since
// CDN availability varies by network; fall back to a card grid if all fail.
const INDIA_TOPO_SOURCES = [
  'https://cdn.jsdelivr.net/npm/@highcharts/map-collection/countries/in/in-all.geo.json',
  'https://code.highcharts.com/mapdata/countries/in/in-all.geo.json',
];

// Only these states are ever shown on the map — the rest of India is dropped
// from the GeoJSON entirely so Highcharts auto-fits the view to just this region.
const PROGRAM_STATE_NAMES = GEOGRAPHY.states.map((s) => s.name.toLowerCase());

function fetchFirstAvailable(urls) {
  return urls.reduce(
    (promise, url) => promise.catch(() => fetch(url).then((r) => { if (!r.ok) throw new Error('bad response'); return r.json(); })),
    Promise.reject()
  );
}

function nameOfFeature(props) {
  return (props && (props.name || props.district || props['hc-key'] || props.woe_name)) || '';
}

function baseMapChartOptions(chrome, heightPx) {
  return {
    chart: { backgroundColor: 'transparent', height: heightPx, margin: [10, 10, 10, 10] },
    title: { text: undefined },
    credits: { enabled: false },
    mapNavigation: { enabled: true, buttonOptions: { verticalAlign: 'bottom' } },
    legend: { enabled: false },
    tooltip: { backgroundColor: chrome.surface, borderColor: chrome.gridline, style: { color: chrome.textPrimary } },
  };
}

function clearMapLoading() {
  const loading = document.getElementById('map-loading');
  if (loading) loading.remove();
}

function mapLoadFailed(message, fallbackNodes, onSelect) {
  const loading = document.getElementById('map-loading');
  if (loading) loading.textContent = message;
  const main = document.getElementById('map-main');
  const extra = document.createElement('div');
  extra.style.marginTop = '12px';
  main.appendChild(extra);
  renderGeoCardGrid(extra, fallbackNodes, true, onSelect);
}

// ---- Level 1: region (Karnataka + Kerala choropleth, India GeoJSON filtered) ----
function loadRegionMap() {
  fetchFirstAvailable(INDIA_TOPO_SOURCES)
    .then((topo) => {
      clearMapLoading();
      renderRegionMap(topo);
    })
    .catch(() => mapLoadFailed(
      'Map data unavailable right now — showing the states below instead.',
      GEOGRAPHY.states,
      (node) => { state.filters.stateId = node.id; render(); }
    ));
}

function renderRegionMap(topology) {
  const chrome = chartChrome();
  const max = Math.max(...GEOGRAPHY.states.map((n) => n.beneficiaries), 1);

  const allMapData = Highcharts.geojson ? Highcharts.geojson(topology) : topology.features;
  const mapData = allMapData.filter((f) => PROGRAM_STATE_NAMES.includes(String(nameOfFeature(f.properties)).toLowerCase()));
  const effectiveMapData = mapData.length ? mapData : allMapData;

  const seriesData = effectiveMapData.map((feature) => {
    const name = nameOfFeature(feature.properties);
    const match = GEOGRAPHY.states.find((n) => n.name.toLowerCase() === String(name).toLowerCase());
    return { 'hc-key': feature.properties && feature.properties['hc-key'], name, value: match ? match.beneficiaries : null, custom: match };
  });

  const chart = Highcharts.mapChart('map-canvas', Object.assign(baseMapChartOptions(chrome, 440), {
    colorAxis: { min: 0, max, stops: [[0, '#eef0ee'], [0.25, choroplethColor(0.25)], [0.5, choroplethColor(0.5)], [0.75, choroplethColor(0.75)], [1, choroplethColor(1)]] },
    tooltip: {
      backgroundColor: chrome.surface, borderColor: chrome.gridline, style: { color: chrome.textPrimary },
      formatter: function () {
        const b = this.point.custom;
        return b
          ? `<b>${this.point.name}</b>: ${b.beneficiaries.toLocaleString('en-IN')} beneficiaries`
          : `<b>${this.point.name}</b><br/>Not currently covered by the program`;
      },
    },
    series: [{
      data: seriesData,
      mapData: effectiveMapData,
      joinBy: ['hc-key', 'hc-key'],
      nullColor: '#eef0ee',
      borderColor: chrome.surface,
      borderWidth: 1,
      dataLabels: { enabled: true, format: '{point.name}', style: { color: chrome.textPrimary, fontSize: '12px', fontWeight: '700', textOutline: '2px ' + chrome.surface } },
      states: { hover: { brightness: 0.15, borderColor: chrome.textPrimary } },
      point: { events: { click: function () { if (this.custom) { state.filters.stateId = this.custom.id; render(); } } } },
    }],
  }));

  if (state.mapLayer === 'partners') {
    chart.addSeries({
      type: 'mapbubble', name: 'Partners',
      data: GEOGRAPHY.states.map((s) => ({ name: s.name, lat: s.center[1], lon: s.center[0], z: s.partners })),
      minSize: 10, maxSize: 32, color: seriesPalette()[1],
      tooltip: { pointFormat: '<b>{point.name}</b>: {point.z} partners' },
    });
  }
  chartInstances.push(chart);
}

// ---- Level 2: state (real district polygons for Karnataka/Kerala) ----
function loadStateMap(s) {
  const source = STATE_TOPO[s.name];
  if (!source) { mapLoadFailed('No district map for this state — showing districts below instead.', s.districts, (n) => { state.filters.districtId = n.id; render(); }); return; }

  fetch(source.url)
    .then((r) => { if (!r.ok) throw new Error('bad response'); return r.json(); })
    .then((topology) => {
      clearMapLoading();
      const geo = Highcharts.topo2geo(topology, source.key);
      renderStateMap(s, geo.features);
    })
    .catch(() => mapLoadFailed(
      `District map unavailable right now — showing ${s.name}'s districts below instead.`,
      s.districts,
      (n) => { state.filters.districtId = n.id; render(); }
    ));
}

function renderStateMap(s, features) {
  const chrome = chartChrome();
  const max = Math.max(...s.districts.map((n) => n.beneficiaries), 1);

  // guneetnarula's district topojson keys each feature by its own "district"
  // property (not Highcharts' usual "hc-key") — join on that literal field.
  const seriesData = features.map((feature) => {
    const name = nameOfFeature(feature.properties);
    const match = s.districts.find((n) => n.name.toLowerCase() === String(name).toLowerCase());
    return { district: feature.properties && feature.properties.district, name, value: match ? match.beneficiaries : null, custom: match };
  });

  const chart = Highcharts.mapChart('map-canvas', Object.assign(baseMapChartOptions(chrome, 440), {
    colorAxis: { min: 0, max, stops: [[0, '#eef0ee'], [0.25, choroplethColor(0.25)], [0.5, choroplethColor(0.5)], [0.75, choroplethColor(0.75)], [1, choroplethColor(1)]] },
    tooltip: {
      backgroundColor: chrome.surface, borderColor: chrome.gridline, style: { color: chrome.textPrimary },
      formatter: function () {
        const b = this.point.custom;
        return b
          ? `<b>${this.point.name}</b>: ${b.beneficiaries.toLocaleString('en-IN')} beneficiaries`
          : `<b>${this.point.name}</b><br/>Not currently covered by the program`;
      },
    },
    series: [{
      data: seriesData,
      mapData: features,
      joinBy: ['district', 'district'],
      nullColor: '#eef0ee',
      borderColor: chrome.surface,
      borderWidth: 1,
      // Only label the districts the program actually covers — labeling all
      // ~30 of Karnataka's districts when 3 matter buries the signal and
      // reads like something's broken in the other 27.
      dataLabels: {
        enabled: true,
        formatter: function () { return this.point.custom ? this.point.name : null; },
        style: { color: chrome.textPrimary, fontSize: '11px', fontWeight: '700', textOutline: '2px ' + chrome.surface },
      },
      states: { hover: { brightness: 0.15, borderColor: chrome.textPrimary } },
      point: { events: { click: function () { if (this.custom) { state.filters.districtId = this.custom.id; render(); } } } },
    }],
  }));

  if (state.mapLayer === 'partners') {
    chart.addSeries({
      type: 'mapbubble', name: 'Partners',
      data: s.districts.map((d) => ({ name: d.name, lat: d.center[1], lon: d.center[0], z: d.partners })),
      minSize: 8, maxSize: 26, color: seriesPalette()[1],
      tooltip: { pointFormat: '<b>{point.name}</b>: {point.z} partners' },
    });
  }
  chartInstances.push(chart);
}

// ---- Level 3: district (zoomed to the selected district polygon + block bubbles) ----
function loadDistrictMap(s, d) {
  const source = STATE_TOPO[s.name];
  if (!source) { mapLoadFailed('No map for this district — showing blocks below instead.', d.blocks, (n) => { state.filters.blockId = n.id; render(); }); return; }

  fetch(source.url)
    .then((r) => { if (!r.ok) throw new Error('bad response'); return r.json(); })
    .then((topology) => {
      clearMapLoading();
      const geo = Highcharts.topo2geo(topology, source.key);
      const feature = geo.features.find((f) => nameOfFeature(f.properties).toLowerCase() === d.name.toLowerCase());
      renderDistrictMap(d, feature ? [feature] : geo.features);
    })
    .catch(() => mapLoadFailed(
      `Block map unavailable right now — showing ${d.name}'s blocks below instead.`,
      d.blocks,
      (n) => { state.filters.blockId = n.id; render(); }
    ));
}

function renderDistrictMap(d, features) {
  const chrome = chartChrome();
  const palette = seriesPalette();

  const chart = Highcharts.mapChart('map-canvas', Object.assign(baseMapChartOptions(chrome, 440), {
    series: [{
      // No data/joinBy needed here — this series only draws the selected
      // district's polygon as a flat background; blocks are the mapbubble layer.
      mapData: features,
      color: isDarkMode() ? '#1f3d2c' : '#dff0e6',
      borderColor: chrome.surface,
      borderWidth: 1,
      enableMouseTracking: false,
    }, {
      type: 'mapbubble',
      name: 'Blocks',
      data: d.blocks.map((b) => ({ name: b.name, lat: b.center[1], lon: b.center[0], z: b.beneficiaries, custom: b })),
      minSize: 16,
      maxSize: 46,
      color: palette[0],
      colorKey: 'z',
      dataLabels: { enabled: true, format: '{point.name}', style: { color: chrome.textPrimary, fontSize: '11px', fontWeight: '700', textOutline: '2px ' + chrome.surface }, y: -14 },
      tooltip: { pointFormat: '<b>{point.name}</b>: {point.z} beneficiaries — click to view villages' },
      cursor: 'pointer',
      point: { events: { click: function () { state.filters.blockId = this.custom.id; render(); } } },
    }],
  }));
  chartInstances.push(chart);
}

// ---------- Top-level render ----------
function render() {
  destroyCharts();
  document.getElementById('topbar-title').textContent = (DASHBOARDS.find((d) => d.id === state.dashboardId) || {}).label || 'Dashboard';
  document.getElementById('theme-toggle-btn').textContent = isDarkMode() ? '☀ Light' : '🌙 Dark';
  renderSidebar();
  renderFilterBar();
  renderDashboardGrid();
}

document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
render();
