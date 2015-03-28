/* globals Tone, nx */

//nexusUI setup
nx.showLabels = true;
nx.colorize("accent", "#D76767");
nx.colorize("fill", "#fff");
// nx.colorize("border", "#000");

var Interface = {};

Interface.getElement = function(el){
	if (typeof el === "string"){
		return $("#"+el);
	} else {
		return $(el);
	}
};

Interface.Rack = function(id, name, collapsible){
	var element = Interface.getElement(id);
	element.addClass("Rack");
	//var title = $("<div>").addClass("Title").text(name);
	//element.prepend(title);
	// title.on("click touch", function(){
	// 	element.toggleClass("Expanded");
	// });
	if (collapsible){
		element.addClass("Collapsible");
	}
	return {
		close : function(){
			element.removeClass("Expanded");
		},
		open : function(){
			element.addClass("Expanded");
		}
	};
};
