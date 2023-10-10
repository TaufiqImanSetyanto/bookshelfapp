const books = [];
const RENDER_EVENT = "render-book";
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("input-new-book");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, false);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
function makeBook(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = bookObject.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = bookObject.year;

  const bookAction = document.createElement("div");
  bookAction.classList.add("action");

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book-item");
  bookContainer.append(bookTitle, bookAuthor, bookYear, bookAction);
  bookContainer.setAttribute("id", `todo-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("belum-selesai");
    undoButton.innerText = "Belum selesai dibaca";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("hapus");
    trashButton.innerText = "Hapus";

    trashButton.addEventListener("click", function () {
      if (confirm("Yakin mau hapus buku?")) {
        removeBook(bookObject.id);
      }
    });

    bookAction.append(undoButton, trashButton);
  } else {
    const doneButton = document.createElement("button");
    doneButton.classList.add("selesai");
    doneButton.innerText = "Selesai dibaca";

    doneButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });
    const trashButton = document.createElement("button");
    trashButton.classList.add("hapus");
    trashButton.innerText = "Hapus";

    trashButton.addEventListener("click", function () {
      if (confirm("Yakin mau hapus buku?")) {
        removeBook(bookObject.id);
      }
    });

    bookAction.append(doneButton, trashButton);
  }

  return bookContainer;
}
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("uncompleteBookshelf");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelf");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else completedBookList.append(bookElement);
  }
});
function saveData() {
  if (isStorageExist()) {
    const setBookData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, setBookData);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function loadDataFromStorage() {
  const getBookData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(getBookData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
