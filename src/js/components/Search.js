import { generateUrlAPI, getDataAPI } from '../utils/API';
import { getSearchHtml } from '../utils/templates';

export default class Search {
    constructor(selector, updateCallback) {
        this.container = document.querySelector(selector);
        this.update = updateCallback;
    }
    render() {
        this.container.insertAdjacentHTML('beforeend', getSearchHtml());
        this.form = this.container.querySelector('.search-form');
        this.addEvent();
    }
    get searchListAll() {
        return document.querySelector('.search-list');
    }
    get searchList() {
        return this.container.querySelector('.search-list');
    }
    addEvent() {
        this.form.addEventListener('input', () => {
            while (this.searchListAll) {
                this.searchListAll.remove();
            }
            if (this.form.film.value.trim().length < 3) return;
            document.querySelectorAll('.search-form').forEach((form) => {
                if (form.film.value !== this.form.film.value) {
                    form.film.value = this.form.film.value;
                }
            });
            this.renderDropList(this.form.film.value.trim());
        });

        this.form.addEventListener('focusin', () => {
            if (this.searchList) {
                setTimeout(() => {
                    this.searchList.classList.remove('hide');
                }, 0);
            } else if (this.form.film.value.trim().length >= 3) {
                this.renderDropList(this.form.film.value.trim());
            }
        });
        this.form.addEventListener('focusout', () => {
            if (this.searchList) {
                setTimeout(() => {
                    this.searchList.classList.add('hide');
                }, 0);
            }
        });
        this.form.addEventListener('click', (event) => {
            if (!event.target.closest('.search-item')) return;

            this.update(this.setAttr(event.target.closest('.search-item')));
        });
        this.form.addEventListener('keydown', (event) => {
            if (event.keyCode !== 13 || !event.target.closest('.search-item')) return;

            this.update(this.setAttr(event.target.closest('.search-item')));
        });
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            document.activeElement.blur();
            this.update(this.setAttr(event.target));
        });
    }
    async renderDropList(query) {
        this.form.insertAdjacentHTML(
            'beforeend',
            `<ul class="search-form__search-list search-list loading"></ul>`
        );
        this.searchList.style.maxHeight = `calc(100vh - ${
            this.searchList.getBoundingClientRect().top
        }px)`;
        const data = await getDataAPI(generateUrlAPI(query));
        if (!data) return;
        const items = [];
        let more = '';
        for (let i = 0; i < Math.min(data.total_results, 6); i++) {
            const film = data.results[i];
            items.push(`
			<li class="search-list__search-item search-item" data-id="${film.id}" tabindex=0>
				<p class="search-item__title">${film.title}</p> 
				<span class="search-item__release">${film.release_date}</span>
			</li>`);
        }
        if (data.total_results == 0)
            more = `<p class="search-item__more">По запросу ничего не найдено</p>`;
        else if (data.total_results - 6 > 0)
            more = `<p class="search-item__more">Показать еще <span class="search-item__num">${
                data.total_results - 6
            }</span> фильмов</p>`;
        else
            more = `<p class="search-item__more">Показать все <span class="search-item__num">${data.total_results}</span> фильмов</p>`;

        items.push(`
		<li class="search-list__search-item search-item" tabindex=0>
			${more}
		</li>`);

        this.searchList.insertAdjacentHTML('beforeend', items.join(''));
        this.searchList.classList.remove('loading');
    }
    setAttr(elem) {
        const params = {};
        if (elem.getAttribute('data-id')) {
            params.do = 'details';
            params.id = elem.getAttribute('data-id');
        } else {
            params.do = 'search';
            params.q = this.form.film.value;
        }
        return params;
    }
}
