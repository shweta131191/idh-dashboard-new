#!/usr/bin/env node
// Regenerates docs/INDICATOR_MAPPING.md from shared/indicators.json.
// Run after every edit to indicators.json: node scripts/generate-mapping-doc.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'shared', 'indicators.json'), 'utf8'));

const dashboardLabel = Object.fromEntries(registry.dashboards.map((d) => [d.id, d.label]));

function chartTypeLabel(type) {
  return { kpi: 'KPI Card', column: 'Column Chart (Highcharts)', pie: 'Pie Chart (ECharts)', donut: 'Donut Chart (ECharts)' }[type] || type;
}

function renderIndicator(ind) {
  const lines = [];
  lines.push(`#### ${ind.indicator}`);
  lines.push('');
  lines.push(`- **Sheet row:** ${ind.row}`);
  lines.push(`- **Chart type:** ${chartTypeLabel(ind.chartType)}`);
  lines.push(`- **Form(s) / table(s):** ${ind.tables.map((t) => `\`${t}\` (${registry.tables[t] ? registry.tables[t].form : t})`).join(', ')}`);
  if (ind.column) lines.push(`- **Source column:** \`${ind.column}\``);
  if (ind.columns) lines.push(`- **Source columns:** ${ind.columns.map((c) => `\`${c}\``).join(', ')}`);
  if (ind.dependsOn) lines.push(`- **Skip-logic dependency:** \`${ind.dependsOn.column}\` = \`${ind.dependsOn.value}\``);
  if (ind.categories) {
    lines.push(`- **Categories:** ${ind.categories.map((c) => c.label).join(', ')}`);
  }
  lines.push(`- **Logic:** ${ind.logic}`);
  lines.push('- **SQL:**');
  lines.push('  ```sql');
  ind.sql.split('\n').forEach((l) => lines.push('  ' + l));
  lines.push('  ```');
  if (ind.notes) lines.push(`- **Notes:** ${ind.notes}`);
  lines.push('');
  return lines.join('\n');
}

function main() {
  const out = [];
  out.push('# IDH Dashboard — Indicator Mapping');
  out.push('');
  out.push('> Generated from `shared/indicators.json`. Do not hand-edit — edit the registry and run `node scripts/generate-mapping-doc.js`.');
  out.push('');
  out.push(`Source: **IDH Logic Sheet (1).xlsx** (sheet \`Updated Design Sheet_v2\`, rows 2-70), cross-referenced with **idh_prod_sync_driver (1).sql**.`);
  out.push('');
  out.push(`Total indicators: **${registry.indicators.length}**`);
  out.push('');

  const byDashboard = {};
  for (const ind of registry.indicators) {
    byDashboard[ind.dashboard] = byDashboard[ind.dashboard] || {};
    byDashboard[ind.dashboard][ind.subDashboard] = byDashboard[ind.dashboard][ind.subDashboard] || [];
    byDashboard[ind.dashboard][ind.subDashboard].push(ind);
  }

  for (const dash of registry.dashboards) {
    const subs = byDashboard[dash.id];
    if (!subs) continue;
    out.push(`## ${dash.label}`);
    out.push('');
    for (const [subName, indicators] of Object.entries(subs)) {
      out.push(`### ${subName}`);
      out.push('');
      for (const ind of indicators) out.push(renderIndicator(ind));
    }
  }

  fs.writeFileSync(path.join(ROOT, 'docs', 'INDICATOR_MAPPING.md'), out.join('\n'));
  console.log('Wrote docs/INDICATOR_MAPPING.md');
}

main();
