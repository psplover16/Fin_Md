# 基礎

### 一.
鍵（Key）是用來唯一識別關聯表中某一列（tuple／紀錄）的欄位或欄位組合。
* **超鍵 (Superkey)**：能唯一識別資料表中每一筆紀錄的欄位集合（可能包含多餘欄位）。
* **候選鍵 (Candidate Key)**：具備「最小性」的超鍵（不含多餘欄位）
* **主鍵 (Primary Key)**：設計者從「候選鍵」中挑選出一個，作為代表該表唯一識別的鍵（絕對不可為 NULL）。
* **替代鍵 (Alternate Key)**：未被選為主鍵的其餘「候選鍵」。
* **外來鍵 (Foreign Key)**：用來參照另一個資料表主鍵的欄位，目的是建立兩表關聯，並確保「參考完整性」。
* **複合鍵 (Composite Key)**：由「兩個或兩個以上」欄位所組合而成的鍵。

### 二.
* **主屬性（Prime Attribute）**：屬於某個候選鍵的屬性
* **非主屬性（Non-prime Attribute）**：不屬於任何候選鍵的屬性

---

# 阿姆斯壯公理

* **反身律**：$Y \subseteq X \Rightarrow X ightarrow Y$，一個集合可決定它的子集（顯然相依）
* **擴充律**：$X ightarrow Y \Rightarrow XZ ightarrow YZ$，兩邊同時加入屬性，相依仍成立
* **遞移律**：$(X ightarrow Y、Y ightarrow Z) \Rightarrow X ightarrow Z$

---

# 資料庫語法注意事項

1. **關鍵字本身（大寫 / 小寫）**：沒差，但習慣大寫
2. **資料庫名稱、表格名稱、欄位名稱（自訂名稱）**：有差
