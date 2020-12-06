import Sidebar from './Sidebar';
import Header from './Header';
import Content from './Content';

export default class App {
    constructor() {
        this.url = new URL(document.location.href);
    }
    update(params) {
        const names = Object.keys(params);
        if (names.length === 1 && names[0] === 'page') {
            if (params.page === '1') {
                this.url.searchParams.delete('page');
            } else {
                if (!this.url.searchParams.has('do')) {
                    this.url.searchParams.set('do', 'popular');
                }
                this.url.searchParams.set('page', params.page);
            }
        } else {
            this.url = new URL(this.url.pathname, this.url.origin);
            names.forEach((name) => {
                this.url.searchParams.set(name, params[name]);
            });
        }

        history.pushState(null, null, this.url);
        this.sidebar.close();
        this.content.render();
    }
    render() {
        this.sidebar = new Sidebar(this.update.bind(this));
        this.header = new Header('.header__container', this.update.bind(this));
        this.content = new Content('.main__container', this.update.bind(this));

        this.sidebar.render();
        this.header.render();
        this.content.render();
        window.addEventListener('popstate', () => {
            this.url = new URL(document.location.href);
            this.content.render();
        });
    }
}
