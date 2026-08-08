# JOIN 分類
* JOIN 後沒資料的，用 `null` 表示。
* JOIN 要配 `ON`，把關聯的鍵綁在一起。

### 基本 JOIN
* **JOIN**：交集，只找配對的
  ```sql
  SELECT user_id FROM orders JOIN users ON orders.user_id = users.id
  ```
* **LEFT JOIN**：左邊全部列出來，右邊補充
  ```sql
  SELECT user_id FROM orders LEFT JOIN users ON orders.user_id = users.id
  ```
* **RIGHT JOIN**：右邊全列出來，左邊補充
* **FULL JOIN**：全部列出來

---

### CROSS JOIN (笛卡兒積)
* 每列兩兩相配，無 `ON` 條件。
```sql
SELECT 顏色, 尺寸 FROM Colors CROSS JOIN Sizes;
```
* 💡 **應用範例**：
  * 電商建立「商品規格矩陣」，所有尺寸與規格的組合（顏色+尺寸）。
  * 連續日期底稿 (員工上班出勤日)。

---

# 子查詢

**情境範例**：
* 員工表 (欄位：名字、部門ID)
* 部門表 (欄位：部門ID、所在城市)
* **任務目標**：找出「在台北上班」的員工名單。

### 寫法 1：JOIN 關聯
```sql
SELECT e.名字 
FROM 員工表 AS e 
JOIN 部門表 AS d 
    ON e.部門ID = d.部門ID 
WHERE d.所在城市 = '台北';
```
* **說明**：先集合，再 `WHERE` 篩選，最後再抽出名字。

### 寫法 2：WHERE 裡的子查詢 (IN)
```sql
SELECT 名字 
FROM 員工表 
WHERE 部門ID IN (
    SELECT 部門ID 
    FROM 部門表 
    WHERE 所在城市 = '台北'
);
```
* **說明**：先抓括弧內的問題，取得哪些部門 ID 是位在台北的。請去員工表幫我挑人，只要他的部門 ID 是 `[1, 3]` 其中一個，就把名字列出來。

### 寫法 3：FROM 裡的子查詢 (寫法1的進階版)
```sql
SELECT e.名字 
FROM 員工表 AS e 
JOIN (
    SELECT 部門ID 
    FROM 部門表 
    WHERE 所在城市 = '台北'
) d 
    ON e.部門ID = d.部門ID;
```
* **說明**：將部門表瘦身成「台北專屬虛擬表」，然後將「台北專屬虛擬表」與原本的員工表做 JOIN。

### 寫法 4：EXISTS (存在性驗證)
```sql
SELECT e.名字 
FROM 員工表 e 
WHERE EXISTS (
    SELECT 1 
    FROM 部門表 d 
    WHERE e.部門ID = d.部門ID 
      AND d.所在城市 = '台北'
);
```
* **說明**：與寫法 2 不同，先從員工表 `e` 抓第 1 位員工，帶著該員工的部門 ID，執行括號內的探索。去部門表找找看，能不能找到一筆資料，它的部門ID剛好等於「現在這位員工」的部門ID，而且城市剛好是「台北」？

### ⚠️ 執行順序差異
* **寫法 2** 是從內部括弧開始；**寫法 4** 是從外部括弧開始。
* 括號內是「獨立」的，從內部開始。
* 有牽連/關聯，則是從外部開始。

---

# 集合運算
把兩個獨立的表的搜尋結果，揉合在一起。

### 規則：
1. 欄位數量必須一模一樣
2. 對應位置的「資料型別」必須相容

### 種類：
1. **UNION**：合併兩查詢結果，去除重複
2. **UNION ALL**：合併但保留重複（較快）
3. **INTERSECT**：交集（兩邊都有的列）
4. **EXCEPT**：差集（上有下無的列）

### 範例：
```sql
SELECT 員工ID, 名字 FROM 上半年優秀員工
EXCEPT
SELECT 員工ID, 名字 FROM 下半年優秀員工
ORDER BY 員工ID DESC;
```
