import arrows from '../../img/arrows.sprite.svg';

export class SliderMy {
    constructor(selector, updateCallback, settings = {}) {
        this.slider = document.querySelector(selector);
        this.update = updateCallback;
        this.settings = {
            slideWidth: settings['slideWidth'] ?? 0.5, //0-1
            slideOffset: settings['slideOffset'] ?? 0.5, // 0-1
            arrow: settings['arrow'] ?? true,
            startAt: settings['startAt'] ?? 0,
            slidesToShow: settings['slidesToShow'] ?? 3,
            backgroundTrack: settings['backgroundTrack'] ?? false,
            scale: settings['scale'] ?? 0.5, //0-1
            mobile: settings['mobile'] ?? true, //true false 'only'
        };
        this.settings.slidesToShowMobile =
            settings['slidesToShowMobile'] ?? this.settings.slidesToShow;
    }
    init() {
        this.slides = [...this.slider.children];

        this.track = document.createElement('div');
        this.track.classList.add('slider__track', 'track');
        this.slides.forEach((slide, i) => {
            slide.classList.add('slide');
            slide.setAttribute('data-slide', i);
            this.track.append(slide);
        });

        this.slider.append(this.track);
        this.slider.classList.add('slider');

        this.checkSettings();
        if (this.settings.arrow) this.createArrow();
        this.checkMobile();
        this.setCurrentClass(this.settings.startAt);
        this.backgroundCreate();

        this.addTransforms();
        if (this.settings.mobile && this.settings.mobile !== 'only') {
            this.resizeHandler = this.resizing.bind(this);
            window.addEventListener('resize', this.resizeHandler);
        }
        this.slider.addEventListener('click', this.events.bind(this));
    }

    checkSettings() {
        if (this.settings.slidesToShow < 0) this.settings.slidesToShow = 0;
        if (this.settings.slidesToShow > Math.floor((this.slides.length - 1) / 2))
            this.settings.slidesToShow = Math.floor((this.slides.length - 1) / 2);
        if (this.settings.slidesToShowMobile < 0) this.settings.slidesToShowMobile = 0;
        if (this.settings.slidesToShowMobile > Math.floor((this.slides.length - 1) / 2))
            this.settings.slidesToShowMobile = Math.floor((this.slides.length - 1) / 2);

        if (this.settings.startAt < 0) this.settings.startAt = 0;
        if (this.settings.startAt >= this.slides.length)
            this.settings.startAt = this.slides.length - 1;
    }

    resizing() {
        if (document.documentElement.clientWidth > 767.98 && this.isMobile) {
            this.checkMobile();
            if (!this.setCurrentClass(this.currentNum)) this.setActiveClass();
            this.backgroundCreate();

            this.addTransforms();
        }
        if (document.documentElement.clientWidth <= 767.98 && !this.isMobile) {
            this.checkMobile();
            if (!this.setCurrentClass(this.currentNum)) this.setActiveClass();
            this.backgroundCreate();

            this.addTransforms();
        }
    }

    checkMobile() {
        if (
            this.settings.mobile != 'only' &&
            (!this.settings.mobile || document.documentElement.clientWidth > 767.98)
        ) {
            this.isMobile = false;
            this.slider.classList.remove('slider--mobile');
        } else {
            this.isMobile = true;
            this.slider.classList.add('slider--mobile');
        }
        this.toggleSrc();
    }

    toggleSrc() {
        this.slides.forEach((slide) => {
            slide.querySelectorAll('img').forEach((img) => {
                if (
                    img.hasAttribute('data-src-mobile') &&
                    img.hasAttribute('data-src-desktop')
                ) {
                    if (
                        this.isMobile &&
                        img.getAttribute('src') !== img.getAttribute('data-src-mobile')
                    ) {
                        img.setAttribute('src', img.getAttribute('data-src-mobile'));
                    }
                    if (
                        !this.isMobile &&
                        img.getAttribute('src') !== img.getAttribute('data-src-desktop')
                    ) {
                        img.setAttribute('src', img.getAttribute('data-src-desktop'));
                    }
                }
            });
        });

        this.slider.querySelectorAll('.arrow-link').forEach((link) => {
            if (
                this.isMobile &&
                link.getAttribute('xlink:href').match(/(?<=#).*$/) !==
                    link.getAttribute('data-id-mobile')
            ) {
                link.setAttribute(
                    'xlink:href',
                    link
                        .getAttribute('xlink:href')
                        .replace(/(?<=#).*$/, link.getAttribute('data-id-mobile'))
                );
            }
            if (
                !this.isMobile &&
                link.getAttribute('xlink:href').match(/(?<=#).*$/) !==
                    link.getAttribute('data-id-desktop')
            ) {
                link.setAttribute(
                    'xlink:href',
                    link
                        .getAttribute('xlink:href')
                        .replace(/(?<=#).*$/, link.getAttribute('data-id-desktop'))
                );
            }
        });
    }
    createArrow() {
        this.track.insertAdjacentHTML(
            'beforebegin',
            `<div class="slider__previous slider__navigation navigation navigation-previous">
            <svg class="slider__arrow-left arrow-left slider__arrow arrow"><use class="arrow-link" xlink:href="${arrows}#arrow" data-id-mobile="arrow--mobile" data-id-desktop="arrow" /></svg>
			</div>`
        );
        this.track.insertAdjacentHTML(
            'afterend',
            `<div class="slider__next slider__navigation navigation navigation-next">
            <svg class="slider__arrow-right arrow-right slider__arrow arrow"><use class="arrow-link" xlink:href="${arrows}#arrow" data-id-mobile="arrow--mobile" data-id-desktop="arrow" /></svg>
			</div>`
        );
    }
    setCurrentClass(newCurrNum) {
        if (
            this.isMobile &&
            (newCurrNum < this.settings.slidesToShowMobile ||
                newCurrNum > this.slides.length - 1 - this.settings.slidesToShowMobile)
        ) {
            newCurrNum += Math.min(
                Math.abs(this.settings.slidesToShowMobile - newCurrNum),
                this.slides.length - 1 - this.settings.slidesToShowMobile - newCurrNum
            );
        }
        if (newCurrNum === this.currentNum) return false;
        this.slides.forEach((slide, i) => {
            slide.classList.remove('slide--current');
            if (i === newCurrNum) slide.classList.add('slide--current');
        });
        this.setActiveClass();
        return true;
    }
    setActiveClass() {
        this.slides.forEach((slide, i) => {
            slide.classList.remove('slide--active');
            if (this.isMobile) {
                if (
                    i >= this.currentNum - this.settings.slidesToShowMobile &&
                    i <= this.currentNum + this.settings.slidesToShowMobile
                )
                    slide.classList.add('slide--active');
            } else if (
                i >= this.currentNum - this.settings.slidesToShow &&
                i <= this.currentNum + this.settings.slidesToShow
            )
                slide.classList.add('slide--active');
        });
        this.checkArrowState();
    }
    checkArrowState() {
        if (!this.settings.arrow) return;
        if (this.isMobile) {
            if (this.currentNum - this.settings.slidesToShowMobile <= 0)
                this.slider
                    .querySelector('.navigation-previous')
                    .classList.add('disabled');
            else
                this.slider
                    .querySelector('.navigation-previous')
                    .classList.remove('disabled');
            if (
                this.currentNum + this.settings.slidesToShowMobile >=
                this.slides.length - 1
            )
                this.slider.querySelector('.navigation-next').classList.add('disabled');
            else
                this.slider
                    .querySelector('.navigation-next')
                    .classList.remove('disabled');
        } else {
            if (this.currentNum <= 0)
                this.slider
                    .querySelector('.navigation-previous')
                    .classList.add('disabled');
            else
                this.slider
                    .querySelector('.navigation-previous')
                    .classList.remove('disabled');
            if (this.currentNum >= this.slides.length - 1)
                this.slider.querySelector('.navigation-next').classList.add('disabled');
            else
                this.slider
                    .querySelector('.navigation-next')
                    .classList.remove('disabled');
        }
    }
    backgroundCreate() {
        if (this.isMobile) {
            if (this.track.querySelector('.track__background'))
                this.track.querySelector('.track__background').remove();
            return;
        }
        if (this.settings.backgroundTrack) {
            if (!this.track.querySelector('.track__background'))
                this.track.insertAdjacentHTML(
                    'afterbegin',
                    `<div class="track__background"></div>`
                );
            this.track.querySelector(
                '.track__background'
            ).style.background = `url(${document
                .querySelector('.slide--current img')
                .getAttribute('src')
                .replace('w780', 'w300')}) center/cover`;
        }
    }
    setBackground() {
        if (this.isMobile) return;
        this.track.querySelector(
            '.track__background'
        ).style.background = `url(${document
            .querySelector('.slide--current img')
            .getAttribute('src')
            .replace('w780', 'w300')}) center/cover`;
    }

    movingSlides(newCurrentNum) {
        if (!this.setCurrentClass(+newCurrentNum)) return;
        this.backgroundCreate();
        this.addTransforms();
    }

    events(event) {
        if (event.target.closest('.slider__previous') && this.currentNum > 0) {
            this.movingSlides(this.currentNum - 1);
        }
        if (
            event.target.closest('.slider__next') &&
            this.currentNum < this.slides.length - 1
        ) {
            this.movingSlides(this.currentNum + 1);
        }
        if (event.target.closest('.slide--active')) {
            if (event.target.closest('.slide--current')) {
                const params = {};
                params.do = 'details';
                params.id = event.target
                    .closest('.slide--current')
                    .getAttribute('data-id');

                this.update(params);
            } else {
                if (this.isMobile) {
                    const params = {};
                    params.do = 'details';
                    params.id = event.target
                        .closest('.slide--active')
                        .getAttribute('data-id');

                    this.update(params);
                } else
                    this.movingSlides(
                        event.target.closest('.slide--active').getAttribute('data-slide')
                    );
            }
        }
    }

    addTransforms() {
        if (this.isMobile) {
            this.slides.forEach((slide) => {
                slide.style.transform = `translate(${
                    -100 * (this.currentNum - this.settings.slidesToShowMobile)
                }%)`;
                slide.style.zIndex = `100`;
                slide.style.minWidth = `${
                    100 / (this.settings.slidesToShowMobile * 2 + 1)
                }%`;
                slide.style.maxWidth = ``;
            });
        } else {
            const scale = 1 - Math.pow(this.settings.scale, 2);

            this.slides.forEach((slide) => {
                slide.style.transform = `scale(0.001)`;
                slide.style.zIndex = `0`;
                slide.style.maxWidth = `${this.settings.slideWidth * 100}%`;
                if (slide.matches('.slide--current')) {
                    slide.style.zIndex = `100`;
                    slide.style.transform = ``;
                } else if (slide.matches('.slide--active')) {
                    const deltaSlides =
                        slide.getAttribute('data-slide') - this.currentNum;
                    const scaleFunc = Math.sqrt(
                        Math.abs(
                            (deltaSlides / this.settings.slidesToShow) * scale -
                                Math.sign(deltaSlides)
                        )
                    );
                    const positionFunc =
                        ((1 - scaleFunc) / 2 +
                            Math.sqrt(
                                Math.abs(deltaSlides / this.settings.slidesToShow)
                            ) *
                                ((((1 - this.settings.slideWidth) / 2) *
                                    this.settings.slideOffset) /
                                    this.settings.slideWidth)) *
                        100 *
                        Math.sign(deltaSlides);

                    slide.style.transform = `translate(${positionFunc}%) scale(${scaleFunc})`;
                    slide.style.zIndex = `${100 - Math.abs(deltaSlides)}`;
                }
            });
        }
    }
    get currentNum() {
        if (this.slider.querySelector('.slide--current'))
            return +this.slider
                .querySelector('.slide--current')
                .getAttribute('data-slide');
    }
    delete() {
        window.removeEventListener('resize', this.resizeHandler);
    }
}
