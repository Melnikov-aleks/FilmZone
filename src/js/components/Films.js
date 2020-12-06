import { SliderMy } from './Slider';
import { generateUrlAPI, getDataAPI } from '../utils/API';
import titleUpdate from './TitleUpdate';

import {
    getDetailsHtml,
    getSliderHtml,
    getCardsHtml,
    getPaginationHtml,
    getTabsHtml,
} from '../utils/templates';

class Film {
    constructor(container, updateCallback) {
        this.container = container;
        this.update = updateCallback;
    }

    render() {
        throw new Error('Метод render не реализован');
    }
}

export class FilmDetails extends Film {
    constructor(selector, updateCallback) {
        super(selector, updateCallback);
    }

    async render() {
        this.data = await getDataAPI(generateUrlAPI());
        if (!this.data) return;

        titleUpdate(this.data);

        this.container.innerHTML = '';

        while (document.querySelector('.tab--active'))
            document.querySelector('.tab--active').classList.remove('tab--active');

        this.container.insertAdjacentHTML(
            'afterbegin',
            `<div class="main__film-wrap film-wrap">
				${await getDetailsHtml(this.data)}
				</div>`
        );
        this.container.classList.remove('loading');

        await this.sliderInit('recommendations', 'Рекомендации');
        await this.sliderInit('similar', 'Похожие');
    }

    async sliderInit(type, title) {
        if (!this.data[type].results.length) return;

        this.container.insertAdjacentHTML(
            'beforeend',
            await getSliderHtml(type, this.data[type].results, title)
        );

        new SliderMy(`.slider-${type}`, this.update, {
            slidesToShow: 2,
            mobile: 'only',
        }).init();
    }
}

export class FilmCards extends Film {
    constructor(selector, updateCallback) {
        super(selector, updateCallback);
    }
    async render() {
        this.data = await getDataAPI(generateUrlAPI());
        if (!this.data) return;

        titleUpdate(this.data);

        if (this.container.querySelector('.film-cards')) {
            this.container.querySelector('.film-cards').innerHTML = '';
        } else {
            this.container.innerHTML = '';
            this.container.insertAdjacentHTML(
                'afterbegin',
                `<div class="main__film-cards film-cards">
				</div>`
            );
            this.container
                .querySelector('.film-cards')
                .addEventListener('click', this.eventCards.bind(this));
        }

        this.renderUpside();

        this.container.classList.remove('loading');

        this.container
            .querySelector('.film-cards')
            .insertAdjacentHTML('afterbegin', await getCardsHtml(this.data.results));

        this.renderPagination();
    }
    eventCards(event) {
        if (!event.target.closest('.film-card')) return;

        const params = {};
        params.do = 'details';
        params.id = event.target.closest('.film-card').getAttribute('data-id');
        this.update(params);
    }

    renderPagination() {
        if (this.data.total_pages < 2) return;

        while (this.container.querySelector('.page-list')) {
            this.container.querySelector('.page-list').remove();
        }

        this.container.querySelector('.film-cards').insertAdjacentHTML(
            'afterend',
            `<ul class="main__page-list page-list">
            	${getPaginationHtml(+this.data.total_pages, +this.data.page)}
			</ul>`
        );
        this.container
            .querySelector('.page-list')
            .addEventListener('click', this.eventPagination.bind(this));
    }
    eventPagination(event) {
        if (!event.target.hasAttribute('data-page')) return;
        const params = {};
        params.page = event.target.getAttribute('data-page');
        this.update(params);
    }

    renderUpside() {
        const url = new URL(document.location.href);

        if (!this.container.querySelector('.main__upside')) {
            this.container
                .querySelector('.film-cards')
                .insertAdjacentHTML('beforebegin', `<div class="main__upside"></div>`);
        }
        const upside = this.container.querySelector('.main__upside');

        if (url.searchParams.get('do') === 'search') {
            if (upside.querySelector('.tabs-wrap'))
                upside.querySelector('.tabs-wrap').remove();

            while (document.querySelector('.tab--active'))
                document.querySelector('.tab--active').classList.remove('tab--active');

            if (upside.querySelector('.total-results'))
                upside.querySelector('.total-results').remove();

            this.renderTotalResuls(url, upside);
        } else {
            if (upside.querySelector('.total-results'))
                upside.querySelector('.total-results').remove();
            if (upside.querySelector('.tabs-wrap')) return;
            this.renderTabs(url, upside);
        }
    }

    renderTotalResuls(url, container) {
        container.insertAdjacentHTML(
            'afterbegin',
            `<h1 class="main__total-results total-results">По запросу "${url.searchParams.get(
                'q'
            )}" нашлось ${this.data.total_results} фильмов</h1>`
        );
    }

    renderTabs(url, container) {
        container.insertAdjacentHTML('afterbegin', getTabsHtml('main'));

        document.querySelectorAll('.nav-tab').forEach((tab) => {
            if (url.searchParams.has('do')) {
                if (tab.getAttribute('data-section') === url.searchParams.get('do'))
                    tab.classList.add('tab--active');
            } else {
                if (tab.getAttribute('data-section') === 'popular')
                    tab.classList.add('tab--active');
            }
        });
        container
            .querySelector('.tabs-wrap')
            .addEventListener('click', this.eventTabs.bind(this));
    }

    eventTabs(event) {
        if (
            !event.target.closest('.tab') ||
            event.target.closest('.tab').matches('.tab--active')
        )
            return;

        document.querySelectorAll('.nav-tab').forEach((tab) => {
            if (tab.matches('.tab--active')) tab.classList.remove('tab--active');
            if (
                tab.getAttribute('data-section') ===
                event.target.closest('.tab').getAttribute('data-section')
            )
                tab.classList.add('tab--active');
        });

        const params = {};
        params.do = event.target.closest('.tab').getAttribute('data-section');
        this.update(params);
    }
}
