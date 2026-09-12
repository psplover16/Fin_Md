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
-- DELIMITER 三明治夾法，DELIMITER //  + 程式碼 + // (換行) + DELIMITER ;
DELIMITER //

CREATE PROCEDURE ProcessPerformanceReview (
    IN p_emp_id INT,                    -- 1. IN 參數：輸入員工編號
    IN p_score INT,                     -- 1. IN 參數：輸入考核分數 (0-100)
    OUT p_result_message VARCHAR(255)   -- 2. OUT 參數：執行完畢後吐回給外部的訊息
)
BEGIN
    -- 3. DECLARE：宣告內部計算要用到的區域變數
    DECLARE v_current_salary DECIMAL(10, 2);
    DECLARE v_raise_amount DECIMAL(10, 2) DEFAULT 0;

    -- 4. 條件判斷防呆：分數不合法時，直接用 SIGNAL 終止並報錯
    IF p_score < 0 OR p_score > 100 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '錯誤：考核分數必須介於 0 到 100 之間！';
    END IF;

    -- 5. 查詢資料並存入區域變數中 (SELECT ... INTO)
    SELECT salary INTO v_current_salary 
    FROM employees 
    WHERE emp_id = p_emp_id;

    -- 6. IF-ELSE 商業邏輯判斷：根據分數決定加薪金額
    IF p_score >= 90 THEN
        SET v_raise_amount = 5000;      -- 表現極佳，加薪 5000
    ELSEIF p_score >= 80 THEN
        SET v_raise_amount = 3000;      -- 表現良好，加薪 3000
    ELSE
        SET v_raise_amount = 0;         -- 表現普通，不加薪
    END IF;

    -- 7. 執行 DML：更新員工薪資 (UPDATE)
    UPDATE employees 
    SET salary = salary + v_raise_amount 
    WHERE emp_id = p_emp_id;

    -- 8. 執行 DML：自動寫入稽核日誌 (INSERT)
    INSERT INTO audit_log (action_text, action_time) 
    VALUES (CONCAT('員工編號 ', p_emp_id, ' 考核完成，加薪：', v_raise_amount), CURRENT_TIMESTAMP);

    -- 9. 指派 OUT 參數的最後回傳值
    SET p_result_message = CONCAT('處理成功！本次調整薪資：', v_raise_amount);
END //
-- DELIMITER 與 分號，一定要有空格
DELIMITER ;

-- 宣告一個變數 @msg 來接住 OUT 吐出來的結果，並傳入員工編號 7 與分數 95
CALL ProcessPerformanceReview(7, 95, @msg);

-- 查看預存程序回傳給你的訊息
SELECT @msg;
```

### 5. 觸發器 (Trigger)
* 一種特殊的預存程序，它不能被手動呼叫，而是綁定在某個 Table 上。當該 Table 發生 INSERT、UPDATE 或 DELETE 事件時，就會「被動」自動執行。
* **用法**：強制執行資料稽核（例如：誰在什麼時候刪除了資料，自動寫入 Log 表）、自動計算連動數據。

```sql
-- 建立一個觸發器，當新增員工時，自動在日誌表新增一筆紀錄
CREATE TRIGGER trg_AfterInsertEmployee -- 建立一個名為 trg_AfterInsertEmployee 的觸發器（自動警報器）
AFTER INSERT ON Employees          -- 觸發時機：當 Employees 表格被成功「INSERT」「之後 (AFTER)」
FOR EACH ROW                       -- 每一筆新增的資料都要觸發一次(固定標配)
BEGIN                              -- 觸發後開始執行以下動作
    INSERT INTO AuditLog (ActionText, ActionTime) -- 自動在日誌表新增一筆紀錄
    VALUES ('一位新員工被新增了', CURRENT_TIMESTAMP); -- 填入提示文字與當下的系統時間
END;                               -- 結束觸發器
```

```sql
-- 員工薪水調幅監控(稽核日誌)
-- NEW 代表「即將寫入」或「修改後」的新資料。
-- OLD 代表「原本存在」或「即將被刪除」的舊資料。
CREATE TRIGGER trg_AfterUpdateSalary   -- 建立一個名為 trg_AfterUpdateSalary 的觸發器
AFTER UPDATE ON Employees            -- 觸發時機：當 Employees 表格被成功「UPDATE」「之後」
FOR EACH ROW                         -- 針對每一筆被修改的資料
BEGIN
    -- 判斷：只有當「新薪水」不等於「舊薪水」時，才進行紀錄
    IF NEW.Salary != OLD.Salary THEN
        INSERT INTO AuditLog (ActionText, ActionTime) 
        -- 利用 OLD.Salary 抓出原本的薪水，利用 NEW.Salary 抓出改完的薪水
        VALUES (CONCAT('員工 ', NEW.EmpID, ' 薪水從 ', OLD.Salary, ' 變為 ', NEW.Salary), CURRENT_TIMESTAMP);
    END IF;
END;
```

```sql
-- 保護重要資料 (防呆)
CREATE TRIGGER trg_BeforeDeleteEmployee -- 建立一個名為 trg_BeforeDeleteEmployee 的觸發器
BEFORE DELETE ON Employees            -- 觸發時機：當 Employees 表格準備進行「DELETE」「之前」
FOR EACH ROW                          -- 針對每一筆準備被刪除的資料
BEGIN
    -- 判斷：如果這筆「即將被刪除的舊資料 (OLD)」的職位是經理
    IF OLD.Position = 'Manager' THEN
        -- MySQL 專用語法：拋出錯誤代碼 45000 (代表使用者自訂例外)，這會「強制中斷並取消」這次的刪除動作！
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '系統警告：禁止刪除經理級別的員工資料！';
    END IF;
END;
```

```sql
-- 資料自動格式化
CREATE TRIGGER trg_BeforeInsertEmployee -- 建立一個名為 trg_BeforeInsertEmployee 的觸發器
BEFORE INSERT ON Employees            -- 觸發時機：在資料真正被寫入「INSERT」「之前」
FOR EACH ROW                          -- 針對每一筆即將新增的資料
BEGIN
    -- 把「即將寫入的新資料 (NEW)」的 Email 欄位，強制套用 LOWER() 函數轉成小寫
    -- 因為是 BEFORE，所以改完之後，存進硬碟的就會是小寫格式
    SET NEW.Email = LOWER(NEW.Email);
END;
```


### 6. 序列 (Sequence)
* 一個獨立的資料庫物件，專門用來產生連續不斷、保證不重複的整數數值。
* MySQL沒有
* **用法**：產生流水號（如訂單編號、收據號碼）。即使在極高併發的環境下，也能確保編號的唯一性。（註：有些資料庫如 MySQL 習慣用 AUTO_INCREMENT 欄位屬性來替代此功能）。

---
