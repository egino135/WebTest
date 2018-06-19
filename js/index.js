//$("#intro_link")[0].click();
function isElementInViewport(el) {
  var rect     = el.getBoundingClientRect(),
      vWidth   = window.innerWidth || doc.documentElement.clientWidth,
      vHeight  = window.innerHeight || doc.documentElement.clientHeight,
      efp      = function (x, y) { return document.elementFromPoint(x, y) };     

  // Return false if it's not in the viewport
  if (rect.right < 0 || rect.bottom < 0 
          || rect.left > vWidth || rect.top > vHeight)
      return false;

  // Return true if any of its four corners are visible
  return (
        el.contains(efp(rect.left,  rect.top))
    ||  el.contains(efp(rect.right, rect.top))
    ||  el.contains(efp(rect.right, rect.bottom))
    ||  el.contains(efp(rect.left,  rect.bottom))
  );
}

$(document).ready(function() {
  
  let home = document.getElementById('home');
  let intro = document.getElementById('intro');
  let practice = document.getElementById('practice');
  let tuya = document.getElementById('tuya');
  let hai = document.getElementById('hai');
  let v_gallery = document.getElementById('v-gallery');
  let contact = document.getElementById('contact');
  let price = document.getElementById('price');
  let cooperate = document.getElementById('cooperate');
  var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');

  $("#pic-1").owlCarousel({
    autoPlay: 3000, //Set AutoPlay to 3 seconds
    items : 4,
    itemsDesktop : [1199,3],
    itemsDesktopSmall : [768,1],

  }).lightGallery({
    selector: '.target'
  });

  $("#pic-2").owlCarousel({
    autoPlay: 2499, //Set AutoPlay to 3 seconds
    items : 4,
    itemsDesktop : [1199,3],
    itemsDesktopSmall : [768,1],
  }).lightGallery({
    selector: '.target'
  });

  $("#pic-3").owlCarousel({
    autoPlay: 2699, //Set AutoPlay to 3 seconds
    items : 4,
    itemsDesktop : [1199,3],
    itemsDesktopSmall : [768,1]
  }).lightGallery({
    selector: '.target'
  });
  
  $('.lg-close').click(function(){
    $('.gallery-animate').trigger('owl.play', 3000);
  });
  
  $('a.nav-link').click(function(){
    let target = this.id.split('_')[0];
    $body.stop().animate({
			scrollTop: $('#' + target).offset().top - 100
		}, 800);
    return false;
  });
  window.addEventListener('scroll', function(){
    let target;
    if(isElementInViewport(home)){
      target = 'pagetop';
    }
    else if(isElementInViewport(intro)){
      target = 'intro';
    }
    else if(isElementInViewport(practice)){
      target = 'practice'
    }
    else if(isElementInViewport(tuya)){
      target = 'tuya';
    }
    else if(isElementInViewport(hai)){
      target = 'hai';
    }
    else if(isElementInViewport(cooperate)){
      target = 'cooperate';
    }
    else if(isElementInViewport(v_gallery)){
      target = 'v-gallery';
    }
    else if(isElementInViewport(price)){
      target = 'price';
    }
    else if(isElementInViewport(contact)){
      target = 'contact';
    }
    if(typeof target !== 'undefined'){
      target += '_link';
      $('.navbar-nav a').removeClass('nav-active');
      $('#' + target).addClass('nav-active');
    }

    let animate = document.querySelectorAll('.price-content-div');
    if(isElementInViewport(animate[0]) || isElementInViewport(animate[1]) || isElementInViewport(animate[2]) || isElementInViewport(animate[3])){
      setTimeout("$('.price-content div').addClass('price-content-animate-active')", 300);
    }
    else{
      $('.price-content div').removeClass('price-content-animate-active');
    }
  });

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  /*
  main();
  */
});