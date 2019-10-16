var $w = $(window),
    $d = $(document);

$d.ready(function() {
    
    var $btnOpenModal = $('.btn-enter'),
        $btnCloseModal = $('.modal_btn-close'),
        $modal = $('.modal'),
        $modalBackdrop = $('.modal_backdrop');

    var $headerHelp = $('.header-help'),
        $headerMobileHumburger = $('.header-mobile-humburger'),
        $humburgerMenu = $('.humburger__menu'),
        $dropdown = $('.dropdown');

    var $mobDropdownBtn = $('.mob-dropdown-btn');

    // открыть модальное окно
    function openModal() {
        $modal.show(300);
    }

    // закрыть модальное окно
    function closeModal() {
        $modal.hide(300);
    }

    $btnOpenModal.on('click', openModal);
    $btnCloseModal.on('click', closeModal);
    $modalBackdrop.on('click', closeModal);

    // закрыть модальное окно по клику на Ecs
    $d.keyup(function(e) {
        if (e.keyCode === 27 && $modal.is(':visible')) {
            closeModal();
        }
    });

    // открыть-закрыть выпадающее меню
    $headerHelp.on('click', openCloseDropdownMenu);
    $headerMobileHumburger.on('click', openCloseDropdownMenu);

    function openCloseDropdownMenu() {
        $dropdown.toggle();
        if ($w.width() < 600) {
            $humburgerMenu.toggleClass('humburger__open-menu');
        }
    }

    // закрыть выпадающее меню по клику на Ecs
    $d.keyup(function(e) {
        if (e.keyCode === 27 && $dropdown.is(':visible')) {
            closeDropdownMenu();
        }
    });

    function closeDropdownMenu() {
        $dropdown.hide();
        if ($w.width() < 600) {
            $humburgerMenu.removeClass('humburger__open-menu');
        }
    }

    // Закрыть выпадающее меню при клике за его пределами
    $d.on('click', closeClickOutDropdownMenu);

    function closeClickOutDropdownMenu(e) {
        var $target = $(e.target);
        if ($dropdown.is(':visible') && (!$target.hasClass('header-help') && !$target.is('.humburger__menu'))) {
            if (!$dropdown.is($target) && $dropdown.has($target).length === 0) {
                closeDropdownMenu();
            }
        }
    }

    //открыть описание платежей
    function openMobileDropdownText(e) {        
        $(this).next('.wrap-text-content').slideToggle(200);
        $(this).children('.arrow-close').toggleClass('arrow-open');
    }

    $mobDropdownBtn.on('click', openMobileDropdownText);
});