//https://carminecarella.wordpress.com/2014/04/07/uploading-file-html5-backbonejs-and-restful-services/
//https://stackoverflow.com/questions/37919393/layout-directedgraph-dagre-only-on-a-subset-of-nodes
//https://github.com/dagrejs/dagre/releases?after=v0.5.1
//Returns in the first positions the tables that do not contain references, then the rest

function drawReferences(g,tables,map){	
    for (var i=0;i< tables.length ;i++){        
        for (var j=0;j< tables[i].items.length ;j++){           	
            if (tables[i].items[j].ref){                                                
                linkDataBase(g,map.get(tables[i].key),tables[i].items[j].id,map.get(tables[i].items[j].ref.name),tables[i].items[j].ref.name,tables[i].items[j].ref.id);                
            }
        }
    }    
}

var mapTableIdCanvas;
var loadSQLView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#sql_template").html(), {} );
    this.$el.html( template );
},
events: {
    //"change input[type=file]": "doSearch",
    "submit":"uploadFile"
},
uploadFile:function (event){
	var fileName= $('#sqlFile')[0].files[0];			
	var form = new FormData();
	form.append("file", fileName);	
	$.ajax({
        url: "uploadFile",
        type: "POST",
        data: form,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data'
      })
      .done(function(data) {        
        positionTable= { x: 70, y: 10 };
        graphTGDs.clear();        
        mapTableIdCanvas=new Map();
        
        //Add the tables
        for (var i=0;i< data.length ;i++){      
            var tableCanvas=createTable(data[i].key,data[i].items,positionTable);           
            mapTableIdCanvas.set(data[i].key,tableCanvas.id);
            graphTGDs.addCell(tableCanvas);    
        }
        drawReferences(graphTGDs,data,mapTableIdCanvas);        
        joint.layout.DirectedGraph.layout(graphTGDs.getCells(),getLayoutOptions());
		paperTGDs.fitToContent({
                padding: 50,
                allowNewOrigin: 'any'
            });
		console.log("File Uploaded")
      })
      .fail(function(jqXHR, textStatus, errorThrown) {        
        console.log(textStatus);
      })
      .always(function() {
        
      });
	event.preventDefault();
},
doSearch: function( event ){
    // Button clicked, you can access the element that was clicked with event.currentTarget      
    var reader = new FileReader();
    reader.onload = function onReaderLoad(event){        
    var obj = JSON.parse(event.target.result);        
		positionTable= { x: 70, y: 10 };
        graphTGDs.clear();        
        mapTableIdCanvas=new Map();
        //Add the tables
        for (var i=0;i< obj.data.length ;i++){      
            var tableCanvas=createTable(obj.data[i].key,obj.data[i].items,positionTable);           
            mapTableIdCanvas.set(obj.data[i].key,tableCanvas.id);
            graphTGDs.addCell(tableCanvas);    
        }
        drawReferences(graphTGDs,obj.data,mapTableIdCanvas);        
        joint.layout.DirectedGraph.layout(graphTGDs.getCells(),getLayoutOptions());
		paperTGDs.fitToContent({padding: 50,allowNewOrigin: 'any'});
    };
    reader.readAsText(event.currentTarget.files[0]);       
}
});

var sql_view = new loadSQLView({ el: $("#sql_container") });
