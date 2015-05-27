;(function(w) {

	w.customEventEngine = {

		init : function(targ, eventType) {
			if(!targ.cUE) targ.cUE = {}; 
			if(!targ.cUE[eventType]) targ.cUE[eventType] = [];
		},
		call : function(targ, eventType, args) {

			if (!targ.cUE || !targ.cUE[eventType])
				w.customEventEngine.init(targ, eventType);
				
			for (var l in targ.cUE[eventType]) {
				targ.cUE[eventType][l](args);
			}

		},
		bind : function(targ, eventType, callback) {

			if (!targ.cUE || !targ.cUE[eventType])
				w.customEventEngine.init(targ, eventType);
				
			targ.cUE[eventType].push(callback);

		}
	}
})(this);

/*
 var b = {};

 customEventEngine.bind(b,'super',function(message){
 alert('awesome '+message);
 });

 customEventEngine.call(b,'super','jesus');*/

