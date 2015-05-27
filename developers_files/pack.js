

$(function(args) {
	
	function c(a){
		return $('body').hasClass(a);
	}
	
	function adaptiveColsSystem(p){
		
		p.bWPM=p.bW+p.bM;
			
		function recalculation(){
			var bCW = p.bo.width(),
				cols = Math.floor((bCW+p.bM)/p.bWPM);
				
			cols=Math.max(p.colsRange[0],cols);
			cols=Math.min(p.colsRange[1],cols);
			
			if(p.lC&&p.lC==cols)return; // prevent layout change 
									// when column count stays the same
			p.lC=cols;
			p.onCountMade(cols);
			p.r.css('width',(cols-1)*p.bWPM+p.bW);
			
			
		}
		
		recalculation();
		
		$(window).on('resize',function(){
			recalculation();
		});
	}
	
	if(c('clones')){
		
		var r = $('.blocks'),
			b=r.find('.block'),
			p = r.children('.popup'),
			pImg = p.find('>img'),
			pBrd = parseInt(pImg.css('border-left-width')),
			pImgRatio = pImg.width()/pImg.height(),
			posC = ['l','c','r'],
			f=$('#footer'),
			eyeEv='mouseover touch',
			co=[],
			colWidth,
			colMarg;
		
		
		
		var ppH = {
			wait: 1500,
			tOID: undefined
		};
		
		for(var i=0;i<3;i++){
			var e = $('<div/>').addClass('co');
			p.before(e);
			co.push(e);
		}
		
		function fillCols(cols){
			
			p.stop(true,true).hide();
			
			if(cols<3){
				var w = (cols-1)*(colWidth+colMarg)+colWidth-pBrd*2,
					h = w/pImgRatio; 
				
				pImg.css({
					'width':w,
					'height':h
				});
			} else {
				pImg.css({
					'width':'',
					'height':''
				});
			} 
			
			var i=0;
			b.each(function(){
				
				var cI = i%cols,
					popupClass = posC[cI],
					bl = $(this),
					imgSrc=bl.attr('previewUrl');
				if(cols==2 && cI==1){
					popupClass = 'r';
				}
				
				bl.appendTo(co[cI]).css({'display':''});
				
				bl.find('.eyeIcon')
				.off(eyeEv)
				.on(eyeEv,function(){
					var  
						t = $(this)
						rO=r.offset().top,
						tO=t.offset().top,
						offsetB=tO-rO,
						h = t.height(),
						tOPH = offsetB+h;
					
					clearTimeout(ppH.tOID);
					pImg
					.removeAttr('src')
					.attr('src',imgSrc);
					p
					.stop(true,true)
					.removeClass(posC.join(' '))
					.addClass(popupClass)
					.css({
						'top':tOPH,
						'opacity':0
					});
					p.show();
					var 
						rOH = r.outerHeight(),
						rH = r.height(),
						pH = p.outerHeight(),
						pB = tOPH+pH;
					if(pB>rOH){
						var m = pB-rH;
						r.css({
							'padding-bottom':m
						});
					}
					p.css('opacity','');
					t.on('mouseleave',function(){
						ppH.tOID = setTimeout(
							function(){
								p.fadeOut();
							},
							ppH.wait
						);
						t.off('mouseleave');
					});
				});	
				i++;
			});
		}
		
		colWidth = co[0].innerWidth();
		colMarg = parseInt(co[1].css('margin-left'));
		
		adaptiveColsSystem({
			r:r,
			bo:$('#body'),
			bW:colWidth,
			bM:colMarg,
			colsRange:[1,3],
			onCountMade: fillCols	
		});
		
	} else if(c('awards')){
		
		var r = $('.blocks'),
			b=r.find('.block'),
			bo=$('#body'),
			bW=b.eq(0).innerWidth(),
			bM=parseInt(b.eq(1).css('margin-left')),
			lILC = 'lastInLine',
			colsRange=[1,3];
	
		function onColsCalculated(cols){
			b.each(function(i,e){
				var t = $(e);
				if(i%cols+1==cols){
					t.addClass(lILC);
				} else {
					t.removeClass(lILC);
				}
			});
		}
		
		var s = {
			r : r,
			bo:bo,
			bW:bW,
			bM:bM,
			colsRange:colsRange,
			onCountMade: onColsCalculated
		};
		
		adaptiveColsSystem(s);
		
	} else if(c('team')){
		
		var dur = {
			swap: 220,
			interswap: {
				min: 3000,
				max: 7000
			}
		}
		
		dur.interswap.delta = dur.interswap.max - dur.interswap.min;
		
		$('.photos .multiLayer').each(function(args) {
			var $this = $(this), 
				images = $this.find('.photosContainer img'), 
				currentIndex = images.length - 1;
				
				
			function randomPhotoSwap(){
			
				var next = {
					index: tdLib.positiveModulo(currentIndex-1,images.length)
				};
				next.image = $(images[next.index]);
				
				
				var a = Math.random()>.5?('-'):'';
				var b = Math.random()>.5?'top':'left';
				var startDisposition = {'z-index': '2'};
				startDisposition[b]=a+'100%';
				
				next.image.css(startDisposition);
				next.image.animate({
					left: 0,
					top: 0
				}, dur.swap ,function (args) {
					next.image.css({'z-index': '1'});
					$(images[currentIndex]).css({'z-index': 'auto'});
					currentIndex=next.index;
				    planRandomPhotoSwap();
				});
			};
			
			function planRandomPhotoSwap (){
				setTimeout(randomPhotoSwap,Math.random()*dur.interswap.delta+dur.interswap.min);
			};
			planRandomPhotoSwap();
		});
	} else if (c('portfolio')){
		var $bl = $('#box-list');
		
		
		var wideLiMinimumWidth = 500,
			fullSizeTilesMinimumWidth = 700;
		
		function adapt(){
			
			var wW = $(window).innerWidth();
			
			/*if (wW < wideLiMinimumWidth) {
			
				wideLis.each(function(args) {
					$(this).attr('data-cols', 2);
				});
		
			} else {
				
				wideLis.each(function(args) {
					$(this).attr('data-cols', $(this).data('initialWidth'));
				});
			}
			
			if(wW < fullSizeTilesMinimumWidth){
				grid.smallerScale();
			} else {
				grid.fullScale();
			}*/
		}
		
		var grid = new Grid($bl);
		
		var wideLis = $('#box-list > li').filter(function(args) {
			return $(this).attr('data-cols') > 2;
		}).each(function(args) {
			$(this).data('initialWidth', $(this).attr('data-cols'));
		});
		
		
		adapt();
		grid.render();
		
		$(window).on('resize', function() {
		
			
			adapt();
			grid.render({
				animated : true,
				dur : 1500
			});
		});
		
		$bl.find('> li').on('hover', function() {
			var $t = $(this);
			var headerHeight = $t.find('h1 span').height();
			var headerFontSize = parseInt($t.find('h1 span').css('font-size'), 10);
			var $desc = $t.find('.desc');
			var baseHeaderSize = 36;
			if (headerHeight > headerFontSize * 1.5) {
		
				$desc.css('top', headerHeight - headerFontSize + 50 + 'px');
		
			}
		
		});
	}
});
