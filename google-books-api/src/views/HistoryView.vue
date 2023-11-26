<script setup>
import { ref, onMounted } from "vue";
const savedBooks = ref([]);// 検索した文字の中身

// 履歴を一つずつ消すメソッド
const removeBook = (i) => {
  savedBooks.value.splice(i, 1);
  localStorage.setItem("savedBooks", JSON.stringify(savedBooks.value));
};

// 履歴全部消すメソッド
const allRemoveBook = (i) => {
  savedBooks.value.splice(i);
  localStorage.setItem("savedBooks", JSON.stringify(savedBooks.value));
};

// アプリケーション起動時にローカルストレージから検索履歴を読み込む
onMounted(() => {
  savedBooks.value = JSON.parse(localStorage.getItem("savedBooks"));
  // 検索語履歴を上から新しい順にする
  savedBooks.value.reverse();
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
    <button @click="allRemoveBook(i)">履歴を全て消す</button>
    <ul class="ul">
      <li v-for="(bookName, i) in savedBooks" :key="i">
        <span>
          <button class="btn_delete" @click="removeBook(i)">削除</button>
        </span>
        {{ bookName }}
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

.ul li,
ol li {
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
}
</style>