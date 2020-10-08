export const API_KEY = '9c7b675f9aa1962d9049582aa1d2321c';

export const API_BASE = 'https://api.themoviedb.org/';

export const API_PATHNAME = {
    search: '3/search/movie', //https://api.themoviedb.org/3 /search/movie          ?api_key=<<api_key>>  &language=ru  &query=8  &page=1
    genres: '3/genre/movie/list', //https://api.themoviedb.org/3 /genre/movie/list  ?api_key=<<api_key>>  &language=ru
    details: '3/movie/', //https://api.themoviedb.org/3 /movie/        {movie_id}   ?api_key=<<api_key>>  &language=ru
    watching: '3/movie/now_playing', //https://api.themoviedb.org/3 /movie/now_playing   ?api_key=<<api_key>>  &language=ru  &page=1
    popular: '3/movie/popular', //https://api.themoviedb.org/3 /movie/popular       ?api_key=<<api_key>>  &language=ru  &page=1
    best: '3/discover/movie', //https://api.themoviedb.org/3 /movie/top_rated  ?api_key=<<api_key>>  &language=ru  &page=1
    upcoming: '3/discover/movie', //sort_by=popularity.desc & primary_release_date.gte=2020-09-14
    last: '3/discover/movie', //sort_by=primary_release_date.desc & primary_release_date.lte=2020-09-14
};
