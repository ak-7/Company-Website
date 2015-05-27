/*
 * Пожалуйста, предоставляйте 
 * релевантные глобальные переменные
 * windowWidth, windowHeight, windowAspect
 * перед вызовами resizeables.adjust()
 */

var resizeables = {

	engineCreator: undefined,
	
	engine: undefined,
	
	initFromDescript: function(d){
		resizeables.engine.getContainersFromDescript(d);
	},
	init: function(){
		resizeables.engine.findContainers();
	},
	adjust: function(){
		resizeables.engine.adjust();
	},
	fillModes: {
		FILL_PARENT : 'fillParent',
		FIT_PARENT : 'fitParent',
		FIT_PARENT_WIDTH : 'fitParentWidth'
	},
	orientations: {
		LANDSCAPE : 'landscape',
		PORTRAIT : 'portrait'
	},
	criticalReadabilityClass: 'criticalReadability',
	
	/* Минимально допускаемый движком 
	 * размер шрифта на .criticalReadability*/
	minimalReadableFontSize: 11
};


	
	/* window.innerWidth и window.innerHeight 
	 * на машине верстальщика при 100% зуме. */
	
resizeables.reference = {w:1280, h:923};

resizeables.engineCreator = function(){
			
	var list = [],
		l,
		obj = resizeables;

	this.findContainers = function(){
		
		for (var fm in obj.fillModes) {
			$('.' + obj.fillModes[fm]).each(function() {
				var a = new aRContainer($(this), obj.fillModes[fm]);
				list.push(a);
			});
		}
		l = list.length;
	}
	
	this.getContainersFromDescript = function(d){
		
		for (var aRCIndex in d) {
			var aRCData = d[aRCIndex];
			aRCData.$src = $(aRCData.srcString);
			var aRC = new aRContainerGeneric(aRCData);
			list.push(aRC);
		}
		l = list.length;
	}
	
	this.adjust = function() {
		for (var i = 0, arc = list[i]; i < l; i++, arc = list[i]) {
			arc.adjust();
		}
	}
	
	function aRContainer($src, fillMode) {
		return new aRContainerGeneric({
			$src : $src,
			fitting : fillMode
		});
	}

	function aRContainerGeneric(src) {

		var $src = src.$src, 
			fitting = src.fitting, 
			multiLayout = src.multiLayout, 
			initialDim, 
			initialDimRelative, 
			aspect, 
			baseFontSize,
			versionB;

		this.recollectMetrics = function() {

			$src.css({
				width : '',
				height : '',
				'font-size' : ''
			});

			initialDim = {
				w : $src.outerWidth(true),
				h : $src.outerHeight(true)
			};
			aspect = initialDim.w / initialDim.h;
			initialDimRelative = {
				w : initialDim.w / resizeables.reference.w,
				h : initialDim.h / resizeables.reference.h
			};
			baseFontSize = parseInt($src.css('font-size'), 10);

		};
		
		versionB = src.versionB;

		if(versionB){
			$src.css('display','inline-block');
		}
		
		this.recollectMetrics();

		criticalElements = $src.find('.' + obj.criticalReadabilityClass);
		this.parent = $src.parent();

		var currentOrientation, lastOrientation = 'none';

		function updateOrientation() {
			currentOrientation = windowAspect > layoutSwitchThreshold ? obj.orientations.LANDSCAPE : obj.orientations.PORTRAIT;
		}

		var layoutSwitchThreshold = 1;
		if (src.layoutSwitchThreshold) {
			layoutSwitchThreshold = src.layoutSwitchThreshold;
		}

		this.adjust = function() {

			if (multiLayout) {

				updateOrientation();

				if (currentOrientation != lastOrientation) {

					$src.addClass(currentOrientation).removeClass(lastOrientation);

					this.recollectMetrics();

					lastOrientation = currentOrientation;
				}

			}
			
			var anchorDim = 'w', complementDim = 'h';

			if (fitting === obj.fillModes.FILL_PARENT) {
				if (aspect > windowAspect) {
					anchorDim = 'h';
				} 
			} else if (fitting === obj.fillModes.FIT_PARENT) {
				if (aspect < windowAspect) {
					anchorDim = 'h';
				}
			}
			
			if(anchorDim=='h'){
				complementDim = 'w';
			}
			
			var widthToBe, heightToBe, fontSizeToBe;
			
			var dimToBe = {
				h: 0,
				w: 0
			};
			
			var windowDim = {
				h: windowHeight,
				w: windowWidth
			};
			
			var marginNameTranslation = {
				h: 'margin-left',
				w: 'margin-top'
			};
			
			
			
			

			dimToBe[anchorDim] = 
				windowDim[anchorDim]*
				(fitting === obj.fillModes.FILL_PARENT || versionB ? 
					1 
					: initialDimRelative[anchorDim]
				);
			
			dimToBe[complementDim] = 
				dimToBe[anchorDim];
			
			if(complementDim=='h'){
				dimToBe[complementDim] /= aspect;
			} else {
				dimToBe[complementDim] *= aspect;
			}
			
			
			if(dimToBe[complementDim]>windowDim[complementDim]){
				
				var remargin = 
					-(dimToBe[complementDim] - windowDim[complementDim]) / 2;
				
				var complementMargin = marginNameTranslation[anchorDim],
					anchorMargin = marginNameTranslation[complementDim];
					
				$src.css(anchorMargin,'');
				$src.css(complementMargin,remargin);
			}
			
			fontSizeToBe = dimToBe.h/initialDim.h;
			
			
			

			$src.width(dimToBe.w);
			$src.height(dimToBe.h);
			
			fontSizeToBe *= baseFontSize;
			$src.css('font-size', fontSizeToBe);

			// Здесь следим за тем, чтобы у специально помеченных надписей
			// размер был не меньше порога [ obj.minimalReadableFontSize ]
			for (var i = 0, l = criticalElements.length; 
					 i < l;  
					 i++) {
						
				$ce = $(criticalElements[i]);

				$ce.css('font-size', '');

				var calculatedFontSize = parseInt($ce.css('font-size'), 10);

				if (calculatedFontSize < obj.minimalReadableFontSize) {
					$ce.css('font-size', obj.minimalReadableFontSize + 'px');
				}
			}


		}
	}

	return this;
};

resizeables.engine = new resizeables.engineCreator();


var baseFontSize;

function adjustFontSize() {

	var diminishing = {
		w : window.innerWidth / resizeables.reference.w,
		h : window.innerHeight / resizeables.reference.h
	};

	$('body').css('font-size', baseFontSize * Math.min(diminishing.w, diminishing.h));

	$('#parallax').trigger('fontAdjust');
}