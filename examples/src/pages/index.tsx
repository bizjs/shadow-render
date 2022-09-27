import { ShadowRender } from '@bizjs/shadow-render-react';
import { useState } from 'react';

const HTML_CONTENT = '<h1>我是 h1 内容</h1>';

export default function HomePage() {
  const [htmlContent, setHtmlContent] = useState(HTML_CONTENT);
  return (
    <div>
      <div>
        <button
          onClick={() => {
            setHtmlContent(HTML_CONTENT);
          }}
        >
          渲染 HTML Content
        </button>
        <button
          onClick={() => {
            setHtmlContent(undefined);
          }}
        >
          渲染 Children
        </button>
      </div>
      <ShadowRender htmlContent={htmlContent}>
        <h2 style={{ color: 'red' }}>我是 h2 内容 - Children</h2>
      </ShadowRender>
    </div>
  );
}
