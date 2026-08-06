## 一、 交易 (Transaction) 與 ACID 核心
*   **定義**：不可分割的工作單位，核心精神為「全部成功」或「全部失敗」。
*   **生命週期**：UPDATE(記憶體) ➔ COMMIT ➔ 寫 Log (交易結束) ➔ 寫硬碟。
*   **ACID 四大特性** (公式：**A + I + D = C**)：
    *   **A (原子性)**：全做或全不做 (失敗靠 `ROLLBACK` 復原)。
    *   **C (一致性)**：維持合法狀態 (系統終極目標)。
    *   **I (隔離性)**：互不干擾，排隊執行 (靠 Lock/MVCC 達成，最難維護)。
    *   **D (持久性)**：COMMIT 後永久保存 (靠 Transaction Log 達成)。

---

## 二、 讀取異常 與 隔離等級 (Isolation Levels)
### 三大讀取異常 (難以預防度：髒讀 < 不可重複讀 < 幻讀)
1.  **髒讀 (Dirty Read)**：讀到別人「未提交」的資料。
2.  **不可重複讀**：別人「修改/刪除」並提交，導致同筆資料兩次讀取值不同。
3.  **幻讀 (Phantom Read)**：別人「新增/刪除」，導致兩次範圍查詢筆數不同。

### 四大隔離等級 (針對 SELECT 行為)
*   **Read Uncommitted (讀未提交)**：無防禦力。
*   **Read Committed (讀已提交)**：防髒讀。
*   **Repeatable Read (可重複讀)**：**MySQL 預設**。防不可重複讀。
*   **Serializable (序列化)**：強制循序排隊。效能極差，防所有異常 (含幻讀)。

---

## 三、 併發控制機制 (隔離性實作)
### MVCC (多版本併發控制)
*   **核心**：空間換時間。保留歷史快照，**讀寫不互斥**。
*   **MVCC 在 RR 與 RC 的決定性差異**
    *   **RC 等級**：每次 SELECT 產**新快照**。
    *   **RR 等級**：第一次 SELECT 產快照，後續**沿用舊快照** (達成可重複讀)。

### 鎖(悲觀鎖+2PL)
*   **悲觀鎖**：假設必衝突，排隊換正確。先上鎖 (如 `FOR UPDATE`)。

### 樂觀鎖
*   **樂觀鎖**：不是鎖，事後檢查。假設少衝突，UPDATE 時才核對版本。


---

## 四、 鎖定機制與 Gap Lock (悲觀鎖細節)
*   **S-Lock (共享鎖)**：唯讀不寫 / **X-Lock (排他鎖)**：獨佔讀寫。
*   **自動加鎖**：SELECT 預設無鎖；UPDATE/DELETE 自動加鎖。
*   **死結陷阱**：同交易內先 `FOR SHARE` 後 `UPDATE` 極易死結，應直接 `FOR UPDATE`。

### Gap Lock (間隙鎖) 與 Next-Key Lock 觸發條件 (RR 等級下)
*   **定義**：MySQL(InnoDB) 預設用 Next-Key Lock (行鎖 + 間隙鎖) 防幻讀。
*   **必觸發 Gap Lock**：範圍查詢、查無資料、**非唯一索引精準命中**。
*   **無 Gap Lock**：RC 等級，或 RR 等級下「唯一索引精準命中」。

---

## 五、 二階段鎖定協定 (2PL)
*   **目標**：保證衝突可序列化。
*   **標準 2PL (絕不交錯)**：
    *   **擴張階段**：只能**申請**鎖，絕不可釋放。
    *   **收縮階段**：只能**釋放**鎖，絕不可申請 (釋放第一把鎖即進入此階段)。
*   **標準 2PL 缺點**：無法避免死結、**連鎖復原 (Cascading Rollback)**。

### 嚴格 2PL (Strict 2PL) - 實務採用
*   **機制**：所有 X-Lock 必須撐到 **COMMIT / ROLLBACK 的那一刻** 才能釋放。
*   **優缺點**：解決連鎖復原問題，但併發度大幅下降，死結機率更高。

---

## 六、 實戰程式碼考點

### 1. TCL 交易指令
```sql
START TRANSACTION;
SAVEPOINT p1;          -- 設存檔點
ROLLBACK TO p1;        -- 部分還原
COMMIT;                -- 永久寫入
```

### 2. 樂觀鎖更新防護 (防線在 WHERE)
```sql
UPDATE accounts SET balance = balance - 500, version = version + 1 
WHERE id = 1 AND version = 1; -- 必須與取出的版本相符
```

### 3. 變數作用域陷阱
*   `@a`：**連線變數** (Session)，隨處可用。
*   `DECLARE a`：**區域變數** (Local)，僅限 Stored Procedure/Function 的 BEGIN...END 內。