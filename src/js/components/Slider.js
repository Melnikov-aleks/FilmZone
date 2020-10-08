import getDataAPI from '../utils/getDataAPI';
import Content from './Content';

class Slider {
    constructor() {
        this.settings = {
            startAt: 10,
            slidesToShow: 3,
            backgroundTrack: true,
            distance: 150,
            scale: 0.5, //0-1
        };
    }

    async render() {
        this.data = await getDataAPI.getData(
            'https://api.themoviedb.org/3/movie/popular?api_key=9c7b675f9aa1962d9049582aa1d2321c&language=ru'
        );

        const wrapperHtml = document.createElement('section');
        wrapperHtml.classList.add('section__slider', 'slider');
        const sliderTrack = document.createElement('div');
        sliderTrack.classList.add('slider__track', 'track');

        let slidesHtml = ``;

        this.data.results.forEach((film, i) => {
            slidesHtml += `
			<div class="slider__slide slide" data-slide="${i}" data-id="${film.id}">
				<img class="slide__img" src="https://image.tmdb.org/t/p/w780${film.backdrop_path}">
				<h1 class="slide__title">${film.title}</h1>
			</div>
			`;
        });

        sliderTrack.insertAdjacentHTML('afterbegin', slidesHtml);

        wrapperHtml.append(sliderTrack);

        wrapperHtml.insertAdjacentHTML(
            'afterbegin',
            `
		<div class="slider__arrow-left arrow-left slider__arrow"></div>
		`
        );
        wrapperHtml.insertAdjacentHTML(
            'beforeend',
            `
		<div class="slider__arrow-right arrow-right slider__arrow"></div>
		`
        );

        document.querySelector('.main').prepend(wrapperHtml);

        this.slides = document.querySelectorAll('.slide');

        if (0 <= this.settings.startAt < this.slides.length - 1) {
            this.setCurrentClass(this.settings.startAt);
        } else {
            this.setCurrentClass(0);
        }

        if (this.settings.backgroundTrack) {
            document.querySelector('.track').insertAdjacentHTML(
                'afterbegin',
                `
			<div class="track__background"></div>
			`
            );
            this.setBackground();
        }

        this.setActiveClass();

        this.slides.forEach((slide) => console.log(slide.classList.value));
        // console.log(this.slides);
        let k = 0;
        this.setPosSlides();

        document.querySelector('.arrow-left').addEventListener('click', () => {
            if (this.currentNum - 1 < 0) return;

            this.movingSlides(this.currentNum - 1);
        });
        document.querySelector('.arrow-right').addEventListener('click', () => {
            if (this.currentNum + 1 >= this.slides.length) return;

            this.movingSlides(this.currentNum + 1);
        });
        this.addEventSlide();
    }

    addEventSlide() {
        this.slides.forEach((slide) => {
            slide.removeEventListener('click', this.clickOnSlide);
            if (slide.classList.contains('slide--current')) {
                slide.addEventListener('click', this.clickOnSlide);
            }
        });
    }

    clickOnSlide(event) {
        const url = new URL(document.location.href);
        url.searchParams.set('do', 'details');
        url.searchParams.set('id', event.target.getAttribute('data-id'));
        url.searchParams.delete('page');
        url.searchParams.delete('q');
        console.warn(url);
        history.pushState(null, null, url);
        Content.render();
    }

    setBackground() {
        document.querySelector(
            '.track__background'
        ).style.background = `url(${document
            .querySelector('.slide--current')
            .getElementsByClassName('slide__img')[0]
            .getAttribute('src')
            .replace('w780', 'w300')}) center/cover`;
    }

    movingSlides(newCurrentNum) {
        this.slides.forEach((slide) => {
            slide.classList.remove('slide--current');
            slide.classList.remove('slide--active');
        });

        this.setCurrentClass(newCurrentNum);

        this.setActiveClass();

        this.setBackground();

        this.setPosSlides();

        this.addEventSlide();
    }

    setPosSlides() {
        let length = 150;
        const scale = 1 - Math.pow(this.settings.scale, 2);

        this.slides.forEach((slide) => {
            slide.style.transform = `scale(0.001)`;
            slide.style.zIndex = `0`;
            if (
                slide.classList.contains('slide--active') &&
                !slide.classList.contains('slide--current')
            ) {
                const deltaSlides = slide.getAttribute('data-slide') - this.currentNum;

                const scaleFunc = Math.sqrt(
                    Math.abs(
                        (deltaSlides / this.settings.slidesToShow) * scale -
                            Math.sign(deltaSlides)
                    )
                );
                console.log(scaleFunc);

                const positionFunc =
                    this.settings.distance *
                    Math.sign(deltaSlides) *
                    Math.sqrt(
                        (Math.abs(deltaSlides) / this.settings.slidesToShow) *
                            (2 - Math.abs(deltaSlides) / this.settings.slidesToShow)
                    );

                slide.style.transform = `translate(${
                    positionFunc +
                    (slide.clientWidth / 2) * Math.sign(deltaSlides) * (1 - scaleFunc)
                }px) scale(${scaleFunc})`;

                slide.style.zIndex = `${100 - Math.abs(deltaSlides)}`;
            }
            if (slide.classList.contains('slide--current')) {
                slide.style.zIndex = `100`;
                slide.style.transform = ``;
            }
        });
    }
    setCurrentClass(currNum) {
        this.slides[currNum].classList.add('slide--current');
    }
    setActiveClass() {
        for (
            let i = this.currentNum - this.settings.slidesToShow;
            i <= this.currentNum + this.settings.slidesToShow;
            i++
        ) {
            this.slides[i] ? this.slides[i].classList.add('slide--active') : false;
        }
    }

    get currentNum() {
        return +document.querySelector('.slide--current').getAttribute('data-slide');
    }
}

export default new Slider();
