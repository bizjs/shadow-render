import React, {
  forwardRef,
  type PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { removeNodeItems, setAttributes } from './utils';

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
  const rootDivRef = useRef<HTMLDivElement>(null);
  const [contentContainer, setContentContainer] = useState<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => {
    return {
      getContentDOM() {
        return contentContainer!;
      },
    };
  });

  // 初始化 shadow root
  useEffect(() => {
    if (!shadowRootRef.current) {
      shadowRootRef.current = rootDivRef.current!.attachShadow({ mode: 'open' });

      // 添加放内容的容器
      const contentEl = document.createElement('div');
      setAttributes(contentEl, { class: `${ROOT_CLASS}-content` });
      shadowRootRef.current.appendChild(contentEl);
      setContentContainer(contentEl);
    }
  }, []);

  // 处理样式
  useEffect(() => {
    const shadowRootDOM = shadowRootRef.current!;
    // 1. 先清理
    removeNodeItems(shadowRootDOM, `.${STYLE_CLASS}`);
    // 2. 再循环追加
    styles.forEach((style) => {
      if (typeof style === 'string') {
        const styleEl = document.createElement('style');
        setAttributes(styleEl, { class: STYLE_CLASS });
        styleEl.innerHTML = style;
        shadowRootDOM.insertBefore(styleEl, contentContainer);
      } else if (style.href) {
        const linkEl = document.createElement('link');
        setAttributes(linkEl, { class: STYLE_CLASS, rel: 'stylesheet', href: style.href });
        shadowRootDOM.insertBefore(linkEl, contentContainer);
      }
    });
  }, [styles]);

  // 最终需要渲染的 children
  const finalChildren = useMemo(() => {
    const needRenderByReact = htmlContent === undefined;
    return needRenderByReact ? children : <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }, [htmlContent, children]);

  const divClass = `${ROOT_CLASS} ${className || ''}`;

  return (
    <div className={divClass} ref={rootDivRef}>
      {contentContainer ? createPortal(finalChildren, contentContainer!) : null}
    </div>
  );
});
