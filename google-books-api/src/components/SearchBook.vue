<script setup>
import booksSearch from "../store/index";

// 分割代入で関数定義
const {
  searchWord,
  books,
  bookExplanationInOut,
  bookExplanations,
  searchBooks,
  toggleDescription,
  addFavorite
} = booksSearch();
</script>

<template>
  <header id="top">
    <nav>
      <h2>書籍検索フォーム</h2>
      <ul>
        <li><router-link to="/">書籍検索</router-link></li>
        <li><router-link to="/favorite">お気に入り</router-link></li>
        <li><router-link to="/history">検索履歴</router-link></li>
        <router-view />
      </ul>
    </nav>
  </header>
  <main>
    <div class="cp_iptxt">
      <label class="ef">
        <input v-model="searchWord" type="text" placeholder="本タイトル検索" />
        <button class="title_btn" @click="searchBooks()">検索</button>
      </label>
    </div>
    <!--本が表示されていないときに表示-->
    <h1 class="book-attention" v-if="books.length === 0">
      本を検索してください
    </h1>
    <ul>
      <li class="container" v-for="(book, i) in books" :key="i">
        <div class="text">
          <p class="title">{{ book.title }}</p>
          <p v-if="book.authors">著者: {{ book.authors.join(", ") }}</p>
          <p v-if="book.publishedDate">出版日: {{ book.publishedDate }}</p>
          <p v-if="book.pageCount">ページ: {{ book.pageCount }}</p>
          <!--本の説明-->
          <button class="btn" @click="toggleDescription(i)">本の説明</button>
          <button class="btn-favorite" @click="addFavorite(i)">お気に入り保存</button>
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