# NoSQL 資料庫核心理論與四大類型整理

## 一、NoSQL 核心理論基礎：CAP 定理與 BASE 模型

### (一) CAP 定理 (CAP Theorem)
分散式系統無法同時滿足下列三者，最多取其二，其中 **P（分區容錯）通常為必選**：
1. **Consistency (一致性)**：所有節點在同一時間看到相同資料。
2. **Availability (可用性)**：每個請求都能得到回應。
3. **Partition tolerance (分區容錯)**：網路分區（節點間斷線）時系統仍可運作。

**依據取捨分類：**
* **CP 架構（重一致性）**：如 <span style="color:red;">MongoDB</span>、<span style="color:red;">HBase</span>。
* **AP 架構（重可用性）**：如 <span style="color:red;">Cassandra</span>、<span style="color:red;">DynamoDB</span>。
* **CA 架構（不容忍分區）**：僅單機／關聯式資料庫適用。

### (二) BASE 模型
NoSQL 系統多採 **BASE**：
1. **Basically Available (基本可用)**：系統保證可用性。
2. **Soft state (軟狀態)**：狀態允許隨時間變化（即使無新輸入）。
3. **Eventually consistent (最終一致)**：在無新更新下，系統最終會達到一致。

---

## 二、NoSQL 四大資料庫類型與應用場景

### (一) 鍵值型資料庫 (Key-Value Store)
**1. 核心特性**
1. 由一個唯一的鍵 (Key) 與其對應的值 (Value) 所組成。
2. Value 可以是簡單的字串、數字，或複雜的物件。
3. 不支援複雜的關聯查詢（Joins），但由於資料大多常駐於記憶體中，且透過雜湊演算法定位，具備極高的讀寫吞吐量與 $O(1)$ 的存取效能。

**2. 典型應用場景**
1. 使用者登入狀態 (Session) 管理與快取 (Cache)。
2. 電子商務網站的購物車暫存資料。
3. 即時計數器與排行榜系統。
4. 常見代表軟體包含 <span style="color:red;">Redis</span> 與 <span style="color:red;">Amazon DynamoDB</span>。

### (二) 文件型資料庫 (Document Store)
**1. 核心特性**
1. 文件型資料庫以類 JSON 或 BSON 的格式來儲存半結構化資料。
2. 具備高度的彈性與無綱要 (Schema-less) 特性。同一集合 (Collection) 中的不同文件可以擁有完全不同的欄位，並支援階層式與巢狀結構，免去傳統關聯式資料庫頻繁進行 `JOIN` 的效能消耗。

**2. 典型應用場景**
1. 內容管理系統 (CMS) 與部落格文章管理。
2. 使用者個人檔案 (Profile) 資料儲存。
3. 電子商務的商品目錄，便於儲存規格多變的商品屬性。
4. 常見代表軟體包含 <span style="color:red;">MongoDB</span> 與 <span style="color:red;">CouchDB</span>。

### (三) 寬列型 / 欄號型資料庫 (Column-Family Store)
**1. 核心特性**
1. 寬列型資料庫專為分散式、海量大數據儲存設計。
2. 資料以行鍵與欄位族組成，每一行可以動態擴充不同的欄位。
3. 擅長進行水平擴展，能夠以高寫入吞吐量處理大量的時間序列或日誌數據。

**2. 典型應用場景**
1. 物聯網 (IoT) 感測器產生的海量時序數據 (Time-series data)。
2. 大型系統的即時運作日誌 (Log Analysis) 記錄與追蹤。
3. 網站即時點擊流 (Clickstream) 分析。
4. 常見代表軟體包含 <span style="color:red;">Apache Cassandra</span> 與 <span style="color:red;">HBase</span>。

### (四) 圖形型資料庫 (Graph Database)
**1. 核心特性**
1. 圖形型資料庫由節點 (Nodes)、邊 (Edges/關聯) 與屬性 (Properties) 組成。
2. 專門處理複雜、多對多且高密度的網狀關聯資料。透過指標直接指向相鄰節點，避免了傳統關聯式資料庫在面對多層關聯查詢時所需的昂貴 `JOIN` 運算。

**2. 典型應用場景**
1. 社群網路平台的好友推薦、追蹤與社交圖譜分析。
2. 電子商務的商品關聯推薦引擎。
3. 詐欺偵測（分析複雜的金流與人際網絡異常）。
4. 權限控管與組織架構網路。
5. 常見代表軟體包含 <span style="color:red;">Neo4j</span> 與 <span style="color:red;">Amazon Neptune</span>。