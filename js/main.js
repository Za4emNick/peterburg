/*
  jQuery 3 динамика:
  - Плавный скролл по якорям
  - Переключение валют и пересчет цен (пример: 70 ₽ = 1 $)
  - Открытие списка красок
  - FAQ-аккордеон
*/

(function($){
  'use strict';

  var symbols = {
    RUB: '₽',
    UAH: '₴',
    USD: '$',
    EUR: '€'
  };

  function formatMoney(num){
    var n = Math.round(num);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function convertFromRub(rub, code){
    if(code === 'RUB') return rub;
    if(code === 'USD') return rub / 70; // по ТЗ пример
    if(code === 'EUR') return rub / 80; // условно
    if(code === 'UAH') return rub / 2.4; // условно
    return rub;
  }

  function setPricesIn($block, code){
    var rubNew = parseFloat($block.attr('data-rub')) || 0;
    var rubOld = parseFloat($block.attr('data-rub-old')) || 0;

    var newVal = convertFromRub(rubNew, code);
    var oldVal = convertFromRub(rubOld, code);

    $block.find('.js-new').text(formatMoney(newVal));
    $block.find('.js-old').text(formatMoney(oldVal));
    $block.find('.js-cur-symbol').text(symbols[code] || '₽');
  }

  function setCurrencyGlobal(code){
    $('.prices').each(function(){
      setPricesIn($(this), code);
    });
  }

  $(function(){
    // Smooth scroll
    $('.js-scroll').on('click', function(e){
      var href = $(this).attr('href');
      if(!href || href.charAt(0) !== '#') return;
      var $t = $(href);
      if(!$t.length) return;
      e.preventDefault();
      var offset = $('.navbar').outerHeight() || 0;
      $('html, body').animate({ scrollTop: $t.offset().top - offset + 1 }, 550);
      $('.navbar-collapse').collapse('hide');
    });

    // Materials popover (paints)
    $('.material-item').on('click', function(){
      var key = $(this).data('material');
      if(key !== 'paints') return;
      var $popover = $('#paintsPopover');
      if($popover.is(':visible')) {
        $popover.stop(true,true).fadeOut(150);
      } else {
        $popover.stop(true,true).fadeIn(150);
      }
    });

    // hide popover on outside click
    $(document).on('click', function(e){
      var $pop = $('#paintsPopover');
      if(!$pop.length) return;
      if($(e.target).closest('.material-item, #paintsPopover').length) return;
      $pop.stop(true,true).fadeOut(150);
    });

    // Currency switch (per-card)
    $('.currency-switch').on('click', '.cur-btn', function(){
      var $btn = $(this);
      var raw = ($btn.data('currency') || 'rub').toString().toLowerCase();
      var code = raw === 'usd' ? 'USD' : raw === 'eur' ? 'EUR' : raw === 'uah' ? 'UAH' : 'RUB';

      var $wrap = $btn.closest('.prices');
      $wrap.find('.cur-btn').removeClass('active');
      $btn.addClass('active');
      setPricesIn($wrap, code);
    });

    // Join buttons demo
    $('.js-join').on('click', function(e){
      e.preventDefault();
      alert('Заявка отправлена! (демо)');
    });

    // FAQ accordion
    $('.faq-item .faq-q').on('click', function(){
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

    // Init default currency and initial FAQ state
    setCurrencyGlobal('RUB');
    $('.faq-item.is-open').addClass('open').find('.faq-a').show();
  });

})(jQuery);
