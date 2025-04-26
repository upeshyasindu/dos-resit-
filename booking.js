let cart = [];
const movieOptions = {
    action: [
        { title: "Mission X", price: 1000 },
        { title: "War Zone", price: 1100 },
        { title: "Bullet Rush", price: 1050 },
    ],
    scifi: [
        { title: "Star Voyage", price: 1200 },
        { title: "Future Shock", price: 1250 },
        { title: "Galaxy Run", price: 1190 },
    ],
    romance: [
        { title: "Love Line", price: 1500 },
        { title: "Forever Us", price: 1400 },
    ],
    fantasy: [
        { title: "Dragon Realms", price: 1300 },
        { title: "Wizards World", price: 1350 },
    ],
    family: [
        { title: "Happy Family", price: 1800 },
        { title: "Fun Time", price: 1700 },
    ]
};
const itemsPerPage = 6;
  let currentPage = 1;

  const movieGrid = document.getElementById('movieGrid');
  const allItems = Array.from(movieGrid.children);
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  function showPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    allItems.forEach((item, index) => {
      item.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) ? 'block' : 'none';
    });
    document.getElementById('pageIndicator').textContent = `Page ${page}`;
  }

  function changePage(delta) {
    showPage(currentPage + delta);
  }
  showPage(currentPage);

function updateMovies() {
    const type = document.getElementById("movie-type").value;
    const movieSelect = document.getElementById("movie");

    movieSelect.innerHTML = '<option value="">--Select a movie--</option>';

    if (movieOptions[type]) {
        movieOptions[type].forEach(movie => {
            const option = document.createElement("option");
            option.value = `${movie.title}|${movie.price}`;
            option.textContent = `${movie.title} - Rs. ${movie.price}`;
            movieSelect.appendChild(option);
        });
    }
}
function addToCart() {
    const movieSelect = document.getElementById('movie');
    const quantityInput = document.getElementById('quantity');
    const [movie, price] = movieSelect.value.split('|');
    const quantity = parseInt(quantityInput.value);
    const total = quantity * parseFloat(price);

    const existingItem = cart.find(item => item.movie === movie);
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total += total;
    } else {
        cart.push({ movie, quantity, price: parseFloat(price), total });
    }

    updateCartTable();
}

function updateCartTable() {
    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');
    cartBody.innerHTML = '';

    let grandTotal = 0;
    cart.forEach(item => {
        grandTotal += item.total;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.movie}</td>
            <td>${item.quantity}</td>
            <td>Rs${item.price.toFixed(2)}</td>
            <td>Rs${item.total.toFixed(2)}</td>
        `;
        cartBody.appendChild(row);
    });

    cartTotal.textContent = `Rs${grandTotal.toFixed(2)}`;
}

function saveFavorite() {
    localStorage.setItem('favoriteBooking', JSON.stringify(cart));
    alert('Booking saved as favorite!');
}

function applyFavorite() {
    const favorite = localStorage.getItem('favoriteBooking');
    if (favorite) {
        cart = JSON.parse(favorite);
        updateCartTable();
    } else {
        alert('No favorite booking found.');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Please add tickets to your cart.');
        return;
    }
    document.getElementById('booking').classList.add('hidden');
    document.getElementById('checkout').classList.remove('hidden');
}

function completePurchase() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const seat = document.getElementById('seat').value;
    const payment = document.getElementById('payment').value;

    if (!name || !email || !seat || !payment) {
        alert('Please fill in all fields.');
        return;
    }

    const bookingRef = 'STC' + Math.floor(Math.random() * 1000000);
    const details = `
        Movie: ${cart.map(item => `${item.movie} (${item.quantity} tickets)`).join(', ')}<br>
        Time: 7:00 PM<br>
        Seats: ${seat}<br>
        Booking Reference: ${bookingRef}
    `;
    
    document.getElementById('checkout').classList.add('hidden');
    document.getElementById('confirmation').classList.remove('hidden');
    document.getElementById('confirmation-details').innerHTML = details;
    cart = [];
    updateCartTable();
}
