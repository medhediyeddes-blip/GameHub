
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const accountMessage = document.getElementById("accountMessage");

function getAccounts() {
    return JSON.parse(localStorage.getItem("gamingAccounts")) || {};
}

function signUp() {
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
        accountMessage.textContent = "Please enter your email and password.";
        return;
    }

    if (!emailInput.checkValidity()) {
        accountMessage.textContent = "Please enter a valid email address.";
        return;
    }

    if (password.length < 6) {
        accountMessage.textContent = "Password must be at least 6 characters.";
        return;
    }

    const accounts = getAccounts();

    if (accounts[email]) {
        accountMessage.textContent = "This email already has an account. Try logging in.";
        return;
    }

    accounts[email] = password;
    localStorage.setItem("gamingAccounts", JSON.stringify(accounts));

    localStorage.setItem("gamingLoggedInEmail", email);
    showAccount();

    accountMessage.textContent = "";
}

function logIn() {
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const accounts = getAccounts();

    if (!email || !password) {
        accountMessage.textContent = "Please enter your email and password.";
        return;
    }

    if (accounts[email] !== password) {
        accountMessage.textContent = "Incorrect email or password.";
        return;
    }

    localStorage.setItem("gamingLoggedInEmail", email);
    showAccount();
    accountMessage.textContent = "";
}

function showAccount() {
    const email = localStorage.getItem("gamingLoggedInEmail");

    if (email) {
        document.getElementById("accountForm").classList.add("hidden");
        document.getElementById("profile").classList.remove("hidden");
        document.getElementById("profileEmail").textContent = email;
    } else {
        document.getElementById("accountForm").classList.remove("hidden");
        document.getElementById("profile").classList.add("hidden");
    }
}

function logOut() {
    localStorage.removeItem("gamingLoggedInEmail");
    emailInput.value = "";
    passwordInput.value = "";
    showAccount();
}

// Search games
const searchInput = document.getElementById("searchInput");
const gameCards = document.querySelectorAll(".game-card");
const noResults = document.getElementById("noResults");
const categoryButtons = document.querySelectorAll(".category-button");

let selectedCategory = "all";

function filterGames() {
    const searchText = searchInput.value.toLowerCase();
    let visibleGames = 0;

    gameCards.forEach(card => {
        const gameName = card.textContent.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch = gameName.includes(searchText);
        const matchesCategory =
            selectedCategory === "all" || category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.classList.remove("hidden");
            visibleGames++;
        } else {
            card.classList.add("hidden");
        }
    });

    noResults.classList.toggle("hidden", visibleGames !== 0);
}

searchInput.addEventListener("input", filterGames);

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        filterGames();
    });
});

// Favorites
gameCards.forEach((card, index) => {
    const favoriteButton = card.querySelector(".favorite-button");
    const favoriteKey = "gamingFavorite" + index;

    if (localStorage.getItem(favoriteKey) === "true") {
        favoriteButton.classList.add("favorited");
        favoriteButton.textContent = "♥ Favorited";
    }

    favoriteButton.addEventListener("click", () => {
        const isFavorite = favoriteButton.classList.toggle("favorited");

        localStorage.setItem(favoriteKey, isFavorite);

        favoriteButton.textContent =
            isFavorite ? "♥ Favorited" : "♡ Favorite";
    });
});

// Ratings
gameCards.forEach((card, index) => {
    const stars = card.querySelectorAll(".rating span");
    const ratingKey = "gamingRating" + index;
    let savedRating = Number(localStorage.getItem(ratingKey)) || 0;

    function updateStars(rating) {
        stars.forEach(star => {
            const starNumber = Number(star.dataset.rating);
            star.textContent = starNumber <= rating ? "★" : "☆";
        });
    }

    updateStars(savedRating);

    stars.forEach(star => {
        star.addEventListener("click", () => {
            savedRating = Number(star.dataset.rating);
            localStorage.setItem(ratingKey, savedRating);
            updateStars(savedRating);
        });
    });
});

// Show saved account when opening the website
showAccount();
