/* eslint-disable one-var */
/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid');
const allBooks = require('./books');

/* -----------Handler untuk menambahkan buku ---------------*/
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage } =
    request.payload;

  let finished, reading;
  if (readPage < pageCount) {
    finished = false;
    reading = true;
  } else {
    finished = true;
    reading = false;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  allBooks.push(newBook);

  const isSuccess = allBooks.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

/* -----------Handler untuk mendapatkan informasi semua buku yang terdaftar---------------*/
const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books: allBooks.map((el) => ({
      id: el.id,
      name: el.name,
      publisher: el.publisher,
    })),
  },
});

/* -----------Handler untuk mendapatkan informasi buku berdasarkan ID ---------------*/
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = allBooks.filter((el) => el.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// /* -----------Handler untuk mengubah informasi buku berdasarkan ID ---------------*/
const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  // payload
  const { name, year, author, summary, publisher, pageCount, readPage } =
    request.payload;

  let finished, reading;
  if (readPage < pageCount) {
    finished = false;
    reading = true;
  } else {
    finished = true;
    reading = false;
  }

  const updatedAt = new Date().toISOString();
  const index = allBooks.findIndex((el) => el.id === bookId);
  if (index !== -1) {
    allBooks[index] = {
      ...allBooks[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// /* -----------Handler untuk menghapus buku berdasarkan ID dalam daftar buku ---------------*/
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = allBooks.findIndex((el) => el.id === bookId);

  if (index !== -1) {
    allBooks.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
