(() => {
  const state = {
    tools: [],
    lang: 'ja',
    search: '',
    activeTags: new Set(),
    selectedSlug: null
  };

  const el = {
    search: document.getElementById('search'),
    tagContainer: document.getElementById('tag-container'),
    toolList: document.getElementById('tool-list'),
    toolDetail: document.getElementById('tool-detail'),
    langToggle: document.getElementById('lang-toggle')
  };

  const text = (tool, key) => {
    const suffix = state.lang === 'ja' ? 'ja' : 'en';
    return tool[`${key}_${suffix}`] || '';
  };

  const getAllTags = () => {
    const tags = new Set();
    state.tools.forEach((tool) => {
      (tool.tags || []).forEach((t) => tags.add(t));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'ja'));
  };

  const matchesSearch = (tool) => {
    if (!state.search) return true;
    const q = state.search.toLowerCase();
    const fields = [text(tool, 'name'), text(tool, 'description')].join(' ').toLowerCase();
    const tags = (tool.tags || []).join(' ').toLowerCase();
    return fields.includes(q) || tags.includes(q);
  };

  const matchesTags = (tool) => {
    if (state.activeTags.size === 0) return true;
    const tags = new Set(tool.tags || []);
    for (const t of state.activeTags) {
      if (!tags.has(t)) return false;
    }
    return true;
  };

  const filteredTools = () => state.tools.filter((t) => matchesSearch(t) && matchesTags(t));

  const setSelected = (slug) => {
    state.selectedSlug = slug;
    const url = new URL(window.location.href);
    if (slug) {
      url.searchParams.set('tool', slug);
    } else {
      url.searchParams.delete('tool');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const getSelectedTool = () => state.tools.find((t) => t.slug === state.selectedSlug) || null;

  const renderTags = () => {
    const tags = getAllTags();
    el.tagContainer.innerHTML = '';
    if (tags.length === 0) return;

    tags.forEach((tag) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag' + (state.activeTags.has(tag) ? ' active' : '');
      btn.textContent = tag;
      btn.addEventListener('click', () => {
        if (state.activeTags.has(tag)) {
          state.activeTags.delete(tag);
        } else {
          state.activeTags.add(tag);
        }
        renderTags();
        renderList();
      });
      el.tagContainer.appendChild(btn);
    });
  };

  const renderList = () => {
    const tools = filteredTools();
    el.toolList.innerHTML = '';

    if (tools.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = state.lang === 'ja' ? '該当するツールがありません。' : 'No tools found.';
      el.toolList.appendChild(empty);
      return;
    }

    tools.forEach((tool) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.addEventListener('click', () => {
        setSelected(tool.slug);
        renderDetail();
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          setSelected(tool.slug);
          renderDetail();
        }
      });

      const title = document.createElement('h3');
      title.textContent = text(tool, 'name');

      const desc = document.createElement('p');
      desc.textContent = text(tool, 'description');

      const tags = document.createElement('div');
      tags.className = 'tag-list';
      (tool.tags || []).forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'tag-chip';
        span.textContent = tag;
        tags.appendChild(span);
      });

      const cta = document.createElement('a');
      cta.href = tool.url;
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      cta.className = 'cta';
      cta.textContent = state.lang === 'ja' ? '配布先へ' : 'Open';
      cta.addEventListener('click', (e) => e.stopPropagation());

      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(tags);
      card.appendChild(cta);
      el.toolList.appendChild(card);
    });
  };

  const renderDetail = () => {
    const tool = getSelectedTool();
    el.toolDetail.innerHTML = '';

    if (!state.selectedSlug) {
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder';
      placeholder.textContent = state.lang === 'ja' ? 'ツールを選択すると詳細が表示されます。' : 'Select a tool to see details.';
      el.toolDetail.appendChild(placeholder);
      return;
    }

    if (!tool) {
      const notFound = document.createElement('div');
      notFound.className = 'placeholder';
      notFound.textContent = state.lang === 'ja' ? 'ツールが見つかりません。' : 'Tool not found.';
      el.toolDetail.appendChild(notFound);
      return;
    }

    const title = document.createElement('h2');
    title.textContent = text(tool, 'name');

    const desc = document.createElement('p');
    desc.textContent = text(tool, 'description');

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = (state.lang === 'ja' ? '更新日: ' : 'Updated: ') + tool.updated;

    const tagWrap = document.createElement('div');
    tagWrap.className = 'tag-list';
    (tool.tags || []).forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'tag-chip';
      span.textContent = tag;
      tagWrap.appendChild(span);
    });

    const open = document.createElement('a');
    open.href = tool.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.className = 'cta primary';
    open.textContent = state.lang === 'ja' ? '配布先へ' : 'Open';

    const share = document.createElement('div');
    share.className = 'share';

    const shareUrl = `${window.location.origin}${window.location.pathname}?tool=${encodeURIComponent(tool.slug)}`;

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.id = 'copy-link';
    copyBtn.textContent = state.lang === 'ja' ? 'リンクをコピー' : 'Copy link';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copyBtn.textContent = state.lang === 'ja' ? 'コピーしました' : 'Copied';
        setTimeout(() => {
          copyBtn.textContent = state.lang === 'ja' ? 'リンクをコピー' : 'Copy link';
        }, 1500);
      } catch (err) {
        window.prompt(state.lang === 'ja' ? 'このリンクをコピーしてください:' : 'Copy this link:', shareUrl);
      }
    });

    const twitter = document.createElement('a');
    const tweetText = encodeURIComponent(text(tool, 'name'));
    twitter.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
    twitter.target = '_blank';
    twitter.rel = 'noopener noreferrer';
    twitter.className = 'share-link';
    twitter.textContent = 'X';

    const facebook = document.createElement('a');
    facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    facebook.target = '_blank';
    facebook.rel = 'noopener noreferrer';
    facebook.className = 'share-link';
    facebook.textContent = 'Facebook';

    share.appendChild(copyBtn);
    share.appendChild(twitter);
    share.appendChild(facebook);

    el.toolDetail.appendChild(title);
    el.toolDetail.appendChild(desc);
    el.toolDetail.appendChild(meta);
    el.toolDetail.appendChild(tagWrap);
    el.toolDetail.appendChild(open);
    el.toolDetail.appendChild(share);
  };

  const setLanguage = (lang) => {
    state.lang = lang;
    el.langToggle.value = lang;
    document.documentElement.lang = lang;
    el.search.placeholder = lang === 'ja' ? 'ツールを検索' : 'Search tools';
    renderTags();
    renderList();
    renderDetail();
  };

  const init = async () => {
    const url = new URL(window.location.href);
    const toolSlug = url.searchParams.get('tool');
    state.selectedSlug = toolSlug;

    const res = await fetch('./data/tools.json');
    const data = await res.json();
    state.tools = data.tools || [];

    setLanguage(state.lang);
  };

  el.search.addEventListener('input', (e) => {
    state.search = e.target.value.trim();
    renderList();
  });

  el.langToggle.addEventListener('change', (e) => setLanguage(e.target.value));

  init().catch((err) => {
    el.toolList.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'empty';
    error.textContent = 'Failed to load data.';
    el.toolList.appendChild(error);
    console.error(err);
  });
})();
