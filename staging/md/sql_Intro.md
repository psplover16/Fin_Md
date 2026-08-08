# SQL 四大種類

## 1. DDL (資料定義語言)：定義／修改資料庫結構
* **1. CREATE**：建立物件（表、檢視表、索引等）
* **2. ALTER**：修改物件結構（如新增欄位）
  * 下列範例無法執行，原因是進行 ALTER 看的是舊表，下面是新增 EMAIL 又修改 EMAIL，所以無法修改。
  * 是整段無法執行，原因是一個 `;` 前所有當作一個動作。

```sql
ALTER TABLE Employees 
ADD Email VARCHAR(100), -- 增加EMAIL欄位、最大100個字串
AUTO_INCREMENT = 3, -- 將自動跳號重置為 3 (這是資料表層級的設定，可以直接用逗號接在後面)
RENAME COLUMN Email_Test TO _deprecated_Email_Test2, -- 把欄位 Email_Test 名稱改成 _deprecated_Email_Test2
ALTER COLUMN Email SET INVISIBLE, -- 將 Email 欄位設定為「隱藏狀態」
DROP COLUMN Email; -- 徹底把 Email 這個欄位，連同裡面的資料一起刪除
```

* **3. DROP**：刪除整個物件（含結構與資料）

```sql
-- 直接刪除 Employees 這張表，如果這張表有被其他表關聯（例如有外來鍵 Foreign Key 綁著），直接刪會失敗，資料庫會拒絕，保護你不會不小心害其他系統崩潰。
DROP TABLE Employees;

-- 如果 Employees 這張表存在，就刪除它；如果不存在就算了，不會報錯
DROP TABLE IF EXISTS Employees;
```

  * View 與預存程序 (PROCEDURE) 比較安全，可以直接刪除

* **4. TRUNCATE**：清空表中"所有"資料，但保留表結構，速度快，不可加 WHERE

```sql
-- 清空Employees 表格資料
TRUNCATE TABLE Employees;
```

* **DCL 注意事項**：
  * DDL 指令通常會自動提交（auto-commit），執行後即生效。
  * 資料庫裡修改資料，通常是暫時存在記憶體或暫存區裡，唯有下了 COMMIT 才會永久寫入硬碟。
  * 「不能 rollback」（因視為 DDL、自動提交）
  * Rollback 是將資料庫尚未永久存檔（未 Commit）的所有變更全部作廢並還原到初始狀態的「後悔/復原」機制。
    1. 必須在「交易（Transaction）」的保護傘之內
    2. 資料尚未被提交（Not Committed）
    3. 該操作必須支援復原（例如 DML，而非 DDL）

---

## 2. DML (資料操作語言)：對表中的資料進行存取
* **1. INSERT** 新增
* **2. UPDATE** 修改
* **3. DELETE** 刪除
* **4. SELECT** 查詢

---

## 3. DCL (資料控制語言)：控制使用者權限
* **1. GRANT**

```sql
-- 賦予使用者在可以從任何外部 IP 對 username 對 employees 這張表進行查詢與新增、修改、刪除
GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO 'username'@'%';

-- 賦予使用者 username 在本地端對 employees 這張資料庫表的所有操作權限
GRANT ALL PRIVILEGES ON employees TO 'username'@'localhost';

-- 賦予使用者 username 在特定IP連線進入，才能對 employees 這張資料庫表的所有操作權限。且還能把這些權限轉發給其他人
GRANT ALL PRIVILEGES ON employees TO 'username'@'192.168.1.50' WITH GRANT OPTION;
```

* **2. REVOKE**

```sql
-- 收回使用者 username 對 employees 表的新增權限
REVOKE INSERT ON employees FROM 'username'@'localhost';

-- 徹底清除該帳號的特定存取與轉發權力
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'username'@'localhost';

-- 收回使用者 username 對 employees 表權限轉發給他人的權利
REVOKE GRANT OPTION FOR SELECT ON employees FROM 'username'@'localhost';
```

* `'帳號名稱'@'主機來源'` 是一個不可分割的「完整帳號身分（Identity）」

---

## 4. TCL (交易控制語言)：管理交易
* **1. START TRANSACTION / BEGIN (開啟交易)**：標記一個新交易的開始，讓後續的 DML 操作被包在同一個安全防護網內。
* **2. COMMIT (提交)**：將交易期間所有的 DML 變更永久寫入資料庫硬碟中，無法再反悔。
* **3. ROLLBACK (回滾/復原)**：將交易期間所有尚未提交的變更全部作廢，回到交易開始前的狀態。
* **4. SAVEPOINT (儲存點)**：在交易中設定一個中繼檢查點，允許在發生錯誤時部分回滾 (把進度退到該檢查點上)，不用全部重來。

**範例 1** (若中間發生錯誤，則執行 `ROLLBACK;` 將金額扣款與加款全部作廢)：
```sql
START TRANSACTION; -- 開始交易
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
-- 檢查一切順利，永久存檔
COMMIT;
```

**範例 2**：
```sql
START TRANSACTION;
INSERT INTO logs (action) VALUES ('Step 1');

SAVEPOINT sp1; -- 設定儲存點 1

-- 新增一筆資料到 logs 表中，指定填寫 action 欄位，內容是字串 'Step 2 (Failed)'。
INSERT INTO logs (action) VALUES ('Step 2 (Failed)');
-- 發現 Step 2 有問題，但想保留 Step 1
ROLLBACK TO sp1; 

COMMIT; -- 最後只會永久保留 Step 1
```

---

* **DELETE vs TRUNCATE vs DROP**：DELETE 擦字、TRUNCATE 撕頁、DROP 燒書
