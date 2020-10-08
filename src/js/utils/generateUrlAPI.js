import moment from 'moment';
import { API_BASE, API_KEY, API_PATHNAME } from '../constants/api.js';

class URL_API {
    generate(query) {
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
                    API_URL.searchParams.set('append_to_response', 'videos,credits');

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

        console.log(API_URL);
        return API_URL;
    }
}
export default new URL_API();
