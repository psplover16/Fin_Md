# CRUD

### 1. CREATE：
`INSERT INTO 表的名稱 (欄位名稱A, 欄位名稱B) VALUES (值A, 值B);`

```sql
INSERT INTO orders (user_id, category, price, amount, status)
VALUES 
    (101, '3C', 1200, 1, 'Completed'),    -- 新增第一筆資料
    (102, 'Clothing', 500, 2, 'Pending'); -- 新增第二筆資料
```

💡 **註解說明**：
1. 欄位沒寫到 `id` (主鍵通常設為自動遞增 `AUTO_INCREMENT`)。
2. 欄位沒寫到 `created_at` (因為我們有設 `DEFAULT CURRENT_TIMESTAMP`，資料庫會自動補上)。

---

### 2. Read：
`SELECT 欄位名稱A, 欄位名稱B FROM 表名 WHERE 條件 ORDER BY 欄位;`
* `SELECT *` 表示所有欄位
* 沒加 `WHERE` 表示"沒有設定任何過濾條件"
* 以下程式順序不能改，但執行的順序並非程式的順序

```sql
SELECT
    user_id,                           -- 1. 顯示會員 ID
    COUNT(id) AS total_orders,         -- 2. 計算這個人買了幾張單，並取別名為 total_orders
    SUM(price * amount) AS total_spent, -- 3. 計算單價乘數量的總和，取別名為 total_spent
    -- 沒有加AS，欄位名稱是 AVG(price * amount)
    AVG(price * amount),  -- 算出「平均一筆訂單」的總花費是多少。    
    MAX(price * amount),  -- 找出今天「單筆消費金額最高」的那一單是多少錢（尋找傳說中的大戶！）。
    MIN(price * amount) -- 找出今天「單筆消費金額最低」的那一單是多少錢。

FROM orders                            -- 4-1. 從 orders 表格撈資料
JOIN users ON orders.user_id = users.id -- 4-2. 把 orders 跟 users 這兩張表併在一起，牽線的橋樑是orders裡的 user_id 要等於會員表裡的 id
WHERE category = '3C' AND status = 'Completed' -- 5. 【第一關篩選】：在分組前，先剔除不要F的資料

GROUP BY user_id, category                       -- 6. 【分組】：先用 user_id 分組，再根據user_id分出來的各組別內部依照 category分組
HAVING total_spent >= 1500 AND total_spent < 3000    -- 7. 【第二關篩選】：在分組計算後，只保留總花費大於 1500 且 小於3000 的群組
-- ASC = Ascending (升序 / 由小到大)，如果ORDER BY 不加，預設是ASC
-- DESC = Descending (降序(down) / 由大到小)
ORDER BY total_spent DESC, user_id ASC              -- 8. 【排序】：依照總花費由高到低 (DESC) 排序。後面那個欄位，只有在前面平手時才會上場
LIMIT 3;                               -- 9. 【限制筆數】：只取前 3 名
-- LIMIT 3, 4; -- (表示LIMIT 3 OFFSET 4，跳過前 4 筆資料，然後往後抓 3 筆(從1開啟，而非0))
```

---

### 3. UPDATE
`UPDATE 表名 SET 欄位 = 值 WHERE 條件;`

**直接賦值**：
```sql
UPDATE orders
SET 
    status = 'Canceled',               -- 修改第一個欄位，賦予新字串
    price = 0,                         -- 修改第二個欄位，賦予數字 0 (欄位之間用逗號 , 隔開)
    amount = amount - 1                -- 可以在 SET 裡面直接做數學運算 (將原本的數量減 1)
WHERE user_id = 102 AND status = 'Pending'; -- 若省略 WHERE，會修改「整張表所有列」
```

**條件賦值**：
```sql
UPDATE students 
SET 
    NAME = CASE 
        WHEN (ID BETWEEN 2 AND 6) AND (created_at < '2009-06-05 07:50:03') THEN 'AA' -- 添加()方便閱讀
        WHEN ID IN (7, 8, 9, 10, 11) THEN 'BB' -- 多重等於的意思，與(ID BETWEEN 7 AND 11)相同
        WHEN ID = 12 THEN 'CC'
        WHEN NAME LIKE '%王%' THEN '王' -- 字串比對，此次表示 只要字串有"王"就會撈出來
        WHEN email IS NULL THEN 'null'  -- email沒有資料
        WHEN email2 IS NOT NULL THEN 'not null' -- email有資料
        ELSE NAME  -- 如果都不符合，就保持原本的名字
    END,
    
    SCORE = CASE 
        WHEN ID BETWEEN 2 AND 6 THEN 20
        WHEN ID BETWEEN 7 AND 11 THEN 60
        WHEN ID = 12 THEN 70
        ELSE SCORE -- 如果都不符合，就保持原本的分數
    END
WHERE (ID > 1) AND (ID <= 12); -- 添加()方便閱讀
```

---

### 4. DELETE
`DELETE FROM 表名 WHERE 條件;`

```sql
-- 會刪除搜尋條件結果的全部資料。
-- 如果沒有加 WHERE，整張表的資料就會被清空
DELETE FROM orders
WHERE status = 'Canceled' 
  AND created_at < '2025-01-01'; -- 可以直接用比較運算子對日期進行篩選
```
