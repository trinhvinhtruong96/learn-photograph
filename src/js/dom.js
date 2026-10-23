export const SVG_NS = 'http://www.w3.org/2000/svg';

let counter = 0;
export function uid(prefix) {
  counter += 1;
  return `${prefix}-${counter}`;
}

function build(node, attrs, children) {
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  node.append(...[children].flat(Infinity).filter((c) => c !== undefined && c !== null && c !== false));
  return node;
}

export function el(tag, attrs = {}, children = []) {
  return build(document.createElement(tag), attrs, children);
}

export function svgEl(tag, attrs = {}, children = []) {
  return build(document.createElementNS(SVG_NS, tag), attrs, children);
}
