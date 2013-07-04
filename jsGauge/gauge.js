function RFGauge () {
	var config = {
		container		: "gauge",
		minAngle		: -90,
		maxAngle		: 90,
		height			: 200,
		width			: 200,
		dialForeground	: "#efefef",
		dialBackground 	: "#ffffff",
		textColor		: "red",
		textFont		: "Sans-serif",
		textSize		: "30px",
		transTime		: 1000,
	};
	var currentValue = 0;
	var gaugeIsDrawn = false;
    var degree = Math.PI/180;
    var radius, thickness, inRadius, outRadius;
    var current_data;
    var arc = undefined, svg = undefined, path = undefined, textNode = undefined, pie = undefined;

    var color = d3.interpolateHsl(d3.rgb(config.dialForeground), d3.rgb(config.dialBackground));
    var dataset = {
  		apples: [0, 100],
	};

   	function render() {

   		//remove any pre existing container with same name
   		d3.select("#"+config.container)
       .remove();

   		pie = d3.layout.pie().startAngle(config.minAngle * degree).endAngle(config.maxAngle * degree)
      		  .sort(null);
      //set arc radius, thickness
      thickness = 5*Math.min(config.width, config.height)/20;//presently thickness set to 25% of min(height, width)
   		radius = Math.min(config.width, config.height) / 2 - thickness/2;
   		inRadius = radius - thickness/2;
		  outRadius = radius + thickness/2;

    	arc = d3.svg.arc()
        	.innerRadius(inRadius)
        	.outerRadius(outRadius);
    
    	svg = d3.select("body").append("svg")
        	.attr("width", config.width)
        	.attr("height", config.height)
        	.attr("id", config.container)
        	.append("g")
        	.attr("id", "pie")
        	.attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")");

    	path = svg.selectAll("path")
        	.data(pie(dataset.apples))
      		.enter().append("path")
        	.attr("fill", function(d, i) { return color(i); })
        	.attr("d", arc)
        	.attr("id", "path")
        	.each(function(d) { this._current = d; });

    	textNode = svg.append("svg:text")
            .attr("text-anchor", "middle")
            .text("")
            .attr("id", "label")
            .attr("font-family", config.textFont)
            .attr("font-size",config.textSize)
            .attr("fill",config.textColor);

        gaugeIsDrawn = true;
    }

    function arcTween(a) {
  		var i = d3.interpolate(this._current, a);
  		this._current = i(0);
  		return function(t) {
    			return arc(i(t));
  			};
	}

	function data(value){
    	dataset.apples[0] = value%100;
    	dataset.apples[1] = 100 - (value%100);
    	currentValue = dataset.apples[0];
    	draw();
	}

	function draw(){
    	d3.select('#label').text(currentValue);
    	svg.selectAll("path")
        .data(pie(dataset.apples))
    	.transition()
    	.duration(config.transTime)
        .attrTween("d", arcTween);   
    }

    //function to get the current gauge value
    this.getCurrentValue = function(){
		return currentValue;    	
    }

    //function to set a new value to gauge
	this.setValue = function(value) {
		if(!gaugeIsDrawn) {
			render();
			data(value); 
			currentValue = value;
		}
		else {
			data(value);
			currentValue = value;
		}
	}

	//resize already existing gauge to a new height, width
	this.resizeTo = function(height, width) {
		config.height = height;
		config.width = width;
		config.textSize = 80*radius/100;
		gaugeIsDrawn = false;
		this.setValue(currentValue);
	}

	//function to configure the gauge
	this.configure = function (targetID, opts) {
		config.container = targetID;
		for(var key in opts) {
			if(config.hasOwnProperty(key))
			{
				config[key] = opts[key];
			}
		}
	}
}
