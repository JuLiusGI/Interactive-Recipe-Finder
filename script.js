const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recipeContainer = document.getElementById('recipeContainer');

const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Show loading state
    recipeContainer.innerHTML = '<div class="empty-state"><p>Searching for deliciousness...</p></div>';

    try {
        const response = await fetch(`${API_URL}${query}`);
        const data = await response.json();

        renderRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipeContainer.innerHTML = '<div class="empty-state"><p>Oops! Something went wrong. Please try again.</p></div>';
    }
}

function renderRecipes(meals) {
    recipeContainer.innerHTML = '';

    if (!meals) {
        recipeContainer.innerHTML = `
            <div class="empty-state">
                <p>No recipes found for "${searchInput.value}". Try another ingredient!</p>
            </div>`;
        return;
    }

    // Limit to 5 results
    const topMeals = meals.slice(0, 5);

    topMeals.forEach(meal => {
        const card = createRecipeCard(meal);
        recipeContainer.appendChild(card);
    });
}

function createRecipeCard(meal) {
    const cookTime = Math.floor(Math.random() * (60 - 20 + 1) + 20); // Simulate 20-60 mins
    
    const div = document.createElement('div');
    div.classList.add('recipe-card');

    div.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-image">
        <div class="card-content">
            <h3 class="card-title">${meal.strMeal}</h3>
            <div class="card-meta">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>${cookTime} mins</span>
                <span style="margin: 0 5px">•</span>
                <span>${meal.strArea}</span>
            </div>
            <div class="card-actions">
                <a href="${meal.strSource || meal.strYoutube}" target="_blank" class="btn-recipe">View Recipe</a>
            </div>
        </div>
    `;

    return div;
}

// Aesthetic: Floating Emojis
function createFloatingEmojis() {
    const emojis = ['🍕', '🍔', '🍟', '🌭', '🥞', '🥓', '🥪', '🌮', '🌯', '🥙', '🥗', '🍲', '🍝', '🍜', '🍣', '🍱', '🍛', '🍚', '🍗', '🍩', '🍪', '🍰', '🍫', '🍬', '🍭', '🍦'];
    const container = document.createElement('div');
    container.id = 'emoji-container';
    document.body.prepend(container);

    const emojiCount = 20;

    for (let i = 0; i < emojiCount; i++) {
        const span = document.createElement('span');
        span.classList.add('floating-emoji');
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Randomize
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 10; // 0-10s
        const duration = 15 + Math.random() * 20; // 15-35s
        const scale = 0.5 + Math.random() * 1.5; // 0.5-2x size

        span.style.left = `${left}%`;
        span.style.animationDelay = `-${delay}s`; // Start mid-animation
        span.style.animationDuration = `${duration}s`;
        span.style.fontSize = `${scale * 2}rem`;

        container.appendChild(span);
    }
}

// Init
createFloatingEmojis();
