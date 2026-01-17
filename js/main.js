(function($) {
  'use strict';

  var symbols = {
    RUB: '₽',
    UAH: '₴',
    USD: '$',
    EUR: '€'
  };

  var rates = {
    RUB: 1,
    USD: 70,
    EUR: 80,
    UAH: 2.4
  };

  var materialsText = {
    paints: {
      title: 'Список красок',
      text: 'Ниже полный список используемых оттенков.'
    },
    brushes: {
      title: 'Кисти',
      text: 'Круглые № 2–6, плоская 10–12, мягкая синтетика.'
    },
    paper: {
      title: 'Бумага',
      text: 'Хлопок 300 г/м², холодное прессование. Формат — по желанию.'
    },
    pencil: {
      title: 'Карандаш',
      text: 'Обычный 2B или 3B для набросков.'
    }
  };

  function formatMoney(num) {
    var n = Math.round(num);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function convertFromRub(rub, code) {
    var rate = rates[code] || 1;
    if (code === 'RUB') return rub;
    return rub / rate;
  }

  function setPricesIn($block, code) {
    var rubNew = parseFloat($block.attr('data-rub')) || 0;
    var rubOld = parseFloat($block.attr('data-rub-old')) || 0;

    var newVal = convertFromRub(rubNew, code);
    var oldVal = convertFromRub(rubOld, code);

    $block.find('.js-new').text(formatMoney(newVal));
    $block.find('.js-old').text(formatMoney(oldVal));
    $block.find('.js-cur-symbol').text(symbols[code] || '₽');
  }

  function setCurrencyGlobal(code) {
    $('.prices').each(function() {
      setPricesIn($(this), code);
    });
  }

  function setMaterialsInline(key) {
    var info = materialsText[key];
    if (!info) return;
    $('#materialsInline').find('.materials-inline__title').text(info.title);
    $('#materialsInline').find('.materials-inline__text').text(info.text);
  }

  function toggleMaterialsPopover(show) {
    var $popover = $('#materialsPopover');
    if (!$popover.length) return;
    if (show) {
      $popover.stop(true, true).fadeIn(150);
    } else {
      $popover.stop(true, true).fadeOut(150);
    }
  }

  $(function() {
    // Плавный скролл
    $('.js-scroll').on('click', function(e) {
      var href = $(this).attr('href');
      if(!href || href.charAt(0) !== '#') return;
      var $t = $(href);
      if(!$t.length) return;
      e.preventDefault();
      var offset = $('.navbar').outerHeight() || 0;
      $('html, body').animate({ scrollTop: $t.offset().top - offset + 1 }, 550);
      $('.navbar-collapse').collapse('hide');
    });

    // Материалы
    $('.material-item').on('click', function() {
      var key = $(this).data('material');
      if (!key) return;
      $('.material-item').removeClass('active');
      $(this).addClass('active');
      setMaterialsInline(key);
      toggleMaterialsPopover(key === 'paints');
    });

    // Закрытие поповера по клику вне блока
    $(document).on('click', function(e) {
      if ($(e.target).closest('.material-item, #materialsPopover').length) return;
      toggleMaterialsPopover(false);
    });

    // Переключатель валюты (в каждой карточке свой)
    $('.currency-switch').on('click', '.cur-btn', function() {
      var $btn = $(this);
      var raw = ($btn.data('currency') || 'rub').toString().toLowerCase();
      var code = raw === 'usd' ? 'USD' : raw === 'eur' ? 'EUR' : raw === 'uah' ? 'UAH' : 'RUB';

      var $wrap = $btn.closest('.prices');
      $wrap.find('.cur-btn').removeClass('active');
      $btn.addClass('active');
      setPricesIn($wrap, code);
    });

    // Демо-отправка
    $('.js-join').on('click', function(e) {
      e.preventDefault();
      alert('Заявка отправлена! (демо)');
    });

    // FAQ-аккордеон
    $('.faq-item .faq-q').on('click', function() {
      var $item = $(this).closest('.faq-item');
      var $a = $item.find('.faq-a');

      if($item.hasClass('open')){
        $a.stop(true,true).slideUp(220);
        $item.removeClass('open');
      } else {
        $('.faq-item.open').removeClass('open').find('.faq-a').stop(true,true).slideUp(220);
        $a.stop(true,true).slideDown(220);
        $item.addClass('open');
      }
    });

    // Инициализация
    setCurrencyGlobal('RUB');
    $('.faq-item.is-open').addClass('open').find('.faq-a').show();
    setMaterialsInline('paints');
    $('.material-item[data-material="paints"]').addClass('active');
  });

})(jQuery);
