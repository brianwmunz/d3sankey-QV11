var sankey_path = Qva.Remote + "?public=only&name=Extensions/sankey/";
function extension_Init() {
	// Use QlikView's method of loading other files needed by an extension. These files should be added to your extension .zip file (.qar)
	if ( typeof jQuery == 'undefined') {
		Qva.LoadScript(sankey_path + 'jquery.js', function() {
			Qva.LoadScript(sankey_path + 'd3.v3.min.js', extension_Done);
		});
	} else {
		Qva.LoadScript(sankey_path + 'd3.v3.min.js', extension_Done);
	}
}

function countInArray(array, what) {
	var count = 0;
	for (var i = 0; i < array.length; i++) {
		if (array[i] === what) {
			count++;
		}
	}
	return count;
}

function searchAndChange(target, arr) {
	var count = 1;
	var newArr = [];
	$.each(arr, function() {
		var newS = "";
		if ((this == target) && (count != 1)) {
			newArr.push(this.toString().trim() + " " + count);
			count++;
		} else if ((this == target) && (count === 1)) {
			newArr.push(this.toString())
			count++;
		} else if ($.inArray(this.toString().trim()) === -1) {
			newArr.push(this.toString());
		}
	});
	return newArr;
}

function extension_Done() {
	//Add extension
	Qva.AddExtension('sankey', function() {
		//Load a CSS style sheet
		var _this = this;
		var divName = _this.Layout.ObjectId.replace("\\", "_");
		Qva.LoadCSS(sankey_path + "style.css");
		if (_this.Element.children.length == 0) {//if this div doesn't already exist, create a unique div with the divName
			var ui = document.createElement("div");
			ui.setAttribute("id", divName);
			_this.Element.appendChild(ui);
		} else {
			//if it does exist, empty the div so we can fill it again
			$("#" + divName).empty();
		}
		//create a variable to put the html into
		var html = "";
		//set a variable to the dataset to make things easier
		var td = _this.Data;
		var sNodes = [];
		var jNodes = [];
		var rev = _this.Layout.Text0.text.toString();
		//////console.info(countInArray(testArr, "A"));
		for (var rowIx = 0; rowIx < td.Rows.length; rowIx++) {
			//set the current row to a variable
			var row = td.Rows[rowIx];
			var path = row[0].text;
			var tArr = path.split(",");
			if (rev == "1") {
				tArr.reverse();
			}
			if (tArr.length > 1) {
				$.each(tArr, function(i) {
					//tArr[i] = this.toString().trim() + "~" + i;
					if(tArr.length === (i + 1)){
						tArr[i] = this.toString().trim() + "~end";
					}else{
						tArr[i] = this.toString().trim() + "~" + i;	
					}
					/*var newThis = this.toString() + i;
					 if(countInArray(tArr,newThis) > 1){
					 tArr = searchAndChange(newThis, tArr, countInArray(tArr,newThis));
					 }*/
				});
				$.each(tArr, function(i) {
					if ($.inArray(this.toString().trim(), sNodes) === -1) {
						sNodes.push(this.toString().trim());
					}
				});
			}
		}
		sLinks = [];
		//console.info(tArr);
		/* {
		 "source" : 47,
		 "target" : 15,
		 "value" : 289.366
		 }*/
		$.each(sNodes, function() {
			jNodes.push({
				"name" : this.toString()
			})
		});
		////console.info(jNodes);
		endArr = [];
		for (var rowIx = 0; rowIx < td.Rows.length; rowIx++) {
			var row = td.Rows[rowIx];
			var path = row[0].text;
			var val = parseFloat(row[1].text);
			var tArr = path.split(",");
			if (rev == "1") {
				tArr.reverse();
			}
			if (tArr.length > 1) {
				$.each(tArr, function(i) {
					/*if(tArr.length === (i + 1)){
						var cur = this;
						if(endArr.length > 0){
							$.each(endArr,function(){
								var trimmed = this.substring(0,this.indexOf("~"));
								if(cur == trimmed){

								}
							});
						}else{
							endArr.push(cur.toString().trim() + "~" + i);
						}
					}*/
					if(tArr.length === (i + 1)){
						tArr[i] = this.toString().trim() + "~end";
					}else{
						tArr[i] = this.toString().trim() + "~" + i;	
					}
					
					/*var newThis = this.toString() + i;
					 if(countInArray(tArr,newThis) > 1){
					 tArr = searchAndChange(newThis, tArr, countInArray(tArr,newThis));
					 }*/
				});
				//console.info(tArr);
				
				
				$.each(tArr, function(i) {
					var tFlag = "no";
					if ((i + 1) != tArr.length) {
						////console.info(this.toString().trim() + " to " + tArr[i + 1]);
						var cS = $.inArray(this.toString().trim(), sNodes);
						var cT = $.inArray(tArr[i + 1].toString().trim(), sNodes);

						//////console.info(cT + " " + cS);
						$.each(sLinks, function(i, v) {
							if ((v.source === cS) && (v.target === cT)) {
								////console.info(this);
								tFlag = "yes";
								v.value = v.value + val;

							}
						});
						if (tFlag == "no") {
							sLinks.push({
								"source" : cS,
								"target" : cT,
								"value" : val
							});
						}

					}
				});
			}

		}
		
		//console.info(sNodes);
		//_this.Element.innerHTML = "HELLO ENABLEMENT";
		//console.info(sLinks);
		var margin = {
			top : 1,
			right : 1,
			bottom : 1,
			left : 1
		}, width = _this.GetWidth(), height = _this.GetHeight();

		var formatNumber = d3.format(",.0f"), format = function(d) {
			return formatNumber(d) + " TWh";
		}, color = d3.scale.category20();

		var svg = d3.select("#" + divName).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom ).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//console.info(svg);
		var sankey = d3.sankey().nodeWidth(15).nodePadding(10).size([width - 5, height - 5]);

		var path = sankey.link();

		//d3.json("energy.json", function(energy) {

		sankey.nodes(jNodes).links(sLinks).layout(32);

		var link = svg.append("g").selectAll(".link").data(sLinks).enter().append("path").attr("class", "link").attr("d", path).style("stroke-width", function(d) {
			return Math.max(1, d.dy);
		}).sort(function(a, b) {
			return b.dy - a.dy;
		});

		link.append("title").text(function(d) {
			return d.value;
		});

		var node = svg.append("g").selectAll(".node").data(jNodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		}).call(d3.behavior.drag().origin(function(d) {
			return d;
		}).on("dragstart", function() {
			this.parentNode.appendChild(this);
		}).on("drag", dragmove));

		node.append("rect").attr("height", function(d) {
			return d.dy;
		}).attr("width", sankey.nodeWidth()).style("fill", function(d) {
			return d.color = color(d.name.substring(0, d.name.indexOf("~")).replace(/ .*/, ""));
		}).style("stroke", function(d) {
			return d3.rgb(d.color).darker(2);
		}).append("title").text(function(d) {
			return d.value;
		});

		node.append("text").attr("class", "nodeTitle").attr("x", -6).attr("y", function(d) {
			return d.dy / 2;
		}).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function(d) {
			var str = d.name.substring(0, d.name.indexOf("~"));
			return str;
		}).filter(function(d) {
			return d.x < width / 2;
		}).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start");

		function dragmove(d) {
			d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
			sankey.relayout();
			link.attr("d", path);
		}

		//});

	});
}

//Initiate extension
extension_Init();

