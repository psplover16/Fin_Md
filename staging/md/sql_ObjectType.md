# 資料庫物件

### 1. 表格 (Table)
* 資料庫中最基本、用來實體儲存資料的二維結構，由「欄位 (Column)」與「資料列 (Row)」組成。

```sql
-- 建立一個名為「員工表」的表格，包含編號、姓名與薪水欄位
CREATE TABLE Employees (
    -- 欄位名稱 | 型別 | 其他
    EmpID INT PRIMARY KEY, -- EmpID 是欄位名稱 | INT 代表整數 | PRIMARY KEY 代表主鍵（唯一且不能空白）
    EmpName VARCHAR(50),   -- EmpName 是欄位名稱 | VARCHAR(50) 代表最多 50 個字的字串
    Salary DECIMAL(10, 2)  -- Salary 是欄位名稱 | DECIMAL(10,2) 代表總共 10 位數、含 2 位小數的數字
);
```

### 2. 檢視表 (View)
* 一個不儲存實體資料的「虛擬表格」，其內容是由一段預先寫好的 SELECT 查詢語句即時產生的結果。
* **用法：**
  1. 資安控管：隱藏機密欄位（如薪水、密碼），只開放特定欄位給使用者看。
  2. 簡化複雜度：將非常複雜的跨表查詢（JOIN）包裝成一個 View，以後查詢就變得很簡單。

```sql
-- 建立一個只包含姓名，隱藏薪水的員工檢視表
CREATE VIEW Safe_Employees_View AS -- 建立一個名叫 Safe_Employees_View 的虛擬表格，內容來源是...
SELECT EmpID, EmpName              -- 只挑選這兩個欄位（刻意把薪水 Salary 藏起來）
FROM Employees;                    -- 來源是 Employees 表格
WHERE EmpID >= 60;                 -- 且ID要在60之後
```

### 3. 索引 (Index)
* 一種附加在表格欄位上的資料結構（通常是 B-Tree），用來大幅加快資料檢索的速度。
* **用法**：當表格資料量極大時，建立在常被用來查詢（WHERE 條件）的欄位上，可以避免全表掃描，提升查詢效能。

```sql
-- 在員工表的「姓名」欄位上建立一個加速搜尋的索引
CREATE INDEX idx_emp_name -- 建立一個名叫 idx_emp_name 的索引（加速搜尋用）
ON Employees (EmpName);   -- 把這個加速器安裝在 Employees 表格的 EmpName 欄位上
```

### 4. 預存程序 (Stored Procedure)
* 將一段或多段 SQL 語句集合打包、編譯並儲存在資料庫中的程式區塊，可接受傳入參數。
* **用法**：將複雜的商業邏輯（例如：月底結算、扣庫存加開發票）寫在資料庫端，減少應用程式與資料庫之間的網路傳輸，並提升執行效率。

```sql
-- 建立一個幫特定員工加薪的預存程序
CREATE PROCEDURE GiveRaise (       -- 建立一個名為 GiveRaise 的預存程序（類似自訂的 SOP 指令）
    IN p_EmpID INT,                    -- 輸入參數 1：要幫哪位員工加薪
    IN p_RaiseAmount DECIMAL(10, 2)    -- 輸入參數 2：要加多少錢
    IN p_RaiseAmount DECIMAL(10, 2)  -- 輸入參數 2：要加多少薪水（填入數字）
)
BEGIN                              -- 以下開始執行內部的動作
    UPDATE Employees               -- 去修改 Employees 表格
    SET Salary = Salary + p_RaiseAmount -- 把原本的薪水加上要加的金額
    WHERE EmpID = p_EmpID;         -- 指定條件：只修改對應的那位員工編號
END;                               -- 結束這個預存程序

-- 呼叫 GiveRaise 這個預存程序，並依序帶入參數：員工編號 7、加薪 5000
CALL GiveRaise(7, 5000);
```

### 5. 觸發器 (Trigger)
* 一種特殊的預存程序，它不能被手動呼叫，而是綁定在某個 Table 上。當該 Table 發生 INSERT、UPDATE 或 DELETE 事件時，就會「被動」自動執行。
* **用法**：強制執行資料稽核（例如：誰在什麼時候刪除了資料，自動寫入 Log 表）、自動計算連動數據。

```sql
-- 建立一個觸發器，當新增員工時，自動在日誌表新增一筆紀錄
CREATE TRIGGER trg_AfterInsertEmployee -- 建立一個名為 trg_AfterInsertEmployee 的觸發器（自動警報器）
AFTER INSERT ON Employees          -- 觸發時機：當 Employees 表格被成功「新增資料 (INSERT)」的「之後 (AFTER)」
FOR EACH ROW                       -- 每一筆新增的資料都要觸發一次
BEGIN                              -- 觸發後開始執行以下動作
    INSERT INTO AuditLog (ActionText, ActionTime) -- 自動在日誌表新增一筆紀錄
    VALUES ('一位新員工被新增了', CURRENT_TIMESTAMP); -- 填入提示文字與當下的系統時間
END;                               -- 結束觸發器
```

### 6. 序列 (Sequence)
* 一個獨立的資料庫物件，專門用來產生連續不斷、保證不重複的整數數值。
* **用法**：產生流水號（如訂單編號、收據號碼）。即使在極高併發的環境下，也能確保編號的唯一性。（註：有些資料庫如 MySQL 習慣用 AUTO_INCREMENT 欄位屬性來替代此功能）。

```sql
-- 建立一個名為訂單編號的發號機，從 1 開始，每次加 1
CREATE SEQUENCE OrderID_Seq  -- 建立一個名為 OrderID_Seq 的序列（像是抽號碼牌機）
    START WITH 1             -- 從數字 1 開始發號碼
    INCREMENT BY 1;          -- 每次發號碼，數字就自動加 1（1, 2, 3...）
```

---
