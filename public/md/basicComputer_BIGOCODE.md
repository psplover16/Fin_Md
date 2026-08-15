1. 快速冪演算法：2^6 = (2^2)^3 = 4 * 4^2 = 4 * 16
    ```java
        // 計算 base 的 exp 次方
        public static long fastPower(long base, long exp) {
            long result = 1;  // 用來裝最終答案

            while (exp > 0) {
                // 情況 B：如果指數是奇數 (抽一個底數乘進答案裡)
                if (exp % 2 == 1) {
                    result = result * base;
                }

                // 情況 A：底數平方，指數砍半
                base = base * base;
                // long型態只能放整數，小數會無條件捨去，達到 -1 的效果
                exp = exp / 2;
            }

            return result;
        }
    ```

2. 合併排序 (Merge Sort)：把所有資料一直對半切，直到變成一個個單獨的數字。將兩兩有序的分組，依照大小順序重新組合成更大的有序分組。
* 先**一直對半拆到每段剩 1 個**(單一元素天生有序),再**兩兩合併回去**
```java
class MergeSort {
    // 極短寫法
    static void sort(int[] arr, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        
        sort(arr, left, mid);
        sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;

        // 雙指 PK：誰小誰拿，並自動推進指標與暫存位置
        while (i <= mid && j <= right) {
            temp[k++] = (arr[i] <= arr[j]) ? arr[i++] : arr[j++];
        }

        // 單身整包帶走
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];

        // 完整拷貝回原陣列
        for (int p = 0; p < temp.length; p++) {
            arr[left + p] = temp[p];
        }
    }
}
```
```java
// ① 負責「拆」;left/right 是「圈住陣列哪一段」的索引
void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;            // 只剩 1 個,不用再拆
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);            // 拆左半並排好
    mergeSort(arr, mid + 1, right);       // 拆右半並排好
    merge(arr, left, mid, right);         // 左右都排好 → 合併
}
// ② 負責「合」:把兩段有序資料併成一段有序
private static void merge(int[] arr, int left, int mid, int right) {
    // 建立一個暫存陣列，用來裝合併後的結果
    int[] temp = new int[right - left + 1];
    
    int i = left;      // 左半邊的起始指標
    int j = mid + 1;   // 右半邊的起始指標
    int k = 0;         // 暫存陣列的指標
    // 像拉鍊一樣，比較兩邊的頭，誰小就先拿誰進 temp
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k] = arr[i];
            i++;
        } else {
            temp[k] = arr[j];
            j++;
        }
        k++;
    }
    // 如果左半邊還有剩，把剩下的全部直接倒進 temp
    while (i <= mid) {
        temp[k] = arr[i];
        i++;
        k++;
    }
    // 如果右半邊還有剩，把剩下的全部直接倒進 temp
    while (j <= right) {
        temp[k] = arr[j];
        j++;
        k++;
    }
    // 把整理好的 temp 暫存陣列，完整拷貝回原本的 arr 陣列中對應的位置
    for (int p = 0; p < temp.length; p++) {
        arr[left + p] = temp[p];
    }
}

// 開始進行遞迴分割，範圍從頭 (0) 到尾 (長度 - 1)
mergeSort(arr, 0, arr.length - 1); 
```


3. 快速排序法：抓一個基準值pivot，把pivot小的放左邊、pivot大的放右邊，重複遞迴
```java
class QuickSort {
    // 1. 主框架：告訴程式「我要排序哪一段範圍」
    static void sort(int[] arr, int low, int high) {
        // 如果 low >= high，代表這段範圍只剩 1 個元素或空了，不用再排了
        if (low < high) {            
            // 找出 Pivot（基準點）排好後的正確「家」在哪裡
            int pivotIndex = partition(arr, low, high);
            
            // 遞迴排序：把 Pivot 左邊的那群繼續排序
            sort(arr, low, pivotIndex - 1);
            
            // 遞迴排序：把 Pivot 右邊的那群繼續排序
            sort(arr, pivotIndex + 1, high);
        }
    }

    // 2. 切割核心 (Partition)：把小於 Pivot 的搬左邊，大於的搬右邊
    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high]; // 挑選「當前範圍的最右邊一個數字」當作基準點        
        int i = low - 1;       // i 負責當「小於區」的結界線（隨時準備擴張領土）

        // j 負責當「探子」，從頭到尾掃描這段範圍
        for (int j = low; j < high; j++) {            
            // 如果探子 j 看到的數字，小於或等於 pivot
            if (arr[j] <= pivot) {
                i++; // 結界線往右擴張一格                
                // 把小的數字交換到左邊的「小於區」
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        // 掃描完後，把原本躲在最右邊的 pivot，放回它真正的「中間老家」 (i + 1 的位置)
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1; // 回傳 pivot 目前安家落戶的正確索引位置
    }
}
```


4. 堆積排序 (Heap Sort)
```java
public class HeapSortTarget {

    // 🏆 主戰場：堆積排序主函數
    public static void heapSort(int[] arr) {
        int n = arr.length;

        // 【步驟一：建構最大堆積 (Build Max Heap)】，要讓 所有的父節點，一定大於（或等於）它的子節點。
        // 邏輯：從「最後一個有小孩的父節點」開始，一路往回走到 Root (index 0) 進行調整。
        // 建立初期紀律。 從最底層的主管開始，「反覆多次呼叫 heapify」，一路往上修復，最終把全場最大值推到 Root。
        // 最後一個有小孩的父節點索引剛好會是 (n / 2) - 1。
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }

        // 【步驟二：執行排序 (Extract Max)】
        // 邏輯：Root 絕對是最大值，把它拔出來跟最後一個元素交換，然後重新調整剩下的樹。
        for (int i = n - 1; i > 0; i--) {
            // 1. 把 Root (最大的數, index 0) 換到陣列最後面 (index i)
            swap(arr, 0, i);
            
            // 2. 陣列長度「邏輯上」縮小了 (傳入的邊界變成 i)
            // 3. 把剛換上來、坐在 Root 位置的「假王」往下調整，重新維持 Max Heap
            heapify(arr, i, 0);
        }
    }

    // 🛠 核心引擎：向下調整維持 Max Heap 性質 (Sift Down / Adjust)
    //  針對「單一節點」，不斷把它往下推，直到符合規矩。
    // 參數說明：arr (陣列)
    // n (目前 Heap 的有效長度)
    // i (要檢查的父節點索引)
    private static void heapify(int[] arr, int n, int i) {
        int largest = i;          // 預設：目前這個父節點就是最大值
        int left = 2 * i + 1;     // 左小孩的陣列索引
        int right = 2 * i + 2;    // 右小孩的陣列索引

        // 規則 1：如果左小孩沒越界，且左小孩比「目前的王」還大，王位換人做
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        // 規則 2：如果右小孩沒越界，且右小孩比「目前的王」還大，王位換人做
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        // 如果經過上面兩關，王位換人了 (代表有小孩犯上作亂，爸爸不是最大的)
        if (largest != i) {
            // 把最大的小孩跟爸爸交換位置
            swap(arr, i, largest);
            
            // 【重要遞迴】：爸爸被降級換到下面去了，怕他比新的小孩還要小，
            // 所以要順著他被換下去的位置 (largest)，繼續往下遞迴檢查！
            heapify(arr, n, largest); 
        }
    }

    // 輔助工具：交換陣列中的兩個元素
    private static void swap(int[] arr, int a, int b) {
        int temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
}
```



5. 泡泡排序：重複走訪陣列，比較相鄰兩個元素，順序錯誤就交換。每一輪結束後，該輪範圍內最大的元素會被交換到正確位置（陣列尾端）。
```java
public static void bubbleSort(int[] array) {
    int n = array.length;

    for (int i = 0; i < n - 1; i++) {
        // 記錄這一輪是否發生過交換；若完全沒交換，代表陣列已排序完成
        boolean swapped = false;

        // 每輪結束後，陣列尾端的 i 個元素已確定排序完成，不需要再比較
        for (int j = 0; j < n - 1 - i; j++) {
            if (array[j] > array[j + 1]) {
                int temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                swapped = true;
            }
        }

        // 提前結束優化：這一輪若完全沒交換，代表已經排序完成
        if (!swapped) {
            break;
        }
    }
}
```

7. 選擇排序：將陣列分成「已排序」與「未排序」兩部分。每一輪從未排序部分找出最小值，與未排序部分的第一格交換。
```java
public static void selectionSort(int[] array) {
     int n = array.length;

     for (int i = 0; i < n - 1; i++) {
         int minIndex = i; // 先假設目前這格就是未排序部分的最小值

         // 從 i + 1 開始掃描，找出真正的最小值所在索引
         for (int j = i + 1; j < n; j++) {
             if (array[j] < array[minIndex]) {
                 minIndex = j;
             }
         }

         // 只有在找到更小的值時才交換，避免不必要的交換
         if (minIndex != i) {
             int temp = array[i];
             array[i] = array[minIndex];
             array[minIndex] = temp;
         }
     }
}
```


8. 插入排序：
    *   將陣列視為「已排序」與「未排序」兩部分，初始時已排序部分只有第一個元素。
    *   每次取出未排序部分的第一個元素（key），在已排序部分由後往前比較，
    *   找到正確位置後插入，過程中較大的元素依序往後挪一格。
*   簡單版
```java
public static void insertionSort(int[] array) {
    int n = array.length;
    for (int i = 1; i < n; i++) {
        int j = i;
        // 讓 array[i] 一路跟左邊的鄰居「真正交換」，直到不用再換為止
        while (j > 0 && array[j] < array[j - 1]) {
            int temp = array[j];
            array[j] = array[j - 1];
            array[j - 1] = temp;
            j--;
        }
    }
}
```
*   正解
```java
public static void insertionSort(int[] array) {
     int n = array.length;

     for (int i = 1; i < n; i++) {
         int key = array[i]; // 目前要插入到已排序部分的值
         int j = i - 1;      // 已排序部分的最後一個索引，從這裡開始往前比較

         // 只要前面的元素比 key 大，就往後挪一格，為 key 騰出插入位置
         while (j >= 0 && array[j] > key) {
             array[j + 1] = array[j];
             j--;
         }

         // 迴圈結束後，j + 1 就是 key 應該插入的正確位置
         array[j + 1] = key;
     }
}
```


9. 費氏數列：每一項都是前兩項相加的總和
*   遞迴版，時間複雜度 O(2^n)
```java
public class Fibonacci {
    // 思考模式：「往回問」，直到問到已知起點為止
    public static int fibRecursive(int n) { // n表示第幾個數字        
        // 數學的起點 (Base cases)：如果是第 0 或第 1 項，不用算，直接給答案
        if (n == 0) return 0;
        if (n == 1) return 1;
        
        // 數學規則：這一項 = 前一項 + 前兩項
        return fibRecursive(n - 1) + fibRecursive(n - 2);
    }
}
```
*   迴圈版，時間複雜度 O(N)
```java
public class Fibonacci {
    // 思考模式：「往前走」，踏著前兩個數字算出下一個，然後往前推進
    public static int fibIterative(int n) {
        
        // 一樣先處理起點
        if (n == 0) return 0;
        if (n == 1) return 1;

        // 設定一開始的兩張底牌
        int prev = 0; // 相當於第 0 項
        int curr = 1; // 相當於第 1 項
        int next = 0; // 用來裝等一下算出來的新數字

        // 從第 2 項開始算，一路算到第 n 項
        for (int i = 2; i <= n; i++) {
            
            // 步驟一：算出現成的新數字
            next = prev + curr;
            
            // 步驟二：大風吹，大家一起往右挪一格，準備算下一輪
            prev = curr;  // 把「前一項」變成舊的「前兩項」
            curr = next;  // 把「剛算出的新數字」變成新的「前一項」
        }

        // 走到第 n 項時，curr 就是我們要的最終答案
        return curr;
    }
}
```

