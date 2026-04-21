# LAPLACE
> Strategic Revenue Management OS for Tourism.

![Project Status](https://img.shields.io/badge/status-active-lightgrey?style=flat-square) ![Stack](https://img.shields.io/badge/stack-python%20%7C%20next.js-lightgrey?style=flat-square)  ![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

観光・宿泊施設の市場データを収集・分析し、**戦略的な意思決定（レベニューマネジメント）**を支援するためのデータ基盤および可視化アプリケーション。

---

## ── CONCEPT : S-R-M MODEL

単なる価格比較を超え、ホテルの「体質」と「意志」を多角的に定量化します。

- **Structural (S)** : 地力。クチコミ・立地・ブランドに依存する基礎体力。
- **Responsiveness (R)** : 反応速度。市場変動に対する価格調整の緻密さとスピード。
- **Market Fit (M)** : 市場適合度。競合比較における「お得感」または「強気度」。
- **Strategy** : 戦略性。価格の安定性と一貫性。

---

## ── ARCHITECTURE

#### 01 / BATCH (Python)
- OTAデータのクローリングと正規化
- 統計的特徴量およびシグナルの抽出
- S-R-MスコアリングとK-Meansクラスタリング

#### 02 / WEB (Next.js)
- 統合データアクセスレイヤー (API)
- Fluxアーキテクチャによる分析ステートの同期
- 多次元可視化インテリジェンス

---

## ── STRUCTURE

```text
laplace/
├── batch/       # Data Pipeline
│   ├── collectors/    # Fetching engine
│   ├── jobs/          # Orchestration
│   ├── services/      # Logic (Scoring / Clustering)
│   ├── repositories/  # Query layer
│   └── writers/       # Persistence layer
│
├── web/         # Interface
│   ├── app/           # App Router
│   ├── state/         # Lightweight Flux
│   └── components/    # Visualization units
│
└── infra/       # Deployment (Cloud Run / Scheduler)
```

---

## ── DATA FLOW

#### PIPELINE
1. **FETCH** : 生データの収集
2. **SIGNAL** : 市場平均との乖離および前日差分から予兆を検出
3. **POSITION** : エリア統計に基づく $S, R, M$ スコアの確定
4. **CLUSTER** : 戦略的 Tier への動的分類
5. **LOG** : `hotel_strategic_logs` への永続化と変位追跡

#### INTERFACE
- **HOOKS** → **DISPATCH** → **REDUCER** → **VIEW**
- リアクティブな状態管理により、複雑な多次元フィルタリングをシームレスに実現。

---

## ── KEY LOGICS

- **Strategic Clustering**
  地力 (S) を主軸に、運用 (R) と市場適合度 (M) を加味して 4 つのクラスターを特定。「競合が地力を維持したまま、お得感 (M) を増やして攻めてきた」といった戦略的変位を数学的に検知。

- **Pickup Analysis**
  7 日前の価格との差分（$pickup = \frac{p_{latest} - p_{prev}}{p_{prev}}$）により、市場の熱量と競合の強気・弱気サインを抽出。

---

## ── ROADMAP

- [ ] **Moving Average** : スコアの平滑化によるノイズ除去
- [ ] **Shift Alert** : 戦略 Tier 変位の自動検知と要因分析
- [ ] **Matrix UI** : S軸 × M軸 による市場ポジショニングマップ
- [ ] **LLM Insight** : 数値変動から競合の「意志」を言語化

---

## ── PHILOSOPHY

**"Logics are reproducible. Data is granular. Insights reveal the will."**