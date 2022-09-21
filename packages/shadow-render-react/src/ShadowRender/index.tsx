import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { removeNodeItems, setAttributes } from './utils';

export type HtmlCustomStyle = { href: string } | string;

export type ShadowRenderProps = {
  className?: string;
  styles?: HtmlCustomStyle[];
  htmlContent: string;
};

// 样式常量
const ROOT_CLASS = `biz-shadow-react`;
const STYLE_CLASS = `${ROOT_CLASS}-link-style`;

type ShadowRenderRef = { getContentDOM: () => HTMLDivElement };

export const ShadowRender = forwardRef<ShadowRenderRef, ShadowRenderProps>((props: ShadowRenderProps, ref) => {
  const { htmlContent, styles = [], className } = props;

  const shadowRootRef = useRef<ShadowRoot>();
  const divRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>();

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
      contentEl.setAttribute('class', 'biz-html-content-box');
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

    // 处理内容
    contentRef.current!.innerHTML = htmlContent;
  }, [htmlContent, styles]);

  const divClass = `${ROOT_CLASS} ${className}`;

  return <div className={divClass} ref={divRef}></div>;
});
