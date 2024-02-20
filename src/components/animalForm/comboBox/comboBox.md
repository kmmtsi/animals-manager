## 使い方
form送信時はformDataではなくstateから値を取得する
一意のnameプロパティを持つアイテムにのみ使用可能

## 主な変数とその役割
### originalItems
全アイテム
suggestItemsの元になるアイテム

### selectedItems
選択済みアイテム
selectedItemsに入れる条件
- 同じアイテムが既にselectedItemsに含まれていない
- ngItemsに含まれていない
- maxSelectに達していない

### suggestItems
サジェストされるアイテム
suggestItemsに入れる条件
- 全アイテムのうち
- selectedItemsに含まれていない
- ngItemsに含まれていない
- inputによるフィルタリングを通過

### ngItems
selectedItemsに含めてはいけないアイテム

## 主なコンポーネントの挙動
### 初期表示ボタン
btnTextに与えた文字列をもつ
新規作成の余地ないときには存在しない
クリックでdialog開く
Enterでdialog開く

### dialog
dialog閉じるボタンでdialog閉じる
dialog背景押したらdialog閉じる
escでdialog閉じる
dialog開くと内部のinputに自動フォーカス
選択完了後dialogは開き続ける
選択完了後maxSelectに到達すると自動でdialogが閉じる

### input
inputが空の時Enter押しても何も起こらない
input内容が選択済みの時Enter押しても何も起こらない
inputにfocusがあり、input入力済みで新規作成が可能なときにEnter押すと、新規作成されinputが空になる

### input用ボタン
activeである条件
- inputに値が入力されている
- inputの値が未だsuggestionsに含まれていない
- inputの値がselectedItemsに追加してよい値である
その他の場合disabled

### selectedItems (UI)
- （dialog用）選択済みという文字は選択済みのアイテムが1つ以上存在する時だけ表示
- selectedItemsは選択済みのアイテムが1つ以上存在する時だけ表示

### selectedItem
- ✕ボタンをクリックで削除可能
- ✕ボタンにfocus＋Enterで削除可能

### suggestions (UI)

### suggestion
- suggestion間をtabで移動し、Enterで新規アイテムを作成できる
- suggestion間をtabで移動し、EnterでsuggestItemを選択できる
- 選択済みのアイテムと同名のものを含まない
- suggestionクリックしたとき必ず新規作成を行う

### コンビネーションの挙動

## スタイリング
長いテキストをもったアイテムがあるときのスマホで画面幅突き抜け防止


## formがEnterで送信される条件検証や分かっていること
ComboBoxのinputはimplicit submissionを防ぐためのinputにはカウントされない（formにはnameしか存在しないことになっている（恐らくdialogのせい））
基本全てnameは入力済みで調査
結果的にinputに対してpreventDefault()で解決できた
---
恐らくnameの状態は関係ない
- name未入力、nameのinputにフォーカス
- name入力済み、nameのinputにフォーカス
---
inputにフォーカスがある際に送信される
- ✕ motherのinputにフォーカス、mother未入力＝作成ボタンdisabled
- ◎ motherのinputにフォーカス、mother入力済み（新規アイテム）＝作成ボタンactive
- ✕ childrenのinputにフォーカス、children未入力＝作成ボタンdisabled
- ✕ childrenのinputにフォーカス、children入力済み（新規アイテム）＝作成ボタンactive
- ✕ childrenのinputにフォーカス、children入力済み（既存アイテム）＝作成ボタンdisabled
---
作成ボタンにフォーカスがある際には送信は行われない
- ◎ motherの作成ボタンにフォーカス、mother入力済み（新規アイテム）＝作成ボタンactive
- ◎ childrenの作成ボタンにフォーカス、children入力済み（新規アイテム）＝作成ボタンactive
---
suggestionにフォーカスがある際には送信は行われない
- ◎ motherのsuggestionにフォーカス、mother未入力＝作成ボタンdisabled
- ◎ childrenのsuggestionにフォーカス、children未入力＝作成ボタンdisabled、children未選択
- ◎ childrenのsuggestionにフォーカス、children未入力＝作成ボタンdisabled、children選択済み