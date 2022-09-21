# @bizjs/shadow-render-react

[![NPM version](https://img.shields.io/npm/v/@bizjs/shadow-render-react.svg?style=flat)](https://npmjs.org/package/@bizjs/shadow-render-react)
[![NPM downloads](http://img.shields.io/npm/dm/@bizjs/shadow-render-react.svg?style=flat)](https://npmjs.org/package/@bizjs/shadow-render-react)

用于渲染 HTML 内容到 Shadow DOM 的 React 组件。

## 具体用法

```ts
import { ShadowRender } from '@bizjs/shadow-render-react';

function App() {
  return <ShadowRender htmlContent={`<h1>Hello</h1>`} />;
}
```

## 组件 Props

```ts
export type HtmlCustomStyle = { href: string } | string;

export type ShadowRenderProps = {
  className?: string;
  styles?: HtmlCustomStyle[];
  htmlContent: string;
};
```

| 属性名      | 描述                                               | 类型                | 默认值 | 版本 |
| ----------- | -------------------------------------------------- | ------------------- | ------ | ---- |
| htmlContent | `必选`，要渲染到 shadow DOM 的 html 内容           | `string`            |        |      |
| className   | 自定义渲染容器的 class，用于自定义容器样式         | `string`            |        |      |
| styles      | 要插入到 shadow DOM 的样式，用于自定义渲染内容样式 | `HtmlCustomStyle[]` | `[]`   |      |

## LICENSE

MIT
