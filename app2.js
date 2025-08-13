const PAGES_JSON = 'docs2/pages.json';

const renderer = new marked.Renderer();

renderer.link = ({ href, title, text }) => {
   try {
      const domain = new URL(href).origin;
      const faviconUrl = domain + '/favicon.ico';
      return `<a class="link-with-icon" href="${href}" target="_blank" title="${title || href}">
         <img src="${faviconUrl}" alt="icon"
            onerror="this.onerror=null;this.src='assets/img/default_icon.png';" />
         ${text}
      </a>`;
   } catch {
      return `<a class="link-with-icon" href="${href}" target="_blank" title="${title || href}">${text}</a>`;
   }
};

renderer.code = (token) => {
   const codeText = token.text || '';
   const lang = token.lang || (token.langInfo ? token.langInfo.split(' ')[0] : '');

   if ((lang || '').toLowerCase() === 'mcfunction') {
      const lines = codeText.split('\n').map(line => mclangHighlight(line));
      const highlighted = lines.join('\n');
      return `<pre><code class="mcfunction">${highlighted}</code></pre>`;
   }

   const escaped = codeText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

   const cls = lang ? `language-${lang}` : '';
   return `<pre><code class="${cls}">${escaped}</code></pre>`;
};

function mdToHtml(md) {
   return marked.parse(md, {
      renderer,
      gfm: true,
      breaks: true,
   });
}

/* 페이지 목록 관리 */
let pages = []; // {id,title,path,content}
let activeId = null;

/* 목록 불러오기 */
async function loadIndex() {
   try {
      const res = await fetch(PAGES_JSON, { cache: 'no-store' });
      if (!res.ok) throw new Error('pages.json not found');
      const list = await res.json();
      pages = list.map(x => ({ ...x, content: null }));

      renderList(pages);

      if (pages.length) loadPage(pages[0].id);
   } catch (e) {
      document.getElementById('article').innerHTML = `
         <h1>설정 안내</h1>
         <p>docs2/pages.json 파일을 만들어 페이지 목록을 추가하세요.</p>
         <pre>[
            {&quot;id&quot;:&quot;welcome&quot;, &quot;title&quot;:&quot;환영합니다&quot;, &quot;path&quot;:&quot;welcome.md&quot;}
         ]</pre>
         <p>그리고 docs2/welcome.md 같은 파일을 추가하세요.</p>
      `;
   }
}

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
      d.style.marginLeft = level * 16 + 'px'; // 노드별 들여쓰기

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


async function loadPage(id) {
   const meta = findPageById(pages, id);
   if (!meta) return;
   activeId = id;
   renderList(pages);

   // 최상위 부모 노드 찾기
   const topParent = findTopParent(pages, id) || meta;

   document.getElementById('crumb').textContent = topParent.title;

   if (meta.content) {
      if (meta.content.trim() === '') return;
      renderMd(meta.content);
      return;
   }

   try {
      const r = await fetch('docs2/' + meta.path, { cache: 'no-store' });
      if (!r.ok) throw new Error('md not found');
      const txt = await r.text();

      if (txt.trim() === '') return;

      meta.content = txt;
      renderMd(txt);
   } catch (e) {
      document.getElementById('article').innerHTML = '<h2>문서를 불러올 수 없습니다</h2><p>' + e.message + '</p>';
   }
}

function renderMd(md) {
   document.getElementById('article').innerHTML = mdToHtml(md);

   document.querySelectorAll('pre code:not(.mcfunction)').forEach((block) => {
      hljs.highlightElement(block);
   });

   // 내부 링크 클릭 이벤트 처리
   document.getElementById('article').querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
         a.addEventListener('click', e => {
            e.preventDefault();

            let id = href;

            // 절대 경로 '/docs2/' 제거
            if (id.startsWith('/docs2/')) {
               id = id.slice('/docs2/'.length);
            }

            id = id.replace(/\.md$/, ''); // 확장자 제거
            id = id.replace(/\//g, '-');  // 슬래시를 하이픈으로 변환

            console.log(`[DEBUG] 내부 링크 클릭: href="${href}", 변환된 id="${id}"`);

            loadPage(id);
         });
      }
   });
}

// 검색
document.getElementById('q').addEventListener('input', async (e) => {
   const q = e.target.value.trim().toLowerCase();
   if (!q) { renderList(pages); return; }

   // 아직 로드되지 않은 문서는 미리 fetch 하지 않음
   const filtered = pages.filter(p => p.title.toLowerCase().includes(q));
   renderList(filtered);
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

// 메뉴 버튼
document.querySelector('.menu-toggle').addEventListener('click', () => {
   document.querySelector('.sidebar').classList.toggle('open');
});

// 홈 버튼
document.getElementById('homeBtn').addEventListener('click', () => { if (pages[0]) loadPage(pages[0].id); });

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

// 시작
loadIndex();