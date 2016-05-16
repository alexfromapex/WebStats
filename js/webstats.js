/*
 * WebStats Javascript code
 * @author Alex Watson
 * Copyright 2012-Present, Alex Watson. All rights reserved.
 *
 * ANYONE IS GRANTED A LICENSE TO COPY AND USE THIS CODE IN THEIR 
 * OWN PROJECTS AS LONG AS THIS COPYRIGHT NOTICE AND LICENSE NOTICE 
 * IS INCLUDED IN ANY CODE THAT MAKES USE THEREOF
 */

/* Declare our own WebStats namespace */
if(!window.WebStats)
{
	window.WebStats = 
	{
		barObject: function barObject()
		{
			this.name = "";
			this.type = "bar";
			this.color = "";
			this.parentCanvas = "";
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;
			this.tooltip = "";
		},
		textObject: function textObject()
		{
			this.name = "";
			this.type = "text";
			this.font = "";
			this.parentCanvas = "";
			this.text = "";
			this.align = "center";
			this.width = 10000;
			this.lineHeight = 12;
			this.color = "";
			this.x = 0;
			this.y = 0;
			this.rotation = 0;
			this.baseline = "alphabetic";
		},
		pathObject: function pathObject()
		{
			this.name = "";
			this.type = "path";
			this.parentCanvas = "";
			this.x = [];
			this.y = [];
			this.color = "";
			this.lineWidth = 0;
		},
		hoverObject: function hoverObject()
		{
			this.name = "";
			this.type ="hover";
			this.parentCanvas = "";
			this.x = 0;
			this.y = 0;
			this.width = 0;
			this.height = 0;
			this.color = "";
			this.fillStyle = "";
			this.visible = false;
		},
		arcObject: function arcObject()
		{
			this.name = "";
			this.type = "arc";
			this.parentCanvas = "";
			this.x = 0;
			this.y = 0;
			this.fillStyle = "";
			this.borderColor = "";
			this.borderWidth = 0;
			this.endAngle = 0;
			this.radius = 0;			
		},
		draw: function draw()
		{
			var object;
			var canvas;
			var ctx;
			var canvasArray = document.getElementsByTagName("canvas");
			var lastRadian = 0;
			
			/* Clear all canvases before re-drawing to avoid bleeding */
			for(var e = 0; e < canvasArray.length; e++)
			{
				ctx = canvasArray[e].getContext("2d");
				ctx.clearRect(0,0,canvasArray[e].width,canvasArray[e].height);
			}
			
			for(var i = 0; i < WebStats.objectArray.length; i++)
			{
				object = WebStats.objectArray[i];
				
				if(object.type === "bar")
				{
					canvas = document.getElementById(object.parentCanvas);
					if(canvas)
					{
						ctx = canvas.getContext("2d");
						ctx.fillStyle = object.color;
						/* Draw Bars */
						ctx.fillRect(object.x, object.y, object.width, object.height);
					}
				}
				if(object.type === "text")
				{
					canvas = document.getElementById(object.parentCanvas);
					if(canvas)
					{
						ctx = canvas.getContext("2d");
						ctx.textBaseline = object.baseline;
						/* Rotate text if rotation is set on the object */
						if(object.rotation !== 0)
						{
						     ctx.save();
	 						 ctx.translate(object.x, object.y);
							 ctx.rotate(object.rotation);
							 ctx.textAlign = object.align;
							 ctx.fillText(object.text, 0, 0);
							 ctx.restore();
						}
						else
						{
							/* Have to handle line breaks because non-angled text can become cramped */
							var words = (object.text.toString()).split(' ');
							var line = '';
							var x = object.x;
							var y = object.y;
							var maxWidth = object.width;
							ctx.textAlign = object.align;
							ctx.fillStyle = object.color;
							ctx.font = object.font;

							for(var n = 0; n < words.length; n++)
							{
								var testLine = line + words[n] + ' ';
								var metrics = ctx.measureText(testLine);
								var testWidth = metrics.width;
								if(testWidth > maxWidth)
								{
									ctx.fillText(line, x, y);
									line = words[n] + ' ';
									y += object.lineHeight;
								}
								else
								{
									line = testLine;
								}
							}
							ctx.fillText(line, x, y);
						}
					}
				}
				if(object.type === "path")
				{
					canvas = document.getElementById(object.parentCanvas);
					if(canvas)
					{
						ctx = canvas.getContext("2d");
						ctx.strokeStyle = object.color;
						ctx.beginPath();
						ctx.moveTo(object.x[0],object.y[0]);
						for(var k = 1; k < object.x.length; k++)
						{
							ctx.lineTo(object.x[k],object.y[k]);
						}
						ctx.stroke();
					}
				}
				if(object.type === "hover")
				{
					canvas = document.getElementById(object.parentCanvas);
					if(canvas)
					{
						ctx = canvas.getContext("2d");
						ctx.fillStyle = object.fillStyle;
						ctx.fillRect(object.x, object.y, object.width, object.height);
						ctx.fill();
					}			
				}
				if(object.type === "arc")
				{
					canvas = document.getElementById(object.parentCanvas);
					if(canvas)
					{
						ctx = canvas.getContext("2d");
						ctx.strokeStyle = object.borderColor;
						ctx.lineWidth = object.borderWidth;
						ctx.fillStyle = object.fillStyle;
						ctx.beginPath();
						ctx.arc(object.x,object.y,70,lastRadian,lastRadian+object.endAngle,false);
						ctx.lineTo(object.x,object.y);
						ctx.fill();
						ctx.stroke();
						lastRadian += object.endAngle;
					}
				}
			}
		},
		degreesToRadians: function degreesToRadians(degrees)
		{
			return (degrees * Math.PI)/180;
		},
		/* Function to draw a bar graph on Canvas elements */
		BarGraph: function BarGraph(chartInfo)
		{
			
				/* Check whether properties are set. If not, set a default value */
				var bgImage = chartInfo.backgroundImage ? "url(" + chartInfo.backgroundImage + ")" : "";		/* Style of Background Image */
				var textColor = chartInfo.textColor ? chartInfo.textColor : "#000";								/* Color of text on chart */
				var borderColor = chartInfo.borderColor ? chartInfo.borderColor : "#CCC";						/* Border color of chart */
			
				/* Pull out Canvas element */
				var canvas = document.getElementById(chartInfo.chartCanvasID);
				
				/* Set canvas size dynamically */
				if(canvas !== null)
					var ctx = canvas.getContext("2d");
				else
					return;
				
				/* Set Canvas element width/height to be half that of the screen */
				ctx.canvas.width  = window.innerWidth / 3;
				ctx.canvas.height = window.innerHeight / 2.5;
				
				ctx.canvas.style.backgroundImage = bgImage;
				ctx.canvas.style.border = "solid 2px " + borderColor					/* Style of border */
				
				/* Holds current bar object being processed */
				var currentBar;
				var currentBarLabel;
				var lineBreakArray;

				var chartTitle = chartInfo.title;										/* Chart title */
				var endingPointY = canvas.height / 1.5;									/* Coordinate to stop drawing bars on Y-axis */
				var barsStartingPointY = endingPointY;									/* ?????????? */
				var AxisLineWidth = 2;													/* Width used to draw Axis lines */
				var values = chartInfo.values;											/* Data values */
				var barWidth = (ctx.canvas.width) / (values.length * 4);				/* Width of bars*/
				var barPadding = ctx.canvas.width / Math.pow(values.length,1.8);		/* Padding between bars (7 Percent = divide by (100/7)) */
				var barsStartingPointX = (ctx.canvas.width/2) - ((barWidth/2) * (values.length)) - ((barPadding*(values.length-1))/2); /* VERY IMPORTANT! DONT TOUCH */
				var XAxisStartingPoint = ctx.canvas.width/(80/(values.length+10));		/* DON'T TWEAK UNLESS YOU KNOW WHAT YOU'RE DOING */

				var XLabels = chartInfo.XLabels;
				var XAxisWidth = ctx.canvas.width - XAxisStartingPoint;
				var maxValue = 0;
				var scaleMultiplier = ctx.canvas.height * 0.4;
				var startingPointY = barsStartingPointY - scaleMultiplier;
				
				var YAxisObject = new WebStats.pathObject();
				var XAxisObject = new WebStats.pathObject();

				/* Text line height in pixels */
				var lineHeight = 12;

				/* Find max value to scale other values */
				for(var k = 0; k < values.length; k++)
				{
					if(values[k] > maxValue)
						maxValue = values[k];
				}
				
				/* Chart title object */
				var chartTitleObject = new WebStats.textObject();
				
				/* Y-Axis label (break apart if too long)*/
				var YAxisLabel = chartInfo.YAxisLabel === undefined ? new Array("") : chartInfo.YAxisLabel.split(" ");
				var YAxisLabelObject = new WebStats.textObject();
				
				/* Y-Axis Label's Coordinates */
				var YLabelLineOffset = lineHeight * (YAxisLabel.length-1);
				var YLabelXCoordinate = XAxisWidth + (XAxisStartingPoint/2);
				var YLabelYCoordinate = (ctx.canvas.height / 2) - YLabelLineOffset;

				/* Notches on the Y-Axis ---------------------------------------------------------------------*/
				
				var YAxisNotch = new WebStats.pathObject();
				var YAxisNotchLabel = new WebStats.textObject();
				
				var YAxisMiddleNotch = new WebStats.pathObject();
				var YAxisMiddleNotchLabel = new WebStats.textObject();

				YAxisNotch.name = "YAxisTopNotch";
				YAxisNotch.lineWidth = AxisLineWidth;
				YAxisNotch.x = [XAxisStartingPoint - 5, XAxisStartingPoint + 5];
				YAxisNotch.y = [startingPointY,startingPointY];
				YAxisNotch.parentCanvas = chartInfo.chartCanvasID;
				YAxisNotch.color = "#CCC";
				
				YAxisNotchLabel.name = "YAxisTopNotchLabel";
				YAxisNotchLabel.font = "bold " + lineHeight + "px sans-serif";
				YAxisNotchLabel.text = maxValue;
				YAxisNotchLabel.color = textColor;
				YAxisNotchLabel.x = XAxisStartingPoint/2;
				YAxisNotchLabel.y = startingPointY + (lineHeight / 2);
				YAxisNotchLabel.parentCanvas = chartInfo.chartCanvasID;
				
				YAxisMiddleNotch.name = "YAxisMiddleNotch";
				YAxisMiddleNotch.lineWidth = AxisLineWidth;
				YAxisMiddleNotch.x = [XAxisStartingPoint - 5, XAxisStartingPoint + 5];
				YAxisMiddleNotch.y = [(startingPointY+endingPointY)/2,(startingPointY+endingPointY)/2];
				YAxisMiddleNotch.parentCanvas = chartInfo.chartCanvasID;
				YAxisMiddleNotch.color = "#CCC";
				
				YAxisMiddleNotchLabel.name = "YAxisMiddleNotchLabel";
				YAxisMiddleNotchLabel.font = "bold " + lineHeight + "px sans-serif";
				YAxisMiddleNotchLabel.text = maxValue /2;
				YAxisMiddleNotchLabel.x = XAxisStartingPoint/2;
				YAxisMiddleNotchLabel.y = ((startingPointY+endingPointY)/2) + (lineHeight/2);
				YAxisMiddleNotchLabel.parentCanvas = chartInfo.chartCanvasID;
				YAxisMiddleNotchLabel.color = textColor;
				
				WebStats.objectArray.push(YAxisNotch);
				WebStats.objectArray.push(YAxisNotchLabel);
				WebStats.objectArray.push(YAxisMiddleNotch);
				WebStats.objectArray.push(YAxisMiddleNotchLabel);

				/* Done drawing notches ----------------------------------------------------------------------------*/
			
				/* Create Y Axis Label */
				if(YAxisLabel.length === 1)
				{
					YAxisLabelObject.name = "YAxisLabel";
					YAxisLabelObject.color = textColor;
					YAxisLabelObject.font = "bold " + lineHeight + "px sans-serif";
					YAxisLabelObject.text = YAxisLabel;
					YAxisLabelObject.x = YLabelXCoordinate;
					YAxisLabelObject.y = YLabelYCoordinate;
					YAxisLabelObject.parentCanvas = chartInfo.chartCanvasID;
					
					WebStats.objectArray.push(YAxisLabelObject);
				}
				else
				{
					for(var i = 0; i < YAxisLabel.length; i++)
					{
						YAxisLabelObject = new WebStats.textObject();
						YAxisLabelObject.name = "YAxisLabel";
						YAxisLabelObject.color = textColor;
						YAxisLabelObject.font = "bold " + lineHeight + "px sans-serif";
						YAxisLabelObject.text = YAxisLabel[i];
						YAxisLabelObject.x = YLabelXCoordinate;
						YAxisLabelObject.y = (YLabelYCoordinate + (i*lineHeight));
						YAxisLabelObject.parentCanvas = chartInfo.chartCanvasID;
						
						WebStats.objectArray.push(YAxisLabelObject);
					}
				}
			
				/* Calculate X and Y Axis */
				
				XAxisObject.name = "XAxis";
				XAxisObject.color = "#CCC";
				XAxisObject.lineWidth = AxisLineWidth;
				XAxisObject.x = [XAxisStartingPoint,XAxisWidth];
				XAxisObject.y = [endingPointY,endingPointY];
				XAxisObject.parentCanvas = chartInfo.chartCanvasID;
				
				YAxisObject.name = "YAxis";
				YAxisObject.color = "#CCC";
				YAxisObject.lineWidth = AxisLineWidth;
				YAxisObject.x = [XAxisStartingPoint,XAxisStartingPoint];
				YAxisObject.y = [endingPointY,startingPointY];
				YAxisObject.parentCanvas = chartInfo.chartCanvasID;
				
				WebStats.objectArray.push(XAxisObject);
				WebStats.objectArray.push(YAxisObject);
			
				/* Geometry for bars and text */
				for(var i = 0; i < values.length; i++)
				{
					
					currentBar = new WebStats.barObject();
					currentBarLabel = new WebStats.textObject();
					
					if(i > 14)
					{
						throw new Error("WebStats: " + arguments.callee.name + "(): length of 'values' array should not exceed 15.","");
						break;
					}
					if(chartInfo.colors && chartInfo.colors.length > 1)
					{
						ctx.fillStyle = chartInfo.colors[i];
						currentBar.color = chartInfo.colors[i];
					}
					else if(chartInfo.colors && chartInfo.colors.length == 1)
					{
						ctx.fillStyle = chartInfo.colors[0];
						currentBar.color = chartInfo.colors[0];
					}
					else
					{
						currentBar.color = WebStats.getRandomColor();
						ctx.fillStyle = currentBar.color;
					}

					/* Push bars onto event handler stack as objects */
					currentBar.x = barsStartingPointX + (i*barWidth) + (i*barPadding);
					currentBar.y = barsStartingPointY - ((values[i]/maxValue)*scaleMultiplier)-AxisLineWidth;
					currentBar.width = barWidth;
					currentBar.height = (values[i]/maxValue)* scaleMultiplier;
					
					currentBar.name = XLabels[i];
					currentBar.parentCanvas = chartInfo.chartCanvasID;
					currentBar.tooltip = values[i];
					
					/* Push onto stack to be drawn */
					WebStats.objectArray.push(currentBar);

					/* Bar Labels */
					currentBarLabel.name = XLabels[i];
					currentBarLabel.text = XLabels[i];
					currentBarLabel.font = "bold " + lineHeight + "px sans-serif";
					currentBarLabel.color = currentBar.color;
					currentBarLabel.parentCanvas = chartInfo.chartCanvasID;
					currentBarLabel.align = values.length > 4 ? "right" : "center";
					currentBarLabel.x = barsStartingPointX + ((barWidth+barPadding)*i) + (barWidth/2);
					currentBarLabel.y = endingPointY + lineHeight;
					currentBarLabel.rotation = values.length > 4 ? -(Math.PI/3) : 0;
					currentBarLabel.baseline = "middle";
					currentBarLabel.width = 10;
					WebStats.objectArray.push(currentBarLabel);
					
				}

				/* Chart title style */
				chartTitleObject.color = textColor;
				chartTitleObject.font = "bold 20px sans-serif";
				chartTitleObject.text = chartTitle;
				chartTitleObject.x = ctx.canvas.width / 2;
				chartTitleObject.y = ctx.canvas.height / 6;
				chartTitleObject.parentCanvas = chartInfo.chartCanvasID;
				
				WebStats.objectArray.push(chartTitleObject);
				
				/* Listen for mouse hover
				canvas.onmousemove = function mouseMoveFunction(e)
				{
					/* TODO: Implement hover support
					var hoveredObject = WebStats.hoverHandler(e);
					var ctx = hoveredObject ? document.getElementById(hoveredObject.parentCanvas).getContext("2d") : false;
					
					var hoverIndex;
					var hoverMsgObj;
					
					var posx;
					var posy;
					
					if(hoveredObject) // Mouse is hovering over an object which is now accessible through hoveredObject
					{
						// Get mouse position within Canvas
						posx = posx - e.target.offsetLeft;
						posy = posy - e.target.offsetTop;
						
					}
					
				};*/

		},
		
		/* Function to draw a pie chart on Canvas elements */
		PieChart: function(chartInfo)
		{
			/* Check whether properties are set. If not, set a default value */
			var bgImage = chartInfo.backgroundImage ? "url(" + chartInfo.backgroundImage + ")" : "";		/* Style of Background Image */
			var textColor = chartInfo.textColor ? chartInfo.textColor : "#000";								/* Color of text on chart */
			var borderColor = chartInfo.borderColor ? chartInfo.borderColor : "#CCC";						/* Border color of chart */
			var pieBorderColor = chartInfo.pieBorderColor ? chartInfo.pieBorderColor : WebStats.getRandomColor();
			
			/* Pull out Canvas element */
			var canvas = document.getElementById(chartInfo.chartCanvasID);
			
			/* Set canvas size dynamically */
			if(canvas !== null)
				var ctx = canvas.getContext("2d");
			else
				return;
			
			/* Set Canvas element width/height to be half that of the screen */
			ctx.canvas.width  = chartInfo.width ? chartInfo.width : window.innerWidth / 3;
			ctx.canvas.height = chartInfo.height ? chartInfo.height : window.innerHeight / 3;
			
			ctx.canvas.style.backgroundImage = bgImage;
			ctx.canvas.style.border = "solid 2px " + borderColor					/* Style of border */
			
			/* Chart Title Information */
			var chartTitle = chartInfo.title;
			var chartTitleObject = new WebStats.textObject();
			chartTitleObject.color = textColor;
			chartTitleObject.font = "bold 20px sans-serif";
			chartTitleObject.text = chartTitle;
			chartTitleObject.x = ctx.canvas.width / 2;
			chartTitleObject.y = ctx.canvas.height / 6;
			chartTitleObject.parentCanvas = chartInfo.chartCanvasID;
			WebStats.objectArray.push(chartTitleObject);
			
			/* Circle Information */
			var centerX = Math.floor(canvas.width /2 + canvas.width/4);
      		var centerY = Math.floor(canvas.height /2);
      		var radius = Math.floor(canvas.height / 2);
      		var circleObject;
      		var sliceLabel;
      		var totalAmount = WebStats.sumOfValues(chartInfo.values, chartInfo.values.length);
      		var sliceColor;
      		var lineHeight = 15;

			/* Draw each slice of pie */
			var percentSlice;
			for(var i = 0; i < chartInfo.values.length; i++)
			{
				circleObject = new WebStats.arcObject();
				sliceLabel = new WebStats.textObject();
				sliceColor = chartInfo.sliceColors ? chartInfo.sliceColors[i] : WebStats.getRandomColor();
				
				percentSlice = chartInfo.values[i]/totalAmount;
				/* Push circle onto object array for drawing */
				circleObject.name = "PieSlice" + i;
				circleObject.parentCanvas = chartInfo.chartCanvasID;
				circleObject.x = centerX;
				circleObject.y = centerY;
				circleObject.fillStyle = sliceColor;
				circleObject.borderColor = pieBorderColor;
				circleObject.borderWidth = 2;
				circleObject.radius = radius;
				circleObject.endAngle = (Math.PI*2*(chartInfo.values[i]/totalAmount));
				WebStats.objectArray.push(circleObject);
				
				sliceLabel.text = chartInfo.labels[i] + " (" + Math.round(100*percentSlice,2) + "%)";
				sliceLabel.x = canvas.width/20;
				sliceLabel.y = (canvas.height/3) + (lineHeight * i);
				sliceLabel.color = sliceColor;
				sliceLabel.align = "left";
				sliceLabel.baseline = "Top";
				sliceLabel.font = "bold " + lineHeight + "px arial";
				sliceLabel.parentCanvas = chartInfo.chartCanvasID;
				WebStats.objectArray.push(sliceLabel);
			}
		},
		sumOfValues: function sumOfValues(values,i)
		{
			var sum = 0;
			for(var e = 0; e < i; e++)
			{
				sum += values[e];
			}
			return sum;
		},		
		getRandomColor: function()
		{
			var digits = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    		var color = '#';
    		for (var i = 0; i < 6; i++ )
    		{
        		color += digits[Math.round(Math.random() * 15)];
    		}
    		return color;
		},
		
		objectArray: [],
		
		hoverHandler: function hoverHandler(e)
		{
				/* TODO: Implement hover capability */
				/* NOTE: Can get ID of element mouse is over with e.target.id */
				var posx = 0;
				var posy = 0;
				
				var rangex = 0;
				var rangey = 0;
				var conditional = false;
				
				var canvas = document.getElementById(e.target.id);
				var ctx = canvas.getContext("2d");
				
				if (!e) var e = window.event;
				if (e.pageX || e.pageY)
				{
					posx = e.pageX;
					posy = e.pageY;
				}
				else if (e.clientX || e.clientY)
				{
					posx = e.clientX + document.body.scrollLeft
						+ document.documentElement.scrollLeft;
					posy = e.clientY + document.body.scrollTop
						+ document.documentElement.scrollTop;
				}
				
				/* Get mouse position within Canvas */
				posx = posx - e.target.offsetLeft;
				posy = posy - e.target.offsetTop;
				
				for(var i = 0; i < WebStats.objectArray.length; i++)
				{
					if(WebStats.objectArray[i].parentCanvas == e.target.id)
					{
						rangex = WebStats.objectArray[i].x + WebStats.objectArray[i].width;
						rangey = WebStats.objectArray[i].y + WebStats.objectArray[i].height;
						conditional = (posx >= WebStats.objectArray[i].x && posx <= rangex) && (posy >= WebStats.objectArray[i].y && posy <= rangey);
						if(conditional)
						{
							return WebStats.objectArray[i];
						}
					}
				}
				
				return false;
		},
		start: function start()
		{
			WebStats.draw();
			window.setInterval(WebStats.draw, 500);
		}
	};
}
else
{
	throw new Error('WebStats namespace taken.');
}