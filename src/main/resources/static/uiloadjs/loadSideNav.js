var sideLeftView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#side_template").html(), {} );
    this.$el.html( template );
},
events: {
    "click .list-unstyled li a":"hideOthers",
    "click #sideLeftcollapse":"activate"  
},
hideOthers:function(e){
    if ($(e.target).parents('li')[0].id=="tgd"){        
    	//editorJSON.set(stTGD2(graphTGDs,paperTGDs,mapTableIdCanvas));
    	var exchange=new Exchange();
    	editor.setContents({ops:[{insert:exchange.GMLfromCy(mapSymbols,tgdLines,mapTableIdCanvas,tgdsCy,tgdGreenCond)}]},'api');
    	
    }
    if($(e.target).parents('li')[0].id=="testing"){    	
    	window.open("SpecRunner.html");
    }
	for (var i=0;i<$(e.target).parents('li').siblings().length;i++){
    $(e.target).parents('li').siblings()[i].firstElementChild.classList.remove('active'); 
    $(e.target).parents('li').siblings()[i].firstElementChild.removeAttribute('aria-expanded');	
	}
},
activate:function(e){    
    $('#sidebar').toggleClass('active');
}
});

var side_left_view = new sideLeftView({ el: $("#sidebar") });
