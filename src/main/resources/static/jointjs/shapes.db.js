//TODO
/*
 *change background when is a different path
 */
//https://sample-videos.com/download-sample-sql.php
//https://github.com/cytoscape/cytoscape.js/issues/2189
//http://ceur-ws.org/Vol-1456/paper4.pdf
//https://jsfiddle.net/zc3k1f48/42/
//https://bl.ocks.org/vegarringdal/8e02e1bcc281f0bb7ecbf041a35f5245
//https://stackoverflow.com/questions/48915931/bootstrap-table-how-to-set-table-row-background-color
//https://bootstrap-table.com/docs/api/table-options/
//http://visjs.org/docs/network/
//https://es.slideshare.net/juansequeda/rdb2-rdf-tutorial-iswc2013
//https://dzone.com/articles/writing-web-based-client-side-unit-tests-with-jasm
//https://jasmine.github.io/tutorials/your_first_suite
//http://shexjava.lille.inria.fr/demonstrator
//http://ftp.informatik.rwth-aachen.de/Publications/CEUR-WS/Vol-368/paper16.pdf
//https://www.testingexcellence.com/encode-decode-json-byte-array/
//https://groups.google.com/forum/#!topic/jointjs/r9xuR09_76g
//https://www.cs.ox.ac.uk/boris.motik/pubs/bkmmpst17becnhmarking-chase.pdf
//http://www.dia.uniroma3.it/~papotti/Projects/DataExchange/pdf/vldb10.pdf
//https://perso.liris.cnrs.fr/angela.bonifati/teaching/dbdm/DBDM-dataIntegration3.pdf
//https://github.com/josdejong/jsoneditor
//https://github.com/Rathachai/d3rdf
//https://github.com/ejgallego/jscoq
//https://i11www.iti.kit.edu/_media/teaching/winter2016/graphvis/graphvis-ws16-v6.pdf
//https://github.com/clientIO/joint/issues/455
//https://arxiv.org/ftp/arxiv/papers/1807/1807.09368.pdf
//https://github.com/wenzhixin/bootstrap-table/issues/453
//https://github.com/wenzhixin/bootstrap-table-examples/blob/master/methods/removeByUniqueId.html
//http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.144.8213&rep=rep1&type=pdf
//https://rtsys.informatik.uni-kiel.de/~biblio/downloads/theses/pkl-mt.pdf
//http://jsfiddle.net/e3nk137y/791/
//https://github.com/wenzhixin/bootstrap-table-examples/blob/master/options/custom-toolbar.html
//https://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
//https://groups.google.com/forum/#!msg/jointjs/bR5kBCERzdU/OW-esjswCAAJ
//https://github.com/clientIO/joint/blob/master/tutorials/link-tools.html
//https://resources.jointjs.com/docs/jointjs/v2.2/joint.html#dia.Paper.events
//https://stackoverflow.com/questions/20769850/changesource-event-in-jointjs
//https://github.com/ccoenraets/directory-backbone-bootstrap/tree/master/js/models
//https://stackoverflow.com/questions/34296234/is-there-a-safe-way-to-delete-a-jointjs-paper-graph
//https://github.com/haycco/spring-boot-backbone-example
//http://resources.jointjs.com/docs/jointjs/v2.2/joint.html#joint.dia.Paper
//http://www.irisa.fr/LIS/ferre/sparklis/osparklis.html 
//https://github.com/leafygreen/backbone-bootstrap-modals
//https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e
//https://stackoverflow.com/questions/44155471/how-to-create-bootstrap-modal-with-transparent-background
//https://www.baeldung.com/spring-boot-sql-import-files
//http://buildingonmud.blogspot.com/2009/06/convert-string-to-unicode-in-javascript.html
let comparisonOp=["le","leq","gt","geq"]
let widthSVGForLine='210px';
let widthSVGForLineG='250px';
let heightSVGForLine='17px';
let widthSVGLine='192';
let widthSVGLineG='232';

let svgCanvasTGDW=650;
let svgCanvasTGDH=500;

let sessionGO=[];
let subjectLinkColor="#09325D";
let attributeLinkColor="#6eb257";
let attributeRefLinkColor="#FF5A25";
let rRectColor="#7275db";
let tRectColor="#4b4a67";
let typeNodeRect="round-rectangle";
let typeNodeAtt="ellipse";

let curNameschema="";
let widthLink=4;

/**
 * font size for the labels that appear
 **/
let pathfontSizeLabel=17;
let iriCfontSizeLabel=15;
/**
 * For the lines that appear in the canvas
 * */
let widthsvgLink=2;
/**
 * This variable stores in the id edge identifier and value array of edge and type 
 * */
let tgdLines=new Map();
/**
 * This variable stores id edge identifier and string value of a condition 
 * */
let tgdGreenCond=new Map();

let tgdPathLine=new Map();
var graphTGDs = new joint.dia.Graph;
var paperTGDs = new joint.dia.Paper({
    el: document.getElementById('mydb'),
    width: 2000,
    height: 2000,    
    model: graphTGDs,
    gridSize: 10,
    drawGrid: true,
    snapLinks: { radius: 75 },
    background: {
        //color: 'rgba(0, 255, 0, 0.3)'
    	color: '#ffffcc'
    },
    snapLinks: {radius:75},
    interactive: { labelMove: true },
    linkPinning: false,
    embeddingMode: true,	    
    defaultConnectionPoint: { name: 'boundary' },
    defaultLink:new joint.shapes.standard.Link()
});
paperTGDs.on('link:mouseenter', function(linkView) {
    linkView.showTools();
});

paperTGDs.on('link:mouseleave', function(linkView) {
    linkView.hideTools();
});


graphTGDs.on('remove', function(cell, collection, opt) {
   if (cell.isLink()) {	         
        if (cell.attr('line/stroke')==subjectLinkColor){     
        	//TODO NOTIFY THAT WE ARE REMOVING ALL LINKS THAT ARE CONNECTED TO THE TABLE WITH ITS TYPE        	
			var links=graphTGDs.getLinks();			
			for (var link of links){				
				var linkView=link.findView(paperTGDs);
				if (linkView.sourceView.model.id== cell.attributes.source.id && linkView.targetView.model.id==cell.attributes.target.id){									
					link.remove();					
				}
			}
			links=graphTGDs.getLinks();
			for (var link of links){
				var edgeView=link.findView(paperTGDs);
				if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="shex.Type" && (link.attr('line/stroke')==attributeLinkColor||link.attr('line/stroke')==attributeRefLinkColor)){
					let path=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;					
					let names=getTokens(path)					
					if (mapTableIdCanvas.get(names[names.length-1])==cell.attributes.source.id){						
						link.remove();						
					}
				}		
			}			
			tgdLines.delete(cell.id);
			tgdGreenCond.delete(cell.id);			
			
        }else{
        	
        		for (let value of tgdLines.values()) {
        		  let found=false;
        		  for (let l=0;l<value.length;l++){
        			  if (value[l].id==cell.id){
        				  value.splice(l, 1);
        				  found=true;
        				  break;
        			  }
        		  }
        		  if (found){
        			  break;
        		  }
        			  
        		}	        		
        }
        drawSVGGraph();
   }
})

var positionTable= {};
var positionShexType={};
var createTable=function(title,attributes,position){
    var table = new joint.shapes.db.Table({
        question:title,
        options:attributes,
        position:position
    });        
    var lastHeight= positionTable.y+table.attributes.size.height+50;
    positionTable={x:positionTable.x,y:lastHeight};    
    return table;
}
var createShexType=function(name,triConstraints,position){
    var typeShex=new joint.shapes.shex.Type({
        question:name,
        options:triConstraints,
        position:position
    });
    var lastHeightShex= positionShexType.y+typeShex.attributes.size.height+30;
    positionShexType={x:positionShexType.x,y:lastHeightShex};
    return typeShex;
}

var invertPaths=function(tablesConnected){
	var reverseTablesConnected=[]
	tablesConnected.forEach(function(path){
		var idxPath=path.id.split(",")
		var textPath=path.text.split(",")
		var reverseIdxP=idxPath.reverse()
		var reverseTextP=textPath.reverse()
		reverseTablesConnected.push({id:reverseIdxP.join(),text:reverseTextP.join()})
	});
	return reverseTablesConnected
}

paperTGDs.on('link:connect',function(linkView){  
    if (typeof(linkView.targetView)==='null'){
        console.log("no element selected");
    }else{
    	try{ 
    	
        var currentLink=linkView.model;  
        currentLink.attr({
            line: { // selector for the visible <path> SVGElement
            	strokeWidth: widthLink, // SVG attribute and value
            	targetMarker: {
            		'type': 'path',
            		'stroke-width': widthLink,
            		'd': 'M 10 -3 10 -10 -2 0 10 10 10 3'
            	}
            }});
        //verify that are of the same type the connectors        
        if (linkView.sourceMagnet.nodeName==linkView.targetMagnet.nodeName && linkView.targetView.model.attributes.ports.items[1].id==currentLink.attributes.target.port){
        	currentLink.remove()
        }
        else if (linkView.sourceMagnet.nodeName==linkView.targetMagnet.nodeName && !(linkView.sourceView.model.attributes.type=="db.Table" && linkView.targetView.model.attributes.type=="db.Table")){                        
            var auxKeySymbols=[];
            for (const key of mapSymbols.keys()) {
                var obj={text:key};                        
                auxKeySymbols.push(obj);
            }
            
            if ((V(linkView.sourceMagnet.parentNode).attr('port-group')==='outfk' || V(linkView.sourceMagnet.parentNode).attr('port-group')==='outpk') &&       V(linkView.targetMagnet.parentNode).attr('port-group')==='outype'){
                currentLink.attr('line/stroke', attributeRefLinkColor);
                //Obtain the text of attribute selected
                var attributeSelected="";
                for (var option of linkView.sourceView.model.attributes.options){                    
                    if (option.id==V(linkView.sourceMagnet.parentNode).attr('port')){
                        attributeSelected=option.text;
                        break;
                    }
                };
                //obtain the join paths
                var tablesConnected=[{id:linkView.sourceView.model.id,text:linkView.sourceView.model.attributes.question}];                
                var intargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});                
                var tLink;
                var visited=[];
                
                if (intargetLinks.length==1){   
                	getJoinsTableAllPaths(linkView.sourceView.model,tablesConnected,tablesConnected[0],visited);
                    loadModalTypeReferenced(currentLink,auxKeySymbols,tablesConnected,mapSymbols,attributeSelected,intargetLinks);
                }else{					                    
                    for (var aux of intargetLinks){                                                
                        if (linkView.targetView.model.getPort(aux.attributes.target.port).group=='inType'){
                            tLink=aux;                            
                            break;
                        }
                    }                                       
                    var tView=tLink.findView(paperTGDs);                                                
                    getJoinsTableFromTo(linkView.sourceView.model,tablesConnected,tView.sourceView.model.id,visited,tablesConnected[0])                                                        
                    
                    if (tablesConnected.length==1 && auxKeySymbols.length==2 && mapSymbols.size==2){
                        let subIRI=(((tLink.labels()[0]|| {}).attrs||{}).text||{}).text;
                        //set the value by default                        
                        let sAtt=getSourceOptionNameLinkView(linkView);                        
						let iriUsed=subIRI.split("(")[0];
						let fIRI;
						let keysMap=Array.from(mapSymbols.keys())
						if (keysMap[0]==iriUsed){
							fIRI=keysMap[1]+"("+sAtt+")";
						}else{
							fIRI=keysMap[0]+"("+sAtt+")";
						}                        
                        currentLink.appendLabel({attrs: {text: {text: fIRI ,'font-size':iriCfontSizeLabel}},position: {offset: 10}});
                        currentLink.appendLabel({attrs: {text: {text: tablesConnected[0].text, 'font-size':pathfontSizeLabel}},position: {offset: -10}});
                        drawNewRedLinkInTable(currentLink,linkView.sourceView.model.attributes.question,sAtt,tablesConnected[0].text,fIRI,linkView.targetView.model.attributes.question)
                        drawSVGGraph();
                    }else{																	
						console.log(invertPaths(tablesConnected))
                        loadModalTypeReferenced(currentLink,auxKeySymbols,tablesConnected,mapSymbols,attributeSelected,intargetLinks);
                    }                    
                }                                                              
            } else if (V(linkView.sourceMagnet.parentNode).attr('port-group')==='out' &&    V(linkView.targetMagnet.parentNode).attr('port-group')==='outype'){
                alert("Need to be referenced to a primary key or foreign key");
                currentLink.remove();
            }else{
                if (linkView.sourceMagnet.nodeName=='rect'){
                    currentLink.attr('line/stroke', subjectLinkColor);
                    //if the primary key is only one set by default if not load modal
					var pks=getKeys(linkView.sourceView.model.attributes.options);
					if (pks.length==1){
						var fSymbol=getFunctionSymbol(mapSymbols,linkView.targetView.model.attributes.question);
						var valueIRI=fSymbol+"("+pks[0]+")"
						currentLink.appendLabel({attrs: {text: {text: valueIRI, 'font-size':iriCfontSizeLabel}}});
                        createLinkTool(currentLink);                        
                        drawNewGreenLinkInTable(currentLink,linkView.sourceView.model.attributes.question,valueIRI,linkView.targetView.model.attributes.question)
					}else{
                        loadModal(currentLink,auxKeySymbols,linkView.sourceView.model.attributes.options,mapSymbols);
					}
					
                }
                if (linkView.sourceMagnet.nodeName=='circle'){                                        
                    var linked=false;                    
                    
                    var portType;  
                    linkView.targetMagnet.parentNode.parentNode.parentNode.childNodes.forEach(function(childElement){
                        
						if (V(childElement).attr('class')=='joint-port'){                            
                            if (V(childElement.firstChild).attr('port-group')=='inType'){
                                portType=V(childElement.firstChild).attr('port');
                                var portLinks=_.filter(graphTGDs.getLinks(), function(o) {                                    
                                    return o.get('target').port == V(childElement.firstChild).attr('port');
                                });                                    
                                if (portLinks.length<1){
                                    if (V(linkView.sourceMagnet.parentNode).attr('port-group')==='out'){                                                                                                                                                                 
                                        var idsourceModel;
                                        var idportSource;
                                        
                                        idsourceModel=linkView.sourceView.model.id;
                                        idportSource=linkView.sourceView.model.attributes.ports.items[0].id;
                                                                                                                        
                                        var tablesConnected=[{id:linkView.sourceView.model.id,text:linkView.sourceView.model.attributes.question}];
                                        var visitedLinks=[];
                                        getJoinsTableAllPaths(linkView.sourceView.model,tablesConnected,tablesConnected[0],visitedLinks);   
                                        
                                        loadPathIRIModal(currentLink,auxKeySymbols, linkView.sourceView.model.attributes.options,mapSymbols,tablesConnected);
                                        linked=true;
                                    }                                        
                                }
                            }
                        }                        
					});
                    if (!linked){                        
                        var tablesConnected=[{id:linkView.sourceView.model.id,text:linkView.sourceView.model.attributes.question}];                        
                        var intargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});
                        var tLinks=getLinkTarget(intargetLinks,portType);                                        
						
						for (var tlink of tLinks){
							
                            var tView=tlink.findView(paperTGDs);
                            var visited=[];
                            getJoinsTableFromTo(linkView.sourceView.model,tablesConnected,tView.sourceView.model.id,visited,tablesConnected[0]);	
						}     								
						//supposed that it is already connected with others but there is only one path then we have to create the green link first
						if (tablesConnected.length==1){
							
							var element;
			                for (let table of graphTGDs.getElements()){			                	
			                    if (table.attributes.question==tablesConnected[0].text){
			                        element=table;
			                    }
			                }
							
							let isConnectedGL=false;
				        	for (var greenL of graphTGDs.getLinks()){            		
				        		if(greenL.attributes.source.port==element.attributes.ports.items[0].id && greenL.attributes.target.port==linkView.targetView.model.attributes.ports.items[0].id){
				        			isConnectedGL=true;
				        			break;
				        		}
				        	}
				            if (!isConnectedGL){
							
								var pks=getKeys(element.attributes.options);					
				                var fSymbol=getFunctionSymbol(mapSymbols,linkView.targetView.model.attributes.question);
								var valueIRI=fSymbol+"("+pks[0]+")";											
								var linkParent=link(graphTGDs,element.id,element.attributes.ports.items[0].id,linkView.targetView.model.id,linkView.targetView.model.attributes.ports.items[0].id,subjectLinkColor);
								createLinkTool(linkParent);
				                
				                linkParent.appendLabel({attrs: {text: {text: valueIRI ,'font-size':iriCfontSizeLabel}}});

				                
				                let tHead=linkView.targetView.model.attributes.question;
				                drawNewGreenLinkInTable(linkParent,tablesConnected[0].text,valueIRI,tHead)
				            }
						
                            currentLink.appendLabel({attrs: {text: {text: tablesConnected[0].text, 'font-size':pathfontSizeLabel}},position: {offset: -10}});							
                            currentLink.attr('line/stroke', attributeLinkColor);
							createLinkTool(currentLink);
							console.log("creating blue link")
							drawNewBlueLinkInTable(currentLink);	
							drawSVGGraph();
                        }else{                    							
                            loadModalPathAttribute(currentLink,tablesConnected);
                        }                                                                           
                    }                                        
                }                            
        }               
    }else{//remove the link from the canvas            
        currentLink.remove();
    }    
    }catch(err){
    	console.log(err.message)
    }
   }
});

function createULList(list){
    var items = document.createElement('ul');
    list.forEach(function(value){
        var item = document.createElement('li');
        var ahref =document.createElement('a');
        ahref.setAttribute('data-value',value.text);
        ahref.setAttribute('href','#');
        ahref.appendChild(document.createTextNode(value.text));
        item.appendChild(ahref);  
        items.appendChild(item);
    });
    return items;
}
/*Creates a list using only */
function createList(list){
    var items = document.createElement('div');
    items.className="dropdown-menu";
    list.forEach(function(value){        
        var ahref =document.createElement('a');
        ahref.className="dropdown-item";
        ahref.setAttribute('data-value',value.id);
        ahref.setAttribute('href','#');
        ahref.appendChild(document.createTextNode(value.text));        
        items.appendChild(ahref);
    });
    return items;
}
function createButton(text){
    var buttonDrop=document.createElement('button');
    buttonDrop.className='btn btn-primary dropdown-toggle';
    buttonDrop.setAttribute('type','button');
    buttonDrop.setAttribute('data-toggle','dropdown');
    buttonDrop.appendChild(document.createTextNode(text));
    return buttonDrop;
}

function createText(id){
    var inText=document.createElement('input');
    inText.id=id;
    inText.className="form-control no-padding";
    inText.type="url";
    return inText;
}

function loadModalFunctions(currentLink,cy){  
    console.log("loadModalFunctions")
    var CustomView = Backbone.View.extend({        
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";            
                        
            var divForm1 = document.createElement("div");
            divForm1.setAttribute("class","form-group");                        		         
            addPrimitiveFunctions(divForm1);                
            divContainer.appendChild(divForm1);            
            this.$el.html(divContainer);        
            return this;
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Customize'},
        bodyView: CustomView,
        onConfirm: function() {                 
            let i=0
            let index=-1
            for (let label of currentLink.labels()){
                if (label.attrs.text.text.includes("function")){
                    index=i;
                }
                i++;
            }
            var constraintAtt="";
            
        	if ($('#att-func').val().length>0){        		
        		constraintAtt="[function:"+ $('#att-func').val()+"]";
        	}else{
        		if (currentLink.labels().length==1){
        			currentLink.removeLabel(-1);
        		}
        	}                        
            var offsetNew=currentLink.labels().length+1*10;
            if (constraintAtt.length>0){
            if (index==-1){                
                currentLink.appendLabel({
                        markup: [{tagName: 'rect',selector: 'labelBody'}, {tagName: 'text',selector: 'text'}],
                        attrs: {
                            text: {
                                text: constraintAtt,
                                fill: '#7c68fc',
                                fontFamily: 'sans-serif',
                                textAnchor: 'middle',
                                textVerticalAnchor: 'middle'
                            },
                            labelBody: {
                                ref: 'text',
                                refX: -5,
                                refY: -5,
                                refWidth: '100%',
                                refHeight: '100%',
                                refWidth2: 10,
                                refHeight2: 10,
                                stroke: '#7c68fc',
                                fill: 'white',
                                strokeWidth: 2,
                                rx: 5,
                                ry: 5
                            }
                        },
                        position: {
                            offset: -40
                        }
                    });
            }else{
            	currentLink.label(index,{attrs: {text: {text: constraintAtt}}});             
            }
            //cy.$('#'+currentLink.id).data('label',constraintAtt);
           }
        },
        onCancel: function(){
            
        }        
    });
    modal.render();
}

function addPrimitiveFunctions(divForm1){
    var labelSelect = document.createElement("label");
    labelSelect.htmlFor="att-func"
    labelSelect.innerText="Apply"
    var select = document.createElement("SELECT");
    select.id="att-func";
    select.setAttribute("class","form-control");
    var option0 = document.createElement("option");
    option0.text = "";
    option0.value="";
    var option1 = document.createElement("option");
    option1.text = "Uppercase";
    option1.value="UPPER";
    var option2 = document.createElement("option");
    option2.text = "Lowercase";
    option2.value="LOWER";
    var option3 = document.createElement("option");
    option3.text = "Trim";
    option3.value="TRIM";	
    select.add(option0);
    select.add(option1);
    select.add(option2);
    select.add(option3);	
    divForm1.appendChild(labelSelect)
    divForm1.appendChild(select)
}

function loadModalPathAttribute(currentLink,parameters){
    console.log("loadModalPathAttribute")
    var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.parameters=opts.displayParameters;
        },
        render: function() {                             
            var divContainer=document.createElement('div');
            divContainer.className="container"; 
            var divForm1 = document.createElement("div");
            divForm1.setAttribute("class","form-group");
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.className='dropdown';
            
            var buttonDropParameter=createButton(this.parameters[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.parameters);        
            divDropdownParameters.appendChild(itemsParameters);                              
            divForm1.appendChild(divDropdownParameters);			
            divContainer.appendChild(divForm1);            
            
            this.$el.html(divContainer);        
            return this;
        },
        events :{            
			"click .dropdown-menu a":"changeName",
            "mouseover #ddParameter a":"selectPath",
            "mouseout #ddParameter a":"unselectPath"
        },
		changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        selectPath:function(e){            
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.highlight();
                    }
                });
            }
        },
        unselectPath:function(e){                        
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.unhighlight();
                    }
                });
            }
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Select Path'},
        bodyView: CustomView,
        bodyViewOptions: { displayParameters:parameters },
        onConfirm: function() {                           
            var joinPath=$("#ddParameter .btn").text().trim();
            currentLink.appendLabel({attrs: {text: {text: joinPath, 'font-size':pathfontSizeLabel}},position: {offset: -10}}); 
			var linkView=currentLink.findView(paperTGDs)
			currentLink.attr('line/stroke', attributeLinkColor);
			createLinkTool(currentLink);
			
            var paramValue=$('#ddParameter .btn').val();            
            if (paramValue===""){
                paramValue=parameters[0].id;
            }
            var lastTable=paramValue.split(",");
            let lastTableName;
            for (const [key,value] of mapTableIdCanvas){
                if (value==lastTable[lastTable.length-1]){
                    lastTableName=key;
                    break;
                }
            }
            //get the list of intypes then check each one if correspond to one of the names
            var intargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});
            var portType=linkView.targetView.model.attributes.ports.items[0];
            var tLinks=getLinkTarget(intargetLinks,portType);                                        
            //loop all links that are table id to type id
            let isPathEqSourceLink=false;
            
            for (var tlink of tLinks){							
                var tView=tlink.findView(paperTGDs);
                if (tView.sourceView.model.id==lastTable[lastTable.length-1]){
                    isPathEqSourceLink=true;
                    break;
                }
            }
            
            if (!isPathEqSourceLink){
                //VERIFY IF ALREADY EXISTS green link IF NOT CREATE
            	
            	
                //get the element of the path
                var element;
                for (let table of graphTGDs.getElements()){
                    if (table.id==lastTable[lastTable.length-1]){
                        element=table;
                    }
                }
                let isConnectedGL=false
            	for (var greenL of graphTGDs.getLinks()){            		
            		if(greenL.attributes.source.port==element.attributes.ports.items[0].id && greenL.attributes.target.port==linkView.targetView.model.attributes.ports.items[0].id){
            			isConnectedGL=true;
            			break;
            		}
            	}
                if (!isConnectedGL){
	                var linkParent=link(graphTGDs,element.id,element.attributes.ports.items[0].id,linkView.targetView.model.id,linkView.targetView.model.attributes.ports.items[0].id,subjectLinkColor);
	                var pks=getKeys(element.attributes.options);
	                let valueIRI=mapSymbols.keys().next().value+"("+pks[0]+")";
	                linkParent.appendLabel({attrs: {text: {text: valueIRI, 'font-size':iriCfontSizeLabel}}});
	                drawNewGreenLinkInTable(linkParent,lastTableName,valueIRI,linkView.targetView.model.attributes.question)
                }
            }
            drawNewBlueLinkInTable(currentLink);
            drawSVGGraph();
        },
        onCancel: function(){
            currentLink.remove();
        }        
    });
    modal.render();
}

function loadModalPathAttributeDetail(currentLink,parameters){
    console.log(loadModalPathAttributeDetail)
    var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.parameters=opts.displayParameters;
        },
        render: function() {                             
            var divContainer=document.createElement('div');
            divContainer.className="container"; 
            var divForm1 = document.createElement("div");
            divForm1.setAttribute("class","form-group");
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.className='dropdown';
            
            var buttonDropParameter=createButton(this.parameters[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.parameters);        
            divDropdownParameters.appendChild(itemsParameters);                              
            divForm1.appendChild(divDropdownParameters);
			//adding function of uppercarse lowercase
			addPrimitiveFunctions(divForm1)
            
            var divForm2 = document.createElement("div");
            divForm1.setAttribute("class","form-group");
            var inputText = document.createElement("input");
            inputText.type="text"
            inputText.id="att-filter"   
            inputText.setAttribute("class","form-control")
			var inputTextFun = document.createElement("input");
            inputTextFun.type="number"
            inputTextFun.min=0
            inputTextFun.id="fun-filter"   
            inputTextFun.setAttribute("class","form-control")
			inputTextFun.style.visibility = 'hidden'
            var labelText = document.createElement("label");
            labelText.htmlFor="att-filter"
            labelText.innerText="Filter"            
            addPrimitiveFunctions(divForm1)    
            divForm1.appendChild(inputTextFun)
            divForm2.appendChild(labelText);
            divForm2.appendChild(inputText);
            divContainer.appendChild(divForm1);
            divContainer.appendChild(divForm2);
            
            this.$el.html(divContainer);        
            return this;
        },
        events :{            
			"click .dropdown-menu a":"changeName",
            "mouseover #ddParameter a":"selectPath",
            "mouseout #ddParameter a":"unselectPath",
			"change #att-func":"showTypeFun"
        },
		showTypeFun:function(){
            var x=document.getElementById('fun-filter')
            if (comparisonOp.includes($('#att-func').val())){                                
                x.style.visibility = 'visible'
            }else{
                x.style.visibility = 'hidden'
            }
			
		},
        changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        selectPath:function(e){            
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.highlight();
                    }
                });
            }

        },
        unselectPath:function(e){                        
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.unhighlight();
                    }
                });
            }
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Select Path'},
        bodyView: CustomView,
        bodyViewOptions: { displayParameters:parameters },
        onConfirm: function() {                           
            var joinPath=$("#ddParameter .btn").text().trim();            
			currentLink.label(0,{attrs: {text: {text: joinPath}}});
			let i=0
            let index=-1
            for (let label of currentLink.labels()){
                if (label.attrs.text.text.includes("function")){
                    index=i;
                }
                i++;
            }
            var constraintAtt="";
            if (document.getElementById('fun-filter').style.visibility=='hidden'){
            	if ($('#att-func').val().length>0){
            		console.log("valor fun:"+$('#att-func').val());
            		constraintAtt="[function:"+ $('#att-func').val();
            	}
            }else{            	
            	constraintAtt="[function:"+ $('#att-func').val()+" "+$('#fun-filter').val();
            }
            if ($('#att-filter').val().length>0 && constraintAtt.length>0){
                constraintAtt=constraintAtt.concat(",filter:"+$('#att-filter').val()).concat("]");
            }else if ($('#att-filter').val().length>0){
            	constraintAtt="[filter:"+$('#att-filter').val()+"]";
            }else if (constraintAtt.length>0){
            	constraintAtt=constraintAtt.concat("]");
            }            
            
            var offsetNew=currentLink.labels().length+1*10;
            if (constraintAtt.length>0){
            if (index==-1){                
                currentLink.appendLabel({
                        markup: [{tagName: 'rect',selector: 'labelBody'}, {tagName: 'text',selector: 'text'}],
                        attrs: {
                            text: {
                                text: constraintAtt,
                                fill: '#7c68fc',
                                fontFamily: 'sans-serif',
                                textAnchor: 'middle',
                                textVerticalAnchor: 'middle'
                            },
                            labelBody: {
                                ref: 'text',refX: -5,refY: -5,refWidth: '100%',
                                refHeight: '100%',
                                refWidth2: 10,
                                refHeight2: 10,
                                stroke: '#7c68fc',
                                fill: 'white',
                                strokeWidth: 2,
                                rx: 5,
                                ry: 5
                            }
                        },
                        position: {offset: -40}
                    });
            }else{
				currentLink.label(index,{attrs: {text: {text: constraintAtt}}});            
            }
            /*
            let objGraphic=$table.bootstrapTable('getRowByUniqueId',currentLink.id);
            var sourceAtt=$(objGraphic.ex)[2].lastChild.textContent;
            var path=$(objGraphic.ex)[3].firstChild.textContent;
            var tAtt=$(objGraphic.ex)[4].lastChild.textContent;            
            let graphicTGD=$('<div>').append('<i class="fas fa-dot-circle"></i><i class="fas fa-ellipsis-h"></i>').append($('<div>').attr('class','li_tgd').append($('<div>').attr('class','li_body_tgd').append(sourceAtt))).append($('<div>').attr('class','link_tgd').append($('<div>').attr({class:"path_tgd"}).append(path)).append($('<a>').attr({'data-tooltip':'true',title:'Edit',id:currentLink.id,class:'edit_tgd'}).append($('<i>').attr('class','fas fa-edit'))).append($('<svg>').attr({height:'17px',width:widthSVGForLine}).append($('<line>').attr({class:'arrowBlue',x1:0,x2:widthSVGLine,y1:10,y2:10}))).append($('<div>').attr({id:"param_"+currentLink.id,class:"param_tgd"}).append(constraintAtt)).append($('<a>').attr({'data-tooltip':'true',title:'Remove Parameters',id:currentLink.id,class:'rem_param_blue_tgd'}).append($('<i>').attr('class','fas fa-trash-alt')))).append($('<div>').attr('class', 'li_tgd').append($('<div>').attr('class','li_body_tgd').append(tAtt))).remove().html();
            
            $table.bootstrapTable('updateByUniqueId',{id:currentLink.id,row:{ex:graphicTGD}});
            */
            }
        },
        onCancel: function(){            
        }        
    });
    modal.render();
}

function loadModalRedFromTable(currentLink,iris, parameters,functionsMap,valueReference,inTargetLinks){
	var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.iris = opts.displayIris;
            this.parameters=opts.displayParameters;
        },
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";
            var divDropdown=document.createElement('div');
            divDropdown.id='ddIriConstructor';
            divDropdown.className='dropdown';
            
            var iriUrl=createText("iriUrl");
            
            var items = createList(this.iris);            
            var buttonDropIri=createButton(this.iris[0].text);
            divDropdown.appendChild(buttonDropIri);
            divDropdown.appendChild(iriUrl);
            divDropdown.appendChild(items);
            
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.className='dropdown';
            var buttonDropParameter=createButton(this.parameters[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.parameters);        
            divDropdownParameters.appendChild(itemsParameters);
                        
            divContainer.appendChild(divDropdown);        
            divContainer.appendChild(divDropdownParameters);
            this.$el.html(divContainer);        
            $("#iriUrl").val(functionsMap.get(this.iris[0].text.trim()));
            return this;
        },
        events :{
            "click .dropdown-menu a":"changeName",
            "click #ddIriConstructor a":"changeInputText",
            "mouseover #ddParameter a":"selectPath",
            "mouseout #ddParameter a":"unselectPath"
        },
        changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        changeInputText:function (e) {
            $("#iriUrl").val(functionsMap.get($(e.target).text().trim()));            
        },
        selectPath:function(e){            
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.highlight();
                    }
                });
            }

        },
        unselectPath:function(e){                        
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.unhighlight();
                    }
                });
            }
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Define IRI Constructor'},
        bodyView: CustomView,
        bodyViewOptions: { displayIris: iris, displayParameters:parameters },
        onConfirm: function() {               
            var valueIRI=$("#ddIriConstructor .btn").text().trim();
            valueIRI=valueIRI.concat("(");            
            valueIRI=valueIRI.concat(valueReference);
            valueIRI=valueIRI.concat(")");
            var joinPath=$("#ddParameter .btn").text().trim();
            if (currentLink.labels().length==0){            
            	currentLink.appendLabel({attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}},position: {offset: 10}});            
            	currentLink.appendLabel({attrs: {text: {text: joinPath, 'font-size':pathfontSizeLabel}},position: {offset: -10}}); 
            }else{                
                currentLink.label(0,{attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}}}); 
                currentLink.label(1,{attrs: {text: {text: joinPath,'font-size':pathfontSizeLabel}},position: {offset: -10}}) ;               
            }            
            let linkView=currentLink.findView(paperTGDs);      
            let sAtt=getSourceOptionNameLinkView(linkView);
//            drawUpdateRedLinkInTable(currentLink,linkView.sourceView.model.attributes.question,sAtt,joinPath,valueIRI,linkView.targetView.model.attributes.question)
            //get the id and set by default the table						
            var paramValue=$('#ddParameter .btn').val();            
            if (paramValue===""){
                paramValue=parameters[0].id;
            }
            var lastTable=paramValue.split(",");
            let lastTableName;
            for (const [key,value] of mapTableIdCanvas){
                if (value==lastTable[lastTable.length-1]){
                    lastTableName=key;
                    break;
                }
            }            			            
            var portType=linkView.targetView.model.attributes.ports.items[0];
            var tLinks=getLinkTargetType(inTargetLinks,portType);             
            //loop all links that are table id to type id
            let isPathEqSourceLink=false;
            
            for (var tlink of tLinks){							
                var tView=tlink.findView(paperTGDs);                
                if (tView.sourceView.model.id==lastTable[lastTable.length-1]){
                    isPathEqSourceLink=true;                    
                    break;
                }
            }
			
			if (!isPathEqSourceLink){

				//get the element of the path
                var element;
                for (let table of graphTGDs.getElements()){
                    if (table.id==lastTable[lastTable.length-1]){
                        element=table;
                    }
                }
                let isConnectedGL=false
            	for (var greenL of graphTGDs.getLinks()){            		
            		if(greenL.attributes.source.port==element.attributes.ports.items[0].id && greenL.attributes.target.port==linkView.targetView.model.attributes.ports.items[0].id){
            			isConnectedGL=true;
            			break;
            		}
            	}
                if (!isConnectedGL){
	                var linkParent=link(graphTGDs,element.id,element.attributes.ports.items[0].id,linkView.targetView.model.id,linkView.targetView.model.attributes.ports.items[0].id,subjectLinkColor);
	                var pks=getKeys(element.attributes.options);
	                let valueIRI=mapSymbols.keys().next().value+"("+pks[0]+")";
	                linkParent.appendLabel({attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}}});
	                
	                drawNewGreenLinkInTable(linkParent,lastTableName,valueIRI,linkView.targetView.model.attributes.question)
                }
			}
			drawSVGGraph();
        },
        onCancel: function(){            
        }        
    });
    modal.render();
}


function loadModalTypeReferenced(currentLink,iris, parameters,functionsMap,valueReference,inTargetLinks){
	console.log("Red Link")
    var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.iris = opts.displayIris;
            this.parameters=opts.displayParameters;
        },
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";
            var divDropdown=document.createElement('div');
            divDropdown.id='ddIriConstructor';
            divDropdown.className='dropdown';
            
            var iriUrl=createText("iriUrl");
            
            var items = createList(this.iris);            
            var buttonDropIri=createButton(this.iris[0].text);
            divDropdown.appendChild(buttonDropIri);
            divDropdown.appendChild(iriUrl);
            divDropdown.appendChild(items);
            
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.className='dropdown';
            var buttonDropParameter=createButton(this.parameters[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.parameters);        
            divDropdownParameters.appendChild(itemsParameters);
                        
            divContainer.appendChild(divDropdown);        
            divContainer.appendChild(divDropdownParameters);
            this.$el.html(divContainer);        
            $("#iriUrl").val(functionsMap.get(this.iris[0].text.trim()));
            return this;
        },
        events :{
            "click .dropdown-menu a":"changeName",
            "click #ddIriConstructor a":"changeInputText",
            "mouseover #ddParameter a":"selectPath",
            "mouseout #ddParameter a":"unselectPath",
        },
        changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        changeInputText:function (e) {
            $("#iriUrl").val(functionsMap.get($(e.target).text().trim()));            
        },
        selectPath:function(e){
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.highlight();
                    }
                });
            }

        },
        unselectPath:function(e){                        
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.unhighlight();
                    }
                });
            }
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Define IRI Constructor'},
        bodyView: CustomView,
        bodyViewOptions: { displayIris: iris, displayParameters:parameters },
        onConfirm: function() {               
            var valueIRI=$("#ddIriConstructor .btn").text().trim();
            valueIRI=valueIRI.concat("(");            
            valueIRI=valueIRI.concat(valueReference);
            valueIRI=valueIRI.concat(")");
            var joinPath=$("#ddParameter .btn").text().trim();
            if (currentLink.labels().length==0){            
            	currentLink.appendLabel({attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}},position: {offset: 10}});            
            	currentLink.appendLabel({attrs: {text: {text: joinPath,'font-size':pathfontSizeLabel}},position: {offset: -10}}); 
            }else{                
                currentLink.label(0,{attrs: {text: {text: valueIRI}}}); 
                currentLink.label(1,{attrs: {text: {text: joinPath}},position: {offset: -10}}) ;               
            }
            createLinkTool(currentLink);
            let linkView=currentLink.findView(paperTGDs);      
            let sAtt=getSourceOptionNameLinkView(linkView);
            
            
            
            //get the id and set by default the table						
            var paramValue=$('#ddParameter .btn').val();            
            if (paramValue===""){
                paramValue=parameters[0].id;
            }
            var lastTable=paramValue.split(",");
            let lastTableName;
            for (const [key,value] of mapTableIdCanvas){
                if (value==lastTable[lastTable.length-1]){
                    lastTableName=key;
                    break;
                }
            }            			            
            var portType=linkView.targetView.model.attributes.ports.items[0];
            var tLinks=getLinkTargetType(inTargetLinks,portType);             
            //loop all links that are table id to type id
            let isPathEqSourceLink=false;
            
            for (var tlink of tLinks){							
                var tView=tlink.findView(paperTGDs);                
                if (tView.sourceView.model.id==lastTable[lastTable.length-1]){
                    isPathEqSourceLink=true;                    
                    break;
                }
            }
			
			if (!isPathEqSourceLink){
				var element;
                for (let table of graphTGDs.getElements()){
                    if (table.id==lastTable[lastTable.length-1]){
                        element=table;
                    }
                }
                let isConnectedGL=false
            	for (var greenL of graphTGDs.getLinks()){            		
            		if(greenL.attributes.source.port==element.attributes.ports.items[0].id && greenL.attributes.target.port==linkView.targetView.model.attributes.ports.items[0].id){
            			isConnectedGL=true;
            			break;
            		}
            	}
                if (!isConnectedGL){
	                var linkParent=link(graphTGDs,element.id,element.attributes.ports.items[0].id,linkView.targetView.model.id,linkView.targetView.model.attributes.ports.items[0].id,subjectLinkColor);
	                var pks=getKeys(element.attributes.options);
	                let valueIRI=mapSymbols.keys().next().value+"("+pks[0]+")";
	                linkParent.appendLabel({attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}}});
	                drawNewGreenLinkInTable(linkParent,lastTableName,valueIRI,linkView.targetView.model.attributes.question)
                }                
			}
			drawNewRedLinkInTable(currentLink,linkView.sourceView.model.attributes.question,sAtt,joinPath,valueIRI,linkView.targetView.model.attributes.question)
			drawSVGGraph();
        },
        onCancel: function(){
            currentLink.remove();
        }        
    });
    modal.render();
}

function drawNewRedLinkInTable(redLink,sHead,sAtt,path,fObject,tHead){
	console.log(redLink);
	let relNames=getTokens(path)
	let linkView=redLink.findView(paperTGDs);
	var inTargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});
	
	var portType=linkView.targetView.model.attributes.ports.items[0];
    var tLinks=getLinkTargetType(inTargetLinks,portType);             
    //loop all links that are table id to type id    
    let parentId;
    let idTable;
    let greenTableName=relNames[relNames.length-1];
    for (const [key,value] of mapTableIdCanvas){
        if (key==greenTableName){
            idTable=value;
            break;
        }
    }
    for (var tlink of tLinks){							
        var tView=tlink.findView(paperTGDs);                
        if (tView.sourceView.model.id==idTable){        	
            parentId=tlink.id;
            break;
        }
    }	
    let tAtt=redLink.attributes.target.port.split(",")[0];    
    buildRedLink(parentId,redLink.id,relNames,greenTableName,tHead,sAtt,tAtt,fObject);
}

function buildGreenLink(greenLink,sHead,fSubject,tHead,condition,constructorDefIri){
	
	tgdLines.set(greenLink.id,[]);	
	tgdGreenCond.set(greenLink.id,[condition,constructorDefIri,fSubject,sHead,tHead]);
	console.log(tgdLines);
}

/**
 * 
 * */
function buildBlueLink(parentId,attLineId,path,sEnt,tEnt,sAtt,tAtt,condition){		
	tgdLines.get(parentId).push({id:attLineId,type:'att'});
	tgdPathLine.set(attLineId,[path,sAtt,tAtt,condition,sEnt,tEnt])		
}
/**
 * This function creates the attribute ref lines in the table view
 * */
function buildRedLink(parentId,attLineId,path,sEnt,tEnt,sAtt,tAtt,fIRI){		
	tgdLines.get(parentId).push({id:attLineId,type:'attRef'});
	tgdPathLine.set(attLineId,[path,sAtt,tAtt,fIRI,sEnt,tEnt])
}

function drawNewGreenLinkInTable(greenLink,sHead,fSubject,tHead,condition){
	buildGreenLink(greenLink,sHead,fSubject,tHead,condition);
}

function drawNewBlueLinkInTable(blueLink){	
	let joinPath=(((blueLink.labels()[0]|| {}).attrs||{}).text||{}).text;
	console.log(joinPath)
	let relNames=getTokens(joinPath)
	let linkView=blueLink.findView(paperTGDs);
	var inTargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});
	
	var portType=linkView.targetView.model.attributes.ports.items[0];
    var tLinks=getLinkTargetType(inTargetLinks,portType);             
    //loop all links that are table id to type id    
    let parentId;
    let idTable;
    let greenTableName=relNames[relNames.length-1];
    console.log(mapTableIdCanvas)
    for (const [key,value] of mapTableIdCanvas){
        if (key==greenTableName){
            idTable=value;
            break;
        }
    }
    for (var tlink of tLinks){							
        var tView=tlink.findView(paperTGDs);                
        if (tView.sourceView.model.id==idTable){            
            parentId=tlink.id;
            break;
        }
    }
	let sourceTName=linkView.sourceView.model.attributes.question;
	let targetTName=linkView.targetView.model.attributes.question;
	let sourceAtt=getSourceOptionNameLinkView(linkView);
	let targetAtt=blueLink.attributes.target.port.split(",")[0];
	let constraintAtt="";
	if (blueLink.labels().length>1)
		constraintAtt=(((blueLink.labels()[1]|| {}).attrs||{}).text||{}).text;
	buildBlueLink(parentId,blueLink.id,relNames,sourceTName,targetTName,sourceAtt,targetAtt,constraintAtt);	
}

function loadPathIRIModal(currentLink,iris, parameters,functionsMap,lsPaths){
	console.log("Path IRI MODAL")
    var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.lsPaths=opts.displayParameters;
        },
        render: function() {                             
            var divForm1 = document.createElement("div");
            divForm1.setAttribute("class","form-group");
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.classList.add('dropdown');
            divDropdownParameters.classList.add("form-control");
            
            
            var buttonDropParameter=createButton(this.lsPaths[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.lsPaths);        
            divDropdownParameters.appendChild(itemsParameters);                              
            divForm1.appendChild(divDropdownParameters);	            
            this.$el.html(divForm1);                
            return this;
        },
        events :{         
			"click .dropdown-menu a":"changeName",
            "mouseover #ddParameter a":"selectPath",
            "mouseout #ddParameter a":"unselectPath",
        },changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        selectPath:function(e){            
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.highlight();
                    }
                });
            }

        },
        unselectPath:function(e){                        
            var tablesCombo=$(e.target).data('value').split(',');
            for (var id of tablesCombo){
                graphTGDs.getElements().forEach(function(element){
                    if (id==element.id){
                        var elementView=element.findView(paperTGDs);
                        elementView.unhighlight();
                    }
                });
            }
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Select Path'},
        bodyView: CustomView,
        bodyViewOptions: { displayParameters:lsPaths },
        onConfirm: function() {                           
            var joinPath=$("#ddParameter .btn").text().trim();
            console.log(pathfontSizeLabel)
            currentLink.appendLabel({attrs: {text: {text: joinPath, 'font-size':pathfontSizeLabel}},position: {offset: -10}});
						
			var linkView=currentLink.findView(paperTGDs)			
			currentLink.attr('line/stroke', attributeLinkColor);
			createLinkTool(currentLink);
			
			
			//get the id and set by default the table						
            var paramValue=$('#ddParameter .btn').val();            
            if (paramValue===""){
                paramValue=lsPaths[0].id;
            }
			var lastTable=paramValue.split(",");			
			let element;
			for (var el of graphTGDs.getElements()){                
				if (el.id==lastTable[lastTable.length-1]){		
					element=el;
					break;
				}
			}		
			//Verify that is not connected already		
			let isConnectedGL=false
        	for (var greenL of graphTGDs.getLinks()){            		
        		if(greenL.attributes.source.port==element.attributes.ports.items[0].id && greenL.attributes.target.port==linkView.targetView.model.attributes.ports.items[0].id){
        			isConnectedGL=true;
        			break;
        		}
        	}
            if (!isConnectedGL){
			
				var pks=getKeys(element.attributes.options);					
                var fSymbol=getFunctionSymbol(mapSymbols,linkView.targetView.model.attributes.question);
				var valueIRI=fSymbol+"("+pks[0]+")";											
				var linkParent=link(graphTGDs,element.id,element.attributes.ports.items[0].id,linkView.targetView.model.id,linkView.targetView.model.attributes.ports.items[0].id,subjectLinkColor);
				createLinkTool(linkParent);
                
                linkParent.appendLabel({attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}}});

                let sHead=getTokens(joinPath);
                let tHead=linkView.targetView.model.attributes.question;
                drawNewGreenLinkInTable(linkParent,sHead[sHead.length-1],valueIRI,tHead)
            }
			
			drawNewBlueLinkInTable(currentLink);
			drawSVGGraph();
        },
        onCancel: function(){
            currentLink.remove();
        }        
    });
    modal.render();
}



function loadModal(currentLink,iris, parameters,functionsMap){
    /*var orderParameters=orderTablesByShortestName(parameters);
    console.log("ordernar de menor longitud a mayor")
    console.log(orderParameters)*/
	let keyParameters=filterKeyParam(parameters)
    var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.iris = opts.displayIris;
            this.parameters=opts.displayParameters;
        },
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";
            var divDropdown=document.createElement('div');
            divDropdown.id='ddIriConstructor';
            divDropdown.className='dropdown';
            
            var iriUrl=createText("iriUrl");
            
            var items = createList(this.iris);            
            var buttonDropIri=createButton(this.iris[0].text);
            divDropdown.appendChild(buttonDropIri);
            divDropdown.appendChild(iriUrl);
            divDropdown.appendChild(items);
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.className='dropdown';
            var buttonDropParameter=createButton(this.parameters[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.parameters);        
            divDropdownParameters.appendChild(itemsParameters);
                        
            divContainer.appendChild(divDropdown);        
            divContainer.appendChild(divDropdownParameters);
            this.$el.html(divContainer);        
            $("#iriUrl").val(functionsMap.get(this.iris[0].text.trim()))
            return this;
        },
        events :{
            "click .dropdown-menu a":"changeName",
            "click #ddIriConstructor a":"changeInputText"
        },
        changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        changeInputText:function (e) {
            $("#iriUrl").val(functionsMap.get($(e.target).text().trim()));            
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Define IRI Constructor'},
        bodyView: CustomView,
        bodyViewOptions: { displayIris: iris, displayParameters:keyParameters },
        onConfirm: function(a) {                                 
            if ($("#ddParameter .btn").text().trim()=="Constructor Parameters" || $("#ddIriConstructor .btn").text().trim()=="IRI Constructors"){
                alert("Need to specify IRI and Parameter")
                this.isConfirmed=false;                
            }else{            
                var valueIRI=$("#ddIriConstructor .btn").text().trim();
                valueIRI=valueIRI.concat("(");
                valueIRI=valueIRI.concat($("#ddParameter .btn").text().trim());
                valueIRI=valueIRI.concat(")");            
                currentLink.appendLabel({attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}}});            
                
                createLinkTool(currentLink);
                var linkView=currentLink.findView(paperTGDs)
                drawNewGreenLinkInTable(currentLink,linkView.sourceView.model.attributes.question,valueIRI,linkView.targetView.model.attributes.question);
                drawSVGGraph();
            }
        },        
        onCancel: function(){
        	currentLink.remove();
        }        
    });
    modal.render();
}

function loadModalGreenFromTable(currentLink,iris, parameters,functionsMap,cy){
    //show only those parameters that are keys
    let keyParameters=filterKeyParam(parameters)
    var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.iris = opts.displayIris;
            this.parameters=opts.displayParameters;
        },
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";
            var divDropdown=document.createElement('div');
            divDropdown.id='ddIriConstructor';
            divDropdown.className='dropdown';
            
            var iriUrl=createText("iriUrl");
            
            var items = createList(this.iris);            
            var buttonDropIri=createButton(this.iris[0].text);
            divDropdown.appendChild(buttonDropIri);
            divDropdown.appendChild(iriUrl);
            divDropdown.appendChild(items);
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.className='dropdown';
            var buttonDropParameter=createButton(this.parameters[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.parameters);        
            divDropdownParameters.appendChild(itemsParameters);
                        
            divContainer.appendChild(divDropdown);        
            divContainer.appendChild(divDropdownParameters);
            this.$el.html(divContainer);        
            return this;
        },
        events :{
            "click .dropdown-menu a":"changeName",
            "click #ddIriConstructor a":"changeInputText"
        },
        changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        changeInputText:function (e) {
            $("#iriUrl").val(functionsMap.get($(e.target).text().trim()));            
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Define IRI Constructor'},
        bodyView: CustomView,
        bodyViewOptions: { displayIris: iris, displayParameters:keyParameters },
        onConfirm: function(a) {                                 
            if ($("#ddParameter .btn").text().trim()=="Constructor Parameters" || $("#ddIriConstructor .btn").text().trim()=="IRI Constructors"){
                alert("Need to specify IRI and Parameter")
                this.isConfirmed=false;                
            }else{            
                var valueIRI=$("#ddIriConstructor .btn").text().trim();
                valueIRI=valueIRI.concat("(");
                valueIRI=valueIRI.concat($("#ddParameter .btn").text().trim());
                valueIRI=valueIRI.concat(")");
                if (currentLink.labels().length>0){
                    currentLink.removeLabel(-1);
                }            
                currentLink.appendLabel({attrs: {text: {text: valueIRI,'font-size':iriCfontSizeLabel}}});
                //verify if it does not exist a link with the same IRI already in the canvas
                let notFound=true;
                if (notFound){
                	drawSVGGraph();
                }
            }
        },        
        onCancel: function(){            
        }        
    });
    modal.render();
}
// for obtaining the links that are related to tables
function getLinkTarget(links,port){
	var linksPort=[];
    for (var tLink of links){                                            
        if (tLink.attributes.target.port==port){
            linksPort.push(tLink);
        }
    };
    return linksPort;
}
// for obtaining the links that are related to types
function getLinkTargetType(links,port){
	var linksPort=[];    
    for (var tLink of links){                                            
        if (tLink.attributes.target.port==port.id){
            linksPort.push(tLink);
        }
    };
    return linksPort;
}

function getJoinsTable (viewModel,tables,initialNode){
    
    var inboundLinks=graphTGDs.getConnectedLinks(viewModel,{inbound:true});
    if (typeof(inboundLinks)!=="undefined"&& inboundLinks.length>0){   
        
        inboundLinks.forEach(function(boundLink){            
            var linkViewTable=boundLink.findView(paperTGDs);            
            var obj={id:initialNode.id+","+linkViewTable.sourceView.model.id, text:initialNode.text+","+linkViewTable.sourceView.model.attributes.question}
            tables.push(obj)
            //verify  self loop
            if (linkViewTable.sourceView.model.id!=linkViewTable.targetView.model.id){
                initialNode=obj;
                getJoinsTable(linkViewTable.sourceView.model,initialNode);
            }
        });        
    }
}

//it needs to test when table is self-referenced
function getJoinsTableAllPaths (currentModel, tables,currentNode,visited){
    var inoutLinks = graphTGDs.getConnectedLinks(currentModel, { deep: true }); // inbound and outbound    

    for (var edge of inoutLinks){
        var edgeView=edge.findView(paperTGDs);
        if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="db.Table"){            
            if (visited.includes(edge.id)==false){                                
                if (edgeView.sourceView.model.id==currentModel.id){ //wrong never equal the same id always different REDO!!
                	if (!currentNode.id.includes(edgeView.targetView.model.id)){
	                    var obj={id:currentNode.id+","+edgeView.targetView.model.id, text:currentNode.text+","+edgeView.targetView.model.attributes.question}
	                    if (tables.some(ta=>ta['id']===obj.id)==false){
	                        tables.push(obj);
	                        visited.push(edge.id);
	                        if (edgeView.sourceView.model.id!=edgeView.targetView.model.id){
	                        	var aux=Object.assign({}, currentNode);
	                            currentNode=obj;                    
	                            getJoinsTableAllPaths(edgeView.targetView.model,tables,currentNode,visited);
	                            currentNode=aux;
	                        }                        
	                    }
                	}
                }else if (edgeView.targetView.model.id==currentModel.id){
                	if (!currentNode.id.includes(edgeView.sourceView.model.id)){                	
	                    var obj={id:currentNode.id+","+edgeView.sourceView.model.id, text:currentNode.text+","+edgeView.sourceView.model.attributes.question}
	                    if (tables.some(ta=>ta['id']===obj.id)==false){
	                        tables.push(obj);
	                        visited.push(edge.id);
	                        
	                        if (edgeView.sourceView.model.id!=edgeView.targetView.model.id){
	                        	var aux=Object.assign({}, currentNode);
	                            currentNode=obj;  
	                            getJoinsTableAllPaths(edgeView.sourceView.model,tables,currentNode,visited);
	                            currentNode=aux;
	                        }
	                    }
                	}
                }
                
            }
        }
    }
}

function getJoinsTableFromTo (currentModel,tables,targetNodeId,visited,currentJoin){
    if (currentModel.id==targetNodeId){
        if (tables.some(ta=>ta['id']===currentJoin.id)==false){
        	
        	tables.push(currentJoin);
        }        
    }else{
        var inoutLinks = graphTGDs.getConnectedLinks(currentModel, { deep: true }); 
        for (var edge of inoutLinks){
            var edgeView=edge.findView(paperTGDs);
            if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="db.Table"){
                if (visited.includes(edge.id)==false){
                    if (edgeView.sourceView.model.id==currentModel.id){
                    	
                    	if (!currentJoin.id.includes(edgeView.targetView.model.id)){                    		
	                        var aux=Object.assign({}, currentJoin);
	                        var obj={id:currentJoin.id+","+edgeView.targetView.model.id, text:currentJoin.text+","+edgeView.targetView.model.attributes.question}
	                        visited.push(edge.id);                            
	                        currentJoin=obj;
	                        getJoinsTableFromTo(edgeView.targetView.model,tables,targetNodeId,visited,currentJoin);                    
	                        currentJoin=aux;                                        
                    	}
                    }else if (edgeView.targetView.model.id==currentModel.id){       
                    	if (!currentJoin.id.includes(edgeView.sourceView.model.id)){                    		
	                        var aux=Object.assign({}, currentJoin);
	                        var obj={id:currentJoin.id+","+edgeView.sourceView.model.id, text:currentJoin.text+","+edgeView.sourceView.model.attributes.question}                        
	                        visited.push(edge.id); 
	                        currentJoin=obj;
	                        getJoinsTableFromTo(edgeView.sourceView.model,tables,targetNodeId,visited,currentJoin);                    
	                        currentJoin=aux;                    
                    	}
                    }else{
						console.log(edgeView)
					}
                }
                
            }
        }
    }
}


function link(g,source, portSource, target,portTarget,color,vertices){   
    var link = new joint.shapes.standard.Link({
        source: { id: source , port:portSource},
        target: { id: target , port:portTarget}, 
        router: { name: 'manhattan' },
        connector: { name: 'jumpover' },
        vertices: vertices || [],
        attrs:{line:{stroke:color,strokeWidth: widthLink, // SVG attribute and value
        	targetMarker: {
        		'type': 'path',
        		'stroke-width': widthLink,
        		'd': 'M 10 -3 10 -10 -2 0 10 10 10 3'
        	}}}

    });    
    g.addCell(link);
    return link;
}

function linkDataBase(g,source, portSource, target,taTarget,portTarget,vertices) {      	
    var link = new joint.shapes.standard.Link({
    	target: { id: target , port:'pk-'.concat(taTarget).concat(portTarget)},
        source: { id: source , port:'fk-'.concat(portSource)}, 
        router: { name: 'manhattan' },
        connector: { name: 'jumpover' },
        vertices: vertices || []

    });    
    g.addCell(link);
    return link;
}

function linkShex(g,source, portSource, target,portTarget,vertices) {      	
    var link = new joint.shapes.standard.Link({
        source: { id: source, port:portSource},
        target: { id: target , port:portTarget},
        attrs:{line:{stroke:'#1a2832'}},
        router: { name: 'manhattan' },
        connector: { name: 'jumpover' },
        vertices: vertices || []

    });    
    g.addCell(link);
    return link;
}

function getTokens(value){
    var tokens=[];
    var j=0;
    var aux;
    
    for (var i=0; i < value.length; i++) {
        var theUnicode = value.charCodeAt(i);                
        if (theUnicode==10781){
            aux=value.substring(j,i);
            j=i+1;
            tokens.push(aux)            
        }
    }
    tokens.push(value.substring(j,i));
    return tokens;
}

function getSubjectFunctionTerm(graph, model,s_fterm, portType,bind){
    var aux_links=graph.getConnectedLinks(model, {outbound:true});
    for (var s_link of aux_links){                                
        if (model.getPort(s_link.attributes.source.port).group=='in' && s_link.attributes.target.port==portType){
            var fterm=s_link.labels()[0].attrs.text.text.split('(');
            s_fterm.push({function:fterm[0],args:[{rel:getKeyByValue(bind,model.attributes.question),attr:fterm[1].slice(0,-1)}]});
            break;
        }
    }        
}

function getNameAttribute(attributes,id){
    for (var att of attributes){
        if (att.id==id)
            return att.text;
    }
}


function getKeys(rows){	
	var keys=[];
	for (var row of rows){
		if (row.iskey){
			keys.push(row.text);
		}
	}
	return keys;
}

function getFunctionSymbol(myMap,objText){
	for (let [k, v] of myMap) {
	  if (v.includes(objText)){
		  return k;
	  }
	}
}
function createLinkTool(link){
	var verticesTool = new joint.linkTools.Vertices();
	var segmentsTool = new joint.linkTools.Segments();
	var sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
	var targetArrowheadTool = new joint.linkTools.TargetArrowhead();
	var sourceAnchorTool = new joint.linkTools.SourceAnchor();
	var targetAnchorTool = new joint.linkTools.TargetAnchor();
	var boundaryTool = new joint.linkTools.Boundary();
	var removeButton = new joint.linkTools.Remove();
	var toolsView = new joint.dia.ToolsView({
		tools: [
			verticesTool, segmentsTool,
			sourceArrowheadTool, targetArrowheadTool,
			sourceAnchorTool, targetAnchorTool,
			boundaryTool, removeButton
		]
	});
	var linkView = link.findView(paperTGDs);
	linkView.addTools(toolsView)
}


function stTGD2(graph,paper,mapTables){
    var bindNames={}
    graph.getElements().forEach(function(element){
        if (element.attributes.type=="db.Table"){
            bindNames[element.attributes.question]=element.attributes.question;
        }
    });    
    var sigma={functions:convert_map_to_obj(mapSymbols),rules:[]};    
    for (var link of graph.getLinks()){
        var linkView=link.findView(paper);
        if (linkView.sourceView.model.attributes.type=="db.Table" && linkView.targetView.model.attributes.type=="shex.Type" && linkView.sourceMagnet.nodeName=='circle'){ 
			var rule={bind:bindNames,constraints:[],yield:[]};
            //construct body terms
            var objterm=[];
            var s_fterm=[];
			var relNames;			
            for (var lab of link.labels()){
                var annotation=lab.attrs.text.text;                
                if (annotation.includes('(')){
                    var fterm=annotation.split('(');                                        
                    objterm.push({function:fterm[0],args:[{rel:getKeyByValue(rule.bind,linkView.sourceView.model.attributes.question),attr:fterm[1].slice(0,-1)}]});                                   
                } else if (annotation.includes('function')){
					
					annotation=annotation.replace(/[\[\]]/g,"")					
					let paramAnnots=annotation.split(",")
					for (let  paramAnnot of paramAnnots){
                        if (paramAnnot.includes("function") && comparisonOp.includes(paramAnnot.split(":")[1].split(" ")[0]) ){                            
							rule.constraints.push({type:paramAnnot.split(":")[1].split(" ")[0],left:{rel:linkView.sourceView.model.attributes.question,attrs:[{attr:getSourceOptionNameLinkView(linkView)}]},right:{value:paramAnnot.split(":")[1].split(" ")[1]}})
						} else if (paramAnnot.includes("function")){                            
							rule.constraints.push({type:"apply",left:{rel:linkView.sourceView.model.attributes.question,attrs:[{attr:getSourceOptionNameLinkView(linkView)}]},right:{function:paramAnnot.split(":")[1]}})
						}
						if (paramAnnot.includes("filter")){							
							rule.constraints.push({type:"like",left:{rel:linkView.sourceView.model.attributes.question,attrs:[{attr:getSourceOptionNameLinkView(linkView)}]},right:{value:paramAnnot.split(":")[1]}})
						}
					}
					
					
				}else{
                    relNames=getTokens(annotation);                    
                    if (relNames.length==1){
                        //get subject term 
                        getSubjectFunctionTerm(graph,linkView.sourceView.model,s_fterm, linkView.targetView.model.attributes.ports.items[0].id,rule.bind);
                        
                    }else{
                        
                        for (var i=0;i<relNames.length;i++){
                            var name=relNames[i];
                            var mapFD=new Map();
                            var mapBFD=new Map();
                            for (var element of graph.getElements()){                            
                                if (mapTables.get(name)==element.id){
                                    var elementView=element.findView(paper);  
									
									if (i==relNames.length-1)
										getSubjectFunctionTerm(graph,elementView.model,s_fterm, linkView.targetView.model.attributes.ports.items[0].id,rule.bind);
									
                                    mapFD.set(name,[]);
                                    mapFD.set(relNames[i+1],[]);
                                    for (var opt of elementView.model.attributes.options){
                                    	//console.log(opt);
                                        if (!!opt.ref){											
                                            if (i<relNames.length && opt.ref.name==relNames[i+1]){
                                                var joinsA=mapFD.get(name);
                                                joinsA.push({name:opt.text});
                                                //console.log(joinsA);
                                                //obtain the attribute to which goes
                                                var nameAttRef="";
                                                for (var taElem of graph.getElements()){
                                                    if (mapTables.get(opt.ref.name)==taElem.id){
                                                        var taView=taElem.findView(paper);
                                                        nameAttRef=getNameAttribute(taView.model.attributes.options,opt.ref.id);                                                        
                                                        break;
                                                    }
                                                }                                                
                                                var joinsB=mapFD.get(opt.ref.name);
                                                joinsB.push({name:nameAttRef});         
                                            }else if (typeof(relNames[i-1])!=='undefined' && opt.ref.name==relNames[i-1]){
                                                if (mapBFD.has(name)){
                                                    var joinsA=mapBFD.get(name);
                                                    joinsA.push({name:opt.text});
                                                    console.log(joinsA);
                                                }else
                                                    mapBFD.set(name,[{name:opt.text}])
                                                //obtain the attribute to which goes
                                                var nameAttRef="";
                                                for (var taElem of graph.getElements()){
                                                    if (mapTables.get(opt.ref.name)==taElem.id){
                                                        var taView=taElem.findView(paper);
                                                        nameAttRef=getNameAttribute(taView.model.attributes.options,opt.ref.id);
                                                        break;
                                                    }
                                                }
                                                if (mapBFD.has(relNames[i-2])){
                                                    var joinsB=mapBFD.get(relNames[i-2])
                                                    joinsB.push({name:nameAttRef})
                                                }else
                                                    mapBFD.set(relNames[i-2],[{name:nameAttRef}]);
                                            }											
                                        }
                                    }
                                    //Has reached the table do not need to continue searching other tables then break the loop 
                                    break;
                                }
                            }                                                 
                            if (mapBFD.has(relNames[i-2])){                                
                                rule.constraints[rule.constraints.length-1].left.attrs=mapBFD.get(relNames[i-2]);
                                rule.constraints[rule.constraints.length-1].right.attrs=mapBFD.get(name);                                
                            }
							if (i<relNames.length-1)
								rule.constraints.push({type:"eq",left:{rel:name,attrs:mapFD.get(name)},right:{rel:relNames[i+1],attrs:mapFD.get(relNames[i+1])}});							
                            
                        }
                        
                    }                    
                }
            }
            if (objterm.length==0){
				for (var opt of linkView.sourceView.model.attributes.options){                        
                        if (opt.id==V(linkView.sourceMagnet.parentNode).attr('port')){                            
							objterm.push({rel:getKeyByValue(rule.bind,relNames[0]),attr:opt.text})
                            break;
                        }
                    }
				
			}
            var triTerms=[];
            //Add the type
            rule.yield.push({atom:linkView.targetView.model.attributes.question,args:s_fterm});
            //Add the triple
            var iriProperty=link.attributes.target.port.split(",")[0];
            triTerms.push(s_fterm);
            triTerms.push(iriProperty);
			triTerms.push(objterm);
            rule.yield.push({atom:"Triple",args:triTerms});
			sigma.rules.push(rule)
        }
    }    
    return sigma;
    
}

function getSourceOptionNameLinkView(linkView){
    for (var opt of linkView.sourceView.model.attributes.options){                        
        if (opt.id==V(linkView.sourceMagnet.parentNode).attr('port')){                            
            return opt.text;            
        }
    }
}
function getTargetOptionNameLinkView(linkView){
    for (var opt of linkView.targetView.model.attributes.options){                        
        if (opt.id==V(linkView.targetMagnet.parentNode).attr('port')){                            
            return opt.text;            
        }
    }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function orderTablesByShortestName(tables){    
    return tables.sort(function(a,b){
        if (a.id.split(",").length > b.id.split(",").length)
            return 1;
        if (a.id.split(",").length < b.id.split(",").length)
            return -1;
        return 0;
            
    })
}

function getHeight() {
        return $(window).height() - $('h1').outerHeight(true);
    }
function filterKeyParam(params){
    var keyparams=[]
    for (var param of params){
        if (param.iskey){
            keyparams.push(param)
        }
    }
    return keyparams;
}
const convert_map_to_obj = ( aMap => {
    const obj = {};
    aMap.forEach ((v,k) => { obj[k] = v });
    return obj;
});


function getLayoutOptions(){
    return {
                setVertices: true,
                setLabels: true,
                ranker: "network-simplex",
                rankDir: "LR",
                align: "UL",
                rankSep: parseInt(150, 10),
                edgeSep: parseInt(150, 10),
                nodeSep: parseInt(150, 10)
            };
}

function getLayoutOptionsNotVertices(){
    return {
                setVertices: false,
                setLabels: true,
                ranker: "network-simplex",
                rankDir: "LR",
                align: "UL",
                rankSep: parseInt(150, 10),
                edgeSep: parseInt(150, 10),
                nodeSep: parseInt(150, 10)
            };
}

function filterNodesById(nodes,id){
	return nodes.filter(function(n) { return n.id === id; });
}

function triplesToGraph(svg,triples){

	svg.html("");
	//Graph
	var graph={nodes:[], links:[]};
	
	//Initial Graph from triples
	triples.forEach(function(triple){
		var subjId = triple.subject;
		var predId = triple.predicate;
		var objId = triple.object;
		
		var subjNode = filterNodesById(graph.nodes, subjId)[0];
		var objNode  = filterNodesById(graph.nodes, objId)[0];
		
		if(subjNode==null){
			subjNode = {id:subjId, label:subjId, weight:1};
			graph.nodes.push(subjNode);
		}
		
		if(objNode==null){
			objNode = {id:objId, label:objId, weight:1};
			graph.nodes.push(objNode);
		}
	
		
		graph.links.push({source:subjNode, target:objNode, predicate:predId, weight:1});
	});
	
	return graph;
}

function update(svg,force,graph){
	// ==================== Add Marker ====================
	svg.append("svg:defs").selectAll("marker")
	    .data(["end"])
	  .enter().append("svg:marker")
	    .attr("id", String)
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 30)
	    .attr("refY", -0.5)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  .append("svg:polyline")
	    .attr("points", "0,-5 10,0 0,5")
	    ;
		
	// ==================== Add Links ====================
	var links = svg.selectAll(".link")
						.data(graph.links)
						.enter()
						.append("line")
							.attr("marker-end", "url(#end)")
							.attr("class", "link")
							.attr("stroke-width",1)
					;//links
	
	// ==================== Add Link Names =====================
	var linkTexts = svg.selectAll(".link-text")
                .data(graph.links)
                .enter()
                .append("text")
					.attr("class", "link-text")
					.text( function (d) { return d.predicate; })
				;
		//linkTexts.append("title")
		//		.text(function(d) { return d.predicate; });
				
	// ==================== Add Link Names =====================
	var nodeTexts = svg.selectAll(".node-text")
                .data(graph.nodes)
                .enter()
                .append("text")
					.attr("class", "node-text")
					.text( function (d) { return d.label; })
				;
		//nodeTexts.append("title")
		//		.text(function(d) { return d.label; });
	
	// ==================== Add Node =====================
	var nodes = svg.selectAll(".node")
						.data(graph.nodes)
						.enter()
						.append("circle")
							.attr("class", "node")
							.attr("r",8)
							.call(force.drag)
					;//nodes

	// ==================== Force ====================
	force.on("tick", function() {
		nodes
			.attr("cx", function(d){ return d.x; })
			.attr("cy", function(d){ return d.y; })
			;
		
		links
			.attr("x1", 	function(d)	{ return d.source.x; })
	        .attr("y1", 	function(d) { return d.source.y; })
	        .attr("x2", 	function(d) { return d.target.x; })
	        .attr("y2", 	function(d) { return d.target.y; })
	       ;
		   
		nodeTexts
			.attr("x", function(d) { return d.x + 12 ; })
			.attr("y", function(d) { return d.y + 3; })
			;
			
		linkTexts
			.attr("x", function(d) { return 4 + (d.source.x + d.target.x)/2  ; })
			.attr("y", function(d) { return 4 + (d.source.y + d.target.y)/2 ; })
			;
	});
	
	// ==================== Run ====================
	force
      .nodes(graph.nodes)
      .links(graph.links)
	  .charge(-500)
	  .linkDistance(100)
      .start()
	  ;
}
function updateParamGreenLink(pid){
	/*let objGraphic=$table.bootstrapTable('getRowByUniqueId',pid);                   
    var sHead=$(objGraphic.ex)[0].lastChild.textContent;
    var fSubject=$(objGraphic.ex)[1].firstChild.textContent;                
    var tHead=$(objGraphic.ex)[2].lastChild.textContent;
    
    let graphicTGD=buildGreenLink(link,sHead,fSubject,tHead,"");                
    $table.bootstrapTable('updateByUniqueId',{id:pid,row:{ex:graphicTGD}})
    */
}
function loadIRIAttWhereParam(currentLink,iris, parameters,functionsMap){
	let filAtt=[];
	parameters.forEach(function(att){
		if (att.iskey==false){			
			if (att.type=='date'){
				filAtt.push({id:att.id,field:att.text,type:att.type,
					validation: {format: 'YYYY/MM/DD'},
				    plugin: 'datepicker',
				    plugin_config: {
				      format: 'yyyy/mm/dd',
				      todayBtn: 'linked',
				      todayHighlight: true,
				      autoclose: true
				    }});
			}else{
				let typAtt="";
				if (att.type.toLowerCase().includes("char")|| att.type.toLowerCase()=="text"){
					typAtt="string";
					filAtt.push({id:att.id,field:att.text,type:typAtt,operators: ['equal', 'not_equal','contains'],default_operator: 'equal'});
				}else if (att.type.toLowerCase().includes("int")) {
					typAtt="integer";
					filAtt.push({id:att.id,field:att.text,type:typAtt,operators: ['equal', 'not_equal','less','less_or_equal','greater','greater_or_equal'],default_operator: 'equal'});
				} else if (att.type.toLowerCase()=="double" || att.type.toLowerCase()== "decimal" || att.type.toLowerCase()=="float"){
					typAtt="double";
					filAtt.push({id:att.id,field:att.text,type:typAtt,operators: ['equal', 'not_equal','less','less_or_equal','greater','greater_or_equal'],default_operator: 'equal'});
				} else if (att.type.toLowerCase().includes("bool")) {
					typAtt="bool";
					filAtt.push({id:att.id,field:att.text,type:typAtt,operators: ['equal', 'not_equal'],default_operator: 'equal'});
				} else {
					typAtt="string";
					filAtt.push({id:att.id,field:att.text,type:typAtt,operators: ['equal', 'not_equal','contains'],default_operator: 'equal'});
				}
				
			}
		}
	});
	
	let keyParameters=filterKeyParam(parameters)
    var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.iris = opts.displayIris;
            this.parameters=opts.displayParameters;
        },
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";
            var divDropdown=document.createElement('div');
            divDropdown.id='ddIriConstructor';
            divDropdown.className='dropdown';
            
            var iriUrl=createText("iriUrl");
            
            var items = createList(this.iris);            
            var buttonDropIri=createButton(this.iris[0].text);
            divDropdown.appendChild(buttonDropIri);
            divDropdown.appendChild(iriUrl);
            divDropdown.appendChild(items);
            
            var divDropdownParameters=document.createElement('div');
            divDropdownParameters.id='ddParameter';
            divDropdownParameters.className='dropdown';
            var buttonDropParameter=createButton(this.parameters[0].text);
            divDropdownParameters.appendChild(buttonDropParameter);
            var itemsParameters=createList(this.parameters);        
            divDropdownParameters.appendChild(itemsParameters);
                        
            divContainer.appendChild(divDropdown);        
            divContainer.appendChild(divDropdownParameters);
            
            var divQuery=document.createElement('div');            
            divQuery.id='queryB'; 
            divContainer.appendChild(divQuery);
            
            this.$el.html(divContainer);        
            return this;
        },
        events :{
            "click .dropdown-menu a":"changeName",
            "click #ddIriConstructor a":"changeInputText"
        },
        changeName: function(e) {                                           
            $(e.target).parents(".dropdown").find('.btn').html($(e.target).text().replace(/,/g,'&#10781;') + ' <span class="caret"></span>');            
            $(e.target).parents(".dropdown").find('.btn').val($(e.target).data('value'));
        },
        changeInputText:function (e) {
            $("#iriUrl").val(functionsMap.get($(e.target).text().trim()));            
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Define IRI Constructor'},
        bodyView: CustomView,
        bodyViewOptions: { displayIris: iris, displayParameters:keyParameters },
        onConfirm: function(a) {                                 
            if ($("#ddParameter .btn").text().trim()=="Constructor Parameters" || $("#ddIriConstructor .btn").text().trim()=="IRI Constructors"){
                alert("Need to specify IRI and Parameter")
                this.isConfirmed=false;                
            }else{            
                var valueIRI=$("#ddIriConstructor .btn").text().trim();
                valueIRI=valueIRI.concat("(");
                valueIRI=valueIRI.concat($("#ddParameter .btn").text().trim());
                valueIRI=valueIRI.concat(")");
                if (currentLink.labels().length>0){
                    currentLink.label(0,{attrs: {text: {text: valueIRI}}});     
                    console.log("draw again");
                    drawSVGGraph();
                }
                
                //verify if it does not exist a link with the same IRI already in the canvas
                //let notFound=true;
                //if (notFound){
                //	console.log("draw again")
                //	drawSVGGraph();
                //}
                
            }
            
            let conditions=$('#queryB').queryBuilder('getRules',{ skip_empty: true });
        	if (conditions!=null && conditions.valid==true){        		
        		let condToStr=getCondWhere(conditions.rules);
        		if (currentLink.labels().length==1){
        			currentLink.appendLabel({
            			markup: [{tagName: 'rect',selector: 'labelBody'}, {tagName: 'text',selector: 'text'}],
                        attrs: {
                            text: {
                                text: condToStr,
                                fill: '#7c68fc',
                                fontFamily: 'sans-serif',
                                textAnchor: 'middle',
                                textVerticalAnchor: 'middle'
                            },
                            labelBody: {ref: 'text',refX: -5,refY: -5,refWidth: '100%',refHeight: '100%',refWidth2: 10,refHeight2: 10,stroke: '#7c68fc',fill: 'white',strokeWidth: 2,rx: 5,ry: 5}
                        },position: {offset: -40}});
        		}else{
        			 currentLink.label(1,{attrs: {text: {text: condToStr}}})
        		}
        		        		        		
        		tgdGreenCond.get(currentLink.id)[0]=condToStr;
        		
        	}   
        },        
        onCancel: function(){            
        }        
    });
    modal.render();
    $('#queryB').queryBuilder({filters:filAtt});
}

/**
 * This methods is called from a entity mapping
 * */
function loadWhereParam(link,attributes,targetCy){	
	let filAtt=[];
	attributes.forEach(function(att){
		if (att.iskey==false){			
			if (att.type=='date'){
				filAtt.push({id:att.id,field:att.text,type:att.type,
					validation: {format: 'YYYY/MM/DD'},
				    plugin: 'datepicker',
				    plugin_config: {
				      format: 'yyyy/mm/dd',
				      todayBtn: 'linked',
				      todayHighlight: true,
				      autoclose: true
				    }});
			}else{
				let typAtt="";
				if (att.type.includes("CHAR")|| att.type=="text"){
					typAtt="string";
				}else{
					typAtt=att.type;
				}
				filAtt.push({id:att.id,field:att.text,type:typAtt,operators: ['equal', 'not_equal','contains'],default_operator: 'equal'});
			}
		}
	});
	var CustomView = Backbone.View.extend({
        initialize: function(opts) {
        	
        },
        render: function() {
            var divContainer=document.createElement('div');            
            divContainer.id='queryB';            
            this.$el.html(divContainer);        
            return this;
        },
        events :{
            
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Add Conditions'},
        bodyView: CustomView,
        bodyViewOptions: { },
        onConfirm: function(a) {                                 
        	let conditions=$('#queryB').queryBuilder('getRules',{ skip_empty: true });
        	if (conditions!=null && conditions.valid==true){        		
        		let condToStr=getCondWhere(conditions.rules);
        		link.appendLabel({
        			markup: [{tagName: 'rect',selector: 'labelBody'}, {tagName: 'text',selector: 'text'}],
                    attrs: {
                        text: {
                            text: condToStr,
                            fill: '#7c68fc',
                            fontFamily: 'sans-serif',
                            textAnchor: 'middle',
                            textVerticalAnchor: 'middle'
                        },
                        labelBody: {ref: 'text',refX: -5,refY: -5,refWidth: '100%',refHeight: '100%',refWidth2: 10,refHeight2: 10,stroke: '#7c68fc',fill: 'white',strokeWidth: 2,rx: 5,ry: 5}
                    },position: {offset: -40}});        		
        		//targetCy.$('#'+link.id).data('labelS',condToStr);
        		tgdGreenCond.get(link.id)[0]=condToStr;
        		/*let objGraphic=$table.bootstrapTable('getRowByUniqueId',link.id);                            
                var sHead=$(objGraphic.ex)[0].lastChild.textContent;
                var fSubject=$(objGraphic.ex)[1].firstChild.textContent;                
                var tHead=$(objGraphic.ex)[2].lastChild.textContent;
                
                let graphicTGD=buildGreenLink(link,sHead,fSubject,tHead,condToStr);                
                $table.bootstrapTable('updateByUniqueId',{id:link.id,row:{ex:graphicTGD}})
                */
        	}        	
        },        
        onCancel: function(){            
        }        
    });
    modal.render();
	
    $('#queryB').queryBuilder({filters:filAtt});	
			    
}
function operatorStrToChar(operator){
	switch(operator){
	case "equal":
		return "=";
	case "not equal":
		return "!=";
	case "less":
		return "<";
	case "less_or_equal":
		return "<=";
	case "greater":
		return ">";
	case "greater_or_equal":
		return ">=";	
	case "contains":
		return " like ";
	}
}
/**
 * This method returns where statement 
 * */
function getCondWhere(conditions){
	let stmt="";
	conditions.forEach(function(cond){		
		if (cond.operator=="between"){
			stmt=stmt.concat(cond.field).concat(">=").concat(cond.value[0]).concat(" AND ").concat(cond.field).concat("<=").concat(cond.value[1]);
		}else{
			if (cond.type=="double"|| cond.type=="integer" )
				stmt=stmt.concat(cond.field).concat(operatorStrToChar(cond.operator)).concat(cond.value);
			else
				stmt=stmt.concat(cond.field).concat(operatorStrToChar(cond.operator)).concat("'").concat(cond.value).concat("'");
		}
		stmt=stmt.concat(",");
		
	});
	stmt=stmt.substr(0,stmt.length-1);
	return stmt;
}

/**
 *This method pop up a modal where user chooses a color
 **/
function loadConfModal(){
	var CustomView = Backbone.View.extend({
        initialize: function() {
            
        },
        render: function() {                             
            var divForm1 = document.createElement("div");
            divForm1.setAttribute("class","form-group");
            divForm1.setAttribute("class","colorG");
            
            var inputEntityLineColor=document.createElement("input");
            inputEntityLineColor.setAttribute("id","entColor");
            inputEntityLineColor.setAttribute("class","form-control");
            inputEntityLineColor.setAttribute("type","color");
            inputEntityLineColor.setAttribute("name","Entity Line");
            inputEntityLineColor.setAttribute("value",subjectLinkColor);
            var lEnt = document.createElement("LABEL");
            var t = document.createTextNode("Entity Mapping");
            lEnt.setAttribute("for", "entColor");
            lEnt.appendChild(t);            
            
            var inputAttLineColor=document.createElement("input");
            inputAttLineColor.setAttribute("id","attColor");
            inputAttLineColor.setAttribute("class","form-control");
            inputAttLineColor.setAttribute("type","color");
            inputAttLineColor.setAttribute("name","Attribute Line");
            inputAttLineColor.setAttribute("value",attributeLinkColor);
            var lAtt = document.createElement("LABEL");
            var t1 = document.createTextNode("Attribute-Literal Mapping");
            lAtt.setAttribute("for", "attColor");
            lAtt.appendChild(t1);
            
            var inputAttRefLineColor=document.createElement("input");
            inputAttRefLineColor.setAttribute("id","refColor");
            inputAttRefLineColor.setAttribute("class","form-control");
            inputAttRefLineColor.setAttribute("type","color");
            inputAttRefLineColor.setAttribute("name","Attribute Reference Line");
            inputAttRefLineColor.setAttribute("value",attributeRefLinkColor);
            var lAttRef = document.createElement("LABEL");
            var t2 = document.createTextNode("Reference-Typed Mapping");
            lAttRef.setAttribute("for", "refColor");
            lAttRef.appendChild(t2);
            divForm1.appendChild(lEnt);
            divForm1.appendChild(inputEntityLineColor);
            divForm1.appendChild(lAtt);
            divForm1.appendChild(inputAttLineColor);
            divForm1.appendChild(lAttRef);
            divForm1.appendChild(inputAttRefLineColor);
            this.$el.html(divForm1);                
            return this;
        },

    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Configure color lines'},
        bodyView: CustomView,
        bodyViewOptions: { },
        onConfirm: function() {
        	const colorSet=new Set([$('#entColor').val(),$('#attColor').val(),$('#refColor').val()]);
        	if (colorSet.size!=3){
        		alert("Color lines should be different!");
        	}
        	if (colorSet.has("#000000")){
        		alert("Black color should not be used");
        	}
        	
        	for (var link of graphTGDs.getLinks()){
        		if (link.attr('line/stroke')==subjectLinkColor){
        			link.attr({line:{stroke:$('#entColor').val()}});        			
        		}
        		if (link.attr('line/stroke')==attributeLinkColor){
        			link.attr({line:{stroke:$('#attColor').val()}});        			
        		}
        		if (link.attr('line/stroke')==attributeRefLinkColor){
        			link.attr({line:{stroke:$('#refColor').val()}});        			
        		}
        	}
        	
        	subjectLinkColor=$('#entColor').val();        	      
        	attributeLinkColor=$('#attColor').val();                	
        	attributeRefLinkColor=$('#refColor').val();
        	
        	drawSVGGraph();        	
        },
        onCancel: function(){
        }        
    });
    modal.render();
}

function loadAttachFile(link,tgdCy){
	var CustomView = Backbone.View.extend({
        initialize: function(opts) {
            this.lsPaths=opts.displayParameters;
        },
        render: function() {                             
            var divForm1 = document.createElement("div");
            divForm1.setAttribute("class","form-group");
            
            var textArea=document.createElement('textarea');
            textArea.setAttribute('id','taIRI');
            textArea.classList.add('form-control');
            
            var inputFile=document.createElement('input');
            inputFile.setAttribute('type','file');
            inputFile.classList.add('form-control');                
            divForm1.appendChild(inputFile);	            
            divForm1.appendChild(textArea);
            this.$el.html(divForm1);                
            return this;
        }
    });
    var modal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'Adding Code'},
        bodyView: CustomView,        
        onConfirm: function() {                           
        	//link.
        	console.log($('#taIRI').val());
        	//tgdCy.$id(link.id).data('labelT',$('#taIRI').val());
        	tgdGreenCond.get(link.id)[1]=$('#taIRI').val();
        },
        onCancel: function(){            
        }        
    });
    modal.render();	
}

function deleteParentIfNotChildren(node,tgdCy){	
	if (node.children().length==0 && node.outdegree(false)==0){
		let nodeP=node.parent();
		tgdCy.remove(node);
		deleteParentIfNotChildren(nodeP,tgdCy);
	}
}
function arrayRemove(arr, value) {
   return arr.filter(function(ele){
       return ele != value;
   });
}

function drawSVGGraph(){
	$('.entRSVG').css({
		'border':'solid 1px '+colorbgEnt		
	});
	$('.entSSVG').css({
		'border':'solid 1px '+shcolorbgEnt		
	});
	$("#tableTGD").html("");
	var svg = d3.select("#tableTGD")
	.append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 400")
   //class to make it responsive
   .classed("svg-content-responsive", true); 
	   //.append("svg").attr("width", svgCanvasTGDW).attr("height", svgCanvasTGDH);
	var defs = svg.append("defs")
	defs.append("marker")
	.attr({
		"id":"arrowEnt",
		"refX":0,
		"refY":3,
		"markerWidth":widthsvgLink*5,
		"markerHeight":widthsvgLink*5,
		"orient":"auto",
		"markerUnits":"strokeWidth"
			
	})
	.append("path")
		.attr("d", "M0,0 L0,6 L9,3 z")
		.attr("style","fill:"+subjectLinkColor);
	
	defs.append("marker")
	.attr({
		"id":"arrowAtt",
		"refX":0,
		"refY":3,
		"markerWidth":widthsvgLink*5,
		"markerHeight":widthsvgLink*5,
		"orient":"auto",
		"markerUnits":"strokeWidth"
			
	})
	.append("path")
		.attr("d", "M0,0 L0,6 L9,3 z")
		.attr("style","fill:"+attributeLinkColor);
	
	defs.append("marker")
	.attr({
		"id":"arrowRefAtt",
		"refX":0,
		"refY":3,
		"markerWidth":widthsvgLink*5,
		"markerHeight":widthsvgLink*5,
		"orient":"auto",
		"markerUnits":"strokeWidth"
			
	})
	.append("path")
		.attr("d", "M0,0 L0,6 L9,3 z")
		.attr("style","fill:"+attributeRefLinkColor);
	let hTe=27;
	let wTe=100;
	let widthText=150;
	let distanceEnts=200;
	let heightText=27;
	let curPosEY=20;
	let curPosEX=10;
	let margin=50;
	let spaceHeight=15;
	let beginSpace=10;
	let rightAlign=40;
	let tgdPosDB=new Map();
	let tgdPosSh=new Map();
	tgdLines.forEach(function(attLines,key,map){
		//draw source Entity
		drawText(svg,curPosEX,curPosEY,tgdGreenCond.get(key)[3],widthText,heightText,"rel");		
		//draw target Entity
		drawText(svg,curPosEX+widthText+distanceEnts+widthsvgLink*6,curPosEY,tgdGreenCond.get(key)[4],widthText,heightText,"sh");
		drawLineArrowGreen(svg,curPosEX+widthText,curPosEY+heightText/2,curPosEX+widthText+distanceEnts,curPosEY+heightText/2,subjectLinkColor,"Ent",tgdGreenCond.get(key)[0]);				
		//draw IRI over line
		drawTextAndOptions(svg,curPosEX+widthText+distanceEnts/4,curPosEY-heightText/2,tgdGreenCond.get(key)[2],widthText,heightText,key,"green_tgd");		
		let iniPosTaY=curPosEY+heightText;		
		curPosEY=curPosEY+heightText+beginSpace;		
		let pathAttTree=new Map(); 
		let attDepth=new Map();
		let attArr=[];
		let attShArr=[];
		let attMapPos=new Map();
		let positionShX=curPosEX+distanceEnts+widthText;
		let positionShY=curPosEY;
		
		//drawLine(svg,curPosEX,curPosEY-10,curPosEX,curPosEY,"#000000");
		let taNames=new Set();
		let attBool=false;
		for (let att of attLines){			
			let taArray=tgdPathLine.get(att.id)[0];			
			if (taArray.length==1){
				attBool=true;
				drawAtt(svg,tgdPathLine.get(att.id)[1],curPosEX,curPosEY,rightAlign,wTe,hTe);
				let pix=tgdPathLine.get(att.id)[1].length*8+8;				
				tgdPosDB.set(att.id,[curPosEX+rightAlign+wTe,curPosEY+hTe/2]);				
				curPosEY=curPosEY+hTe+spaceHeight;
			}			
			taArray.forEach(function(ta){
				taNames.add(ta);
			});						
			attDepth.set(tgdPathLine.get(att.id)[2],curPosEY);
		}
		
		//Draw vertical line in the table
		if (attBool){
			let wTaleft=10;
			drawLine(svg,curPosEX+wTaleft,iniPosTaY,curPosEX+wTaleft,curPosEY-spaceHeight-hTe/2,"#000000");
		}else{
			curPosEY+=heightText/2;
		}
		
		let k=0;	
		let indexTa=new Map();		
		taNames.forEach(function(ta){
			indexTa.set(ta,k);
			pathAttTree.set(ta,new Map());
			k++;
		})		
		for (let att of attLines){
			let taArray=tgdPathLine.get(att.id)[0];						
			if (taArray.length>1){
				if (pathAttTree.get(taArray[0]).has(tgdPathLine.get(att.id)[1])){
					pathAttTree.get(taArray[0]).get(tgdPathLine.get(att.id)[1]).push(att.id);
				}else{
					pathAttTree.get(taArray[0]).set(tgdPathLine.get(att.id)[1],[att.id]);
				}				
			}
		}
		let matrix=Array(taNames.size).fill(null).map(() => Array(taNames.size).fill(0));
		let curEX=[curPosEX];
		let curEY=[curPosEY];		
		getTreeOrder(svg,attLines,curEX,curEY,matrix, indexTa,tgdGreenCond.get(key)[3],pathAttTree,tgdPosDB,attDepth);		
		let orderShAtt=orderByValue(attDepth);		
		let attSh=Array.from(orderShAtt.keys());
		let posIniY=positionShY;
		/*
		 * Draws the attributes of each shex type
		 * */
		attSh.forEach(function(at){
			drawAttSh(svg,at,positionShX+widthsvgLink*6,positionShY,rightAlign,wTe,hTe);	
			attMapPos.set(at,[positionShX+widthsvgLink*6,positionShY]);
			positionShY+=hTe+spaceHeight;
		})
		//Draw vertical line in the target shape
		if (attSh.length>0){
			drawLine(svg,positionShX+rightAlign/2+widthsvgLink*6,posIniY-10,positionShX+rightAlign/2+widthsvgLink*6,positionShY-hTe,"#000000");
		}
		
		for (let att of attLines){
			tgdPosSh.set(att.id,attMapPos.get(tgdPathLine.get(att.id)[2]));
		}
		//draw the paths and attributes
		curPosEY=curEY[0]+margin;		
		drawAttLines(svg,attLines,tgdPosDB,tgdPosSh,hTe,0);		
	});	
	svg.attr("viewBox","0 0 600 "+curPosEY);
}
function drawText(svg,posX,posY,value,wText,hText,type){	
	var fo=svg.append("foreignObject").attr("x", posX).attr("y", posY).attr("width", wText).attr("height", hText);
	if (type=="rel")
		fo.append("xhtml:div").attr({"class":"entRSVG","data-tooltip":true,"title":value}).text(value)
	else if (type=="sh"){
		fo.append("xhtml:div").attr({"class":"entSSVG","data-tooltip":true,"title":value}).text(value)
	}else if (type=="rel-att"){
		fo.append("xhtml:div").attr({"class":"attRSVG","data-tooltip":true,"title":value}).text(value);
	}else{
		fo.append("xhtml:div").attr({"class":"attSSVG","data-tooltip":true,"title":value}).text(value);
	}
	//.attr("style", "width:"+wText+"px; height:"+hText+"px; overflow-x:auto").text(value);		
}
function drawTextAndOptions(svg,posX,posY,value,wText,hText,linkId,classDiv){	
	var fo=svg.append("foreignObject").attr("x", posX).attr("y", posY).attr("width", wText).attr("height", hText);
	fo.append("xhtml:div").attr("style", "width:"+wText+"px; height:"+hText+"px; overflow-x:auto;display:inline").text(value);	
	fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"edit_"+classDiv}).html('<a data-tooltip="true" title="Edit IRI"><i class="fas fa-edit"></i></a>');
	fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"rem_"+classDiv}).html('<a data-tooltip="true" title="Remove Link"><i class="fas fa-minus-circle"></i></a>');
	//fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"adc_"+classDiv}).html('<a data-tooltip="true" title="Add Condition"><i class="fas fa-plus-square"></i></a>');
	//fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"dec_"+classDiv}).html('<a data-tooltip="true" title="Delete Condition"><i class="fas fa-minus-square"></i></a>');
}
function drawTextAndOptionsRed(svg,posX,posY,value,wText,hText,linkId,classDiv){	
	var fo=svg.append("foreignObject").attr("x", posX).attr("y", posY).attr("width", wText+30).attr("height", hText);
	fo.append("xhtml:div").attr("style", "width:"+wText+"px; height:"+hText+"px; overflow-x:auto;display:inline").text(value);	
	fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"edit_"+classDiv}).html('<a data-tooltip="true" title="Edit IRI"><i class="fas fa-edit"></i></a>');
	fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"rem_"+classDiv}).html('<a data-tooltip="true" title="Remove Link"><i class="fas fa-minus-circle"></i></a>');
}
function drawLine(svg, posiniX,posiniY,posfinX,posfinY,color){
	svg.append("line")
    .attr("x1", posiniX)
    .attr("y1", posiniY)
    .attr("x2", posfinX)
    .attr("y2", posfinY)
    .style("stroke", color)
    .style("stroke-width", 1);	
}
function drawLineArrow(svg, posiniX,posiniY,posfinX,posfinY,color,type,linkId){
	svg.append("line")
	.attr("marker-end","url(#arrow"+type+")")
    .attr("x1", posiniX)
    .attr("y1", posiniY)
    .attr("x2", posfinX)
    .attr("y2", posfinY)
    .style("stroke", color)
    .style("stroke-width", widthsvgLink);	
	if (type=="Att"){
		var fo=svg.append("foreignObject").attr("x", posfinX-20).attr("y", posfinY).attr("width", 40).attr("height", 20);
		fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"edit_blue_tgd"}).html('<a data-tooltip="true" title="Add Filter"><i class="fas fa-edit"></i></a>');
		fo.append("xhtml:div").style("display", "inline").attr({id:linkId,class:"rem_blue_tgd"}).html('<a data-tooltip="true" title="Remove Link"><i class="fas fa-minus-circle"></i></a>');
	}
}
function drawLineArrowGreen(svg, posiniX,posiniY,posfinX,posfinY,color,type,condition){
	if (condition!=null && condition.length>0){
		svg.append("line")
		.attr("marker-end","url(#arrow"+type+")")
	    .attr("x1", posiniX)
	    .attr("y1", posiniY)
	    .attr("x2", posfinX)
	    .attr("y2", posfinY)    
	    .attr("title","<div>"+condition+"</div>")
	    .style("stroke", color)
	    .style("stroke-width", widthsvgLink);
	}else{
		svg.append("line")
		.attr("marker-end","url(#arrow"+type+")")
	    .attr("x1", posiniX)
	    .attr("y1", posiniY)
	    .attr("x2", posfinX)
	    .attr("y2", posfinY)    
	    .style("stroke", color)
	    .style("stroke-width", widthsvgLink);	
	}
	
	
}
function drawAtt(svg,att, posX,posY,rightAlign,wTe,hTe){
	let spacewMargin=10;
	let spacehMargin=10;
	//drawLine(svg,posX+spacewMargin,posY-spacehMargin,posX+spacewMargin,posY+hTe/2,"#0f0f10");
	drawLine(svg,posX+spacewMargin,posY+hTe/2,posX+spacewMargin+rightAlign,posY+hTe/2,"#0f0f10");
	drawText(svg,posX+rightAlign,posY,att,wTe,hTe,"rel-att");	
}
function drawAttSh(svg,att, posX,posY,rightAlign,wTe,hTe){
	//drawLine(svg,posX,posY,posX,posY+hTe/2,"#0f0f10");
	drawLine(svg,posX+rightAlign/2,posY+hTe/2,posX+rightAlign,posY+hTe/2,"#0f0f10");
	drawText(svg,posX+rightAlign,posY,att,wTe,hTe,"");	
}
function drawAttLines(svg,attLines,tgdPosDB,tgdPosSh,hTe,minusWA){
	for (let att of attLines){
		let positionIni=tgdPosDB.get(att.id);
		let positionFin=tgdPosSh.get(att.id);
		if (att.type=="att")
			drawLineArrow(svg,positionIni[0],positionIni[1],positionFin[0]-minusWA,positionFin[1]+hTe/2,attributeLinkColor,"Att",att.id);
		else{
			drawLineArrow(svg,positionIni[0],positionIni[1],positionFin[0]-minusWA,positionFin[1]+hTe/2,attributeRefLinkColor,"RefAtt",att.id);
			
			drawTextAndOptionsRed(svg,positionIni[0]+(positionFin[0]-positionIni[0])/3,positionIni[1]+(positionFin[1]-positionIni[1])/2,tgdPathLine.get(att.id)[3],100,25,att.id,"red_tgd");
		}
	}
}

function getTreeOrder(svg,attLines,posX,posY,matrix,indexTa,taName,pathAttTree,tgdPosDB,attDetph){
	//let posXRank=[posX];
	let wEntNode=100;
	let hEntNode=27;	
	for (let att of attLines){
		let taArray=tgdPathLine.get(att.id)[0];
		for (let i=taArray.length-2;i>=0;i--){
			let row=indexTa.get(taArray[i]);
			let col=indexTa.get(taArray[i+1])
			matrix[row][col]=1;
		}
	}
	let visited=Array(indexTa.size).fill(0);
	let lastY=[posY[0]-hEntNode]
	let spaceH=10;	
	console.log(lastY);
	drawTree(svg,matrix,indexTa.get(taName),indexTa,posX,posY,wEntNode,hEntNode,visited,pathAttTree,tgdPosDB,attDetph,lastY,spaceH);
}
/**
 *One character is equal to 8 pixel
 * */
function drawAttNested(svg,mapAtt,posX,posY,wTe,hTe,tgdPosDB,attDepth,spaceH){
	let right=40;
	let keys=Array.from( mapAtt.keys());
	let spacewMargin=10;
	let spacehMargin=10;
	if (keys.length>0){
		posY[0]+=spaceH;
	}	
	for (let keyAtt of  keys){
		//let lenTePix=keyAtt.length*8+8;
		let lenTePix=70;
		drawLine(svg,posX[0]+spacewMargin,posY[0]-spacehMargin,posX[0]+spacewMargin,posY[0]+hTe/2,"#0f0f10");
		drawLine(svg,posX[0]+spacewMargin,posY[0]+hTe/2,posX[0]+spacewMargin+right,posY[0]+hTe/2,"#0f0f10");
		
		drawText(svg,posX[0]+right,posY[0],keyAtt,lenTePix,hTe,"rel-att");		
		mapAtt.get(keyAtt).forEach(function(id){
			tgdPosDB.set(id,[posX[0]+right+lenTePix,posY[0]+hTe/2]);			
			if (attDepth.has(tgdPathLine.get(id)[2])){			
				attDepth.set(tgdPathLine.get(id)[2],attDepth.get(tgdPathLine.get(id)[2])>posY[0]+hTe/2?attDepth.get(tgdPathLine.get(id)[2]):posY[0]+hTe/2);
			}else{
				attDepth.set(tgdPathLine.get(id)[2],posY[0]+hTe/2);
			}
		});
		
		
		posY[0]=posY[0]+hTe;
	}
	
}
function drawTree(svg,matrix,col,indexTa,curPosEX,curPosEY,widthText,heightText,visited,pathAttTree,tgdPosDB,attDepth,lastYPos,spaceHeight){
	let posLevelY=lastYPos[0];
	for (let l=0;l<matrix.length;l++){		
		if (matrix[l][col]==1 && visited[l]==0){					
			let before=curPosEX[0];
			let beforeY=curPosEY[0];
			let name=getTextIndex(l,indexTa);
									
			let spacewMargin=10;
			//let spacehMargin=10;
			
			if (!islastzeros(l+1,col,matrix)){
				//horizontal line
				drawLine(svg, before,curPosEY[0],curPosEX[0]+40,curPosEY[0],"#000000");	
				curPosEX[0]=curPosEX[0]+40;	
				//lastYPos[0]=curPosEY[0];								
			}
			//vertical line
			drawLine(svg, before+spacewMargin,posLevelY,before+spacewMargin,curPosEY[0],"#000000");
			
			drawText(svg,curPosEX[0],curPosEY[0],name,widthText,heightText,"rel");			
			curPosEY[0]=curPosEY[0]+heightText;
			drawAttNested(svg,pathAttTree.get(name),curPosEX,curPosEY,widthText,heightText,tgdPosDB,attDepth,spaceHeight);
			lastYPos[0]=curPosEY[0];
			curPosEY[0]=curPosEY[0]+heightText+spaceHeight;
			visited[l]=1;
			drawTree(svg,matrix,l,indexTa,curPosEX,curPosEY,widthText,heightText,visited,pathAttTree,tgdPosDB,attDepth,lastYPos,spaceHeight);								
			curPosEX[0]=before;
		}
	}
}
function getArrayColumFromMatrix(matrix,col){
	let arr=[];
	for (let i=0;i<matrix.length;i++){		
		arr.push(matrix[i][col])
	}	
	return arr;
}
function islastzeros(pos,col,matrix){
	let lz=true;
	for (let i=pos;i<matrix.length;i++){
		if (matrix[i][col]==1){
			lz=false;
			break;
		}
	}
	return lz;
	
}
function getTextIndex(posT,indexTa){
	let te="";
	let keys = Array.from( indexTa.keys() );
	for (let k of keys ){
		if (indexTa.get(k)==posT){
			te=k;
			break;
		}	
	}
	return te;	
}
function orderByValue(map){
	return  new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
}

function loadGMLCode(){	
	var exchange=new Exchange();
	let textCode=exchange.GMLCan(mapSymbols,tgdLines,mapTableIdCanvas,tgdGreenCond);
	var CustomView = Backbone.View.extend({        
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";            
                        
            var textArea = document.createElement("textarea");
            textArea.setAttribute("style","width:100%;height:300px;");
            textArea.setAttribute("readOnly",true);
            textArea.value=textCode;               
            divContainer.appendChild(textArea);            
            this.$el.html(divContainer);        
            return this;
        }
    });
	var ExtendedModal = new BackboneBootstrapModals.ConfirmationModal({        
        headerViewOptions:{showClose:false, label: 'GML Code'},
        bodyView: CustomView,        
        footerViewOptions: {
		    buttons: [	
		    	{ className: 'btn btn-info', value: 'Confirm', attributes: { 'data-dismiss': 'modal', 'aria-hidden': 'true' }},
		    ]
		  }        
    });
	ExtendedModal.render();	
}
function loadRDFModal(data){
	var CustomView = Backbone.View.extend({        
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";            
                        
            var textArea = document.createElement("textarea");
            textArea.setAttribute("style","width:100%;height:300px;");
            textArea.setAttribute("readOnly",true);
            textArea.value=data;               
            divContainer.appendChild(textArea);            
            this.$el.html(divContainer);        
            return this;
        }
    });
	var ExtendedModal = new BackboneBootstrapModals.ConfirmationModal({		  
		  headerViewOptions: {
		    label: 'RDF Data',		    
		    showClose:false,
		  },
		  bodyView: CustomView,          		  
		  footerViewOptions: {
		    buttons: [
		    	{ className: 'btn btn-info', value: 'Confirm', attributes: { 'data-dismiss': 'modal', 'aria-hidden': 'true' }}
		    ]
		  }
		});		
	ExtendedModal.render();
}


function loadWarnMsg(dataMsg,queryDB){
	var CustomView = Backbone.View.extend({        
        render: function() {
            var divContainer=document.createElement('div');
            divContainer.className="container";
            var ul=document.createElement('ul');
            ul.setAttribute("class","list-group scrollUL");
            let inconsistent=false;
            let miss=false;
            for (var i=0; i<dataMsg.length; i++){

                var li=document.createElement('li');
                
                if (dataMsg[i].level==0){
                	miss=true;
                	li.setAttribute("class","list-group-item list-group-item-action list-group-item-warning");
                } else {
                	inconsistent=true;
                	li.setAttribute("class","list-group-item list-group-item-action list-group-item-danger");
                }
                li.innerHTML=li.innerHTML+dataMsg[i].text;
                ul.appendChild(li);

            }                   
            divContainer.appendChild(ul);
            var divAlert=document.createElement('div');            
            divAlert.setAttribute("class","alert alert-danger");
            divAlert.setAttribute("role","alert");
            if (inconsistent && miss){
            	divAlert.innerHTML='The chase SQL script will generate additional blank nodes, but it not will satisfy the schema';
            }else if (inconsistent){
            	divAlert.innerHTML='The set of triples will not satisfied the schema.';
            } else if (miss){
            	divAlert.innerHTML='The chase SQL script will generate additional blank nodes to satisfy approximatelly the Shape schema';
            }
            
            
            divContainer.appendChild(divAlert);
            this.$el.html(divContainer);        
            return this;
        }
    });
	var ExtendedModal = BackboneBootstrapModals.BaseModal.extend({		  
		  headerViewOptions: {
		    label: 'Warning Messages',		    
		    showClose:false,
		  },
		  bodyView: CustomView,          		  
		  footerViewOptions: {
		    buttons: [
		    	{ id:'continueWarn',className: 'btn btn-info', value: 'Continue'},
		    	{ className: 'btn btn-default', value: 'Cancel', attributes: { 'data-dismiss': 'modal', 'aria-hidden': 'true' }}
		    ]
		  },
		  events: {
	          'click #continueWarn': 'onContinue'
	        },
	        onContinue:function(e){
	        	$.ajax({	  
	                url: "chase",
	                type: "POST",
	                data:  {queries:queryDB,format:$( "select#formats" ).val()}
	              })
	              .done(function(data) {
	                console.log(data)        
	                loadRDFModal(data);
	                var store = $rdf.graph();
	                var uri = 'https://example.org/triples.ttl'
	            	var body = data
	            	var mimeType = 'text/turtle'
	            	var store = $rdf.graph()
/*
	            	try {
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
	            	}	
*/	
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
	          this.hide();
	        }
		});
	var modalMsg=new ExtendedModal(); 
	modalMsg.render();
}