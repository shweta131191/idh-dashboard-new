// JS-side mirror of theme/tokens.css — Highcharts/ECharts need literal hex strings,
// not CSS var() references, so we keep one light and one dark array in sync with
// the CSS custom properties and pick between them at render time.
export const SERIES_LIGHT = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
];

export const SERIES_DARK = [
  '#3987e5',
  '#d95926',
  '#199e70',
  '#c98500',
  '#d55181',
  '#008300',
  '#9085e9',
  '#e66767',
];

export function isDarkMode(): boolean {
  const stamped = document.documentElement.getAttribute('data-theme');
  if (stamped === 'dark') return true;
  if (stamped === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function seriesPalette(): string[] {
  return isDarkMode() ? SERIES_DARK : SERIES_LIGHT;
}

export function chartChrome() {
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
