import logo from '../../img/logo.svg';

import Search from './Search';
import { productUseHtml } from '../utils/API';

export default class Header {
    constructor(selector, updateCallback) {
        this.container = document.querySelector(selector);
        this.update = updateCallback;
    }

    render() {
        let innerHtml = `
			<div class="header__product-use product-use">
				${productUseHtml}
			</div>
			<a class="header__logo logo" href="https://melnikov-aleks.github.io/FilmZone">
				<svg class="logo__svg"><use xlink:href="${logo}#logo"></use></svg>
			</a>
		`;

        this.container.insertAdjacentHTML('afterbegin', innerHtml);
        new Search('.header__container', this.update).render();
    }
}
