import { createSVG } from './graph-utils.js';
export function renderXPChart(container, data=[]){
  const svg = createSVG(400,120);
  svg.innerHTML = '<rect width="100%" height="100%" fill="transparent"></rect>';
  container.appendChild(svg);
}
