import "./App.css";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { async } from "@firebase/util";

function App() {
  const colRef = collection(db, "books");

  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const pagesInput = document.getElementById("pages");
  const readInput = document.getElementById("read");

  const [books, setBooks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newPages, setNewPages] = useState(0);
  const [newRead, setNewRead] = useState(false);

  const getBooks = async () => {
    const data = await getDocs(colRef);
    setBooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getBooks();
  }, []);

  const createBook = async () => {
    await addDoc(colRef, {
      title: newTitle,
      author: newAuthor,
      pages: Number(newPages),
      read: Boolean(newRead),
    });
    getBooks();
    setNewTitle("");
    setNewAuthor("");
    setNewPages("");
    titleInput.value = " ";
    authorInput.value = " ";
    pagesInput.value = " ";
    readInput.checked = false;
    setNewRead(false);
  };

  const deleteBook = async (id) => {
    const book = doc(db, "books", id);
    await deleteDoc(book);
    getBooks();
  };

  const updateBook = async (id, read) => {
    const book = doc(db, "books", id);
    const newFields = { read: !read };
    await updateDoc(book, newFields);
    getBooks();
  };

  return (
    <div className="container">
      <h1 className="header">My Library</h1>

      <div className="create_book">
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="string"
          id="title"
          placeholder="Title"
          onChange={(event) => {
            setNewTitle(event.target.value);
          }}
          required
        />
        <br />
        <label htmlFor="author">Author:</label>
        <br />
        <input
          type="text"
          id="author"
          placeholder="Author"
          onChange={(event) => {
            setNewAuthor(event.target.value);
          }}
          required
        />
        <br />
        <label htmlFor="pages">Pages:</label>
        <br />
        <input
          type="text"
          id="pages"
          placeholder="Number Of Pages"
          onChange={(event) => {
            setNewPages(event.target.value);
          }}
          required
        />
        <br />
        <label htmlFor="read">Read:</label>
        <input
          type="checkbox"
          id="read"
          onChange={(event) => {
            setNewRead(event.target.value);
          }}
        ></input>
        <br />
        <button id="create_book" onClick={createBook}>Create Book</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Pages</th>
            <th>Read</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            return (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.pages}</td>
                <td>{book.read ? "Yes" : "No"}</td>
                <td>
                  <button
                  id="delete_button"
                    onClick={() => {
                      deleteBook(book.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                  id="change_button"
                    onClick={() => {
                      updateBook(book.id, book.read);
                    }}
                  >
                    Change read status
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
