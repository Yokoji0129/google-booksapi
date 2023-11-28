<script setup>
import { onMounted } from "vue";
import booksSave from "../store/index";

// 分割代入で関数定義
const { savedBooks, savedDays } = booksSave();

// 履歴を一つずつ消すメソッド
const removeBook = (i) => {
  savedBooks.value.splice(i, 1);
  savedDays.value.splice(i, 1);
  localStorage.setItem("savedBooks", JSON.stringify(savedBooks.value));
  localStorage.setItem("savedDays", JSON.stringify(savedDays.value));
};

// 履歴全部消すメソッド
const allRemoveBook = () => {
  const confirmation = window.confirm("本当に全て削除しますか？");
  if (confirmation) {
    savedBooks.value = [];
    savedDays.value = [];
    localStorage.setItem("savedBooks", JSON.stringify(savedBooks.value));
    localStorage.setItem("savedDays", JSON.stringify(savedDays.value));
  }
};

// アプリケーション起動時にローカルストレージから検索履歴を読み込む
onMounted(() => {
  savedBooks.value = JSON.parse(localStorage.getItem("savedBooks"));
  savedDays.value = JSON.parse(localStorage.getItem("savedDays"));
});
</script>

<template>
  <header id="top">
    <nav>
      <h2>検索履歴一覧</h2>
      <ul>
        <li><router-link to="/">書籍検索</router-link></li>
        <li><router-link to="/favorite">お気に入り</router-link></li>
        <li><router-link to="/history">検索履歴</router-link></li>
        <router-view />
      </ul>
    </nav>
  </header>

  <main>
    <h1>検索履歴一覧</h1>
    <button
      class="alldelete"
      @click="allRemoveBook()"
      v-if="savedBooks.length > 0"
    >
      履歴を全て消す
    </button>
    <ul class="ul">
      <li v-for="(bookName, i) in savedBooks" :key="i">
        <button class="btn_delete" @click="removeBook(i)">削除</button>
        {{ savedDays[i] }} --- {{ bookName }}
      </li>
    </ul>
  </main>
</template>

<style scoped>
h1 {
  border-bottom: 2px solid rgb(163, 101, 8);
  color: #ffffff;
}
.ul {
  padding: 0;
}

.ul li {
  color: #404040;
  border-left: solid 6px rgb(163, 101, 8);
  background-color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.5;
  padding: 8px;
  list-style-type: none;
  font-weight: bold;
  box-shadow: 1px 1px 1px gray;
  border-radius: 0 10px 10px 0;
  width: 100%; /* 横幅を100%に設定 */
  box-sizing: border-box; /* ボーダーボックスモデルを使用して幅の計算を行う */
}

.btn_delete {
  margin: 0 10px 0 0;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: rgb(229, 89, 50);
  padding: 5px 10px;
  box-shadow: 2px 2px 4px gray;
  cursor: pointer;
}

.btn_delete:hover {
  background-color: rgb(163, 73, 48);
}

.alldelete {
  border: none;
  padding: 5px 15px;
  background-color: rgb(30, 162, 239);
}

.alldelete:hover {
  background-color: rgb(29, 122, 176);
}
</style>