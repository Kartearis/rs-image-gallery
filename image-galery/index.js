
const seeds = ['cat', 'dog', 'mountain', 'river', 'sea', 'red', 'blue', 'dragon', 'rolling', 'scopes', 'school', 'black', 'fire', 'tree'];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('year').innerHTML = new Date().getFullYear();
});

function processKeysOnSearch(event) {
    if (event.code === 'Enter')
        loadImages(document.querySelector('input.search').value);
}

const loadingOverlay = `
    <div class="placeholder-image">
        <div class="loader">Loading...</div>
    </div>
`;

function addLoadingOverlay(container) {
    container.innerHTML = "";
    container.insertAdjacentHTML('beforeend', loadingOverlay.repeat(30));
}

function removeLoadingOverlay(container) {
    container.querySelectorAll('.placeholder-image').forEach(x => x.remove());
}

function loadImages(query, page = 1) {
    if (query.length < 2)
        return;
    addLoadingOverlay(document.querySelector('.gallery'));
    fetch('https://env2k6glw6z34ld.m.pipedream.net?' + new URLSearchParams({
        'query': query,
        'page': page
    }))
    .then(response => {if (!response.ok) throw new Error("Server unavailable"); return response.json();})
    .then(customResponse => {if (customResponse.status !== 0) throw new Error("Some API error"); return customResponse.data;})
    .then(data => buildGallery(data.results.map(x => {return {full: x.urls.full, normal: x.urls.small, alt: x.alt_description};})))
    .catch(er => displayError(er));
}


const errorHtml = `
    <div class="error-message">
        <p>По вашему запросу не найдены изображения (или сервер по какой-то причине недоступен).
        Попробуйте использовать другой запрос или выполните его позже.</p>
        <p>We could not found images relevant to your query (or there is some kind of server error).
        Please try again later or use different keywords for search</p>
        <span class="custom-icons server-error"></span>
    </div>
`;

function displayError(error) {
    console.log(error);
    let gallery = document.querySelector('.gallery');
    gallery.innerHTML = "";
    gallery.insertAdjacentHTML('beforeend', errorHtml);
}

const modalHtml = `
    <div class="overlay">
        <img class="fs-img" src="" alt="">
    </div>
`;



function quitFSonEscape(event, overlay) {
    if (event.code === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', quitFSonEscape);
    }
}

function openFullscreen(event) {
    let image = event.target;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    let modalImage = document.body.querySelector('.overlay img');
    modalImage.src = image.attributes['data-full'];
    modalImage.alt = image.alt;
    let overlay = document.body.querySelector('.overlay');
    overlay.addEventListener('click', () => {overlay.remove();document.removeEventListener('keydown', quitFSonEscape);});
    document.addEventListener('keydown', ev => quitFSonEscape(ev, overlay));
}

function buildGallery(images, totalImages) {
    let gallery = document.querySelector('.gallery');
    removeLoadingOverlay(gallery);
    gallery.innerHTML = "";
    images.forEach(x => {
        const image = document.createElement('img');
        image.src = x.normal;
        image.attributes['data-full'] = x.full;
        image.alt = x.alt;
        image.addEventListener('click', openFullscreen);
        gallery.append(image);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let search = document.querySelector('input.search');
    search.addEventListener('keydown', processKeysOnSearch);
    document.querySelector('button#search').addEventListener('click', x => loadImages(search.value))
});

document.addEventListener('DOMContentLoaded', function () {
    loadImages(seeds[Math.floor(Math.random() * seeds.length)]);
});