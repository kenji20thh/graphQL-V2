export function createSVG(width=300,height=120){
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('width',width);
  svg.setAttribute('height',height);
  return svg;
}
