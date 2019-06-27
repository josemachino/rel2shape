function simpleGraph(gObj){
    let simpleGraph=[];
    for (let cell of gObj){
        if (cell.type=="db.Table" || cell.type=="shex.Type"){
            let table={type:cell.type,id:cell.id,name:cell.question,attrs:cell.options, position:cell.position, ports:cell.ports.items}
            simpleGraph.push(table)
        }
        if (cell.type=="standard.Link"){
			var transformed=""
			var joinPat=""
			/*for (label of cell.labels()){
				console.log(label)
				if (label.attrs.text.text.includes(")")){
					transformed=label.attrs.text.text
				}							
			}*/
			
            let link={type:cell.type,kind:(((cell||{}).attrs|| {}).line||{}).stroke,source:cell.source,target:cell.target,"join-path":"","display-params":"",transformed:transformed}
            simpleGraph.push(link)
        }
    }
	return simpleGraph;
}

var sideView = Backbone.View.extend({
initialize: function(){
    this.render();
    
},
render: function(){
    var template = _.template( $("#side_template").html(), {} );
    
    this.$el.html( template );
},
events: {
     "click #exportst":"export",  
     "click #undost":"undost",
     "click #savest":"savest",
     "click #conf":"configure",
     "click #gml":"viewCode",
     "change input[type=file]#importst ":"import",
     "change input[type=file]#sqlFile": "doSearchSQL",
     "change input[type=file]#shapeFile": "doSearchShape",
     "click #sqlTGD":"getSQL",
     "click #r2rmlTGD":"getR2RML",
     "click #graphRDF":"materialize"
},
materialize:function(e){
	var exchange=new Exchange();
	exchange.generateQuery(mapSymbols,graphTGDs,paperTGDs,mapTableIdCanvas);
	console.log($( "select#formats" ).val());
	if (exchange.warnMsgs.length>0){
		loadWarnMsg(exchange.warnMsgs,exchange.chaseQueryDB);
	}else {
	$.ajax({	  
        url: "chase",
        type: "POST",
        data:  {queries:exchange.chaseQueryDB,format:$( "select#formats" ).val()}
      })
      .done(function(data) {
        console.log(data)        
        loadRDFModal(data);
        var store = $rdf.graph();
        var uri = 'https://example.org/triples.ttl'
    	var body = data
    	var mimeType = 'text/turtle'
    	var store = $rdf.graph()

    	/*try {
    	    $rdf.parse(body, store, uri, mimeType);    	    
            const allTriples = store.statementsMatching(undefined, undefined, undefined);
            allTriples.forEach(function(triple) {
            	console.log('<'+triple.object.uri+'>');
            	 if(triple.object.termType === "NamedNode") {
                		console.log('<' + triple.object.uri + '>');
                	
            	 }else  {
	           		console.log('\'' + triple.object.value + '\'');
	          	 }
            });
    	} catch (err) {
    	    console.log(err)
    	}		*/
        let nameExt="";
        if ($( "select#formats" ).val()=="Turtle"){
        	nameExt="ttl";
        }else if ($( "select#formats" ).val()=="N-Triples"){
        	nameExt="nt";
        }else{
        	nameExt="rj";
        }
        
        const fileStream = streamSaver.createWriteStream(curNameschema+'RDF.'+nameExt)
		const writer = fileStream.getWriter()
		const encoder = new TextEncoder		
		let uint8array = encoder.encode(JSON.stringify(data))	
		writer.write(uint8array)
		writer.close();
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
},
getR2RML:function(e){
	var exchange=new Exchange();
	exchange.generateQuery(mapSymbols,graphTGDs,paperTGDs,mapTableIdCanvas);
	var linkC = document.createElement("a");
	linkC.download = 'R2RML.ttl';
	linkC.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(exchange.RMLScript);
	linkC.click();
},
getSQL:function(e){
	var exchange=new Exchange();
	exchange.generateQuery(mapSymbols,graphTGDs,paperTGDs,mapTableIdCanvas);
	var linkC = document.createElement("a");	
	linkC.download = 'chase.sql';
    linkC.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(exchange.chaseScript);
    linkC.click();
},
doSearchShape:function(event){
	var reader = new FileReader();
    reader.onload = function onReaderLoad(event){        
	    var obj = JSON.parse(event.target.result);
	    mapSymbols=new Map();
	    positionShexType=getPositionFromDB(graphTGDs)
	    //TODO IDENTIFY IF IT IS SHACL OR SHEX
	    try{
	    let contextObj=obj["@context"];
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
		                let subF="shape"+num;
		                let nameShape=shape.id.split('/').pop();
		                if (nameShape.length>3){		                	
		                	subF=nameShape.substr(0,3)
		                }
		                mapSymbols.set(subF+"2iri",shape.id);
		                var sExpression=createShexType(nameShape,tcs,positionShexType);
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
    try{
    	reader.readAsText(event.currentTarget.files[0]);
    }
    catch(errExpr){
    	alert("No File chosen");    	
    }
    
    var form = new FormData();
    curNameschema=event.currentTarget.files[0].name;
    curNameschema=curNameschema.substr(0,curNameschema.length-5);
    
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
},
doSearchSQL:function(e){	
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
		/*paperTGDs.fitToContent({
                padding: 50,
                allowNewOrigin: 'any'
            });*/
		console.log("File Uploaded")
      })
      .fail(function(jqXHR, textStatus, errorThrown) {        
        console.log(textStatus);
      })
      .always(function() {
        
      });
},
viewCode:function(e){
	loadGMLCode();
},

configure:function(e){
	loadConfModal();
},


undost:function(e){
	console.log("undo");
	//remove all elements from table
	mapTableIdCanvas=new Map();
	tgdLines.clear();
	tgdGreenCond.clear();
	mapSymbols=new Map();
	//and import
	if (sessionGO.length>0){
		let lastSaved=sessionGO.pop();
		
		graphTGDs.fromJSON(lastSaved);   
		/*paperTGDs.fitToContent({
	        padding: 50,
	        allowNewOrigin: 'any'
	    });*/    	
		let num=1;
		let namespace="http://example.com/"
		graphTGDs.getElements().forEach(function(element){
			if (element.attributes.type=="db.Table"){
				mapTableIdCanvas.set(element.attributes.question,element.id)
			}
			if (element.attributes.type=="shex.Type"){
				let subF="shape"+num;
				if (element.attributes.question.length>3){
					subF=element.attributes.question.substr(0,3);
				}
				mapSymbols.set(subF+"2iri",namespace+element.attributes.question);
				num++;
			}
		})
		var links=graphTGDs.getLinks();			
		for (var link of links){
			var edgeView=link.findView(paperTGDs);
			if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="shex.Type"){				
				let tLinkport=link.get('target').port.split(',');											
				if (tLinkport.length==1){					
					let valueIRI=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;
					let taName=edgeView.sourceView.model.attributes.question;
					if (link.labels().length>1){
						let condition=(((link.labels()[1]|| {}).attrs||{}).text||{}).text;
						drawNewGreenLinkInTable(link,taName,valueIRI,edgeView.targetView.model.attributes.question,condition);
					}else{
						drawNewGreenLinkInTable(link,taName,valueIRI,edgeView.targetView.model.attributes.question,"");
					}					
				}
			}
		}
    	
    	
		for (var link of links){
			var edgeView=link.findView(paperTGDs);
			if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="shex.Type"){				
				let tLinkport=link.get('target').port.split(',');
				if (tLinkport.length==3 && tLinkport[1]=='Literal'){					
					drawNewBlueLinkInTable(link)
				}
				if (tLinkport.length==3 && tLinkport[1]!='Literal')	{				
					let sHead=edgeView.sourceView.model.attributes.question;
					let sAtt=getSourceOptionNameLinkView(edgeView);
					
					let path=(((link.labels()[1]|| {}).attrs||{}).text||{}).text;;
					
					let fObject=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;
					let tHead=edgeView.targetView.model.attributes.question;
					
					drawNewRedLinkInTable(link,sHead,sAtt,path,fObject,tHead)
				}
			}
		}
		drawSVGGraph();
	}
},
savest:function(e){
	console.log("save")
	sessionGO.push(graphTGDs.toJSON());
}
,
import:function(e){	
	var reader = new FileReader();
    reader.onload = function onReaderLoad(event){        
    	var obj = JSON.parse(event.target.result);
    	mapSymbols=new Map();
    	mapTableIdCanvas=new Map();
    	//clear the panel with mappings    	    	
    	tgdLines.clear();
    	tgdGreenCond.clear();
    	//TODO create the table of mappings and load the global variables
    	graphTGDs.fromJSON(obj);   
    	paperTGDs.fitToContent({
            padding: 50,
            allowNewOrigin: 'any'
        });    	
    	let num=1;
    	let namespace="http://example.com/"
    	graphTGDs.getElements().forEach(function(element){
    		if (element.attributes.type=="db.Table"){
    			mapTableIdCanvas.set(element.attributes.question,element.id)
    		}
    		if (element.attributes.type=="shex.Type"){
				let subF="shape"+num;
				if (element.attributes.question.length>3){
					subF=element.attributes.question.substr(0,3);
				}
				mapSymbols.set(subF+"2iri",namespace+element.attributes.question);
				num++;
			}
    	})
    	var links=graphTGDs.getLinks();			
    	for (var link of links){
			var edgeView=link.findView(paperTGDs);
			if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="shex.Type"){
				
				let tLinkport=link.get('target').port.split(',');
				
								
				if (tLinkport.length==1){
					console.log("green link "+link.id);
					let valueIRI=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;					
					let taName=edgeView.sourceView.model.attributes.question;
					if (link.labels().length>1){
						let condition=(((link.labels()[1]|| {}).attrs||{}).text||{}).text;
						drawNewGreenLinkInTable(link,taName,valueIRI,edgeView.targetView.model.attributes.question,condition);
					}else{
						drawNewGreenLinkInTable(link,taName,valueIRI,edgeView.targetView.model.attributes.question,"");
					}
					
				}
			}
		}
    	
    	
		for (var link of links){
			var edgeView=link.findView(paperTGDs);
			if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="shex.Type"){				
				let tLinkport=link.get('target').port.split(',');
				if (tLinkport.length==3 && tLinkport[1]=='Literal'){
					console.log("blue "+link.id);
					drawNewBlueLinkInTable(link)
				}
				console.log(tgdLines);
				if (tLinkport.length==3 && tLinkport[1]!='Literal')	{				
					let sHead=edgeView.sourceView.model.attributes.question;
					let sAtt=getSourceOptionNameLinkView(edgeView);
					let path=(((link.labels()[1]|| {}).attrs||{}).text||{}).text;
					let fObject=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;
					let tHead=edgeView.targetView.model.attributes.question;
					drawNewRedLinkInTable(link,sHead,sAtt,path,fObject,tHead)
				}
				
			}
		}	
		drawSVGGraph();
    	//loop graphTGDs to obtain mapTableIdCanvas and for mapSymbols the types try to use a default url
    };
    reader.readAsText(e.currentTarget.files[0]);
	
	
},
export:function(e){
    var graphJson=graphTGDs.toJSON()
    //simpleGraph(graphJson.cells)
    /*$('#syntax_tgds').rainbowJSON({
            maxElements: 1000,
            maxDepth: 10,
            json: simpleGraph(graphJson.cells)
        });*/
	const jsonStr = JSON.stringify(graphJson);
    var link = document.createElement("a");
    link.download = curNameschema+'TGD.gml';
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr);
    //link.href=window.URL.createObjectURL('data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr))
    link.click();
}
});

var side_view = new sideView({ el: $("#sidebar") });