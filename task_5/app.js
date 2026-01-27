// JSON data structure for books (as a JSON string)
let dataStr = `
{
    "books": [
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "year": 1925,
            "genre": "Fiction"
        },
        {
            "title": "To Kill a Mockingbird",
            "author": "Harper Lee",
            "year": 1960,
            "genre": "Fiction"
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "year": 1949,
            "genre": "Dystopian Fiction"
        }
    ]
}
`;

let data = JSON.parse(dataStr);

// Display feedback message
function showFeedback(message, isError = false) {
    const feedbackEl = document.getElementById('feedback');
    if (!feedbackEl) return;

    feedbackEl.className = `mb-4 border p-4 ${isError ? 'border-red-700/80 bg-red-900/20 text-app-text' : 'border-app-border bg-app-surface text-app-text'}`;
    feedbackEl.textContent = message;

    // Clear feedback after 5 seconds
    setTimeout(() => {
        feedbackEl.textContent = '';
        feedbackEl.className = 'mb-6';
    }, 5000);
}

// Validate book data
function validateBook(title, author, year, genre) {
    const errors = [];

    if (!title || title.trim() === '') errors.push('Title cannot be blank');
    if (!author || author.trim() === '') errors.push('Author cannot be blank');
    if (!genre || genre.trim() === '') errors.push('Genre cannot be blank');
    if (!year || year === '') errors.push('Year cannot be blank');
    else if (!Number.isInteger(Number(year)) || Number(year) < 0 || Number(year) > 3000)
        errors.push('Year must be a valid number between 0 and 3000');

    return errors;
}

// Render books table from JSON data
function renderTable() {
    const tbody = document.getElementById('booksTableBody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    // Add rows for each book
    data.books.forEach(book => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-white/5';

        row.innerHTML = `
            <td class="px-4 py-3 text-app-text">${escapeHtml(book.title)}</td>
            <td class="px-4 py-3 text-app-text">${escapeHtml(book.author)}</td>
            <td class="px-4 py-3 text-app-text">${book.year}</td>
            <td class="px-4 py-3 text-app-text">${escapeHtml(book.genre)}</td>
        `;

        tbody.appendChild(row);
    });

    // Show message if no books
    if (data.books.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="4" class="px-4 py-8 text-center text-app-muted">No books in the list</td>';
        tbody.appendChild(row);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Find book by title (case-insensitive)
function findBookByTitle(title) {
    return data.books.find(book =>
        book.title.toLowerCase().trim() === title.toLowerCase().trim()
    );
}

// Update book handler
function handleUpdate(event) {
    event.preventDefault();

    const title = document.getElementById('updateTitle').value.trim();
    const author = document.getElementById('updateAuthor').value.trim();
    const year = document.getElementById('updateYear').value.trim();
    const genre = document.getElementById('updateGenre').value.trim();

    // Validate inputs
    const errors = validateBook(title, author, year, genre);
    if (errors.length > 0) {
        showFeedback('Validation errors: ' + errors.join(', '), true);
        return;
    }

    // Find book to update
    const book = findBookByTitle(title);
    if (!book) {
        showFeedback(`Book with title "${title}" not found`, true);
        return;
    }

    // Update book data
    book.author = author;
    book.year = Number.parseInt(year, 10);
    book.genre = genre;

    // Update the JSON string as well
    dataStr = JSON.stringify(data);

    // Re-render table
    renderTable();

    // Show success message
    showFeedback(`Book "${title}" updated successfully`, false);

    // Reset form
    document.getElementById('updateForm').reset();
}

// Remove book handler
function handleRemove(event) {
    event.preventDefault();

    const title = document.getElementById('removeTitle').value.trim();

    // Validate title
    if (!title || title === '') {
        showFeedback('Title cannot be blank', true);
        return;
    }

    // Find and remove book
    const initialLength = data.books.length;
    data.books = data.books.filter(book =>
        book.title.toLowerCase().trim() !== title.toLowerCase().trim()
    );

    // Update the JSON string as well
    dataStr = JSON.stringify(data);

    if (data.books.length === initialLength) {
        showFeedback(`Book with title "${title}" not found`, true);
        return;
    }

    // Re-render table
    renderTable();

    // Show success message
    showFeedback(`Book "${title}" removed successfully`, false);

    // Reset form
    document.getElementById('removeForm').reset();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Render initial table
    renderTable();

    // Attach event listeners
    document.getElementById('updateForm').addEventListener('submit', handleUpdate);
    document.getElementById('removeForm').addEventListener('submit', handleRemove);
});

