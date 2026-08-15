## 物件導向四大特性 (OOP 4 Pillars) 

### 1. 抽象 (Abstraction)
1. 抽取出物件重要、共通的特徵，隱藏不必要的實作細節，只對外呈現必要的介面（做什麼 What，而非怎麼做 How）。
2. **實作方法比較：抽象類別 (Abstract Class) VS 介面 (Interface)**，兩者皆不能直接實例化 (new 出物件)。    
    1. 設計意義：抽象類別：`is-a` (你本質是什麼)，提供共通的基礎實作，用來避免程式碼重複。介面：`can-do` (你能做什麼)，定義行為規範或能力契約，不關心物件實際內容。
    2. 繼承限制 (JAVA及C#)：抽象類別：只能繼承一個 (`extends`)。介面：可實作多個 (`implements`)。
    3. 方法實作：抽象類別：可同時有「已實作方法」與「抽象方法」。介面：傳統只能有宣告(無實作)；Java 8+ 支援 default/static 已實作方法。
    4. 變數狀態：抽象類別：可有一般變數，保有物件狀態。介面：只能是常數 (`public static final`)，無狀態。
    5. 建構子：抽象類別：有建構子 (供子類別 super 呼叫初始化)。介面：無建構子。

```java
public abstract class Animal {
    // 1. 可有一般變數
    protected String name;

    // 2. 可有建構子
    public Animal(String name) {
        this.name = name;
    }

    // 3. 抽象方法 (只宣告，無實作)
    public abstract void makeSound();
}

// 2. 介面 (Interface)
public interface Flyable {
    // 1. 只能是常數
    int MAX_SPEED = 100; 

    // 2. 抽象方法 (只宣告，無實作)
    void fly(); 
}

// 3. 子類別繼承與實作
public class Bird extends Animal implements Flyable {    
    // 必須呼叫父類別的建構子來初始化一般變數
    public Bird(String name) {
        // 呼叫父類別建構子
        super(name);
        // super.方法名稱() ：呼叫父類別的「一般方法」
    }

    // 實作 Animal(抽象類別) 規定的方法
    @Override
    public void makeSound() {
        System.out.println(name + " 說：啾啾！");
    }

    // 實作 Flyable(介面) 規定的方法
    @Override
    public void fly() {
        System.out.println(name + " 正在飛翔，最高時速：" + MAX_SPEED);
    }
}
```

### 2. 多型 (Polymorphism)
1. 同一個方法名稱（同一個訊息），套在不同物件上，會有不同的行為與執行結果。    
2. 兩大實現方式：
    1. **多載 / 重載 (Overloading)** —— 編譯期多型：同一個類別裡，有多個同名方法，靠「參數不同」(個數、型別、順序) 來區分。
    2. **覆寫 (Overriding)** —— 執行期多型：子類別把父類別「已經有」的方法重新定義一次 (方法簽章必須完全相同)。


### 3. 繼承 (Inheritance)
1. 讓一個新類別（子類別）直接擁有既有類別（父類別）的屬性和方法，達到程式碼重用 (Code Reusability) 的目的。
2. 不必重寫既有功能，還能擴充自己的新功能，或修改（覆寫）父類別行為。
    *   **關係設計**：繼承 = `is-a` (例如：狗「是一種」動物)；組合 = `has-a` (例如：車子「有一個」引擎，要用組合 Composition)。(註：實務常提倡「多用組合，少用繼承」以降低耦合度)
    *   **語言差異**：Java 不支援類別多重繼承（用介面替代）；C++ 支援。
    *   **補充**：子類別無法繼承父類別的 private 成員與建構子，但可透過 `super()` 呼叫父類別建構子。


### 4. 封裝 (Encapsulation)
1. 將「資料（屬性）」與「方法（行為）」綁定在一起成為一個類別，並隱藏內部實作細節，只對外開放必要的操作介面。
    *   **資訊隱藏 (Information Hiding)**：避免外部程式碼直接竄改內部資料，保護資料完整性與安全性。
    *   **補充**：實務上通常將屬性設為 private，並透過公開的 Getter / Setter 方法來存取，以便在方法內加入邏輯判斷（例如：年齡不能設定為負數）。
2. **存取修飾子比較 (嚴格 ➔ 寬鬆)**：
    *   `private`：只有「同一個類別內」能存取。
    *   `default`：不寫修飾子即為此模式（套件私有）。「同一個套件內」的類別都能存取，跨套件不行。
    *   `protected`：在 default 之上，再多開放給「其他套件的子類別」存取。
    *   `public`：任何地方都能存取。