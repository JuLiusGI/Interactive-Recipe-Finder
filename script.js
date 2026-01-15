const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recipeContainer = document.getElementById('recipeContainer');
const loadingBar = document.getElementById('loadingBar');
const progressBar = loadingBar.querySelector('progress');

const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Show Loading Bar (Health Bar style)
    recipeContainer.style.display = 'none';
    loadingBar.style.display = 'block';
    
    // Simulate "Loading" filling up
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        progressBar.value = progress;
        if (progress >= 100) clearInterval(interval);
    }, 100);

    try {
        const response = await fetch(`${API_URL}${query}`);
        const data = await response.json();

        // Wait a tiny bit for the "bar" to finish visually
        setTimeout(() => {
            renderRecipes(data.meals);
            loadingBar.style.display = 'none';
            recipeContainer.style.display = 'grid';
        }, 600);

    } catch (error) {
        console.error('Error fetching recipes:', error);
        loadingBar.style.display = 'none';
        recipeContainer.style.display = 'grid';
        recipeContainer.innerHTML = `
            <div class="nes-container is-dark with-title">
                <p class="title">Error</p>
                <p>Quest Failed. Dragon ate the connection.</p>
            </div>`;
    }
}

function renderRecipes(meals) {
    recipeContainer.innerHTML = '';

    if (!meals) {
        recipeContainer.innerHTML = `
            <div class="nes-container is-dark with-title">
                <p class="title">Empty Info</p>
                <p>No recipes found for "${searchInput.value}".</p>
            </div>`;
        return;
    }

    const topMeals = meals.slice(0, 5);

    topMeals.forEach(meal => {
        const card = createRecipeCard(meal);
        recipeContainer.appendChild(card);
    });
}

function createRecipeCard(meal) {
    const cookTime = Math.floor(Math.random() * (60 - 20 + 1) + 20); // Simulate 20-60 mins
    
    const div = document.createElement('div');
    div.classList.add('nes-container', 'with-title', 'is-centered', 'recipe-card-nes');
    
    // Title is part of the container structure in NES.css, but complex to manipulate dynamically strictly
    // So we use standard structure inside
    
    div.innerHTML = `
        <p class="title">${meal.strMeal}</p>
        <div style="background-color: #fff; padding: 0.5rem; margin-bottom: 1rem; border: 4px solid #000;">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="card-image" style="width: 100%; display: block;">
        </div>
        <div class="card-content" style="text-align: left;">
            <div class="card-meta">
                <i class="nes-icon coin is-small"></i> Time: ${cookTime}m<br>
                <i class="nes-icon trophy is-small"></i> Area: ${meal.strArea}
            </div>
            <a href="${meal.strSource || meal.strYoutube}" target="_blank" class="nes-btn is-success btn-retro">Start Quest</a>
        </div>
    `;

    return div;
}

// Pixel Art Asset Logic
function createFloatingSprites() {
    const icons = [
        'assets/burger.png',
        'assets/pizza.png',
        'assets/chicken.png',
        'assets/potion.png'
    ];
    
    const container = document.getElementById('emoji-container');
    const spriteCount = 15; // Fewer sprites to keep it clean

    for (let i = 0; i < spriteCount; i++) {
        const img = document.createElement('img');
        img.src = icons[Math.floor(Math.random() * icons.length)];
        img.classList.add('pixel-sprite');
        
        // Randomize
        const left = Math.random() * 100; // 0-100%
        const delay = Math.random() * 10; // 0-10s
        const duration = 15 + Math.random() * 20; // 15-35s
        const scale = 1 + Math.random(); // 1-2x size (32px to 64px)

        img.style.left = `${left}%`;
        img.style.animation = `floatPixel ${duration}s linear infinite`; // Explicit animation
        img.style.animationDelay = `-${delay}s`;
        img.style.width = `${32 * scale}px`;
        img.style.height = `${32 * scale}px`;

        container.appendChild(img);
    }
}

// Init
createFloatingSprites();
