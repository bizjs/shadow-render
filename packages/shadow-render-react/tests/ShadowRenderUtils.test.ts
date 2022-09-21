import { setAttributes, removeNodeItems } from '../src/ShadowRender/utils';

describe('ShadowRenderUtils test', () => {
  let divEl: HTMLDivElement;

  beforeEach(() => {
    divEl = document.createElement('div');
    divEl.innerHTML = `
    <ul>
      <li class="item"></li>
      <li></li>
      <li class="item"></li>
      <li></li>
    </ul>`;
  });

  test('setAttributes ok', () => {
    setAttributes(divEl, { class: 'hi', style: 'color:red' });

    expect(divEl.className).toBe('hi');
    expect(divEl.style.color).toBe('red');
  });

  test('removeNodeItems ok, include deep items', () => {
    removeNodeItems(divEl, '.item');
    expect(divEl.querySelector('ul')?.children.length).toBe(2);

    removeNodeItems(divEl, 'li');
    expect(divEl.querySelector('ul')?.childElementCount).toBe(0);
  });
});
