import Films from './Films';

class Tabs {
    render() {
        const url = new URL(document.location.href);

        if (document.querySelector('.tabs-wrap')) {
            console.log('tab');
            document.querySelector('.tab--active').classList.remove('tab--active');
            document
                .getElementById(url.searchParams.get('do') || 'popular')
                .classList.add('tab--active');
            return;
        }
        if (
            url.searchParams.get('do') === 'search' ||
            url.searchParams.get('do') === 'details'
        )
            return;

        const wrapperHtml = document.createElement('ul');
        wrapperHtml.classList.add('main__tabs-wrap', 'tabs-wrap');

        let innerHtml = `
		<li class="tabs-wrap__tab tab" id="popular">Популярные</li>
		<li class="tabs-wrap__tab tab" id="last">Последние</li>
		<li class="tabs-wrap__tab tab" id="best">Лучшие</li>
		<li class="tabs-wrap__tab tab" id="watching">Сейчас смотрят</li>
		<li class="tabs-wrap__tab tab" id="upcoming">Ожидаются</li>
		`;

        wrapperHtml.insertAdjacentHTML('afterbegin', innerHtml);

        document.querySelector('.main__container').prepend(wrapperHtml);

        document
            .getElementById(url.searchParams.get('do') || 'popular')
            .classList.add('tab--active');

        this.addEvent();
    }

    addEvent() {
        const url = new URL(document.location.href);
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach((elem) => {
            elem.addEventListener('click', () => {
                if (elem.classList.contains('tab--active')) return;

                tabs.forEach((tab) => tab.classList.remove('tab--active'));
                elem.classList.add('tab--active');

                elem.id === 'popular'
                    ? url.searchParams.delete('do')
                    : url.searchParams.set('do', elem.id);
                url.searchParams.delete('page');

                history.pushState(null, null, url);
                Films.renderCards();
            });
        });
    }
}

export default new Tabs();
