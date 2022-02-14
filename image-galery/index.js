
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

function displayError(error) {
    console.log(error);

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