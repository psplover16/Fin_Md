# 建表：

### 語法命名規則
1. 全部大寫 (UPPERCASE)：專留給「SQL 保留字與函數」
2. 全部小寫 ＋ 底線 (snake_case)：專留給「自訂的表名與欄位」
3. 嚴格區分大小寫：專留給「引號內的字串值」


### 關於 CHAR 與 VARCHAR
1. 資料短，`CHAR` 省空間；資料長，`VARCHAR` 省空間。
2. 更新資料，`CHAR` 原地更新，速度極快；`VARCHAR` 則可能會將整筆資料搬到合適的儲存位置，需要動整筆資料。
3. 運算速度，`CHAR` 有規律，查詢極快。

---

### 4. 型別

| 型別 | 說明 | 備註 |
| :--- | :--- | :--- |
| **INT** | 整數 | 如年齡、數量 |
| **DECIMAL(p,s)** | 精確小數 | `p` ＝ 總位數、`s` ＝ 小數位數。 |
| **CHAR(n)** | 定長文字 | 固定佔 `n` 格，不足補空白 |
| **VARCHAR(n)** | 變長文字 | 最多 `n` 個字元，存多長就佔多長 |
| **DATE / DATETIME** | 日期 / 日期＋時間 | 格式：`YYYY-MM-DD` / `YYYY-MM-DD HH:MM:SS`<br>大小：3bytes / 8bytes<br><br>• 把時間塞進 `DATE`，會自動把時間截掉<br>• 把純日期塞進 `DATETIME`，會自動把時間補零<br>• 實務常用 `DEFAULT CURRENT_TIMESTAMP` 讓預設時間為當下時間 |

* NULL，代表不存在；尚未填寫，代表"未知"
---

### 5. 約束

* **PRIMARY KEY (主鍵)**
  1. 每列的唯一身分，不可重複(`UNIQUE`)、不可空(`NOT NULL`)
  2. 範例：`id CHAR(8) PRIMARY KEY`
* **FOREIGN KEY (外來鍵)**
  1. 指向另一張表的主鍵，確保關聯有效
  2. 範例：`FOREIGN KEY (sid) REFERENCES student(id)`
  3. 通常會搭配 `ON DELETE` 用，詳細請看範例的說明。
* **NOT NULL (非空)**
  1. 此欄一定要有值，不能留白	
  2. 範例：`name VARCHAR(20) NOT NULL`
* **UNIQUE (唯一)**
  1. 此欄不可重複（但可留空(`null`，可以有多個 `null`)）	
  2. 範例：`email VARCHAR(50) UNIQUE`
* **CHECK (檢查)**
  1. 值必須滿足自訂條件	
  2. 範例：`CHECK (score BETWEEN 0 AND 100)`
* **DEFAULT (預設)**
  1. 沒給值時自動填入預設值
  2. 範例：`status VARCHAR(10) DEFAULT '在學'`

---

### 6. 特殊

1. **AUTO_INCREMENT**：
  1. 1個表只能有1個 `AUTO_INCREMENT`
  2. 只支援整數
  3. `ALTER`可以指定計數器，但設定的值只能比現在表裡最大的數字還要大。小於會無視。
  4. 就算是 `AUTO_INCREMENT` 的欄位，使用者也可以手動指定。
2. 在 `WHERE`、`WHEN` 可以添加 `()` 方便閱讀

---

### 7. 範例
一律先欄位名稱，再來型別，之後得順序無所謂

```sql
CREATE TABLE student_profile (
  -- AUTO_INCREMENT，表示自動新增，在建表時指定欄位讓他自動新增
  id INT AUTO_INCREMENT PRIMARY KEY,                        
  student_id  CHAR(8)      NOT NULL UNIQUE,                      
  name        VARCHAR(20)  NOT NULL,                             
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,

  -- 複合主鍵 (Composite PK): 
  -- 當主鍵由兩個欄位組成時，絕對不能寫在欄位旁邊，必須寫在最後面！
  PRIMARY KEY (student_id, created_at),

  -- 【DEFAULT (預設值約束)】: 如果新增資料時沒有特別填寫這個欄位，系統會自動幫它填入 'F'。
  -- 【CHECK (檢查約束)】: 限定這個欄位能被輸入的值。這裡限制只能輸入 'M' 或 'F'，輸入其他字元會被資料庫拒絕。
  -- 檢查約束 放的 其實就是 WHERE的語法
  gender      CHAR(1)      DEFAULT 'F' CHECK (gender IN ('M', 'F')),
  score       DECIMAL(5,2) DEFAULT 0 CHECK (score BETWEEN 0 AND 100),

  -- 【FOREIGN KEY (外來鍵約束)】: 建立兩張表格之間的關聯。
  --  本表的 `student_id` 欄位，其值必須存在於另一張父表 `student` 的 `id` 欄位中，確保「沒有憑空捏造學生」。
  -- 【ON DELETE 行為設定】: 決定當父表 (student) 中的某一筆學生資料被刪除時，這張子表 (student_profile) 該如何應對：
  --   1. CASCADE：連動刪除（父表資料刪除了，這張表裡的對應資料也自動跟著一起刪除）。
  --   2. SET NULL：設為空值（父表資料刪除了，這張表裡的 student_id 會變成 NULL，但前提是該欄位沒有 NOT NULL 約束）。
  --   3. RESTRICT：限制刪除（只要這張子表裡還有該學生的資料，資料庫就會「禁止」你刪除父表的那筆學生資料，這也是預設行為）。
  FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);
```

---
### 8.索引

```sql
-- 針對 Member 的email欄位，創建 名稱為 idx_member_email 的索引
CREATE INDEX idx_member_email ON Member (Email); 
-- 針對 Member 的email欄位，該欄位的資料值不可以重複，創建 名稱為 idx_member_email 的索引
CREATE UNIQUE INDEX idx_member_email ON Member (Email);
-- 最左前綴法則：只要你的搜尋條件有包含「最左邊」的那個欄位，就會加速
-- 先用 LastName 進行絕對排序，當遇到 LastName 相同的資料時，再用 FirstName 進行內部排序（小分類）
CREATE INDEX idx_fullname ON Member (LastName, FirstName);
```

* 二元搜尋法，O(logN)
* 原則上，在 Table 創建之後才能添加索引。
* 但在 CREATE TABLE 裡設定 PRIMARY KEY（主鍵）或 UNIQUE（唯一限制）時，資料庫引擎會「自動」在建表時，連索引一同建立。

