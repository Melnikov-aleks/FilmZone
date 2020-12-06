import moment from './moment';
import { API_BASE, API_KEY, API_PATHNAME } from '../constants/api';

export const productUseHtml = `<a class="product-use__link" href="https://www.themoviedb.org/documentation/api"><img class="product-use__logo" src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"></a>
<p class="product-use__txt">This product uses the TMDb API but is not endorsed or certified by TMDb.</p>`;

export function generateUrlAPI(query) {
    const url = new URL(document.location.href);
    const API_URL = new URL(API_BASE);

    API_URL.searchParams.set('api_key', API_KEY);

    API_URL.searchParams.set('language', url.searchParams.get('lang') ?? 'ru');

    if (query) {
        API_URL.pathname = API_PATHNAME.search;
        API_URL.searchParams.set('query', query);
    } else {
        API_URL.pathname = API_PATHNAME[url.searchParams.get('do') ?? 'popular'];

        API_URL.pathname += url.searchParams.get('id') ?? '';

        if (url.searchParams.has('page')) {
            API_URL.searchParams.set('page', url.searchParams.get('page'));
        }

        const now = moment().format('YYYY-MM-DD');

        switch (url.searchParams.get('do')) {
            case 'search':
                API_URL.searchParams.set('query', url.searchParams.get('q'));
                break;
            case 'details':
                API_URL.searchParams.set(
                    'append_to_response',
                    'videos,credits,recommendations,similar'
                );

                break;
            case 'upcoming':
                API_URL.searchParams.set('sort_by', 'popularity.desc');
                API_URL.searchParams.set('primary_release_date.gte', now);

                break;
            case 'last':
                API_URL.searchParams.set('sort_by', 'primary_release_date.desc');
                API_URL.searchParams.set('primary_release_date.lte', now);

                break;
            case 'best':
                API_URL.searchParams.set('sort_by', 'vote_average.desc');
                API_URL.searchParams.set('primary_release_date.lte', now);
                API_URL.searchParams.set('vote_count.gte', '1500');

                break;
        }
    }
    return API_URL;
}

export async function getDataAPI(url) {
    let data = null;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.status);
        data = await response.json();
    } catch (error) {
        console.error(error);
        document.querySelector(
            'body'
        ).innerHTML = `<p class="error-massage">Что-то пошло не так...</p>`;
    }
    return data;
}

export const Genres = {
    async init() {
        this.status = 'initing';
        const data = await getDataAPI(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ru`
        );
        if (!data) return;
        this.list = {};
        data.genres.forEach((genre) => {
            this.list[genre.id] = genre.name;
        });
        this.status = 'init';
    },
    async getById(id) {
        if (this.status != 'init') await this.init();
        if (!this.list) return;
        return this.list[id];
    },
};
