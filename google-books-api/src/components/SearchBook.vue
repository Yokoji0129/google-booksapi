<script setup>
import axios from "axios";
import { ref } from "vue";

const searchWord = ref(""); // ユーザーの検索語
const books = ref([]); // 本の情報を入れる配列
const bookExplanations = ref([]); // 本の説明を配列で管理
const bookExplanationInOut = ref(false); // 本の説明表示を管理
const savedBooks = ref([]); // 検索語格納(検索履歴)

// 本の検索メソッド
const searchBooks = () => {
  axios
    .get("https://www.googleapis.com/books/v1/volumes", {
      params: {
        q: searchWord.value,
        maxResults: 1, // 本の表示数
      },
    })
    .then((response) => {
      books.value = response.data.items.map((item) => ({
        //画像
        thumbnail: item.volumeInfo.imageLinks.thumbnail,
        //本のタイトル
        title: item.volumeInfo.title,
        //本の著者
        authors: item.volumeInfo.authors,
        //本の出版日
        publishedDate: item.volumeInfo.publishedDate,
        //本の説明
        description: item.volumeInfo.description,
        //本のページ数
        pageCount: item.volumeInfo.pageCount,
      }));

      // 検索結果が変更されたら、説明を初期化
      bookExplanations.value = Array(books.value.length);

      // 検索語を保存
      if (searchWord.value) {
        savedBooks.value.unshift(searchWord.value); // 検索語を先頭に追加
        localStorage.setItem("savedBooks", JSON.stringify(savedBooks.value));
        searchWord.value = ""; // 検索ボタン二度押し防止
      }
    })
    .catch((error) => {
      window.alert("文字を入力してください:", error);
    });
};

//本の説明メソッド
const toggleDescription = (index) => {
  // クリックされた本の説明の表示・非表示を切り替え
  bookExplanationInOut.value = !bookExplanationInOut.value;

  if (bookExplanationInOut.value) {
    // 詳細を表示する場合、クリックされた本の説明をセット
    bookExplanations.value[index] = books.value[index].description;
  } else {
    // 非表示にする場合、全ての本の説明をクリア
    bookExplanations.value = Array(books.value.length);
  }
};
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
    <h1 class="book-attention" v-if="books < 1">本を検索してください</h1>
    <ul>
      <li class="container" v-for="(book, i) in books" :key="i">
        <div class="text">
          <p class="title">{{ book.title }}</p>
          <p v-if="book.authors">著者: {{ book.authors.join(", ") }}</p>
          <p v-if="book.publishedDate">出版日: {{ book.publishedDate }}</p>
          <p v-if="book.pageCount">ページ: {{ book.pageCount }}</p>
          <button class="btn" @click="toggleDescription(i)">本の説明</button>
          <p
            class="explanation"
            v-if="bookExplanationInOut && bookExplanations[i]"
          >
            {{ bookExplanations[i] }}
          </p>
        </div>
        <div class="image">
          <img :src="book.thumbnail" />
        </div>
      </li>
    </ul>
  </main>
  <!-- 検索履歴の表示 -->
  <ul>
    <li v-for="(historyItem, i) in searchHistory" :key="i">
      {{ historyItem }}
    </li>
  </ul>
</template>

<style scoped>

</style>