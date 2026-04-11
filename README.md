# Laplace

観光・宿泊施設の価格データを収集・分析し、意思決定を支援するためのデータ基盤および可視化アプリケーション。

---

## Architecture

[Batch]
- データ収集（Rakuten等）
- 特徴量生成（market / hotel）
- pickup計算（7日差分）
- DB保存

[Web]
- API（Next.js）
- 状態管理（custom reducer）
- 可視化（Chart / Heatmap / Table）

---

## Project Structure

laplace/
├── batch/      # データ収集・加工
├── web/        # フロントエンド + API
├── infra/      # インフラ定義（Cloud Run / Scheduler）
├── .env.example
├── test.py
└── report.txt

---

## batch/

batch/
├── collectors/       # 外部API取得
│   ├── base.py
│   ├── limiter.py
│   └── rakuten.py
│
├── jobs/             # バッチ処理フロー
│   ├── main.py
│   ├── fetch_prices.py
│   ├── build_features.py
│   └── calc_pickups.py
│
├── services/         # ビジネスロジック
│   ├── fetch_rakuten.py
│   └── build_features.py
│
├── repositories/     # DB読み取り
│   ├── hotel_repo.py
│   └── price_repo.py
│
├── writers/          # DB書き込み
│   └── db_writer.py
│
├── lib/
│   └── db.py
│
├── utils/
│   ├── config.py
│   ├── date.py
│   ├── parse_args.py
│   └── transform.py
│
├── Dockerfile
├── cloudbuild.yaml
└── requirements.txt

---

## web/

web/
├── app/              # Next.js App Router
│   ├── api/
│   │   ├── history/
│   │   ├── hotels/
│   │   └── rakuten/  # OTA別
│   │       ├── features/
│   │       ├── prices/
│   │       └── reviews/
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── common/       # 装飾
│   ├── layout/       # ヘッダー / サイドバー / メニュー
│   ├── price/        # 価格チャート
│   ├── rate/         # ヒートマップ / レートテーブル
│   ├── review/       # レビューテーブル
│   ├── soldout/      # 売り止めテーブル
│   └── views/        # Layer構造
│
├── hooks/            # データ取得
│   ├── usePrices.ts
│   ├── useReviews.ts
│   ├── useRateMatrix.ts
│   └── useHotels.ts
│
├── state/            # 状態管理（custom reducer）
│   ├── initial.ts
│   ├── reducer.ts
│   ├── sync.ts
│   └── types.ts
│
├── data/
├── utils/
├── styles/
├── constants/
└── lib/

---

## Data Flow

[Batch]
Rakuten API
  ↓
prices
  ↓
features
  ↓
pickups（7日差分）

[Web]
API → hooks → state → components

---

## Key Concepts

pickup = (price_latest - price_prev) / price_prev

- 7日前の価格との差分
- 異常検知・需要分析に使用

---

## State Management

hooks → dispatch → reducer → UI

- useReducerベースの軽量Flux構成
- UIとロジックを分離

---

## Setup

### batch

pip install -r requirements.txt
python jobs/main.py

### web

npm install
npm run dev

---

## Future

- pickup分布の可視化（scatter）
- reason分類（demand / not_sell / sp_demand）
- チャネル横断分析
- MLによる異常検知

---

## Philosophy

ロジックは再現可能に、データは蓄積する