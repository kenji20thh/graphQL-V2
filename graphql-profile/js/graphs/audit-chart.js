import { createSVG } from './graph-utils.js';
export function renderAuditChart(container, data=[]){
  const svg = createSVG(300,120);
  container.appendChild(svg);
}
