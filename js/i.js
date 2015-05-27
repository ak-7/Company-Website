/*
 Если отношение windwWidth/windowHeigth больше layoutSwitchThreshold,
 элемент применяет к себе ландшафтную верстку,
 в противном случае -- портретную */

var aRCDescript = [{
	srcString : 'video',
	fitting : resizeables.fillModes.FILL_PARENT
}, {
	srcString : '#range .resizeable',
	fitting : resizeables.fillModes.FIT_PARENT,
	multiLayout : true,
	layoutSwitchThreshold : 1
}, {
	srcString : '#priceB .resizeable',
	fitting : resizeables.fillModes.FIT_PARENT,
	multiLayout : true,
	versionB : true
}];


/* Некоторые общие переменные */
var $footer, 
	windowWidth, 
	windowHeight, 
	windowAspect, 
	para, 
	wheelstep; 
var videoSubstitute = {
	$src : undefined,
	selector : '#intro .videoSubstitute'
}, controlHint = {
	$src : undefined,
	selector : '#parallax .mwHint',
	hidden : false
},

/*
 * Хранит картинки, которые хоть и не видны,
 * но будут загружены при загрузке страницы
 */
hiddenImagesContainer;

/* */

hotdot.animateOnlyHDLogo = false;
hotdot.preloaderEnabled = true;

hotdot.settings = {
	
	isWindowsSafari: 
			tdLib.deviceDescription.type == tdLib.DEVICE_TYPES.desktop
			&& tdLib.deviceDescription.os != tdLib.OS_TYPES.mac
			&& tdLib.deviceDescription.browser == tdLib.BROWSERS.safari,
	
	disableAutoHashChange: tdLib.deviceDescription.type == tdLib.DEVICE_TYPES.android, 
	
	removeScrollbar: 
		tdLib.deviceDescription.type != tdLib.DEVICE_TYPES.wPhone,
		
	touchNotScrollMode: 
		(tdLib.deviceDescription.type != tdLib.DEVICE_TYPES.desktop) 
		&& tdLib.deviceDescription.touchCapable,
		
	showTouchHint: 
		tdLib.deviceDescription.type != tdLib.DEVICE_TYPES.desktop 
		&& (supportsTouchEvents || tdLib.deviceDescription.touchCapable),
	
	isAppleMobileDevice: 
		tdLib.deviceDescription.type == tdLib.DEVICE_TYPES.iPad
		 || tdLib.deviceDescription.type == tdLib.DEVICE_TYPES.iPhone,

	mousewheelSlowness: {
		windows: 15,
		mac: 60
	},
	
	pauseSideAnimationsWhenMoving: true,
	
	dontAnimateLophotoPadding: 
		tdLib.deviceDescription.type == tdLib.DEVICE_TYPES.iPad
	
}


hotdot.settings.logoNavigationAdvancedRendering = 
	Modernizr.csstransforms3d 
	&& !hotdot.settings.isWindowsSafari;

function mainPageInit() {
	
	if(Modernizr.history 
		&& window.history.state 
		&& window.history.state.mediaIsLoaded){
			
			tdLib.debLog('Already visted. No preloader');
			
			hotdot.preloaderEnabled = false;
			
	}

	$footer = $('#footer');

	$('#footer .strt').on('click',function(){
		para.toSlide(0);
	});

	tdLib.debLog('mainPageInit');

	debugging = self.location.toString().indexOf('xe') > -1;

	

	var parallaxParams = {

		removeScrollbar : hotdot.settings.removeScrollbar,
		touchNotScrollMode : hotdot.settings.touchNotScrollMode
	}

	if (Modernizr.csstransforms3d) {

		parallaxParams.layerShiftProperty = 'translate3d';
		parallaxParams.parallaxShiftProperty = 'translate3d';
	} 
	
	para = new parallax(parallaxParams);

	tdLib.debLog('afterPara');

	baseFontSize = parseInt($('body').css('font-size'));

	hiddenImagesContainer = $('.preloadedImages');

	videoSubstitute.$src = $(videoSubstitute.selector);
	controlHint.$src = $(controlHint.selector);

	if (hotdot.settings.showTouchHint) {

		tdLib.debLog('i am touch device');
		
		$('video').remove();

		videoSubstitute.$src.show();

		if (controlHint.$src) {
			controlHint.$src.find('img').attr('src', '/static/img/touch_hint.png');
			controlHint.$src.find('p').remove();
		}

		if (parallax) {
			aRCDescript[0].$src = videoSubstitute.selector;
		}

	} else {
		videoSubstitute.$src.remove();
	}
	logoNavigation.init();

	lophoto.init();

	para.onInit = function() {

		tdLib.debLog('para.onInit');
	
		para.mouseWheelTarget.bind('mousewheel', onMouseWheel);
		$(window).on('resize', onResize);
		
		preloader.disable();
		
		lophoto.onParaInit();
		hashProcessingSystem.applyHashFromAddressLine();
		
		tdLib.debLog('no fix');
		
	}


	lastSlide.callUs.$src = $('.callUs .circleContainer .fixCont');
	
	customEventEngine.bind(para, 'scrollChange', function(amount) {

		if (!controlHint.hidden && amount > windowWidth) {
			controlHint.$src.remove();
			controlHint.hidden = true;
		};
		hashProcessingSystem.trackHashChange();
		if (!logoNavigation.lazyUpdate) {
			logoNavigation.adjust(amount / (para.width - windowWidth));
		}
	});

	customEventEngine.bind(para, 'finishedMove', function(amount) {

		
		if (!hotdot.animateOnlyHDLogo) {
			lastSlide.callUs.animation.resume();
			lophoto.animation.resume();
		}

		if (logoNavigation.lazyUpdate) {
			logoNavigation.adjustAnimated(amount / (para.width - windowWidth));
		}

	})

	
	customEventEngine.bind(para, 'startedMove', function() {
		
		if(!hotdot.settings.pauseSideAnimationsWhenMoving) return;
		
		if (!hotdot.animateOnlyHDLogo) {
			lastSlide.callUs.animation.pause();
			lophoto.animation.pause();
		}

		if (logoNavigation.lazyUpdate) {
			logoNavigation.stopAnimation();
		}
	})


	function onPreloaderLoad(){
		
		if(Modernizr.history){
			
			$('a').on('click',function (args) {
				
				var href = $(this).attr('href');
		if(href=='' || href =='#') return;
		
				window.history.pushState({
					mediaIsLoaded: 'true'
				}, 'mediaIsLoaded');  
				
			});
			
		}
		
		tdLib.debLog('in preloader.onLoad');

		resizeables.initFromDescript(aRCDescript);

		nonParaResize();

		if (parallax) {
			para.init();
		}
		
		postParaResize();

		$('#parallax').trigger('preloadFinish');
	}
	
	
	
	if(hotdot.preloaderEnabled){
		preloader.onLoad = onPreloaderLoad;	
	} else {
		preloader.init();
		onPreloaderLoad();
	}


	if(hotdot.preloaderEnabled){
		preloader.start();
	}

	tdLib.debLog('at the end of main routine');

};

function postParaResize(){
	
	var l = $('#intro > img[src$=\'intro/1.png\']');
	
	l.css('position','absolute');
	
	var hWW = windowWidth/2,
		hEW = l.width()/2;
	
	l.css('left',hWW-hEW); 
	
	l = $('#kynsi > img[src$=\'cryingCyan.png\']');
	hEW = l.width()/2;
	
	l.css('position','absolute');
	l.css('left',hWW-hEW); 
	
	l = $('.bilet2u img[src$=\'man.png\']');
	var p = l.parent();
	var parentWasHidden = l.parent().css('display')=='none';
	if(parentWasHidden) l.parent().css('display','');
	var hPW = l.parent().width()/2;
	hEW = l.width()/2;
	
	l.css('position','absolute');
	l.css('left',hPW-hEW); 
	if(parentWasHidden) l.parent().css('display','none');
		
	if(windowHeight>993){
		
		$('#intro > img').each(function (args) {
		  var $t = $(this),
		  		hH = windowHeight/2,
		  		hEH = $t.height()/2;
		  	$t.css('bottom',hH-993/2);
		});
	} else {
		$('#intro > img').each(function (args) {
		  var $t = $(this);
		  	$t.css('bottom','');
		});
	}
}

function onResize() {

	para.onResizeSlides();

	// Расщепление onResize параллакса и такая последовательность функций
	// вызваны работой движка автомасштабируемых контейнеров.
	// onResizeLayers зависит от его результатов (утверждение требует проверки),
	// потому onResizeLayers следует после.

	nonParaResize();

	para.onResizeLayers();
	
	postParaResize()	

}

function nonParaResize() {

	windowWidth = $(window).innerWidth();
	windowHeight = $(window).innerHeight();
	windowAspect = windowWidth / windowHeight;

	wheelstep = wheelStep(windowWidth);

	adjustFontSize();

	resizeables.adjust();

}



/*
 * Вспомогательные органы управления
 */

function wheelStep(windowWidth) {
	var deno = hotdot.settings.mousewheelSlowness.windows;
	if(tdLib.deviceDescription.os == tdLib.OS_TYPES.mac){
		deno = hotdot.settings.mousewheelSlowness.mac;
	}  
	return windowWidth / deno;
}

function onMouseWheel(event, delta) {

	para.add(-delta * wheelstep);
	event.preventDefault();
	event.stopPropagation();

};

$(document).keydown(function(e) {

	if (e.keyCode == '37') {
		para.closerLeft();
		e.preventDefault();
	} else if (e.keyCode == '39' || e.keyCode == '32') {
		para.closerRight();
		e.preventDefault();
	}

});

/*
 * Хэш
 */

var hashProcessingSystem = {

	addrMap : ['', 'create', 'kynsi', 'lophoto', 'bilet2u', 'pricing'],

	doNotApplyHashFromAddressLine : false,

	userLock : false,

	lastSlideI : 0,

	applyHashFromAddressLine : function() {

		var addr = self.location.toString(), selectedSlide = addr.slice(addr.indexOf('#') + 1);

		if (selectedSlide == undefined)
			return;

		for (var h in hashProcessingSystem.addrMap) {
			if (selectedSlide == hashProcessingSystem.addrMap[h] && h != hashProcessingSystem.lastSlideI) {
				hashProcessingSystem.userLock = true;
				para.toSlide((+h));
				return;
			}
		}
	},

	trackHashChange : function trackHashChange() {

		if (hotdot.settings.disableAutoHashChange) return;

		// Значение para.currentSlideI соответствует не текущему смещению,
		// а конечному. Значит, после того, как пользователь ввел хэш
		// и начал переход, значение поменяется только один раз.
		if (para.currentSlideI != hashProcessingSystem.lastSlideI) {

			hashProcessingSystem.lastSlideI = para.currentSlideI;

			if (hashProcessingSystem.userLock) {
				hashProcessingSystem.userLock = false;
				return;
			} else {
				hashProcessingSystem.doNotApplyHashFromAddressLine = true;
			}

			var infoString = 'trackHashChange : Changing hash. ';
			if (hashProcessingSystem.doNotApplyHashFromAddressLine) {
				infoString += ' Has doNotApplyHashFromAddressLine.';
			}
			if (hashProcessingSystem.userLock) {
				infoString += ' Has userHashLock.';
			}
			
			window.location.hash = hashProcessingSystem.addrMap[para.currentSlideI];

		}
	}
}

$(window).on('hashchange', function(e) {

	e.preventDefault();

	if (hashProcessingSystem.doNotApplyHashFromAddressLine) {
		//tdLib.debLog('jq.window.onhashchange : doNotApplyHashFromAddressLine, so returning.');
		hashProcessingSystem.doNotApplyHashFromAddressLine = false;
		return;
	}

	hashProcessingSystem.applyHashFromAddressLine();

	return false;

});

$("#lang_chooser").on('click', function(e) {
	$(this).attr('href', $(this).attr('href') + window.location.hash);
});
/*
 * Логотип-навигация
 */

var logoNavigation = {

	$clickableZone : undefined,
	effectiveClickableZoneWidth : 0,
	logoWidth : 0,
	$logo : undefined,
	$overlay : undefined,
	$overlayChi : undefined,
	$base : undefined,
	$baseChi : undefined,
	closer : true,
	emulatedWidthChange : hotdot.settings.logoNavigationAdvancedRendering,
	lazyUpdate : undefined
	

}

logoNavigation.lazyUpdate = !logoNavigation.emulatedWidthChange;

if(hotdot.settings.logoLazyUpdate != undefined){
	logoNavigation.lazyUpdate = false; 
}

logoNavigation.init = function() {

	logoNavigation.$logo = $footer.find('.logo').on('click', logoNavigation.onClick);
	logoNavigation.$overlay = $('#footer .logo .overlay');
	logoNavigation.$overlayChi = logoNavigation.$overlay.find('> *');
	logoNavigation.$base = $('#footer .logo .base');
	logoNavigation.$baseChi = logoNavigation.$base.find('> *');

	logoNavigation.$clickableZone = logoNavigation.$logo.find('.clickableArea');
	logoNavigation.effectiveClickableZoneWidth = logoNavigation.$clickableZone.width();
	logoNavigation.logoWidth = logoNavigation.$logo.width();

	if (!logoNavigation.emulatedWidthChange) {
		logoNavigation.$base.css({
			width : '100%',
		});
		logoNavigation.$baseChi.css({
			float : 'right',
		});

	} else {
		logoNavigation.$base.add(logoNavigation.$overlay).css({
			width : '100%',
			position : 'relative'
		});
		logoNavigation.$baseChi.add(logoNavigation.$overlayChi).css({
			float : 'none',
			position : 'relative'
		});
	}

	logoNavigation.adjust(0);
}

logoNavigation.onClick = function(e) {

	e.preventDefault();

	var footerPos, logoPos, eve;

	footerPos = $footer.offset();
	logoPos = logoNavigation.$logo.offset();

	var xRelativeToLogo;

	if (e.offsetX) {
		xRelativeToLogo = e.offsetX;
	} else {
		xRelativeToLogo = e.pageX - logoPos.left;
	}
	xRelativeToLogo /= logoNavigation.effectiveClickableZoneWidth;

	if (logoNavigation.closer) {
		var targetSlide = Math.floor(xRelativeToLogo * para.slidesCount);
		para.toSlide(targetSlide);
	} else {
		para.to(xRelativeToLogo * (para.width - windowWidth));
	}

}

logoNavigation.getWidthBasedOnPercentage = function(percentage) {
	var r = [Math.round(percentage * logoNavigation.effectiveClickableZoneWidth)];
	r[1] = logoNavigation.logoWidth - r[0];
	return r;
}

logoNavigation.adjust = function(percentage) {

	var v = logoNavigation.getWidthBasedOnPercentage(percentage);

	if (logoNavigation.emulatedWidthChange) {

		hotdot.applyHorizontalShift(-v[1], logoNavigation.$overlay.add(logoNavigation.$base));

		hotdot.applyHorizontalShift(v[1], logoNavigation.$overlayChi);
		hotdot.applyHorizontalShift(-v[0], logoNavigation.$baseChi);

	} else {

		logoNavigation.$overlay.css('width', v[0]);
		logoNavigation.$base.css('width', v[1]);
	}

}

logoNavigation.adjustAnimated = function(percentage) {

	var v = logoNavigation.getWidthBasedOnPercentage(percentage), dur = 1000;
	logoNavigation.$overlay.animate({
		'width' : v[0]
	}, dur);
	logoNavigation.$base.animate({
		'width' : v[1]
	}, dur);
}

logoNavigation.stopAnimation = function() {
	logoNavigation.$overlay.add(logoNavigation.$base).stop();
}
/*
 * Ло-фото
 */

var lophoto = {
	startCount : 1,
	imagesCount : 7,
	$src : undefined,
	init : undefined,
	onParaScroll : undefined,
	move : undefined,
	paraEngineWrapper : undefined,

	animation : {
		pause : function() {
			lophoto.$src.stop();
		},
		resume : function() {

			if (hotdot.settings.dontAnimateLophotoPadding)
				return;

			lophoto.$src.animate({
				'padding-top' : '20px'
			}, 2000, 'easeInOutCubic').animate({
				'padding-top' : '0px'
			}, 2000, 'easeOutCubic', lophoto.animation.resume);
		},
	}
}

lophoto.init = function() {

	lophoto.$src = $("#lophoto_ipad");

	customEventEngine.bind(para, 'scrollChange', function(amount) {

		if (lophoto.paraEngineWrapper.prnt.childrenVisible) {

			x = Math.ceil((lophoto.paraEngineWrapper.currentLeft / windowWidth) * 10);
			if (x < lophoto.startCount)
				x = lophoto.startCount;
			if (x > lophoto.imagesCount)
				x = lophoto.imagesCount;
			lophoto.$src.attr("src", "/static/img/lp/ipad/" + x + ".png");
		}

	});

	lophoto.animation.resume();

}
/* Наличие такого колбэка вызвано тем, что
 * движок создает слои заново при каждом изменении размеров окна */

lophoto.onParaInit = function() {
	lophoto.paraEngineWrapper = para.findLayerWrapper(lophoto.$src[0]);
}

/* Круги в последнем слайде */

var lastSlide = {

	callUs : {
		$src : undefined,
		cUDur : 3000,
		animation : {
			resume : function() {

				lastSlide.callUs.$src.animate({
					height : 70 + '%'
				}, lastSlide.callUs.cUDur).animate({
					height : 100 + '%'
				}, lastSlide.callUs.cUDur, function() {
					lastSlide.callUs.animation.resume();
				});
			},
			pause : function() {
				lastSlide.callUs.$src.stop();
			}
		}
	},

	threeCircle : {
		rotate : function($circle, radian) {
			var minimal = [-25, -30];
			var range = [97, 101];
			var func = [Math.cos, Math.sin];
			var coordinates = [];

			for (var i = 0; i < 2; i++) {
				coordinates.push(minimal[i] + range[i] * (func[i](radian) + 1) / 2);
			}

			$circle.css({
				left : coordinates[0] + '%',
				top : coordinates[1] + '%'
			})
		},
		rotateAll : function(radian) {

			var $circles = $('#priceB .peripheral > *');
			for (var i = 0; i < $circles.length; i++) {
				lastSlide.threeCircle.rotate($($circles[i]), radian - i * Math.PI * 2 / 3);
			}
		},
		timeToRadianFunction : function(time) {
			return 8 * Math.cos(time / 100000) * Math.sin(time / 10000);
		},
		refreshAll : function() {
			var time = new Date().getTime();
			lastSlide.threeCircle.rotateAll(lastSlide.threeCircle.timeToRadianFunction(time));
		},
		animateAll : function() {
			setInterval(lastSlide.threeCircle.refreshAll, 20);
		}
	}

}

$(mainPageInit);
