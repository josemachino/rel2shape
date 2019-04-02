function addTC(prop,tcs){	
	let typeLabel="";

	let multiplicity='';
    if (typeof(prop.maxCount)==='undefined' || prop.minCount==prop.maxCount){
        multiplicity='1';
    }else{
        if (prop.maxCount==1 && (typeof(prop.minCount)==="undefined" || prop.minCount==0 )){
        	multiplicity='?';
        }
        if (prop.maxCount==-1 && (typeof(prop.minCount)==="undefined" || prop.minCount==0)){
        	multiplicity='*';
        }
        if ((typeof(prop.maxCount)==='undefined'||prop.maxCount>1) && prop.minCount==1){
        	multiplicity='+';
        }
    }
	if (typeof(prop.class)!=="undefined"){		
		if (prop.class instanceof Array){
			for (var typeL of prop.class){				
				tcs.push({label:prop.path.split("/").pop(),type:typeL.split("/").pop(), mult:multiplicity});				
			}
		}else{
			typeLabel=prop.class;
			tcs.push({label:prop.path.split("/").pop(),type:typeLabel.split("/").pop(), mult:multiplicity});
		}		
	}else{		
		typeLabel="Literal";
		tcs.push({label:prop.path.split("/").pop(),type:typeLabel, mult:multiplicity});
	}
		
}
function getPositionFromDB(graphObj){
    var maxValue=0    
    var widthLocal=0
    graphObj.getElements().forEach(function(element){    
        if (element.attributes.type=="db.Table"){            
            if (maxValue<element.attributes.position.x){
                maxValue=element.attributes.position.x;
                widthLocal=element.attributes.size.width;                
            }        
        }
        
    });
    maxValue=maxValue+widthLocal+300
    return {x:maxValue,y:0}
}

function drawRefTypes(g,expressions){
	expressions.forEach(function(valor,clave, miMapa){		
		valor.forEach(function(constraints,idtype,miMapa2){			
			constraints.forEach(function (tc){
				if (tc.type!='Literal'){					
					let ids=idtype.split(',');									
					let refIds=Array.from(miMapa.get(tc.type).keys())[0].split(",")					
					linkShex(g,ids[0], "ref"+tc.label+","+tc.type+","+tc.mult, refIds[0],refIds[1])
				}
			})
		})
	})   
}

var mapSymbols=new Map();
var expressions=new Map();
var graphShex = new joint.dia.Graph;
var SearchView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#search_template").html(), {} );
    this.$el.html( template );
},
events: {
    "change input[type=file]": "doSearch"
},
doSearch: function( event ){
    // Button clicked, you can access the element that was clicked with event.currentTarget      
	
    var reader = new FileReader();
    reader.onload = function onReaderLoad(event){        
	    var obj = JSON.parse(event.target.result);
	    mapSymbols=new Map();
	    positionShexType=getPositionFromDB(graphTGDs)
	    //TODO IDENTIFY IF IT IS SHACL OR SHEX
	    try{
	    let contextObj=obj["@context"];
	    console.log(typeof(contextObj));
	    if(typeof(contextObj)==="string" && contextObj.includes("shex") && typeof(obj.shapes)!=="undefined"){	    	
	    	obj.shapes.forEach(function(shape){
		        if (shape.type=='Shape'){                
		            let tcs=[];
		            if (shape.expression.type=='EachOf'){
		                tc={};
		                shape.expression.expressions.forEach(function(expression){                      
		                    if (expression.type=='TripleConstraint'){
		                        typeLabel='';
		                        if (typeof(expression.valueExpr)==='string'){
		                            typeLabel=expression.valueExpr.split('/').pop();
		                        }else{
		                            typeLabel='Literal'; 
		                        }
		                        multiplicity='';
		                        if (typeof(expression.max)==='undefined' || expression.max==expression.min){
		                            multiplicity='1';
		                        }else{
		                            if (expression.max==1 && expression.min==0){
		                            	multiplicity='?';
		                            }
		                            if (expression.max==-1 && expression.min==0){
		                            	multiplicity='*';
		                            }
		                            if (expression.max>1 && expression.min==1){
		                            	multiplicity='+';
		                            }
		                        }
		                        
		                                        
		                    tc={label:expression.predicate.split('/').pop(),type:typeLabel, mult:multiplicity};                        
		                    tcs.push(tc);
		                    }
		                });      
		                var num=mapSymbols.size+1;
		                mapSymbols.set("f"+num,shape.id);
		                var sExpression=createShexType(shape.id.split('/').pop(),tcs,positionShexType);
		                let mapExpr=new Map();	                
		                mapExpr.set(sExpression.attributes.id+","+sExpression.attributes.ports.items[1].id,tcs)
		                expressions.set(sExpression.attributes.question,mapExpr)	                
		                graphShex.addCell(sExpression);                
		            }
		            
		        }
		    });
	    
		    
	    }else{
	    	//parse shacl
	    	
	    	let shapes=obj['@graph'];
	    	shapes.forEach(function(shape){
	    		if (shape['@type']=="NodeShape"){
	    			let tcs=[];
	    			let propArr=shape.property;	
	    			if (typeof(propArr)!=="undefined"){
		    			if (propArr instanceof Array){	    					    				
		    				for (var prop of propArr){		    					
		    					if (typeof(prop.path)==="string"){
		    						addTC(prop,tcs);			    
		    					}
					    	};
		    			}else{
		    				if (typeof(propArr.path)==="string"){		    				
		    					addTC(propArr,tcs);
		    				}
		    			}
			    		var num=mapSymbols.size+1;
			    		
			    		let idText="";
			    		if (shape['@id'].includes("http")){
			    			idText=shape['@id'].split("/").pop();
			    		}else{
			    			idText=shape['@id'].split(":").pop();
			    		}
			    		mapSymbols.set("f"+num,shape['@id']);
			    		var sExpression=createShexType(idText,tcs,positionShexType);		    		
			    		let mapExpr=new Map();	                
			    		mapExpr.set(sExpression.attributes.id+","+sExpression.attributes.ports.items[1].id,tcs)
			    		expressions.set(sExpression.attributes.question,mapExpr)	                
			    		graphShex.addCell(sExpression);
	    			}
	    		}
	    	});	    		 
	    }
	    }catch(err){
	    	alert("Error in parsing ShEx or Shacl "+err.message);	    	
	    }	    
	    if (graphShex.getCells().length>0){
	    	try{
		    drawRefTypes(graphShex,expressions)	;
	    	}catch(errExpr){
	    		alert("Error in drawing references "+errExpr.message+". Review if the schema has everything specified.");	
	    	}
	    	joint.layout.DirectedGraph.layout(graphShex.getCells(),getLayoutOptionsNotVertices());
		    let pos=getPositionFromDB(graphTGDs)
		    graphShex.getCells().forEach(function(cell){	    	
		    	if (!cell.isLink()){		    	
			    	cell.set('position',{x:cell.get('position').x+pos.x,y:cell.get('position').y})
			    	graphTGDs.addCell(cell)
		    	}else{
		    		let arrayVert=cell.get('vertices')
		    		arrayVert.forEach(function(it){
		    			it.x=it.x+pos.x
		    		})
		    		cell.set('vertices',arrayVert)
		    		graphTGDs.addCell(cell)
		    	}
		    });
			paperTGDs.fitToContent({padding: 50,allowNewOrigin: 'any' });
	    }
    };
    reader.readAsText(event.currentTarget.files[0]);    
    
    var form = new FormData();
	form.append("file", event.currentTarget.files[0]);	
	$.ajax({
        url: "uploadShexFile",
        type: "POST",
        data: form,
        processData: false,
        contentType: false,
        enctype: 'multipart/form-data'
      })
      .done(function(data) {        
    	  
		console.log("File Uploaded")
      })
      .fail(function(jqXHR, textStatus, errorThrown) {        
        console.log(textStatus);
      })
      .always(function() {
        
      });
    
}
});

var search_view = new SearchView({ el: $("#search_container") });
