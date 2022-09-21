/**
 * 从节点中通过选择器找到元素并移除
 * @param node 要移除元素的父节点
 * @param selector 节点选择器，选择要移除的元素
 */
export function removeNodeItems(node: ShadowRoot | HTMLElement, selector: string) {
  node.querySelectorAll(selector).forEach((el) => {
    el.parentNode!.removeChild(el);
  });
}

/**
 * 批量设置节点属性
 * @param node 要设置属性的节点
 * @param attrs 要设置的属性
 */
export function setAttributes(node: HTMLElement, attrs: Record<string, string>) {
  Object.keys(attrs).forEach((key) => {
    node.setAttribute(key, attrs[key]);
  });
}
