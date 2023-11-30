import { ref } from 'vue';
import axios from 'axios';

export default function () {
    const searchWord = ref(''); // ユーザーの検索語
    const books = ref([]); // 本の情報を入れる配列
    const bookExplanations = ref([]); // 本の説明を配列で管理
    const bookExplanationInOut = ref([]); // 各本の説明表示を管理
    const savedBooksWord = ref([]); // 検索語格納(検索履歴)
    const savedDays = ref([]); // 検索したときの日時を格納
    const savedBooks = ref([]) // お気に入りの本のデータを格納
    const day = new Date();

    // 本の検索メソッド
    const searchBooks = () => {
        axios
            .get("https://www.googleapis.com/books/v1/volumes", {
                params: {
                    q: searchWord.value,
                    maxResults: 5, // 本の表示数
                },
            })
            .then((response) => {
                books.value = response.data.items.map((item) => ({
                    thumbnail: item.volumeInfo.imageLinks.thumbnail,
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors,
                    publishedDate: item.volumeInfo.publishedDate,
                    description: item.volumeInfo.description,
                    pageCount: item.volumeInfo.pageCount,
                }));

                // 検索結果が変更されたら、説明を初期化
                bookExplanations.value = Array(books.value.length);


                // 検索語が空の時以外の時に保存
                if (searchWord.value.trim()) {
                    // 既存のデータを取得
                    const existingBooksWord = JSON.parse(localStorage.getItem("savedBooksWord")) || [];
                    const existingDays = JSON.parse(localStorage.getItem("savedDays")) || [];

                    // 新しいデータを追加
                    existingBooksWord.unshift(searchWord.value);
                    existingDays.unshift(day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getHours() + ':' + day.getMinutes());

                    // ローカルストレージに保存
                    localStorage.setItem("savedBooksWord", JSON.stringify(existingBooksWord));
                    localStorage.setItem("savedDays", JSON.stringify(existingDays));

                    // 検索時に検索ボックスを空にする
                    searchWord.value = '';
                }
            })
            .catch((error) => {
                alert(error);
            });
    }


    // お気に入り追加メソッド
    const addFavorite = (index) => {
        const selectedBook = books.value[index];

        // 既存のデータを取得
        const existingBooks = JSON.parse(localStorage.getItem("savedBooks")) || [];
        savedBooks.value = existingBooks;

        // 同じ本が既にお気に入りに存在するか本のタイトルで比較して確認
        const isAlreadyFavorite = savedBooks.value.some((book) => {
            return book.title === selectedBook.title;
        });

        // 本が入っていない場合追加
        if (!isAlreadyFavorite) {
            // 本の説明を含めて保存
            savedBooks.value.unshift(selectedBook);
            localStorage.setItem("savedBooks", JSON.stringify(savedBooks.value));
        }
        // 同じ本を追加しようとした場合
        else {
            alert("すでにお気に入りに追加されています。");
        }
    }

    // 本の説明メソッド(本検索ページ部分)
    const toggleDescription = (index) => {
        bookExplanationInOut[index] = !bookExplanationInOut[index];

        if (bookExplanationInOut[index]) {
            bookExplanations.value[index] = books.value[index].description;
        } else {
            bookExplanations.value[index] = '';
        }
    };

    // 本の説明メソッド(お気に入り一覧ページ部分)
    const toggleDescriptionFavorite = (index) => {
        bookExplanationInOut[index] = !bookExplanationInOut[index];

        if (bookExplanationInOut[index]) {
            bookExplanations.value[index] = savedBooks.value[index].description;
        } else {
            bookExplanations.value[index] = '';
        }
    };

    return {
        searchWord,
        books,
        bookExplanationInOut,
        bookExplanations,
        savedBooksWord,
        savedDays,
        savedBooks,
        searchBooks,
        toggleDescription,
        toggleDescriptionFavorite,
        addFavorite,
    };
}
