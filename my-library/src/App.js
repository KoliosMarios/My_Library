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
  //make a reference to the books collection
  const colRef = collection(db, "books");

  //getting the inputs so we can empty them after submitting the new book
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const pagesInput = document.getElementById("pages");
  const readInput = document.getElementById("read");

  // setting the state for the books array
  const [books, setBooks] = useState([]);
  //setting the states for the details of every book
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newPages, setNewPages] = useState(0);
  const [newRead, setNewRead] = useState(false);

  //function for getting and renewing the books array
  const getBooks = async () => {
    const data = await getDocs(colRef);
    setBooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getBooks();
  }, []);

  const createBook = async () => {
    //getting the data from the input and informing the states
    await addDoc(colRef, {
      title: newTitle,
      author: newAuthor,
      pages: Number(newPages),
      read: Boolean(newRead),
    });
    getBooks();

    //empty the states after we add the new book and setting read property to false
    setNewTitle("");
    setNewAuthor("");
    setNewPages("");
    setNewRead(false);

    //empty the inputs and unchecking the checkbox
    titleInput.value = " ";
    authorInput.value = " ";
    pagesInput.value = " ";
    readInput.checked = false;
  };

  //function to delete a book by using the deleteDoc from firebase
  const deleteBook = async (id) => {
    const book = doc(db, "books", id);
    await deleteDoc(book);
    getBooks();
  };

  //function to update the read status of a book by using the updateDoc from firebase
  const updateBook = async (id, read) => {
    const book = doc(db, "books", id);
    //we check if the read property is true or false and then change it to the opposite
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
        <button id="create_book" onClick={createBook}>
          Create Book
        </button>
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
              // we present all the books in the array in a table
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.pages}</td>
                {/* if the read property is true we write yes and if it's false we write no */}
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
