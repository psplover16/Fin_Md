# 資料庫排課系統練習題

某補習班要建立一個簡單的排課系統。

每位**老師**有：

- 教職員編號
- 姓名
- 電話

每門**課程**有：

- 課程代碼
- 課程名稱
- 學分數

一位老師可以教授多門課程，但**每門課程只有一位老師**。

每門課程會安排一個**上課時段**與一間**教室**。

時段由「**星期幾＋第幾節**」表示。

每間**教室**有：

- 教室編號
- 容納人數

同一個時段：

- **同一間教室不能安排兩門課程。**
- **同一位老師不能同時教授兩門課程。**

學生可以報名多門課程，一門課程也可以有多位學生報名。

每位**學生**有：

- 學號
- 姓名
- 電話

系統需要記錄學生的**報名日期**。

另外：

- **同一位學生在同一個時段不能報名兩門不同的課程。**

---

## 作答假設

為避免題目定義產生歧義，本題採以下假設：

1. **TimeSlot（時段）由「星期幾＋第幾節」決定。**
2. 例如：
   - 星期一＋第 1 節
   - 星期一＋第 2 節
   - 星期二＋第 1 節
3. 「早上、下午、晚上」不另外作為 TimeSlot（時段）的識別條件。

後續 **ER Model（實體關聯模型）**、**Relational Schema（關聯綱要）**、**Functional Dependency（函數相依）** 與 **BCNF（Boyce-Codd 正規形）** 均依照此假設進行。








---
---


# Step 1：需求分析（Requirements Analysis）

本步驟的目的，是將題目中的文字整理成後續建立 **ER Model（實體關聯模型）** 所需要的資訊。

> **本步驟只進行需求分析，不畫 ER Diagram（實體關聯圖）、不建立資料表、不進行正規化。**

---

### 1. Entity（實體）

- **Teacher（老師）**
  - **EmployeeID（教職員編號）**
  - **Name（姓名）**
  - **Phone（電話）**

- **Course（課程）**
  - **CourseCode（課程代碼）**
  - **CourseName（課程名稱）**
  - **Credits（學分數）**

- **TimeSlot（時段）**
  - **DayOfWeek（星期幾）**
  - **Period（第幾節）**

- **Classroom（教室）**
  - **ClassroomID（教室編號）**
  - **Capacity（容納人數）**

- **Student（學生）**
  - **StudentID（學號）**
  - **Name（姓名）**
  - **Phone（電話）**

---

### 2. Relationship（關聯）

- **Teaches（教授）**
  - 連結 **Teacher（老師）** 與 **Course（課程）**。
  - 表示老師教授課程。

- **ScheduledAt（安排於）**
  - 連結 **Course（課程）** 與 **TimeSlot（時段）**。
  - 表示課程安排在哪一個時段。

- **Uses（使用）**
  - 連結 **Course（課程）** 與 **Classroom（教室）**。
  - 表示課程使用哪一間教室。

- **Enrolls（報名）**
  - 連結 **Student（學生）** 與 **Course（課程）**。
  - 表示學生報名課程。

---

### 3. Cardinality（基數）

- **Teacher（老師） : Course（課程） = 1:N**
  - 一位老師可以教授多門課程。
  - 一門課程只有一位老師。

- **TimeSlot（時段） : Course（課程） = 1:N**
  - 一個時段可以安排多門課程。
  - 一門課程只有一個時段。

- **Classroom（教室） : Course（課程） = 1:N**
  - 一間教室可以在不同時段被多門課程使用。
  - 一門課程只有一間教室。

- **Student（學生） : Course（課程） = M:N**
  - 一位學生可以報名多門課程。
  - 一門課程可以有多位學生報名。

---

### 4. Relationship Attribute（關聯屬性）

- **EnrollmentDate（報名日期）**
  - 屬於 **Enrolls（報名）** 關聯。
  - 因為同一位學生可以報名不同課程，而每一次報名都可能有不同的報名日期。
  - 因此不能直接視為 Student（學生）或 Course（課程）的屬性。

---

### 5. Business Rules（業務規則）

- **規則一：同一時段 + 同一教室，最多一門課程。**

  ```text
  (TimeSlot, Classroom) → Course
  ```

- **規則二：同一時段 + 同一老師，最多一門課程。**

  ```text
  (TimeSlot, Teacher) → Course
  ```

- **規則三：同一學生 + 同一時段，最多一門課程。**

  ```text
  (Student, TimeSlot) → Course
  ```

> 上面三條目前是由題目的 **Business Rule（業務規則）** 整理出的限制；正式的 **Functional Dependency（函數相依，FD）** 分析會在 Step 4 進行。

---

### 6. Participation（參與限制）

- **Course（課程） → Teacher（老師）：Total Participation（完全參與）**
  - 每一門課程都必須有一位老師。

- **Course（課程） → TimeSlot（時段）：Total Participation（完全參與）**
  - 每一門課程都必須安排一個時段。

- **Course（課程） → Classroom（教室）：Total Participation（完全參與）**
  - 每一門課程都必須使用一間教室。

- **Teacher、TimeSlot、Classroom、Student：目前視為 Partial Participation（部分參與）**
  - 題目沒有要求每一位老師、每一個時段、每一間教室或每一位學生都一定要參與某個關聯。

---

### 7. Assumption（作答假設）

- **TimeSlot（時段） = DayOfWeek（星期幾） + Period（第幾節）**
- 本題不另外將「早上、下午、晚上」視為 TimeSlot（時段）的識別條件。
- 後續 **ER Model（實體關聯模型）**、**Relational Schema（關聯綱要）**、**Functional Dependency（函數相依）** 與 **BCNF（Boyce-Codd Normal Form，Boyce-Codd 正規形）** 均依照此假設進行。

---

## Step 1 最終結果

### Entity（實體）

- **Teacher（老師）**
- **Course（課程）**
- **TimeSlot（時段）**
- **Classroom（教室）**
- **Student（學生）**

### Relationship（關聯）

- **Teacher（老師） — Teaches（教授） — Course（課程）**
- **Course（課程） — ScheduledAt（安排於） — TimeSlot（時段）**
- **Course（課程） — Uses（使用） — Classroom（教室）**
- **Student（學生） — Enrolls（報名） — Course（課程）**

### 重要限制

```text
(TimeSlot, Classroom) → Course
(TimeSlot, Teacher) → Course
(Student, TimeSlot) → Course
```

**Step 1：完成。**


---
---
# Step 2：從 Step 1 到 Chen ERD 的轉換教學

> 本篇**撇除「如何實際畫圖」的操作**，專門說明：
> **如何把 Step 1 的需求分析結果，一步一步轉換成 Step 2 的 Chen ERD。**

---

## 一、Step 2 的目的

Step 1 與 Step 2 可以先用下面的方式理解：

- **Step 1：需求分析（Requirements Analysis）**
  - 把題目拆開，找出 Entity（實體）、Attribute（屬性）、Relationship（關聯）、Business Rule（業務規則）等資訊。

- **Step 2：概念設計（Conceptual Design）**
  - 把 Step 1 找到的資訊，依照 ER Model（實體關聯模型）的規則重新組織，形成完整的 Chen ERD（陳氏實體關聯圖）。

可以記成：

```text
Step 1：找出資料庫需要的元素
        ↓
Step 2：把這些元素組織成 ER Model
```

---

# 二、Step 1 → Step 2 的轉換流程

## 1. Entity（實體）→ 矩形

Step 1 先找出題目中的 Entity，例如本題：

- Teacher（老師）
- Course（課程）
- TimeSlot（時段）
- Classroom（教室）
- Student（學生）

到了 Step 2：

> 每一個確認為 Entity 的對象，就用**矩形**表示。

因此：

```text
Teacher（老師）      → 矩形
Course（課程）       → 矩形
TimeSlot（時段）     → 矩形
Classroom（教室）    → 矩形
Student（學生）      → 矩形
```

### 判斷重點

看到題目中的名詞，不是全部都要畫成 Entity。

可以問：

> **「這個東西是不是我們需要獨立管理、保存資料的主要對象？」**

例如：

- 老師有教職員編號、姓名、電話 → 是 Entity。
- 課程有課程代碼、課程名稱、學分數 → 是 Entity。

---

## 2. Attribute（屬性）→ 橢圓

Step 1 已經整理出每個 Entity 的 Attribute。

例如：

```text
Teacher
├── EmployeeID（教職員編號）
├── Name（姓名）
└── Phone（電話）
```

到了 Step 2：

> 每個 Attribute 用**橢圓**表示，並連接到所屬的 Entity。

例如概念上：

```text
(EmployeeID)
     |
 [Teacher]
     |
   (Name)
   (Phone)
```

### 判斷重點

Step 1 已經決定：

> 「這個 Attribute 是屬於哪個 Entity。」

Step 2 只是把它正式表示在 ERD 上。

---

## 3. Key Attribute（主鍵屬性）→ 橢圓＋底線

Step 2 還需要決定：

> **哪個 Attribute 可以唯一識別這個 Entity？**

如果可以，就把它視為 Key Attribute（鍵屬性），在 Chen ERD 中加上**底線**。

### 本題

- Teacher → EmployeeID（教職員編號）
- Course → CourseCode（課程代碼）
- Classroom → ClassroomID（教室編號）
- Student → StudentID（學號）

這些都是 Key Attribute。

---

### TimeSlot 比較特殊

本題採用假設：

```text
TimeSlot = DayOfWeek（星期幾） + Period（第幾節）
```

例如：

```text
星期一 + 第1節
星期一 + 第2節
星期二 + 第1節
```

因此：

```text
(DayOfWeek, Period)
```

共同識別一個 TimeSlot。

所以 Chen ERD 中：

- DayOfWeek（星期幾）→ 底線
- Period（第幾節）→ 底線

兩個 Attribute 共同形成 Key。

---

# 三、Relationship（關聯）的轉換

## 4. Step 1 的 Relationship → 菱形

Step 1 找到：

- Teacher 教 Course
- Course 安排在 TimeSlot
- Course 使用 Classroom
- Student 報名 Course

到了 Step 2：

> 每個 Relationship 用**菱形**表示。

因此：

```text
Teacher ── Teaches ── Course
Course ── Scheduled ── TimeSlot
Course ── Uses ── Classroom
Student ── Enrolls ── Course
```

在 Chen ERD 裡，`Teaches`、`Scheduled`、`Uses`、`Enrolls` 都會放在菱形中。

---

# 四、Cardinality（基數）怎麼從題目得到？

## 5. 先問「一邊最多對應多少」

判斷 Cardinality（基數）時，不要只看一句話。

固定問兩個問題：

1. **一個 A 最多可以對應幾個 B？**
2. **一個 B 最多可以對應幾個 A？**

再根據兩邊的答案判斷：

- 1:1
- 1:N
- M:N

---

## 6. Teacher : Course = 1:N

題目：

> 一位老師可以教授多門課程，但每門課程只有一位老師。

拆成兩邊：

```text
Teacher → 多個 Course
Course → 一個 Teacher
```

因此：

```text
Teacher 1 : N Course
```

### 為什麼不是 1:1？

因為 `1:1` 必須同時滿足：

```text
Teacher → 最多 1 個 Course
Course  → 最多 1 個 Teacher
```

但本題明確說一位老師可以教授多門課，所以 Teacher 這一側是 `N`。

因此最後是：

> **Teacher 1:N Course**

---

## 7. Course : TimeSlot = N:1

題目：

> 每門課程會安排一個上課時段。

表示：

```text
Course → 1 TimeSlot
```

而一個 TimeSlot 可以安排多門不同課程，所以：

```text
TimeSlot → N Course
```

因此：

```text
TimeSlot 1 : N Course
```

或反過來寫：

```text
Course N : 1 TimeSlot
```

兩者表示的是同一個關係。

---

## 8. Course : Classroom = N:1

題目：

> 每門課程會安排一間教室。

所以：

```text
Course → 1 Classroom
```

而同一間教室可以在不同時段被不同課程使用，所以：

```text
Classroom → N Course
```

因此：

```text
Classroom 1 : N Course
```

---

## 9. Student : Course = M:N

題目直接說：

> 學生可以報名多門課程，一門課程也可以有多位學生報名。

所以：

```text
Student → N Course
Course → N Student
```

因此：

```text
Student M : N Course
```

---

# 五、Participation（參與限制）怎麼判斷？

## 10. Participation 的核心問題

Participation 與 Cardinality 不一樣。

### Cardinality 問：

> **最多／最少可以有幾個？**

### Participation 問：

> **這個 Entity 的每一個實例，是不是一定要參加這個 Relationship？**

可以簡單記成：

```text
Cardinality
→ 有幾個？

Participation
→ 一定要有嗎？
```

---

## 11. Total Participation（全部參與）

如果 Entity 的**每一個實例都必須參加**某個 Relationship：

> **Total Participation（全部參與）**

Chen ERD 通常表示為：

```text
雙線
```

### 本題範例

題目：

> 每門課程只有一位老師。

表示每一門 Course 都一定有 Teacher。

所以：

```text
Course → Teaches = Total Participation
```

---

## 12. Partial Participation（部分參與）

如果 Entity 的實例**可以參加，也可以完全不參加**某個 Relationship：

> **Partial Participation（部分參與）**

Chen ERD 通常表示為：

```text
單線
```

### 本題範例

題目沒有說每一位 Teacher 一定要教授課程。

所以可能存在：

```text
Teacher A → 教 3 門課
Teacher B → 教 1 門課
Teacher C → 目前沒有課
```

因此：

```text
Teacher → Teaches = Partial Participation
```

---

# 六、本題各 Relationship 的 Participation

## Teaches（教授）

- Teacher → Partial Participation（部分參與）
- Course → Total Participation（全部參與）

理由：

- 老師可以目前沒有課。
- 每門課都必須有老師。

---

## Scheduled（安排）

- Course → Total Participation（全部參與）
- TimeSlot → Partial Participation（部分參與）

理由：

- 每門課都必須安排一個時段。
- 但不是每個時段都一定有課。

---

## Uses（使用）

- Course → Total Participation（全部參與）
- Classroom → Partial Participation（部分參與）

理由：

- 每門課都必須使用一間教室。
- 但不是每間教室都一定被使用。

---

## Enrolls（報名）

- Student → Partial Participation（部分參與）
- Course → Partial Participation（部分參與）

理由：

- 學生可以尚未報名任何課程。
- 課程也可以暫時沒有學生報名。

---

# 七、Relationship Attribute（關係屬性）怎麼處理？

## 13. EnrollmentDate（報名日期）

Step 1 找到：

```text
EnrollmentDate（報名日期）
```

接著問：

> 它是在描述 Student 本身？
> 還是在描述 Course 本身？
> 還是在描述「學生報名課程」這件事情？

答案是第三種。

例如：

```text
學生 A → 英文課 → 9/1 報名
學生 A → 數學課 → 9/5 報名
學生 B → 英文課 → 9/3 報名
```

所以 EnrollmentDate 不是：

```text
Student Attribute
```

也不是：

```text
Course Attribute
```

而是：

```text
Enrolls Relationship Attribute
```

因此 Chen ERD 中：

```text
◇ Enrolls ◇
      │
      ○ EnrollmentDate
```

也就是：

> **橢圓直接連到菱形。**

---

# 八、Business Rule 怎麼處理？

## 14. 不一定全部直接畫進 ERD

Step 1 找到三個特殊規則：

```text
(TimeSlot, Classroom) → Course
(TimeSlot, Teacher) → Course
(Student, TimeSlot) → Course
```

這些規則很重要，但它們不一定能單靠普通的 `1:N` 或 `M:N` 完整表達。

因此 Step 2 最安全的作法是：

> **ERD 表達主要結構，特殊 Business Rules（業務規則）另外註明。**

不要為了硬塞進 ERD 而改變原本的 Entity 或 Relationship 結構。

---

# 九、完整的 Step 1 → Step 2 思考流程

可以把整個過程背成：

```text
Step 1：需求分析
        ↓
找出 Entity
        ↓
→ 矩形

找出 Attribute
        ↓
→ 橢圓

找出 Key
        ↓
→ 橢圓＋底線

找出 Relationship
        ↓
→ 菱形

分析 Cardinality
        ↓
→ 1:N / M:N

分析 Participation
        ↓
→ 單線 / 雙線

找出 Relationship Attribute
        ↓
→ 橢圓連到菱形

整理特殊 Business Rules
        ↓
→ 在 ERD 旁另外註明
```

---

# 十、本題完整轉換結果

## Step 1 找到的 Entity

```text
Teacher
Course
TimeSlot
Classroom
Student
```

## Step 2 變成

```text
Teacher      → 矩形
Course       → 矩形
TimeSlot     → 矩形
Classroom    → 矩形
Student      → 矩形
```

---

## Step 1 找到的 Attribute

```text
Teacher → EmployeeID, Name, Phone
Course → CourseCode, CourseName, Credits
TimeSlot → DayOfWeek, Period
Classroom → ClassroomID, Capacity
Student → StudentID, Name, Phone
```

## Step 2 變成

> 每個 Attribute 都畫成橢圓並連到對應 Entity。

Key Attribute：

- Teacher → EmployeeID
- Course → CourseCode
- TimeSlot → DayOfWeek + Period
- Classroom → ClassroomID
- Student → StudentID

這些 Key Attribute 都加底線。

---

## Step 1 找到的 Relationship

```text
Teacher ── Course
Course ── TimeSlot
Course ── Classroom
Student ── Course
```

## Step 2 變成

```text
Teacher ── ◇ Teaches ◇ ── Course
Course ── ◇ Scheduled ◇ ── TimeSlot
Course ── ◇ Uses ◇ ── Classroom
Student ── ◇ Enrolls ◇ ── Course
```

---

## Cardinality

```text
Teacher 1 : N Course
TimeSlot 1 : N Course
Classroom 1 : N Course
Student M : N Course
```

---

## Participation

```text
Teaches
Teacher → Partial
Course → Total

Scheduled
Course → Total
TimeSlot → Partial

Uses
Course → Total
Classroom → Partial

Enrolls
Student → Partial
Course → Partial
```

---

## Relationship Attribute

```text
Enrolls
   │
EnrollmentDate
```

---

# 十一、最重要的觀念

Step 2 **不是重新分析題目**。

而是把 Step 1 的結果，按照 Chen ERD 的規則「翻譯」成圖形。

所以可以記成：

> **Step 1：我知道題目有什麼。**
>
> **Step 2：我把這些東西正式表示出來。**

最簡單的記憶方式：

```text
Entity        → 矩形
Attribute     → 橢圓
Key           → 橢圓＋底線
Relationship  → 菱形
Cardinality   → 1:N / M:N
Participation → 單線 / 雙線
```

這樣就完成「從 Step 1 到 Step 2 Chen ERD」的主要轉換。




---
---

# Step 3：邏輯設計（Logical Design）

## ERD → Relational Schema（ER 模型轉關聯綱要）

Step 3 的目的：

> **把 Step 2 的 Chen ERD 轉換成資料表雛型。**

這一步先不做正規化，主要回答：

- 要建立哪些 Table（資料表）？
- 每張 Table 有哪些 Column（欄位）？
- 哪些欄位是 PK（主鍵）？
- 哪些欄位是 FK（外鍵）？

---

# 一、Step 3 核心口訣

> **實體建表、屬性變欄、Key 變 PK。**  
> **1:1 看 Participation。**  
> **1:N，FK 放 N。**  
> **M:N，開關係表，帶兩邊 PK。**  
> **關係屬性，放進關係表。**  
> **弱實體，帶 Owner PK＋Partial Key。**  
> **最後檢查 PK / FK。**

---

# 二、依照口訣一步一步操作

## 1. 實體建表

看到 ERD 中的 Entity（實體）：

- Strong Entity（強實體）→ 建立一張 Table
- Weak Entity（弱實體）→ 也建立一張 Table

### 口訣

> **有實體，就有表。**

例如：

```text
Teacher（老師）
Course（課程）
Student（學生）
```

轉成：

```text
TEACHER
COURSE
STUDENT
```

---

## 2. 屬性變欄

Entity 的 Attribute（屬性）轉成 Table 的 Column（欄位）。

例如：

```text
Teacher
├── EmployeeID（教職員編號）
├── Name（姓名）
└── Phone（電話）
```

轉成：

```text
TEACHER(
    EmployeeID,
    Name,
    Phone
)
```

### 口訣

> **橢圓變欄位。**

---

## 3. Key 變 PK

ERD 中有底線的 Key Attribute（鍵屬性），轉成 Primary Key（主鍵）。

例如：

```text
EmployeeID（教職員編號）
```

變成：

```text
TEACHER(
    EmployeeID PK,
    Name,
    Phone
)
```

### 多個 Key Attribute

如果 ERD 中：

```text
DayOfWeek（星期幾）
Period（第幾節）
```

兩個共同識別 Entity，則：

```text
PK = (DayOfWeek, Period)
```

屬於 Composite Primary Key（複合主鍵）。

### 口訣

> **底線找 PK。**

---

## 4. 1:1 Relationship

看到：

```text
A 1 : 1 B
```

不要直接套固定規則。

先觀察：

- Total Participation（全部參與）
- Partial Participation（部分參與）

再決定 Foreign Key（外鍵）放在哪一邊。

### 常見判斷

- Total / Partial → 通常 FK 放 Total 那一邊
- Partial / Total → 通常 FK 放 Total 那一邊
- Total / Total → 可選一邊放 FK；也可視情況考慮合併
- Partial / Partial → 可選一邊放 FK

### 口訣

> **1:1 → 看 Participation。**

---

## 5. 1:N Relationship

看到：

```text
A 1 : N B
```

固定規則：

> **FK 放在 N 的那一側。**

例如：

```text
Teacher 1 : N Course
```

Teacher 的 PK 是：

```text
EmployeeID
```

所以放到 Course：

```text
COURSE(
    CourseCode PK,
    CourseName,
    Credits,
    EmployeeID FK
)
```

### 口訣

> **1 對 N，FK 放 N。**

---

## 6. 複合 FK

如果 1:N 關係中，1 側的 PK 是 Composite Key（複合鍵），就要把整組 PK 帶到 N 側。

例如：

```text
TimeSlot 1 : N Course

TimeSlot PK = (DayOfWeek, Period)
```

因此：

```text
COURSE(
    CourseCode PK,
    CourseName,
    Credits,
    DayOfWeek FK,
    Period FK
)
```

其中：

```text
(DayOfWeek, Period)
```

共同形成 Composite Foreign Key（複合外鍵）。

### 口訣

> **對方 PK 幾個，FK 就帶幾個。**

---

## 7. M:N Relationship

看到：

```text
A M : N B
```

固定規則：

> **為這個 Relationship（關係）建立一張新的 Table。**

例如：

```text
Student M : N Course
```

建立：

```text
ENROLLMENT
```

這張表是用來記錄：

> **哪一個 Student（學生）與哪一個 Course（課程）發生了這筆關係。**

### 口訣

> **M:N → 開關係表。**

---

## 8. M:N 新表：帶兩邊 PK

假設：

```text
Student PK = StudentID
Course PK = CourseCode
```

則：

```text
ENROLLMENT(
    StudentID,
    CourseCode
)
```

兩個欄位通常共同形成 Composite Primary Key（複合主鍵）：

```text
PK = (StudentID, CourseCode)
```

同時：

- StudentID → FK
- CourseCode → FK

所以：

```text
ENROLLMENT(
    StudentID PK/FK,
    CourseCode PK/FK
)
```

### 口訣

> **M:N → 兩邊 PK 都帶進來。**

---

## 9. Relationship Attribute（關係屬性）

如果 Relationship 本身有 Attribute：

```text
Student M : N Course
       │
EnrollmentDate（報名日期）
```

轉成資料表時：

> **把 Relationship Attribute 放進「這個 Relationship 所建立的關係表」。**

因此：

```text
ENROLLMENT(
    StudentID PK/FK,
    CourseCode PK/FK,
    EnrollmentDate
)
```

### 最簡單的理解

> **關係屬性 → 放進關係表。**

也就是：

> 「關係變成哪張表，關係屬性就放進哪張表。」

---

## 10. Weak Entity（弱實體）

如果 ERD 出現 Weak Entity（弱實體）：

1. 建立 Weak Entity 的 Table。
2. 帶入所依附 Strong Entity（強實體）的 PK。
3. 帶入 Weak Entity 的 Partial Key（部分鍵）。
4. 兩者通常共同形成 Weak Entity 的 PK。

例如：

```text
EMPLOYEE(
    EmployeeID PK,
    Name
)

DEPENDENT(
    EmployeeID PK/FK,
    DependentName PK,
    Age
)
```

其中：

- `EmployeeID` = Owner Entity（所依附強實體）的 PK
- `DependentName` = Partial Key（部分鍵）
- `(EmployeeID, DependentName)` = Weak Entity 的完整 PK

### 口訣

> **弱實體：帶主人 PK＋自己的 Partial Key。**

---

# 三、最後檢查 PK / FK

全部轉換完後，做最後檢查。

## PK 檢查

確認：

- 每張 Table 都有 Primary Key（主鍵）。
- Composite Primary Key（複合主鍵）沒有漏欄位。
- PK 能正確識別資料。

## FK 檢查

確認：

- FK 是否來自正確的另一張 Table？
- FK 是否指向對方的 PK？
- Composite Foreign Key（複合外鍵）是否整組帶過來？

例如：

```text
COURSE.EmployeeID
    ↓
TEACHER.EmployeeID
```

以及：

```text
COURSE.(DayOfWeek, Period)
    ↓
TIMESLOT.(DayOfWeek, Period)
```

---

# 四、Step 3 最終輸出格式

Step 3 最後的答案，就是 **Relational Schema（關聯綱要）**。

格式通常寫成：

```text
TABLE(
    Column,
    Column,
    PK,
    FK
)
```

例如：

```text
TEACHER(
    EmployeeID PK,
    Name,
    Phone
)
```

---

# 五、本題完整結果

```text
TEACHER(
    EmployeeID PK,
    Name,
    Phone
)

COURSE(
    CourseCode PK,
    CourseName,
    Credits,
    EmployeeID FK,
    DayOfWeek FK,
    Period FK,
    ClassroomID FK
)

TIMESLOT(
    DayOfWeek PK,
    Period PK
)

CLASSROOM(
    ClassroomID PK,
    Capacity
)

STUDENT(
    StudentID PK,
    Name,
    Phone
)

ENROLLMENT(
    StudentID PK/FK,
    CourseCode PK/FK,
    EnrollmentDate
)
```

---

# 六、Step 3 一眼操作流程

拿到任何 ERD 後，依序做：

```text
ERD
 ↓
① 實體建表
 ↓
② 屬性變欄
 ↓
③ Key → PK
 ↓
④ 1:1 → 看 Participation
 ↓
⑤ 1:N → FK 放 N
 ↓
⑥ M:N → 開關係表
 ↓
⑦ M:N 關係表 → 帶兩邊 PK
 ↓
⑧ Relationship Attribute → 放進關係表
 ↓
⑨ Weak Entity → Owner PK＋Partial Key
 ↓
⑩ 檢查每張表的 PK / 所有 FK
 ↓
完成 Relational Schema
```

---

# 七、最終背誦版

> **實體建表、屬性變欄、Key 變 PK。**  
> **1:1 看 Participation。**  
> **1:N，FK 放 N。**  
> **M:N，開關係表，兩邊 PK 帶進來。**  
> **關係屬性，放進關係表。**  
> **弱實體，帶 Owner PK＋Partial Key。**  
> **最後檢查 PK / FK。**

---

# 八、重要觀念

> **Step 3 的任務是「忠實把 ERD 轉成資料表」，不是現在就開始正規化。**

因此：

```text
Step 2：Chen ERD
        ↓
Step 3：Relational Schema
        ↓
Step 4：Functional Dependency
        ↓
Step 5：BCNF
```

Step 3 完成後，即可進入 Step 4 的 Functional Dependency（函數相依）分析。
