import Search from './Search';
import { productUseHtml } from '../utils/API';
import { getTabsHtml } from '../utils/templates';

export default class Sidebar {
    constructor(updateCallback) {
        this.update = updateCallback;
    }
    render() {
        const url = new URL(document.location.href);
        document
            .querySelector('body')
            .insertAdjacentHTML(
                'afterbegin',
                `<div class="sidebar"><div class="scrollable"></div></div>`
            );
        this.element = document.querySelector('.sidebar');
        this.container = document.querySelector('.scrollable');
        new Search('.scrollable', this.update).render();

        this.element.insertAdjacentHTML(
            'beforeend',
            `<div class="sidebar-btn"><span></span></div>`
        );
        this.container.insertAdjacentHTML(
            'beforeend',
            `${getTabsHtml('sidebar')}
			<div class="sidebar__product-use">
				${productUseHtml}
			</div>`
        );
        document.querySelectorAll('.nav-tab').forEach((tab) => {
            if (url.searchParams.get('do')) {
                if (tab.getAttribute('data-section') === url.searchParams.get('do'))
                    tab.classList.add('tab--active');
            } else {
                if (tab.getAttribute('data-section') === 'popular')
                    tab.classList.add('tab--active');
            }
        });
        this.element.addEventListener('click', this.eventSidebar.bind(this));
    }
    eventSidebar(event) {
        if (event.target.closest('.sidebar-btn')) {
            this.element.classList.toggle('sidebar--active');
            document.querySelector('body').classList.toggle('lock');
        }
        if (event.target.closest('.tab') && !event.target.closest('.tab--active')) {
            const params = {};
            document.querySelectorAll('.nav-tab').forEach((tab) => {
                if (tab.matches('.tab--active')) tab.classList.remove('tab--active');
                if (
                    tab.getAttribute('data-section') ===
                    event.target.closest('.tab').getAttribute('data-section')
                )
                    tab.classList.add('tab--active');
            });
            params.do = event.target.closest('.tab').getAttribute('data-section');
            this.update(params);
        }
    }
    close() {
        if (this.element) {
            this.element.classList.remove('sidebar--active');
            document.querySelector('body').classList.remove('lock');
        }
    }
}
