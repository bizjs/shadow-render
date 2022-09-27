import type { ReactNode } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import type { Root } from 'react-dom/client';

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

/**
 * 根据container缓存ReactRoot
 * 同一个container只能存在一个createRoot实例
 * 如果同一个container存在多个实例，React会抛出警告
 * 重复render时，无需新建Root
 */
const reactRootMap = new Map<HTMLElement, Root>();

/**
 * 兼容React各版render API
 */
export async function render(children: ReactNode, container: HTMLElement) {
  let createRoot;
  try {
    // @ts-ignore
    const { createRoot: reactCreateRoot } = await import('react-dom/client');
    createRoot = reactCreateRoot;
  } finally {
    if (createRoot) {
      let reactRoot = reactRootMap.get(container);
      if (!reactRoot) {
        reactRoot = createRoot(container);
        reactRootMap.set(container, reactRoot);
      }
      reactRootMap.set(container, reactRoot);
      reactRoot.render(children);
    } else {
      const { render } = await import('react-dom');
      // @ts-ignore
      render(children, container);
    }
  }
}

/**
 * 卸载container中的React状态
 * @param container dom节点
 * @param isUnMount 是否是卸载组件
 */
export function unMoutReactByNode(container: HTMLElement) {
  const reactRoot = reactRootMap.get(container);
  if (reactRoot) {
    reactRoot.unmount();
    reactRootMap.delete(container);
  } else {
    unmountComponentAtNode(container);
  }
}
