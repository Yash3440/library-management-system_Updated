const apiUrl = 'http://localhost:5000/api';

// Function to fetch and display books
function fetchBooks() {
  console.log('Fetching books...'); // Debug log
  fetch(`${apiUrl}/books`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const booksList = document.getElementById('books-list');
      booksList.innerHTML = '';
      data.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.author}`;
        booksList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching books:', error));
}

// Function to handle login
function login() {
  console.log('Logging in...'); // Debug log
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Login successful:', data);
    })
    .catch(error => console.error('Error logging in:', error));
}
