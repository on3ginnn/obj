"use strict"

document.addEventListener('DOMContentLoaded', function() {

    // // прелодер
    // document.querySelector('body').classList.remove('_lock');
    // document.querySelector('.preloader').classList.add('_un_active');

    // lazy load 
    const images = document.querySelectorAll('img[data-src]');
    const videos = document.querySelectorAll('iframe[data-src-video]');
    const windowHeight = document.documentElement.clientHeight;

    // массивы координат картинок (и видео)
    let imagesPosition = [];
    let videosPosition = [];

    // итерация всех картинок (и видео), и добавление их координат в imagesPosition (videosPosition)
    if (images.length > 0) {
        images.forEach(img => {
            if (img.dataset.src) {
                imagesPosition.push(img.getBoundingClientRect().top + pageYOffset);
                // т.к экран может уже находится в том месте где надо загрузить картинку
                lazyLoad();
            }
        });
    }
    if (videos.length > 0) {
        videos.forEach(video => {
            if (video.dataset.srcVideo) {
                videosPosition.push(video.getBoundingClientRect().top + pageYOffset);   
                lazyLoad();
            }
        });
    }

    // lazy load (присваиваем src)
    function lazyLoad() {

        // поиск индекса картинки (и видео), которое надо загрузить
        let imgIndex = imagesPosition.findIndex(item => pageYOffset > item - windowHeight);
        let videoIndex = videosPosition.findIndex(item => pageYOffset > item - windowHeight);
        
        if (imgIndex >= 0) {
            if (images[imgIndex].dataset.src) {
                images[imgIndex].src = images[imgIndex].dataset.src;
                images[imgIndex].removeAttribute('data-src');
            }
            delete imagesPosition[imgIndex];
        }
        if (videoIndex >= 0) {
            if (videos[videoIndex].dataset.srcVideo) {
                videos[videoIndex].src = videos[videoIndex].dataset.srcVideo;
                videos[videoIndex].removeAttribute('data-src-video');
            }
            delete videosPosition[videoIndex];
        }
    }

    // итерация всех еще не загруженных каартинок (и видео)
    function lazyLoadChecker() {
        const imagesActual = document.querySelectorAll('img[data-src]');
        const videosActual = document.querySelectorAll('iframe[data-src-video]');
        if (imagesActual.length > 0 || videosActual.length > 0) {
            lazyLoad();
        }
    }

    // scroll event
    window.addEventListener('scroll', lazyLoadChecker);

    // поднятие складывающегося объекта
    function _slideUp(target, ruleItem, duration = 300, cardTextFirst = 0) {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            target.style.transitionProperty = 'height, margin, padding, opacity';
            target.style.height = target.offsetHeight + 'px';
            // эта фигня должна быть ОБЯЗАТЕЛЬНО, без нее не будет плавной анимации
            target.offsetHeight;
            target.style.transitionDuration = duration + 'ms';

            target.style.height = cardTextFirst + 'px';
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.style.overflow = 'hidden';

            window.setTimeout(() => {
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
                if (ruleItem.classList.contains('_active')) {
                    console.log('fff');
                    ruleItem.classList.remove('_active');
                }
            }, duration);

        }
    }
    // опускание складывающегося объекта
    function _slideDown(target, ruleItem, duration = 300, cardTextFirst = 0) {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (!ruleItem.classList.contains('_active')) {
                ruleItem.classList.add('_active');
            }
            // убираем размер с объекта (с html), чтобы применились css стили
            target.style.height = '';
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = cardTextFirst + 'px';
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            // эта фигня должна быть ОБЯЗАТЕЛЬНО, без нее не будет плавной анимации
            target.offsetHeight;

            target.style.transitionProperty = 'height, margin, padding, opacity';
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {

                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    // lazy load для труднодоступных объектов (spoiler) отдельно
    function lazyLoadOfSpoilers(img) {
        if (img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        }
    }

    let theme = 'light';

    function documentClick(event){
        // темная тема
        if (event.target.closest('.dark-mode')) {
            if (theme === 'light') {
                theme = 'dark';
                document.body.classList.add('dark_mode');
            } else {

                theme = 'light';
                document.body.classList.remove('dark_mode');
            }
            
        }
        // меню
        if (event.target.closest('.menu')) {
            let menu = event.target.closest('.menu');
            let headerContent = event.target.closest('.header-content');

            document.body.classList.toggle('_lock')
            headerContent.classList.toggle('_active');

        }
        // spoilers click
        if (event.target.closest('.spoiler__show')) {

            let theoryItem = event.target.closest('.theory__item');

            // lazy load для спойлеров
            lazyLoadOfSpoilers(theoryItem.querySelector('[data-src]'));

            let hideSpoiler = theoryItem.querySelector('.spoiler__hide');
            if (hideSpoiler) {
                if (!theoryItem.classList.contains('_active')) {
                    _slideDown(hideSpoiler, theoryItem, 300);
                } else {
                    _slideUp(hideSpoiler, theoryItem, 300);

                }
            }
        }
        // navagation click
        if (event.target.closest('[data-goto]')) {
            const gotoItem = event.target.closest('[data-goto]');
            if (gotoItem.dataset.goto) {
                const gotoBlock = document.querySelector(gotoItem.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

                // при мобильном меню его надо сворачивать
                let headerContent = event.target.closest('.header-content');

                document.body.classList.remove('_lock')
                headerContent.classList.remove('_active');

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: 'smooth'
                });
            }
        }
    }

    // обработчик событий клика на странице
    document.addEventListener('click', documentClick);


});