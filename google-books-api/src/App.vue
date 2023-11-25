<script setup>
import axios from "axios";
import { ref } from "vue";

const searchWord = ref("");
const books = ref([]);
const bookExplanations = ref([]); // 本の説明を配列で管理
const bookExplanationInOut = ref(false); // 本の説明表示を管理

const searchBooks = () => {
  axios
    .get("https://www.googleapis.com/books/v1/volumes", {
      params: {
        q: searchWord.value,
        maxResults: 5,
      },
    })
    .then((response) => {
      books.value = response.data.items.map((item) => ({
        thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        pageCount: item.volumeInfo.pageCount,
      }));

      // 検索結果が変更されたら、説明を初期化
      bookExplanations.value = Array(books.value.length).fill("");
    })
    .catch((error) => {
      window.alert("文字を入力してください:", error);
    });
};

const toggleDescription = (index) => {
  // クリックされた本の説明の表示・非表示を切り替え
  bookExplanationInOut.value = !bookExplanationInOut.value;

  if (bookExplanationInOut.value) {
    // 詳細を表示する場合、クリックされた本の説明をセット
    bookExplanations.value[index] = books.value[index].description;
  } else {
    // 非表示にする場合、全ての本の説明をクリア
    bookExplanations.value = Array(books.value.length).fill("");
  }
};
</script>

<template>
  <main>
    <div class="cp_iptxt">
      <label class="ef">
        <input v-model="searchWord" type="text" placeholder="本タイトル検索" />
        <button class="title_btn" @click="searchBooks()">検索</button>
      </label>
    </div>
    <ul>
      <li class="container" v-for="(book, i) in books" :key="i">
        <div class="text">
          <p class="title">{{ book.title }}</p>
          <p v-if="book.authors">著者: {{ book.authors.join(", ") }}</p>
          <p v-if="book.publishedDate">出版日: {{ book.publishedDate }}</p>
          <p v-if="book.pageCount">ページ: {{ book.pageCount }}</p>
          <button class="btn" @click="toggleDescription(i)">本の説明</button>
          <p v-if="bookExplanationInOut && bookExplanations[i]">
            {{ bookExplanations[i] }}
          </p>
        </div>
        <div class="image">
          <img :src="book.thumbnail" />
        </div>
      </li>
    </ul>
  </main>
</template>


<style>

</style>
