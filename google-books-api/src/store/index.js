import { ref } from 'vue';
import axios from 'axios';

export default function () {
    const searchWord = ref(""); // ユーザーの検索語
    const books = ref([]); // 本の情報を入れる配列
    const bookExplanations = ref([]); // 本の説明を配列で管理
    const bookExplanationInOut = ref([]); // 各本の説明表示を管理
    const savedBooks = ref([]); // 検索語格納(検索履歴)
    const savedDays = ref([]); // 検索したときの日時を格納
    const day = new Date();

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
                    savedBooks.value.unshift(searchWord.value);
                    savedDays.value.unshift(day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getHours() + ':' + day.getMinutes());
                    localStorage.setItem("savedBooks", JSON.stringify(savedBooks.value));
                    localStorage.setItem("savedDays", JSON.stringify(savedDays.value));
                    searchWord.value = "";
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    // 本の説明メソッド
    const toggleDescription = (index) => {
        bookExplanationInOut[index] = !bookExplanationInOut[index];

        if (bookExplanationInOut[index]) {
            bookExplanations.value[index] = books.value[index].description;
        } else {
            bookExplanations.value[index] = "";
        }
    };

    return {
        searchWord,
        books,
        bookExplanationInOut,
        bookExplanations,
        savedBooks,
        savedDays,
        searchBooks,
        toggleDescription,
    };
}
