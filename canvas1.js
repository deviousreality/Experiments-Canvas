// Cell Pattern 

var Background = (
	function () {
		function _class() {

			if (!(this instanceof Background))
				return new Background();
			
			var _self = this;
						
			this.Context = null;
			this.CanvasHeight = 0;
			this.CanvasWidth = 0;

			this.Options = {};
			this.CanvasFullscreen = false;
			this.fnPattern = null;
			
			this.Init = function(targetDiv, options) {
				if(targetDiv == null || typeof targetDiv == 'undefined') {return false;}
				var canvas = document.getElementById(targetDiv);
				
				_self.Options = options || {};
				_self.CanvasFullscreen = options.fullscreen || false;							
				
				_self.Context = canvas.getContext('2d');
				_self.CanvasHeight = getHeight();
				_self.CanvasWidth = getWidth();
				return true;
			}
			
			this.ResizeToWindow = function() {
				_self.CanvasHeight = getHeight();
				_self.CanvasWidth = getWidth();
				_self.Context.clearRect(0, 0, _self.CanvasHeight, _self.CanvasWidth);
				this.fnPattern(); //Execute Function for Drawing Pattern
			}
			
			this.attachResizeEvent = function() {
				var index;
				window.resizeStop.unbind(index);
				index = window.resizeStop.bind(function () {
					_self.ResizeToWindow(); 					
				});
			}

			function getHeight() {
				if(_self.CanvasFullscreen)
					_self.CanvasHeight = _self.Context.canvas.height = window.innerHeight;

				if(_self.Options.height != null || typeof _self.Options.height != 'undefined')
					_self.CanvasHeight = _self.Context.canvas.height = _self.Options.height;

				return _self.CanvasHeight;				
			}
			
			function getWidth() {
				if(_self.CanvasFullscreen)
					_self.CanvasWidth = _self.Context.canvas.width = window.innerWidth;
				
				if(_self.Options.width != null || typeof _self.Options.width != 'undefined') 
					_self.CanvasWidth = _self.Context.canvas.width = _self.Options.width;
				return _self.CanvasWidth;				
			}
		};
		return _class;
	})();

Background.prototype.RepeatX = function(targetDiv, options) {
	if(!this.Init(targetDiv, options)) { return false; }
	
	var baseCell = new Cell(options.cell);
	var cells = Array();
	
	this.runPattern = function () {
		for(var i = baseCell.xSpacing; i < this.CanvasWidth; i += (baseCell.Width + baseCell.xSpacing))
		{
			options['xpos'] = i;
			var obj = new Cell(options.cell);
			cells.push(obj);
		}
		run(this.Context);
	}

	function run(c) {
		for(var i=0; i < cells.length; i++)
		{
			var cell = cells[i];
			cell.Update(c);
		}
	}
	
	this.fnPattern = this.runPattern;
	this.attachResizeEvent();	
	this.runPattern();	
}

Background.prototype.RepeatY = function(targetDiv, options) {
	if(!this.Init(targetDiv, options)) { return false; }
	
	var baseCell = new Cell(options.cell || {});
	var cells = Array();
	
	this.runPattern = function () {
		for(var i = baseCell.ySpacing; i < this.CanvasHeight; i += (baseCell.Height + baseCell.ySpacing))
		{
			options['ypos'] = i;
			var obj = new Cell(options.cell || {});
			cells.push(obj);
		}
		run(this.Context);	
	}

	function run(c) {
		for(var i=0; i < cells.length; i++)
		{
			var cell = cells[i];
			cell.Update(c);
		}
	}
	
	this.fnPattern = this.runPattern;
	this.attachResizeEvent();	
	this.runPattern();	
}

Background.prototype.Repeat = function(targetDiv, options) {
	if(!this.Init(targetDiv, options)) { return false; }
	
	var baseCell = new Cell(options.cell);
	var cells = Array();
		
	this.runPattern = function () {		
		for(var y = baseCell.ySpacing; y < this.CanvasHeight; y += (baseCell.Height + baseCell.ySpacing)) {
			options.cell['ypos'] = y;
			for(var x = baseCell.xSpacing; x < this.CanvasWidth; x += (baseCell.Width + baseCell.xSpacing)) {
				options.cell['xpos'] = x;			
				cells.push(new Cell(options.cell));
			}
		}		
		run(this.Context);	
	}
	
	function run(c) {
		for(var i=0; i < cells.length; i++)
		{
			var cell = cells[i];
			cell.Update(c);
		}
	}
	this.fnPattern = this.runPattern;
	this.attachResizeEvent();	
	this.runPattern();	
}

var Cell = function (options) {
    options = options || {};	
	this.StrokeColor = options.strokecolor || 'rgba(0,0,0,1)';
	this.LineWidth = options.linewidth || 1;
	
	this.FillColor = options.fillcolor || 'rgba(0,0,0,1)';

    this.Height = options.size || 20;
	this.Width = options.length || 20;
    this.Angle = options.angle || 0;

	this.xSpacing = options.xspacing || 5; //defaults to line size
	this.ySpacing = options.yspacing || 5;	
	this.Offset = options.offset || 0;
	
	this.Xpos = options.xpos || 0; //X-position
	this.Ypos = options.ypos || 0; //y-position
};

Cell.prototype.Update = function(c) {
	c.save();
	c.beginPath();
	if(this.Angle != 0) {
	//c.translate( this.Xpos/2, this.Ypos/2 ); //interesting effect
		c.translate( this.Xpos+(this.Width/2), this.Ypos+(this.Height/2) );
		c.rotate(this.Angle*Math.PI/180);
		c.rect(-this.Width, -this.Height/2, this.Width, this.Height);
	} else {
		c.rect(this.Xpos, this.Ypos, this.Width, this.Height);
	}
	c.strokeStyle = this.StrokeColorl
	c.fillStyle = fillBox(this.FillColor);
	c.fill();
	c.stroke();
	c.restore();
	
	function fillBox(fill) {
		if(Array.isArray(fill)) {
			var item = fill[Math.floor(Math.random()*fill.length)]
			return item;
		}
		return fill;
	}
}
Background.prototype.HorizontalLine = function(targetDiv, options) {
	if(!this.Init(targetDiv, options)) { return false; }
	
	var baseLine = new Line(options.line);
	var lines = Array();

	this.runPattern = function () {	
		for (var y = baseLine.Size; y < this.CanvasHeight; y += baseLine.Spacing)
			if (Math.abs(y) % 2 == 1) {
				options.line['movex'] = 1
				options.line['movey'] = pointStartFix(y);
				options.line['linex'] = this.CanvasWidth;
				options.line['liney'] = pointStartFix(y);
				lines.push(new Line(options.line));
			}
		run(this.Context);	
	}

	function run(c) {
		c.save();
		c.beginPath();
		for(var i=0; i < lines.length; i++)
		{
			var line = lines[i];
			line.Update(c);
		}
		c.stroke();
		c.restore();
	}
	
	function pointStartFix(i)
	{
		return Math.floor(i) + 0.5;
	}
	this.fnPattern = this.runPattern;
	this.attachResizeEvent();	
	this.runPattern();	
	
};

Background.prototype.VerticalLine = function(targetDiv, options) {
	if(!this.Init(targetDiv, options)) { return false; }
	
	var baseLine = new Line(options.line);
	var lines = Array();

	this.runPattern = function () {	
		for (var x = baseLine.Size; x < this.CanvasWidth; x += baseLine.Spacing)
			if (Math.abs(x) % 2 == 1) {
				options.line['movex'] = pointStartFix(x);
				options.line['movey'] = 1;
				options.line['linex'] = pointStartFix(x);
				options.line['liney'] = this.CanvasHeight;
				lines.push(new Line(options.line));
			}
		run(this.Context);	
	}

	function run(c) {
		c.save();
		c.beginPath();
		for(var i=0; i < lines.length; i++)
		{
			var line = lines[i];
			line.Update(c);
		}
		c.stroke();
		c.restore();
	}
	
	function pointStartFix(i)
	{
		return Math.floor(i) + 0.5;
	}
	this.fnPattern = this.runPattern;
	this.attachResizeEvent();	
	this.runPattern();	
	
};

var Line = function (options) {
    options = options || {};
    this.Color = options.color || 'rgba(0,0,0,1)';
    this.Size = getSize(options.size) || 0;
    this.Angle = options.angle || 0;
	this.Spacing = options.spacing || this.Size;
	
	this.Length = options.length || 1;
		
	this.MoveX = options.movex || 0;
	this.MoveY = options.movey || 0; 
	this.LineX = options.linex || 0;
	this.LineY = options.liney || 0; 
	
    function getSize(s) {
        if (s) {
            if (s === 0) { return 0; }
            if (Math.abs(s) % 2 === 0) { s--; }
            return s;
        } else {
            return 1;
        }
    }
};

Line.prototype.Update = function(c) {
	c.lineWidth = this.Size;
	c.strokeStyle = this.Color;

	c.moveTo(this.MoveX, this.MoveY);
	c.lineTo(this.LineX, this.LineY);	
}


/* Canvas using Patterns */
var fill1 = [
	'#CCC38B',
	'#D6873A',
	'#831D1D',
	'#33311F'
]
var fill2 = [
	'#C6BDA3',
	'#45BEA9',
	'#9D8D8D',
	'#A37566',
	'#451226'
];
var fill3 = [
	'#000000',
	'#37414e',
	'#e0eaf3',
	'#a2b4c3',
	'#61737d'
];

var surface = new Background();


/**
    window.resizeStop emulates a "resizestop" event on the window object.

    This is useful for performing actions that depend on the window size, but are expensive in one way or another - i.e. heavy DOM manipulation or asset loading that might be detrimental to performance if run as often as resize events can fire.

    The library-agnostic version assumes the best-case - full support for a number of methods that older or non-DOM-compliant browsers may not support.

    Support for the following is assumed:

        Date.now()
        Array.prototype.indexOf()
        window.addEventListener()
 
    You may need to tweak this to work cross-browser or with your library or existing application.

    @name window.resizeStop
    @namespace
*/
(function (window, setTimeout, Date) {

    var cache = [],
        last = 0,
        timer = 0,
        threshold = 500;

    window.addEventListener('resize', function () {
        last = Date.now();
        timer = timer || setTimeout(checkTime, 10);
    }, false);

    window.resizeStop = {

        /**
            Changes the threshold at which {@link checkTime} determines that a resize has stopped.
            
            @param {Number} ms
                A new threshold in milliseconds. Must be finite, greater than
                zero, and not NaN.
            @returns {Number|Boolean}
                Returns the new threshold or false if it failed.
        */
        setThreshold: function (ms) {
            if (typeof ms === 'number' && ms > -1 && !isNaN(ms) && isFinite(ms)) {
                threshold = ms;
                return ms;
            }
            return false;
        },

        /**
            Fires one or more callbacks when it looks like the user has stopped resizing the window.

            @param {Function} callback
                A function to fire when the user stops resizing the window.
            @returns {Number|Boolean}
                Either the index of the callback in the cache or Boolean false (if the callback was not a function).
        */
        bind: function (callback) {
            if (typeof callback === 'function') {
                cache.push(callback);
                return cache.length - 1;
            }
            return false;
        },

        /**
            Removes a callback from the cache. Can either be a pointer to a function or a cache index from {@see window.bindResizeStop}.

            @param {Number|Function} what
                If a number, assumed to be an index in the cache. Otherwise, the cache is searched for the presence of the passed-in value.
            @returns {Boolean}
                Whether or not {@see what} was found in the cache.
        */
        unbind: function (what) {
            // Assumes support for Array.prototype.indexOf.
            var i = (typeof what === 'number') ? what : cache.indexOf(what);
            if (i > -1) {
                cache.splice(what, 1);
            }
            return i > -1;
        }
    };

    /**
        Checks if the last window resize was over 500ms ago. If so, executes all the functions in the cache.
         
        @private
    */
    function checkTime() {
        var now = Date.now();
        if (now - last < threshold) {
            timer = setTimeout(checkTime, 10);
        } else {
            clearTimeout(timer);
            timer = last = 0;
            for (var i = 0, max = cache.length; i < max; i++) {
                cache[i]();
            }
        }
    }

})(window, setTimeout, Date);
