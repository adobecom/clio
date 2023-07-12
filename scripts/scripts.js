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
    '': { ietf: 'en', tk: 'hah7vzn.css' },
    de: { ietf: 'de', tk: 'vin7zsi.css' },
    es: { ietf: 'es', tk: 'oln4yqj.css' },
    fr: { ietf: 'fr', tk: 'vrk5vyv.css' },
    it: { ietf: 'it', tk: 'bbf5pok.css' },
    ja: { ietf: 'ja', tk: 'dvg6awq' },
    kr: { ietf: 'kr', tk: 'qjs5sfm' },
    nl: { ietf: 'nl', tk: 'cya6bri.css' },
    pt: { ietf: 'pt', tk: 'inq1xob.css' },
    se: { ietf: 'se', tk: 'fpk1pcd.css' },
  },
};

function buildTocBlock() {
  const section = document.createElement('div');
  section.append(buildBlock('toc', { elems: [] }));
  document.querySelector('main').prepend(section);
}

function scrollToAnchor() {
  const { hash } = window.location;
  if (!hash) {
    return;
  }
  const el = document.querySelector(hash);
  if (!el) {
    return;
  }
  el.scrollIntoView({ behavior: 'smooth' });
}

function buildHeroBlock() {
  const main = document.querySelector('main');
  const h1 = main.querySelector('h1');
  if (!h1) {
    return;
  }

  const pictures = [];
  if (h1.previousElementSibling) {
    let sibling = h1.previousElementSibling;
    while (sibling) {
      if (sibling.firstElementChild && sibling.firstElementChild.nodeName === 'PICTURE') {
        pictures.push(sibling.firstElementChild);
        sibling = sibling.previousElementSibling;
      } else {
        sibling = null;
      }
    }
    pictures.forEach((p) => p.parentElement.remove());
  }

  const section = document.createElement('div');
  section.append(buildBlock('hero', { elems: [...pictures, h1] }));
  section.classList.add('hero-wrapper');
  main.prepend(section);
}

function fixLinkNavigation() {
  document.querySelectorAll('a[href]').forEach((a) => {
    if (a.href.includes('clio--adobe.com.hlx.') || window.top === window) {
      return;
    }
    if (a.href.startsWith('https://firefly.adobe.com/')) {
      a.setAttribute('target', '_top');
    } else {
      a.setAttribute('target', '_blank');
    }
  });
}

function buildBackToTop() {
  const section = document.createElement('div');
  section.classList.add('section', 'is-floating');

  const button = document.createElement('button');
  button.classList.add('button');
  button.textContent = 'Back to top';
  button.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  })
  const main = document.querySelector('main');
  section.append(button);

  main.append(section);

  window.addEventListener('scroll', () => {
    const isVisible = Number(section.style.opacity) > 0;
    const shouldVisible = window.innerWidth < 600 ? window.scrollY > 600 : window.scrollY > 350;
    if (isVisible !== shouldVisible) {
      section.style.opacity = shouldVisible ? 1 : 0;
    }
  }, { passive: true });
}

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

  buildTocBlock();
  buildHeroBlock();
  setConfig({ ...CONFIG, miloLibs });
  await loadArea();
  fixLinkNavigation();
  buildBackToTop();
  scrollToAnchor();
  loadDelayed();
}());
