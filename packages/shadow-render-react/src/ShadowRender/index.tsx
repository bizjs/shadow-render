import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import { removeNodeItems, setAttributes, render, unMoutReactByNode } from './utils';

export type HtmlCustomStyle = { href: string } | string;

export type ShadowRenderRef = { getContentDOM: () => HTMLDivElement };

export type ShadowRenderProps = {
  className?: string;
  styles?: HtmlCustomStyle[];
  htmlContent?: string;
};

// 样式常量
const ROOT_CLASS = `biz-shadow-react`;
const STYLE_CLASS = `${ROOT_CLASS}-link-style`;

export const ShadowRender = forwardRef<ShadowRenderRef, PropsWithChildren<ShadowRenderProps>>((props, ref) => {
  const { htmlContent, styles = [], className, children } = props;

  const shadowRootRef = useRef<ShadowRoot>();
  const divRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>();

  // shadowDOM内部的根节点
  const contentElementRef = useRef<HTMLDivElement>();

  // 记录上次的状态是否是通过react API渲染
  const renderByReactRef = useRef(false);

  useImperativeHandle(ref, () => {
    return {
      getContentDOM() {
        return contentRef.current!;
      },
    };
  });

  useEffect(() => {
    // 没有 shadom root 时，先初始化 shadowRoot
    if (!shadowRootRef.current) {
      shadowRootRef.current = divRef.current!.attachShadow({ mode: 'open' });

      // 添加放内容的容器
      const contentEl = document.createElement('div');
      contentElementRef.current = contentEl;
      setAttributes(contentEl, { class: `${ROOT_CLASS}-content` });
      contentRef.current = contentEl;
      shadowRootRef.current.appendChild(contentEl);
    }

    const shadowRootDom = shadowRootRef.current!;

    // 处理样式
    // 1. 先清理
    removeNodeItems(shadowRootDom, `.${STYLE_CLASS}`);
    // 再循环追加
    styles.forEach((style) => {
      if (typeof style === 'string') {
        const styleEl = document.createElement('style');
        setAttributes(styleEl, { class: STYLE_CLASS });
        styleEl.innerHTML = style;
        shadowRootDom.insertBefore(styleEl, contentRef.current!);
      } else if (style.href) {
        const linkEl = document.createElement('link');
        setAttributes(linkEl, { class: STYLE_CLASS, rel: 'stylesheet', href: style.href });
        shadowRootDom.insertBefore(linkEl, contentRef.current!);
      }
    });
  }, [styles]);

  // 处理内容
  // htmlContent优先级高于children
  // 当htmlContent为undefined时,渲染children
  useEffect(() => {
    const hasHTMLContent = htmlContent !== undefined;

    if (hasHTMLContent) {
      if (renderByReactRef.current) {
        // 上次是使用react渲染则先卸载
        unMoutReactByNode(contentRef.current!);
      }

      /**
       * 解决unmout异步问题
       * 但是此处仍然存在数据竞争
       * @problem React仍会抛出警告,目前不影响执行的结果，但可能存在风险
       */
      Promise.resolve().then(() => {
        contentRef.current!.innerHTML = htmlContent;
      });
    } else {
      const needmountByPreRenderStatus = !renderByReactRef.current;
      if (needmountByPreRenderStatus) {
        unMoutReactByNode(contentRef.current!);
      }
      render(children, contentElementRef.current!);
    }

    renderByReactRef.current = !hasHTMLContent;
  }, [htmlContent, children]);

  useEffect(() => {
    // 卸载副作用 考虑到react18的useEffect在update时候回cleanp
    // 故将update与unmount逻辑分离
    return () => {
      // 使用render函数在卸载后延时器事件类相关副作用需清理
      if (renderByReactRef.current) {
        unMoutReactByNode(contentElementRef.current!);
      }
    };
  }, []);

  const divClass = `${ROOT_CLASS} ${className || ''}`;

  return <div className={divClass} ref={divRef}></div>;
});
