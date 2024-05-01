document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');
    const randomBtn = document.getElementById('randomBtn');
    const resultsList = document.getElementById('results');
    const bookDetailsModal = document.getElementById('bookDetailsModal');
    const bookDetailsContent = document.getElementById('bookDetails');
    const menuLinks = document.querySelectorAll('.menu a');

    // Function to handle navigation
    function navigateToPage(event) {
        event.preventDefault();
        const page = this.getAttribute('href');
        window.location.href = page;
    }

    // Attach event listeners to navbar links for navigation
    menuLinks.forEach(link => {
        link.addEventListener('click', navigateToPage);
    });

    // Function to handle book search
    function searchBooks() {
        const query = searchInput.value.trim();
        if (query === '') {
alert('Please enter keywords to search for books.');
return;
}

const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

fetch(url)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    displayBooks(data.items);
})
.catch(error => {
    console.error('Error fetching books:', error);
    alert('Failed to fetch books. Please try again later.');
});
}

// Function to display search results
function displayBooks(books) {
resultsList.innerHTML = ''; // Clear previous results

if (books.length === 0) {
resultsList.innerHTML = '<li>No books found.</li>';
return;
}

books.forEach(book => {
const title = book.volumeInfo.title || 'Unknown Title';
const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';

const li = document.createElement('li');
const img = document.createElement('img');
img.src = thumbnail;
img.alt = 'Book Cover';
const titleElement = document.createElement('h3');
titleElement.textContent = title;
const authorsElement = document.createElement('p');
authorsElement.textContent = 'Authors: ' + authors;

li.appendChild(img);
li.appendChild(titleElement);
li.appendChild(authorsElement);

// Add event listener to show book details on click
li.addEventListener('click', function() {
    showBookDetails(book);
});

resultsList.appendChild(li);
});
}

// Function to show book details
function showBookDetails(book) {
const title = book.volumeInfo.title || 'Unknown Title';
const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
const description = book.volumeInfo.description || 'No description available.';
const pageCount = book.volumeInfo.pageCount || 'Unknown';
const categories = book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : 'Unknown';
const publishedDate = book.volumeInfo.publishedDate || 'Unknown';
const averageRating = book.volumeInfo.averageRating || 'Not rated';
const ratingsCount = book.volumeInfo.ratingsCount || 'Not rated';

const bookDetailsHTML = `
<h2>${title}</h2>
<p><strong>Authors:</strong> ${authors}</p>
<p><strong>Description:</strong> ${description}</p>
<p><strong>Page Count:</strong> ${pageCount}</p>
<p><strong>Categories:</strong> ${categories}</p>
<p><strong>Published Date:</strong> ${publishedDate}</p>
<p><strong>Average Rating:</strong> ${averageRating}</p>
<p><strong>Ratings Count:</strong> ${ratingsCount}</p>
`;

bookDetailsContent.innerHTML = bookDetailsHTML;
bookDetailsModal.style.display = 'block';

// Close modal when clicking on 'x' button
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', function() {
bookDetailsModal.style.display = 'none';
});

// Close modal when clicking outside of the modal
window.onclick = function(event) {
if (event.target == bookDetailsModal) {
    bookDetailsModal.style.display = 'none';
}
};
}

// Function to handle random book generation
function getRandomBook() {
    const randomTerms = [
        'fiction', 'nonfiction', 'mystery', 'fantasy', 'science fiction', 'history', 'romance', 'biography', 'thriller', 'self-help', 'business', 'horror', 'travel'
        // Add more terms as needed
    ];
    const randomIndex = Math.floor(Math.random() * randomTerms.length);
    const query = randomTerms[randomIndex];
    searchInput.value = query;
    searchBooks();
}

// Event listeners
searchBtn.addEventListener('click', searchBooks);
randomBtn.addEventListener('click', getRandomBook);
});
