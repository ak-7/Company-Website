/*
 * Загрузка
 */

var preloader = {
	disable : undefined,
	start : undefined,
	onLoad : function() {
	},
	$slide : undefined,
	visuals : undefined,
	fillVisuals : function() {
	},
	fillingTime : 1400,
	delayBeforeLoadCheck : 0,
	targetLogoWidth : 0
};

var loaderClass = 'loadBackground';

preloader.fillVisuals = function(fillAmount, callback) {

	if (!callback)
		callback = function() {
		};

	$(function() {
		preloader.visuals.loaded/*.stop(false, false)*/.animate({
			'width' : preloader.targetLogoWidth * fillAmount
		}, {
			duration : preloader.fillingTime,
			queue : false
		});
		preloader.visuals.unloaded/*.stop(false, false)*/.animate({
			'width' : (1 - fillAmount) * preloader.targetLogoWidth
		}, {
			duration : preloader.fillingTime,
			queue : false,
			complete : callback
		});
	});

}

preloader.disable = function(param) {

	if (param && param.rough) {

		$('.' + loaderClass).remove();
		preloader.$slide.remove();

	} else {

		$('.' + loaderClass).delay(300).animate({
			'opacity' : 0
		}, preloader.fillingTime, function() {
			$(this).remove();
		});

		preloader.$slide.animate({
			'opacity' : 0,
			/*left: "-"+preloader.$slide.width()+"px"*/
		}, preloader.fillingTime, function() {
			$(this).remove();
		});
	}

	$(document.body).removeClass('unloaded');

}
$(function() {
	return;
	var $media = $('html').find('img,video');

	var lc = 0;
	$media.on('load', function() {
		lc++;
		tdLib.debLog('loadEvent() fired. Total fired: ' + lc + '\n Still need to load ' + ($media.length - lc));
		console.log(this);
	});
	$media.on('error', function() {
		lc++;
		tdLib.debLog('errorEvent() fired.');
		console.log(this);
	});
});

preloader.init = function(){
	preloader.visuals = {
		loaded : $('.preloaderCont .ending'),
		unloaded : $('.preloaderCont .starting')
	};
	preloader.$slide = $('.preloaderCont');
	preloader.targetLogoWidth = .9 * $(window).innerWidth();
}

preloader.start = function() {
	
	preloader.init();
	
	var $media = $('html').find('img,video');

	var mediaCount = $media.length;

	var local_onContentLoad = this.onContentLoad;

	var loaded = 0;

	preloader.visuals.loaded
	.add(preloader.visuals.unloaded)
		.css('opacity', 0);

	var $subCont = $('.preloaderCont .subCont');

	var imageAspect = preloader.visuals.loaded.find('img').width() / preloader.visuals.loaded.find('img').height();

	preloader.visuals.loaded.find('img')
	.add(preloader.visuals.unloaded.find('img'))
	.add(preloader.visuals.unloaded)
		.css('width', preloader.targetLogoWidth);

	$subCont
	.add(preloader.visuals.loaded.find('img'))
	.add(preloader.visuals.unloaded.find('img'))
		.css('height', preloader.targetLogoWidth / imageAspect);

	

	function getFilesToLoadCount() {

		var a = $media.filter(function() {

			// причина: в одном из браузеров не обнаружил complete у svg-изображения
			if (this.src && this.src.indexOf('svg') > -1) {
				return false;
				// видео
				/*READY_STATE http://www.w3schools.com/tags/av_prop_readystate.asp*/
			} else if (this.readyState !== undefined && this.readyState >= 3) {
				return false;
			} else if (this.complete) {
				return false;
			}

			//console.log(this);
			return true;

		});

		return a.length;
	}

	setTimeout(earlyCachedDetection, preloader.delayBeforeLoadCheck);

	function earlyCachedDetection() {

		var alreadyLoaded = getFilesToLoadCount();

		if (alreadyLoaded == 0) {

			tdLib.debLog('No need to load.');

			preloader.onLoad();
			preloader.disable({
				'rough' : true
			});

			return;

		} else {

			preloader.visuals.loaded.add(preloader.visuals.unloaded).animate({
				'opacity' : 1
			}, 300);
			a();
		}
	}

	function a() {

		var notLoaded = getFilesToLoadCount();

		var loadedPart = (mediaCount - notLoaded ) / mediaCount;

		if (notLoaded == 0) {

			tdLib.debLog('Finished loading');

			preloader.fillVisuals(loadedPart, preloader.onLoad);

		} else {

			setTimeout(a, 1000);

			tdLib.debLog('Still need to load ' + notLoaded);

			preloader.fillVisuals(loadedPart);

		}
	}

}