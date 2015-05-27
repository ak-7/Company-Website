// Проект Димы erdmko 
// c модификациями furikuretsu.

function Grid(content) {
	if (!(this instanceof Grid))
		return new Grid(content);

	var pos;
	//текущее положение x, y
	var grid;
	// 2х мерный масив сетки
	var lastEmpty;
	var dir = 1;
	// Direction 1 for right, -1 for left
	var rows;
	var self = this;
	var sx=176, sy=120;
	

	// отображение сетки
	var scale = {
		x : sx,
		y : sy, //размер
		calculated : 1 //размывка масшаба
	};
	var margin = 10;
	//отступы
	
	this.fullScale = function (){
		scale.x = sx; 
		scale.y = sy; 
	}
	this.smallerScale= function (args) {
		scale.x = sx/1.5;
		scale.y = sy/1.5 
	};
	
	// строка сетки масив длиной колонок, возвращает номер r если она уже есть
	var row = function(r) {
		if (grid[r])
			return grid[r];

		// возвращает номер r если она уже есть
		var row = [];
		for (var x = 0; x < columns; x++)
			row.push(0);
		//console.log("новая колонка!: %j",row)
		grid.push(row);

		self.rows = grid.length;
		return row;
	}
	//ищет следующий пустой элемет
	var nextEmpty = function() {
		var ey = grid.length, sx = dir < 0 ? columns - 1 : 0, ex = dir > 0 ? columns : 0;

		for (var y = lastEmpty; y < ey; y++) {
			var r = row(y)
			for (var x = sx; dir > 0 ? x < ex : x > ex; x += dir) {
				if (r[x] == 0) {
					pos.x = x;
					pos.y = lastEmpty = y;
					return pos;
				}
			}
		}
		return pos
	}
	// Умещается ли объект в сетку
	var fits = function(cols, rows) {
		// Не подходит если за горизонталью
		if (dir > 0 && pos.x + cols > columns)
			return false;
		if (dir < 0 && pos.x - cols < 0)
			return false;

		// проверки по вертикали
		var ey = pos.y + rows, ex = dir > 0 ? pos.x + cols : pos.x - cols;

		// Проходим все координаты объекта по сетке,создавая её
		// ложь если коодината уже занята
		for (var y = pos.y; y < ey; y++) {
			var r = row(y);
			for (var x = pos.x; dir > 0 ? x < ex : x > ex; x += dir) {
				//console.log("%d,%d:",x,y,r[x]);
				if (r[x] != 0)
					return false;
			}
		}
		return true;
	}
	//вставка обекта с учетом текущего значения pos вычесленного из next
	var increment = function(cols, rows) {
		//console.log('obj %dx%d inc to %d:%d', cols,rows, pos.x,pos.y);
		var ey = pos.y + rows, ex = dir > 0 ? pos.x + cols : pos.x - cols, cahe_pos = $.extend({}, pos);

		for (var y = pos.y; y < ey; y++) {
			var r = row(y)
			for (var x = pos.x; dir > 0 ? x < ex : x > ex; x += dir)
				r[x] += y == pos.y || x >= ex - 1 ? 1 : 2;
		}
		pos = nextEmpty()
		return cahe_pos;
	}
	
	var obj_css = function(elpos, cols, rows) {
		return {
			top : elpos.y * scale.y * scale.calculated,
			left : elpos.x * scale.x * scale.calculated,
			width : cols * scale.x * scale.calculated - margin,
			height : rows * scale.y * scale.calculated - margin
		};
	}

	this.resize = function() {
		var width = content.width();
		columns = Math.max(3,Math.floor(width / scale.x)); 
		//console.log(width+' '+columns);
		scale.calculated = ((width + margin) / columns) / scale.x;
		grid = [];
		pos = dir > 0 ? {
			x : 0,
			y : 0
		} : {
			x : columns - 1,
			y : 0
		};
		lastEmpty = 0;
		return this
	}
	// Вствка нового обекта в сетку
	this.next = function(cols, rows) {
		var count = 0
		while (1) {
			count++;
			if (fits(cols, rows))
				return increment(cols, rows);
			if (count >= 500)
				return false;
			pos.x += dir;
			if (pos.x > columns) {
				pos.x = 0;
				pos.y += 1;
			} else if (pos.x < 0) {
				pos.x = columns - 1;
				pos.y += 1;
			}
		}
	}
	
	this.computed_height = 0;
	 
	// последовательная вставка объектов в сетку и рендеринг объектов
	this.render = function(param) {
		
		this.computed_height = 0;
		
		this.windowWidthBeforeInitialization = content.width();
		
		this.resize();
		var grid = this;
		content.children().each(function() {
			var el = $(this);
			
			
			
			var cols = Math.min(columns,parseInt(el.attr("data-cols"))), rows = parseInt(el.attr("data-rows"));
			
			var obj_css_cached = obj_css(grid.next(cols, rows), cols, rows);
			
			grid.computed_height = Math.max(obj_css_cached.height+obj_css_cached.top,
											grid.computed_height);
			
			
			el.css('position', 'absolute').stop(true);
			
			if(param && param.animated){
				var duration = param.dur || 500; 
				el.animate(obj_css_cached,duration);
			} else {
				el.css(obj_css_cached);
			}
			
		});
		
		content.css('height',grid.computed_height);
		
		
		// Мотивация: при первой инициализации, 
		// появлении скроллбара ширина контейнера перестает соответствовать
		// ширине экрана.  
		if(this.windowWidthBeforeInitialization>content.width()){
			this.render(param);
		}
	}
	

}