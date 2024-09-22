const apiUrl = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let isAdmin = false;

// DOM Elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const booksSection = document.getElementById('books-section');
const addBookSection = document.getElementById('add-book-section');
const navLogin = document.getElementById('nav-login');
const navRegister = document.getElementById('nav-register');
const navLogout = document.getElementById('nav-logout');

// Event Listeners
document.getElementById('login-form').addEventListener('submit', login);
document.getElementById('register-form').addEventListener('submit', register);
document.getElementById('fetch-books').addEventListener('click', fetchBooks);
document.getElementById('add-book').addEventListener('click', () => {
    addBookSection.style.display = 'block';
    booksSection.style.display = 'none';
});
document.getElementById('add-book-form').addEventListener('submit', addBook);
navLogin.addEventListener('click', () => showSection(loginSection));
navRegister.addEventListener('click', () => showSection(registerSection));
navLogout.addEventListener('click', logout);

function showSection(section) {
    [loginSection, registerSection, booksSection, addBookSection].forEach(s => s.style.display = 'none');
    section.style.display = 'block';
}

async function login(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
            token = data.token;
            isAdmin = data.user.role === 'admin';
            localStorage.setItem('token', token);
            updateUIAfterAuth();
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred during login');
    }
}

async function register(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;
    const fullName = document.getElementById('register-fullname').value;

    try {
        const response = await fetch(`${apiUrl}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email, fullName })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful. Please login.');
            showSection(loginSection);
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error registering:', error);
        alert('An error occurred during registration');
    }
}

function logout() {
    token = null;
    isAdmin = false;
    localStorage.removeItem('token');
    updateUIAfterAuth();
}

function updateUIAfterAuth() {
    if (token) {
        navLogin.style.display = 'none';
        navRegister.style.display = 'none';
        navLogout.style.display = 'inline';
        showSection(booksSection);
        fetchBooks();
    } else {
        navLogin.style.display = 'inline';
        navRegister.style.display = 'inline';
        navLogout.style.display = 'none';
        showSection(loginSection);
    }
}

async function fetchBooks() {
    try {
        const response = await fetch(`${apiUrl}/books`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const books = await response.json();
            displayBooks(books);
        } else {
            throw new Error('Failed to fetch books');
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        alert('Failed to fetch books. Please try again.');
    }
}

function displayBooks(books) {
    const booksList = document.getElementById('books-list');
    booksList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.author}`;
        if (isAdmin) {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteBook(book._id);
            li.appendChild(deleteBtn);
        }
        booksList.appendChild(li);
    });
}

async function addBook(e) {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const category = document.getElementById('book-category').value;

    try {
        const response = await fetch(`${apiUrl}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, author, category })
        });
        if (response.ok) {
            alert('Book added successfully');
            showSection(booksSection);
            fetchBooks();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        alert('An error occurred while adding the book');
    }
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
        const response = await fetch(`${apiUrl}/books/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            alert('Book deleted successfully');
            fetchBooks();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to delete book');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('An error occurred while deleting the book');
    }
}

// Check authentication status on page load
updateUIAfterAuth();