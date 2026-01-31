# Linkage

ツールを多くの人に届けるための、GitHub Pages向けの静的ツール配布ハブです。
検索・タグ絞り込み・詳細表示・共有リンクに対応しています。

## 使い方（公開者向け）

1. `/data/tools.json` を編集してツール情報を追加します。
2. GitHubリポジトリに `/index.html` と `/assets` と `/data` を配置します。
3. GitHub Pages を有効化して公開します。

### データ形式（tools.json）

`/data/tools.json` の最小構成は以下です。

```json
{
  "tools": [
    {
      "id": "t01",
      "slug": "example-tool",
      "name_ja": "ツール名",
      "name_en": "Tool Name",
      "description_ja": "日本語の説明",
      "description_en": "English description",
      "tags": ["タグ1", "タグ2"],
      "url": "https://example.com",
      "updated": "2026-01-31"
    }
  ]
}
```

- `slug` は共有URL（`?tool=slug`）で使います。
- `updated` は詳細欄に表示されます。

### 共有URL

例: `https://<username>.github.io/<repo>/?tool=example-tool`

このURLを開くと、該当ツールの詳細が最初から表示されます。

---

# Linkage

A static tool distribution hub for GitHub Pages. It supports search, tag filters, detail views, and shareable links.

## Usage (for maintainers)

1. Edit `/data/tools.json` to add tools.
2. Put `/index.html`, `/assets`, and `/data` in your GitHub repository.
3. Enable GitHub Pages and publish.

### Data format (tools.json)

Minimum structure for `/data/tools.json`:

```json
{
  "tools": [
    {
      "id": "t01",
      "slug": "example-tool",
      "name_ja": "Tool Name (JP)",
      "name_en": "Tool Name",
      "description_ja": "Japanese description",
      "description_en": "English description",
      "tags": ["tag1", "tag2"],
      "url": "https://example.com",
      "updated": "2026-01-31"
    }
  ]
}
```

- `slug` is used for share URLs (`?tool=slug`).
- `updated` is shown in the detail panel.

### Share URL

Example: `https://<username>.github.io/<repo>/?tool=example-tool`

Opening this URL shows the selected tool detail immediately.
