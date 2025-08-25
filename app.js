/** 페이지에 따른 다른 docs 표시 */
const DOCS_ROOT = window.location.pathname.includes('advanced.html') ? 'docs2' : 'docs';
const PAGES_JSON = `${DOCS_ROOT}/pages.json`;

let currentSearch = '';

const renderer = new marked.Renderer();

/** 인라인 링크 */
renderer.link = ({ href, title, text }) => {
   try {
      const domain = new URL(href).origin;
      const faviconUrl = domain + '/favicon.ico';
      return `<a class="link-with-icon" href="${href}" target="_blank" title="${title || href}">
         <img src="${faviconUrl}" alt="icon"
            onerror="this.onerror=null;this.src='assets/img/beacon.png';" />
         ${text}
      </a>`;
   } catch {
      return `<a class="link-with-icon" href="${href}" title="${title || href}">
         <img src="assets/img/spyglass.png" alt="icon" />
         ${text}
      </a>`;
   }
};

/** 인라인 코드 */
renderer.code = (token) => {
   const codeText = token.text || '';
   const lang = token.lang || (token.langInfo ? token.langInfo.split(' ')[0] : '');

   if ((lang || '').toLowerCase() === 'mcfunction') {
      const lines = codeText.split('\n').map(line => mclangHighlight(line));
      const highlighted = lines.join('\n');
      return `<pre><code class="mcfunction">${highlighted}</code></pre>`;
   }

   // mermaid
   if ((lang || '').toLowerCase() === 'mermaid') {
      return `<div class="mermaid">${codeText}</div>`;
   }

   const escaped = codeText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

   const cls = lang ? `language-${lang}` : '';
   return `<pre><code class="${cls}">${escaped}</code></pre>`;
};

/** .md -> html */
function mdToHtml(md) {
   return marked.parse(md, {
      renderer,
      gfm: true,
      breaks: true,
   });
}

/**  페이지 목록 관리 */
let pages = [];
let activeId = null;

/** 목록 불러오기 */
async function loadIndex() {
   try {
      const res = await fetch(PAGES_JSON, { cache: 'no-store' });
      if (!res.ok) throw new Error('pages.json not found');
      const list = await res.json();
      pages = list.map(x => ({ ...x, content: null }));

      renderList(pages);

      if (pages.length) loadPage(pages[0].id);
   } catch (e) {
      return;
   }
}

/** 페이지 리스트 */
function renderList(list, container = null, level = 0) {
   if (!container) {
      container = document.getElementById('pages');
      container.innerHTML = '';
   }
   list.forEach(p => {
      const d = document.createElement('div');
      d.className = 'page';
      d.textContent = p.title;
      d.dataset.id = p.id;
      d.style.marginLeft = level * 16 + 'px';

      d.onclick = () => {
         if (p.content && p.content.trim() === '') {
            return;
         }
         loadPage(p.id);
      }

      if (p.id === activeId) d.classList.add('active');

      container.appendChild(d);

      if (p.children && p.children.length) {
         renderList(p.children, container, level + 1);
      }
   });
}

function findPageById(list, id) {
   for (const p of list) {
      if (p.id === id) return p;
      if (p.children) {
         const found = findPageById(p.children, id);
         if (found) return found;
      }
   }
   return null;
}

function findTopParent(list, id) {
   for (const p of list) {
      if (p.id === id) return p;
      if (p.children) {
         const found = findTopParent(p.children, id);
         if (found) return p;
      }
   }
   return null;
}

/** 페이지 불러오기 */
async function loadPage(id) {
   const meta = findPageById(pages, id);
   if (!meta) return;
   activeId = id;
   /** 검색 중 */
   const listToRender = currentSearch ? searchPages(pages, currentSearch) : pages;
   renderList(listToRender);

   const topParent = findTopParent(pages, id) || meta;
   document.getElementById('crumb').textContent = topParent.title;

   if (meta.content) {
      if (meta.content.trim() === '') return;
      renderMd(meta.content);
      return;
   }

   try {
      const r = await fetch(`${DOCS_ROOT}/` + meta.path, { cache: 'no-store' });
      if (!r.ok) throw new Error('md not found');
      const txt = await r.text();

      if (txt.trim() === '') return;

      meta.content = txt;
      renderMd(txt);
   } catch (e) {
      document.getElementById('article').innerHTML = '<h2>문서를 불러올 수 없습니다</h2><p>' + e.message + '</p>';
   }
}
/** 검색어 강조 */
function highlightSearch(element, search) {
   if (!search) return;

   const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

   const walk = node => {
      if (node.nodeType === Node.TEXT_NODE) {
         const match = node.textContent.match(regex);
         if (match) {
            const span = document.createElement('span');
            span.innerHTML = node.textContent.replace(regex, m => `<mark>${m}</mark>`);
            node.replaceWith(span);
         }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT') {
         node.childNodes.forEach(walk);
      }
   };

   walk(element);
}
/** 페이지 렌더링 */
function renderMd(md) {
   const container = document.getElementById('article');
   container.innerHTML = mdToHtml(md);

   // 코드 하이라이트
   container.querySelectorAll('pre code:not(.mcfunction)').forEach(block => {
      hljs.highlightElement(block);
   });

   // Mermaid 렌더링
   if (window.mermaid) {
      try {
         mermaid.init(undefined, container.querySelectorAll('.mermaid'));
      } catch (e) {
         console.error("Mermaid 렌더링 오류:", e);
      }
   }

   // 검색어 강조
   highlightSearch(container, currentSearch);

   container.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
         a.addEventListener('click', e => {
            e.preventDefault();
            let id = href;
            if (id.startsWith(`/${DOCS_ROOT}/`)) {
               id = id.slice((`/${DOCS_ROOT}/`).length);
            }
            id = id.replace(/\.md$/, '').replace(/\//g, '-');
            loadPage(id);
         });
      }
   });
}

/** 페이지 실제 검색 */
async function preloadContents(list) {
   for (const p of list) {
      if (!p.content) {
         try {
            const r = await fetch(`${DOCS_ROOT}/${p.path}`, { cache: 'no-store' });
            p.content = r.ok ? await r.text() : '';
         } catch {
            p.content = '';
         }
      }
      if (p.children) {
         await preloadContents(p.children);
      }
   }
}
function searchPages(list, q) {
   const result = [];

   for (const p of list) {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContent = p.content ? p.content.toLowerCase().includes(q) : false;

      if (matchTitle || matchContent) {
         result.push({
            ...p,
            children: p.children ? searchPages(p.children, q) : []
         });
      } else if (p.children) {
         const filteredChildren = searchPages(p.children, q);
         if (filteredChildren.length) {
            result.push(...filteredChildren);
         }
      }
   }

   return result;
}
/** 실제 페이지 검색 */
document.getElementById('q').addEventListener('input', async e => {
   currentSearch = e.target.value.trim().toLowerCase();
   if (!currentSearch) {
      renderList(pages);
      if (pages[0]?.content) renderMd(pages[0].content);
      return;
   }

   await preloadContents(pages);
   const filtered = searchPages(pages, currentSearch);
   renderList(filtered);

   const activePage = findPageById(pages, activeId);
   if (activePage?.content) renderMd(activePage.content);
});

document.addEventListener('keydown', (e) => {
   const tag = e.target.tagName.toLowerCase();
   if (tag === 'input' || tag === 'textarea') return;

   /** 슬래시 키로 검색 */
   if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const searchInput = document.getElementById('q');
      if (searchInput) searchInput.focus();
   }
});


const advancedBtn = document.getElementById('advancedBtn');
if (advancedBtn) {
   advancedBtn.addEventListener('click', () => {
      window.location.href = 'advanced.html';
   });
}

const defaultBtn = document.getElementById('defaultBtn');
if (defaultBtn) {
   defaultBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
   });
}

/** 메뉴 버튼 */
document.querySelector('.menu-toggle').addEventListener('click', () => {
   document.querySelector('.sidebar').classList.toggle('open');
});

/** 홈 버튼 */
document.getElementById('homeBtn').addEventListener('click', () => { if (pages[0]) loadPage(pages[0].id); });

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

/** 시작 */
loadIndex();