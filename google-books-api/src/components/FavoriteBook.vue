<script setup>
import { onMounted } from "vue";
import booksSave from "../store/index";

// 分割代入で関数定義
const {
  savedBooks,
  bookExplanationInOut,
  bookExplanations,
  toggleDescriptionFavorite,
} = booksSave();

// アプリケーション起動時にローカルストレージから検索履歴を読み込む
onMounted(() => {
  // ローカルストレージから検索履歴を読み込み
  const savedBooksFromLocalStorage = JSON.parse(
    localStorage.getItem("savedBooks")
  );

  // 読み込んだ検索履歴をコンポーネントのデータにセット
  savedBooks.value = savedBooksFromLocalStorage;
});
</script>

<template>
  <header id="top">
    <nav>
      <h2>お気に入り一覧({{ savedBooks.length }}冊)</h2>
      <ul>
        <li><router-link to="/">書籍検索</router-link></li>
        <li><router-link to="/favorite">お気に入り</router-link></li>
        <li><router-link to="/history">検索履歴</router-link></li>
        <router-view />
      </ul>
    </nav>
  </header>

  <main>
    <!--お気に入り本がないときに表示-->
    <h1 class="book-attention" v-if="savedBooks.length === 0">
      お気に入り本はありません
    </h1>
    <ul>
      <li class="container" v-for="(book, i) in savedBooks" :key="i">
        <div class="text">
          <p class="title">{{ book.title }}</p>
          <p v-if="book.authors">著者: {{ book.authors.join(", ") }}</p>
          <p v-if="book.publishedDate">出版日: {{ book.publishedDate }}</p>
          <p v-if="book.pageCount">ページ: {{ book.pageCount }}</p>
          <!--本の説明-->
          <button class="btn" @click="toggleDescriptionFavorite(i)">本の説明</button>
          <button class="btn-favorite-out">お気に入りから削除</button>
          <p
            class="explanation"
            v-if="bookExplanationInOut && bookExplanations[i]"
          >
            {{ book.description }}
          </p>
        </div>
        <!--本の画像-->
        <div class="image">
          <img :src="book.thumbnail" />
        </div>
      </li>
    </ul>
  </main>
</template>