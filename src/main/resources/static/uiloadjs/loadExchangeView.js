//var containerEditor = document.getElementById("tgds_list");
//var optionsQuill={readOnly: true, theme: 'bubble'};
//var optionsJSON = {mode:'view'};
//var editorJSON = new JSONEditor(containerEditor, optionsJSON);
//var editor=new Quill(containerEditor, optionsQuill);
var sideExchangeView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#exchange_template").html(), {} );
    this.$el.html( template );
},
events: {
     "submit":"exchange"
},
exchange:function(e){
	e.preventDefault();
	var exchange=new Exchange();
	
	$("#ls_todo").html("");
	let msgRule=exchange.checkComplete(exchange.stTGD(mapSymbols,graphTGDs,paperTGDs,mapTableIdCanvas),graphTGDs);
	console.log(msgRule);
	/*if (msgRule.length>0){	
		for (var msg of msgRule){
			$("#ls_todo").append(msg);
		}
	}else{*/
	exchange.generateQuery(mapSymbols,graphTGDs,paperTGDs,mapTableIdCanvas);	
	
	var linkC = document.createElement("a");
	var valR=$('input[name=optradio]:checked').val();	 
	if(valR=="sql"){
		linkC.download = 'chase.sql';
	    linkC.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(exchange.chaseScript);
	    linkC.click();
	}else if(valR=="rml"){
		linkC.download = 'R2RML.ttl';
		linkC.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(exchange.RMLScript);
		linkC.click();
	}else  if (valR=="sqldb"){
		$.ajax({	  
	        url: "chase",
	        type: "POST",
	        data:  {queries:exchange.chaseQueryDB}
	      })
	      .done(function(data) {
	        console.log(data)        
			var triples=[];
	        for(var uri in data){
	        	for(var property in data[uri]){
	        		for(var i=0; i<data[uri][property].length; i++ ){
	      	          var s = uri;
	      	          var p = property;
	      	          var o = data[uri][property][i]['value'];	        	          
	      	          triples.push({subject:s,predicate:p,object:o})
	        		}
	      	  	}  
	        }
	        
	        
	        const fileStream = streamSaver.createWriteStream('triples.rj')
			const writer = fileStream.getWriter()
			const encoder = new TextEncoder		
			let uint8array = encoder.encode(JSON.stringify(data))	
			writer.write(uint8array)
			writer.close();
	        
	                
	        
	        var svgTriples = d3.select("#result_exchange").append("svg").attr("width", 800).attr("height", 600);		
			var force = d3.layout.force().size([800, 600]);		
			var graph = triplesToGraph(svgTriples,triples);		
			update(svgTriples,force,graph);
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	        //show an dialog box saything that must be loaded some a database
	        var errorView = Backbone.View.extend({
	        	render: function() {
	        		 var divForm1 = document.createElement("div");
	                 divForm1.setAttribute("class","form-group");
	                 
	        		this.$el.html(divForm1);                
	                return this;
	        	}
	        	
	        });
	        var modal = new BackboneBootstrapModals.ConfirmationModal({ headerViewOptions:{showClose:false, label: 'No Database Loaded'},bodyView: errorView});
	        modal.render();
	      })
	      .always(function() {
	        
	      });
	}
    
    
    $("#ls_todo").fadeTo(30000, 500).slideUp(500, function(){
        $("#ls_todo").slideUp(500);
    });  
    
	
	//}
	}
});

var side_exchange_view = new sideExchangeView({ el: $("#result_container") });
