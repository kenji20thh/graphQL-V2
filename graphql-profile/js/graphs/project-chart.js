import { createSVG } from './graph-utils.js';
export function renderProjectChart(container, data=[]){
  const svg = createSVG(300,120);
  container.appendChild(svg);
}
