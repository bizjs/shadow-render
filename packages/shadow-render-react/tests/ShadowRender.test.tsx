import { ShadowRender, ShadowRenderRef } from '../src';
import { fireEvent, render, waitFor } from '@testing-library/react';
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

  test('htmlContent value maybe an ReactElement', async () => {
    const ref: RefObject<ShadowRenderRef> = createRef();
    render(
      <ShadowRender ref={ref}>
        <h1>Hello</h1>
      </ShadowRender>
    );

    await waitFor(() => screen.findByShadowText('Hello'));
    expect(ref.current!.getContentDOM().innerHTML).toBe('<h1>Hello</h1>');
  });

  test('when htmlContent and children exist at the same time will render htmlContent', async () => {
    const ref: RefObject<ShadowRenderRef> = createRef();
    render(<ShadowRender htmlContent="<h1>htmlContent</h1>" ref={ref} children={<h1>children</h1>} />);

    await waitFor(() => screen.findByShadowText('htmlContent'));
    expect(ref.current!.getContentDOM().innerHTML).toBe('<h1>htmlContent</h1>');
  });

  test('htmlContent value maybe an Component', async () => {
    const ref: RefObject<ShadowRenderRef> = createRef();
    const Component = () => <h1>Hello</h1>;
    render(
      <ShadowRender ref={ref}>
        <Component />
      </ShadowRender>
    );

    await waitFor(() => screen.findByShadowText('Hello'));
    expect(ref.current!.getContentDOM().innerHTML).toBe('<h1>Hello</h1>');
  });

  test('when-htmlContent-and-children-values-change-be-ok', async () => {
    const ref: RefObject<ShadowRenderRef> = createRef();
    const Component = () => {
      const [count, setCount] = React.useState(0);
      const [htmlContent, setContent] = React.useState<string | undefined>(undefined);
      return (
        <>
          <button id="increment" onClick={() => setCount(count + 1)}>
            add
          </button>
          <button id="hiddenContent" onClick={() => setContent(undefined)}>
            hidden
          </button>
          <button id="showContent" onClick={() => setContent('hello')}>
            show
          </button>
          <ShadowRender ref={ref} htmlContent={htmlContent} children={<div>{count}</div>}></ShadowRender>
        </>
      );
    };
    render(<Component />);

    await waitFor(() => screen.findByShadowText('0'));
    fireEvent.click(screen.getByText('add'));
    await waitFor(() => screen.findByShadowText('1'));
    fireEvent.click(screen.getByText('show'));
    await waitFor(() => screen.findByShadowText('hello'));
    fireEvent.click(screen.getByText('add'));
    await waitFor(() => screen.findByShadowText('hello'));
    fireEvent.click(screen.getByText('hidden'));
    await waitFor(() => screen.findByShadowText('2'));
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
