<template>
  <header id="top">
    <nav>
      <h2>書籍検索フォーム</h2>
      <ul>
        <li><router-link to="/">書籍検索</router-link></li>
        <li><router-link to="/favorite">お気に入り</router-link></li>
        <li><router-link to="/search">検索履歴</router-link></li>
        <router-view />
      </ul>
    </nav>
  </header>
  <main>
    <div class="cp_iptxt">
      <label class="ef">
        <!--検索フォーム-->
        <input v-model="searchWord" type="text" placeholder="本タイトル検索" />
        <button class="title_btn" @click="searchBooks()">検索</button>
      </label>
    </div>
    <h1 class="bookSearch" v-if="showSearchBooks">本を検索してください</h1>
    <ul>
      <!-- 本のリスト一覧 -->
      <li class="container" v-for="book in pageBack" :key="book.title">
        <div class="text">
          <p class="title">{{ book.title }}</p>
          <p v-if="book.authors">著者: {{ book.authors.join(", ") }}</p>
          <p v-if="book.publishedDate">出版日: {{ book.publishedDate }}</p>
          <p v-if="book.pageCount">ページ: {{ book.pageCount }}</p>
          <button class="btn" @click="description()">本の説明</button>
          <!--説明ボタン押したときに本の説明を表示-->
          <div v-if="showDescription">
            <p v-if="book.description">説明: {{ book.description }}</p>
          </div>
          <button v-if="!book.saved" class="btn" @click="showBookDetails(book)">
            保存
          </button>
          <button v-else class="btn" disabled>保存済み</button>
        </div>
        <div class="image">
          <img :src="book.thumbnail" />
        </div>
      </li>
    </ul>
    <div class="page" v-if="showContent">
      <a class="page_btn" href="#top" @click="backPage()">戻る</a>
      <span class="pageNumber">{{ currentPage }} / {{ pageNext }}</span>
      <a class="page_btn" href="#top" @click="nextPage()">次へ</a>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      //本を検索されたとき消す
      showSearchBooks: true,
      //ページ数を検索されるまで隠す
      showContent: false,
      showDescription: false,
      //現在のページ
      currentPage: 1,
      //1ページの本の最大表示数
      itemsPerPage: 10,
      //検索文字
      searchWord: "",
      //本情報をリストに入れる
      books: [],
      //検索した文字の保存先
      savedBooks: JSON.parse(localStorage.getItem("savedBooks")) || [],
      //お気に入りの本保存先
      savedDetails: JSON.parse(localStorage.getItem("savedDetails")) || [],
    };
  },
  //-------------------------------------------------------------------------------------------------------------------
  computed: {
    //1ページ戻る
    pageBack() {
      //slice関数取得開始位置
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      //slice関数取得終了位置
      const endIndex = startIndex + this.itemsPerPage;

      return this.books.slice(startIndex, endIndex);
    },

    //1ページ進む
    pageNext() {
      return this.books.length / this.itemsPerPage;
    },
  },
  //---------------------------------------------------------------------------------------------------------------
  methods: {
    description(){
      this.showDescription = !this.showDescription;
    },
    //Google Books APIへのHTTPリクエスト処理
    searchBooks() {
      axios
        .get("https://www.googleapis.com/books/v1/volumes", {
          params: {
            //最大30冊分表示
            q: this.searchWord,
            maxResults: 40,
          },
        })
        .then((response) => {
          this.books = response.data.items.map((item) => ({
            //画像
            thumbnail: item.volumeInfo.imageLinks?.thumbnail,
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
        })
        //文字が入力されなかった場合エラーを出す
        .catch((error) => {
          window.alert("文字を入力してください:", error);
        });

      if (this.searchWord) {
        //検索語をローカルストレージに保存
        this.savedBooks.push(this.searchWord);
        localStorage.setItem("savedBooks", JSON.stringify(this.savedBooks));
        this.searchWord = "";
        //本を検索されたときにページ数を表示させる
        this.showContent = !this.showContent;
        this.showSearchBooks = !this.showSearchBooks;
      }
    },

    //本の詳細データ保存処理関数
    showBookDetails(book) {
      //saveDetailsにデータが入っていない場合保存
      if (
        !this.savedDetails.some((savedBook) => savedBook.title === book.title)
      ) {
        //ローカルストレージに保存する情報
        const bookDetails = {
          //画像
          thumbnail: book.thumbnail,
          //タイトル
          title: book.title,
          //本の著者
          authors: book.authors,
          //本の出版日
          publishedDate: book.publishedDate,
          //本のページ
          pageCount: book.pageCount,
        };

        //ローカルストレージに保存
        this.savedDetails.push(bookDetails);
        localStorage.setItem("savedDetails", JSON.stringify(this.savedDetails));

        //保存ボタンの表示変更
        book.saved = true;
      } else {
        //二回目以降ボタンが押されたら表示
        window.alert("すでに保存されています");
      }
    },

    //表示ページを1ページ戻す
    backPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }else{
        window.alert("これ以上戻れません")
      }
    },

    //表示ページを1ページ進める
    nextPage() {
      if (this.currentPage < this.pageNext) {
        this.currentPage++;
      }else{
        window.alert("これ以上進めません")
      }
    },
  },
};
</script>