import { ShadowRender, ShadowRenderRef } from '../src';
import { render, waitFor } from '@testing-library/react';
// 测试 shadow dom 需要
import { screen } from 'shadow-dom-testing-library';
import React, { createRef, RefObject } from 'react';

describe('ShadowRender test', () => {
  async function getShadowElement(selector: string): Promise<HTMLElement> {
    const shadowRoot = document.querySelector('.biz-shadow-react')?.shadowRoot!;
    const element = shadowRoot.querySelector(selector) as HTMLElement;
    if (element) {
      return element;
    }
    throw new Error('element not exists');
  }

  test('match snapshot ok', async () => {
    const comp = render(<ShadowRender htmlContent="<h1>Hello</h1>" />);
    expect(comp).toMatchSnapshot();
    expect(comp.container.querySelector('.biz-shadow-react')).toBeTruthy();
  });

  test('add custom className ok', async () => {
    const comp = render(<ShadowRender className="my-class" htmlContent="<h1>Hello</h1>" />);
    expect(comp.container.querySelector('.my-class')).toBeTruthy();
  });

  test('check shadow html content', async () => {
    render(<ShadowRender htmlContent="<h1>Hello</h1>" />);

    await waitFor(() => screen.findByShadowText('Hello'));
    const el = await screen.findByShadowText('Hello');
    expect(el.tagName).toBe('H1');
  });

  test('getContentDOM will return content dom', async () => {
    const ref: RefObject<ShadowRenderRef> = createRef();
    render(<ShadowRender htmlContent="<h1>Hello</h1>" ref={ref} />);

    await waitFor(() => screen.findByShadowText('Hello'));
    expect(ref.current!.getContentDOM().innerHTML).toBe('<h1>Hello</h1>');
  });

  test('set dynamic styles ok', async () => {
    render(
      <ShadowRender
        htmlContent="<h1>Hello</h1>"
        styles={[{ href: 'https://editor.yuque.com/ne-editor/lake-content-v1.css' }, 'color: blue']}
      />
    );

    // 等待 style 元素存在，50ms 轮训，1000ms 超时
    await waitFor(() => getShadowElement('style'));

    const linkEl = (await getShadowElement('link')) as HTMLLinkElement;
    const styleEl = (await getShadowElement('style')) as HTMLStyleElement;

    expect(linkEl.href).toBe('https://editor.yuque.com/ne-editor/lake-content-v1.css');
    expect(styleEl.innerHTML).toBe('color: blue');
  });
});
