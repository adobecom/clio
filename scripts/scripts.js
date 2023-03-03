/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { buildBlock, setLibs } from './utils.js';

// Add project-wide style path here.
const STYLES = '';

// Use '/libs' if your live site maps '/libs' to milo's origin.
const LIBS = 'https://milo.adobe.com/libs';

// Add any config options.
const CONFIG = {
  // codeRoot: '',
  // contentRoot: '',
  // imsClientId: 'college',
  // geoRouting: 'off',
  // fallbackRouting: 'off',
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
  },
};

(function buildTocBlock() {
  const main = document.querySelector('main');
  const headings = main.querySelectorAll('h2,h3');
  const toc = document.createElement('div');
  let parent = document.createElement('ul');
  toc.append(parent);
  headings.forEach((h) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.innerHTML = h.innerHTML;
    li.innerHTML = a.outerHTML;
    if (h.nodeName === 'H2') {
      parent = toc.firstElementChild;
    } else if (h.nodeName === 'H3') {
      if (parent.parentElement === toc) {
        const ul = document.createElement('ul');
        parent.lastElementChild.append(ul);
        parent = ul;
      }
    }
    parent.append(li);
  });

  const section = document.createElement('div');
  section.append(buildBlock('toc', { elems: [toc] }));
  main.prepend(section);
}());

(function buildHeroBlock() {
  const main = document.querySelector('main');
  const h1 = main.querySelector('h1');
  if (!h1 || !h1.previousElementSibling) {
    return;
  }

  const pictures = [];
  let sibling = h1.previousElementSibling;
  while (sibling) {
    if (sibling.firstElementChild && sibling.firstElementChild.nodeName === 'PICTURE') {
      pictures.push(sibling.firstElementChild);
      sibling = sibling.previousElementSibling;
    } else {
      sibling = null;
    }
  }

  if (!pictures.length) {
    return;
  }

  const section = document.createElement('div');
  section.append(buildBlock('hero', { elems: pictures }));
  main.prepend(section);
}());

// Load LCP image immediately
(async function loadLCPImage() {
  const lcpImg = document.querySelector('img');
  lcpImg?.removeAttribute('loading');
}());

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

const miloLibs = setLibs(LIBS);

(function loadStyles() {
  const paths = [`${miloLibs}/styles/styles.css`];
  if (STYLES) { paths.push(STYLES); }
  paths.forEach((path) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', path);
    document.head.appendChild(link);
  });
}());

(async function loadPage() {
  const { loadArea, loadDelayed, setConfig } = await import(`${miloLibs}/utils/utils.js`);

  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
  loadDelayed();
}());
