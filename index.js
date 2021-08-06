const KEY = '0adbb34bf81e230a73e19aaaeee72637';
const MAIN_URL = 'https://api.themoviedb.org/3/';
const POSTER_PATH = 'https://image.tmdb.org/t/p/w500';

const refs = {
    serchInput: document.querySelector('input'), 
    gallery: document.querySelector('ul')    
};

let searchQuery = '';

const queryes = { ...JSON.parse(sessionStorage.getItem('queryes')) };

const  addQueryToSessionStorage = () => {
   sessionStorage.setItem('queryes', JSON.stringify(queryes))    
 };

const deboucedSearch = _.debounce(onSearchInput, 1000);

refs.serchInput.addEventListener('input', deboucedSearch);

refs.gallery.innerHTML = '<h2>Tipe your seach query please</h2>';

function  getBySearchQuery(searchQuery) {    
    const url = `${MAIN_URL}search/movie?api_key=${KEY}&language=en-US&query=${searchQuery}`;
    return fetch(url).then(response => {
        refs.gallery.innerHTML = '<h2>Loading...</h2>';
        return response.json();
    }).then(({ results }) => results);
};

function onSearchInput(e) {
    searchQuery = e.target.value;    

    if (searchQuery === '' || searchQuery.length < 3) {
        refs.gallery.innerHTML = '<h2>Tipe your seach query please</h2>';
    } else {
        markupFromCache(searchQuery, queryes);
    };
    
};

const markup = (title, posterPath, overview) =>
        `<li>
            <figure>
                <figcaption>
                    <h3>${title}</h3>
                </figcaption>
                <img src="${posterPath}" alt="${title} poster" width="300" height="450" />
            </figure>
            <div class="overview">
                <h3>Overview</h3>
                <p>
                    ${overview}
                </p>
            </div>
        </li>`;


function markupFromCache(searchQuery, queryes) {
    if (searchQuery in queryes) {
        refs.gallery.innerHTML = queryes[searchQuery].reduce((acc, { title, poster_path, overview }) => {
            let posterPath = ``;
            if (!poster_path) {
                posterPath = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-1-3-200x200.jpg";
            } else {
                posterPath = `${POSTER_PATH}${poster_path}`;
            }
            return (acc + markup(title, posterPath, overview));
        }, ``);
    } else {
        markupByQuery(searchQuery);
    };
 };

function markupByQuery(searchQuery) {
    getBySearchQuery(searchQuery)
        .then((results) => {
            if (results) {
                queryes[searchQuery] = results;
                addQueryToSessionStorage();
                refs.gallery.innerHTML = results.reduce((acc, { title, poster_path, overview }) => {
                    let posterPath = ``
                    if (!poster_path) {
                        posterPath = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-1-3-200x200.jpg";
                    } else {
                        posterPath = `${POSTER_PATH}${poster_path}`;
                    }
                    return (acc + markup(title, posterPath, overview));
                }, ``);
            };
        })
        .catch(error => {
            console.log(error);
            return refs.gallery.innerHTML = '<h2>Some error</h2>';
        });
 };