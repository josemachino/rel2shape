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
    var template = _.template( $("#sideright_template").html(), {} );
    this.$el.html( template );
},
events: {
     "click #exportst":"export",  
     "click #undost":"undost",
     "click #savest":"savest",
     "click #conf":"configure",
     "change input[type=file]":"import",
     "click .edit_tgd":"modifyTGD",
     "click .edit_green_tgd":"modifyLinkGreen",
     "click .edit_red_tgd":"modifyLinkRed",
     "click .rem_param_blue_tgd":"removeParam",
     "click #rightCollapsed":"activate",
     "click .edit_param_green":"editParamLinkGreen",
     "click .rem_param_green_tgd":"removeParamGreen"
},
configure:function(e){
	loadConfModal();
},
removeParamGreen:function(e){
	//TODO
	let auxLink;
    for (var link of graphTGDs.getLinks()){        
        if (link.id==e.currentTarget.id){
            auxLink=link;
            break;
        }
    }
    if (auxLink.labels().length>1){
        auxLink.removeLabel(-1)
        //update link 
        updateParamGreenLink(auxLink.id);
    }
},
editParamLinkGreen:function(e){
	//TODO
	let auxLink;
    for (var link of graphTGDs.getLinks()){        
        if (link.id==e.currentTarget.id){
            auxLink=link;
            break;
        }
    }
    let linkView=auxLink.findView(paperTGDs);
    loadWhereParam(auxLink,linkView.sourceView.model.attributes.options);
    
},
activate:function(e){    
    $('#sidebar-right').toggleClass('active');
}
,
undost:function(e){
	console.log("undo");
	//remove all elements from table
	tgdsCy.elements().remove();
	//and import
	if (sessionGO.length>0){
		let lastSaved=sessionGO.pop();
		
		graphTGDs.fromJSON(lastSaved);   
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
				mapSymbols.set("f"+num,namespace+element.attributes.question);
				num++;
			}
		})
		var links=graphTGDs.getLinks();			
		for (var link of links){
			var edgeView=link.findView(paperTGDs);
			if (edgeView.sourceView.model.attributes.type=="db.Table" && edgeView.targetView.model.attributes.type=="shex.Type"){				
				if (link.attr('line/stroke')==subjectLinkColor){
					let valueIRI=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;
					let taName=edgeView.sourceView.model.attributes.question;
					console.log("green link "+valueIRI);
					console.log(tgdLines);
					drawNewGreenLinkInTable(link,taName,valueIRI,edgeView.targetView.model.attributes.question);
				}
				if (link.attr('line/stroke')==attributeLinkColor){					
					drawNewBlueLinkInTable(link)
				}
				if (link.attr('line/stroke')==attributeRefLinkColor){					
					let sHead=edgeView.sourceView.model.attributes.question;
					let sAtt=getSourceOptionNameLinkView(edgeView);
					let path=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;;
					let fObject=(((link.labels()[1]|| {}).attrs||{}).text||{}).text;
					let tHead=edgeView.targetView.model.attributes.question;
					drawNewRedLinkInTable(link,sHead,sAtt,path,fObject,tHead)
				}				
			}
		}
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
    	tgdsCy.elements().remove();
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
    			mapSymbols.set("f"+num,namespace+element.attributes.question);
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
					drawNewGreenLinkInTable(link,taName,valueIRI,edgeView.targetView.model.attributes.question);
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
				if (tLinkport.length==3 && tLinkport[1]!='Literal')	{				
					let sHead=edgeView.sourceView.model.attributes.question;
					let sAtt=getSourceOptionNameLinkView(edgeView);
					let path=(((link.labels()[0]|| {}).attrs||{}).text||{}).text;;
					let fObject=(((link.labels()[1]|| {}).attrs||{}).text||{}).text;
					let tHead=edgeView.targetView.model.attributes.question;
					drawNewRedLinkInTable(link,sHead,sAtt,path,fObject,tHead)
				}
				console.log(tgdLines);
			}
		}		
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
    link.download = 'gstgds.json';
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr);
    //link.href=window.URL.createObjectURL('data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr))
    link.click();
},
modifyTGD: function(e){    
    
    let auxLink;
    for (var link of graphTGDs.getLinks()){        
        if (link.id==e.currentTarget.id){
            auxLink=link;
            break;
        }
    }
    let linkView=auxLink.findView(paperTGDs)    
    var tablesConnected=[{id:linkView.sourceView.model.id,text:linkView.sourceView.model.attributes.question}];                        
    var intargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});
    var portType=linkView.targetView.model.attributes.ports.items[0];
    var tLinks=getLinkTarget(intargetLinks,portType);                                        
    
    for (var tlink of tLinks){							
        var tView=tlink.findView(paperTGDs);  							
        var visited=[];
        getJoinsTableFromTo(linkView.sourceView.model,tablesConnected,tView.sourceView.model.id,visited,tablesConnected[0]);	
    }    
    if (tablesConnected.length>1){
        loadModalPathAttributeDetail(auxLink,tablesConnected);
    }else{            
        loadModalFunctions(auxLink);
    }
    
},
modifyLinkGreen:function(e){
    var auxKeySymbols=[];
    for (const key of mapSymbols.keys()) {
        var obj={text:key};                        
        auxKeySymbols.push(obj);
    }
    let auxLink;
    for (var link of graphTGDs.getLinks()){        
        if (link.id==e.currentTarget.id){
            auxLink=link;
            break;
        }
    }
    let linkView=auxLink.findView(paperTGDs)
    var pks=getKeys(linkView.sourceView.model.attributes.options);
    if (pks.length>1 || mapSymbols.size>1){        
        loadModalGreenFromTable(auxLink,auxKeySymbols,linkView.sourceView.model.attributes.options,mapSymbols);
    }
},
modifyLinkRed:function(e){
	var auxKeySymbols=[];
    for (const key of mapSymbols.keys()) {
        var obj={text:key};                        
        auxKeySymbols.push(obj);
    }
    let auxLink;
    for (var link of graphTGDs.getLinks()){        
        if (link.id==e.currentTarget.id){
            auxLink=link;
            break;
        }
    }
    let linkView=auxLink.findView(paperTGDs);
	var tablesConnected=[{id:linkView.sourceView.model.id,text:linkView.sourceView.model.attributes.question}];   	
    var intargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});
    var portType=linkView.targetView.model.attributes.ports.items[0];
    var tLinks=getLinkTarget(intargetLinks,portType);                                        
    let sourceAtt=getSourceOptionNameLinkView(linkView)
    for (var tlink of tLinks){							
        var tView=tlink.findView(paperTGDs);  							
        var visited=[];
        getJoinsTableFromTo(linkView.sourceView.model,tablesConnected,tView.sourceView.model.id,visited,tablesConnected[0]);	
    }
    
    if (tablesConnected.length>1 || auxKeySymbols.length>1){
    	loadModalRedFromTable(auxLink,auxKeySymbols,tablesConnected,mapSymbols,sourceAtt,intargetLinks);
	}
    //if there is more than two functions symbols load to select which one
    //if there are many paths to show
},
removeParam:function(e){
    let auxLink;
    for (var link of graphTGDs.getLinks()){        
        if (link.id==e.currentTarget.id){
            auxLink=link;
            break;
        }
    }
    if (auxLink.labels().length>1){
        auxLink.removeLabel(-1)
        $('#param_'+auxLink.id).html("")
    }
}
});

var side_view = new sideView({ el: $("#sidebar-right") });
console.log(rRectColor);
console.log(tRectColor);
var tgdsCy=cytoscape({container: document.getElementById('tableTGD'),
	style: [
	    {
	      selector: 'node',
	      css: {
	        'label': 'data(label)',
	        'shape': 'data(type)',
	        'text-valign': 'center',
	        'text-halign': 'center',
	        'height': 40	        
	      }
	    },
	    {
		      selector: 'node.rentity',
		      css: {
		        'background-color':rRectColor,
		        'background-opacity': '0'
		      }
		    },				    
		    {
			      selector: 'node.tentity',
			      css: {
			    	  'background-color':tRectColor,
				      'background-opacity': '0'
			      }
			    },
	    {
	       selector: ':parent',
	       css: {
	          'text-valign': 'top',
	          'text-halign': 'center',
	       }
	    },
	    {
	       selector: 'edge[label]',
	       css: {
	          'label': 'data(label)',			          
	          'width': 3,
	          'curve-style': 'bezier',
	          'target-arrow-shape': 'triangle',
	          'text-valign': 'top',
	          'text-halign': 'center',
	          'text-background-color':'gray'
	          //'text-margin-y': -10
	       }
	    },
	    
	    {
    	  selector: 'edge.entity',
    	  css: {
    		'source-label': 'data(labelS)',
    		'target-label': 'data(labelT)',
    	    'curve-style': 'taxi',
    	    'taxi-direction': 'upward',
    	    'taxi-turn': 20,
    	    'taxi-turn-min-distance': 5,
    	    'source-endpoint': 'outside-to-node',
    	    'target-endpoint': 'outside-to-node',
    	    'line-color':subjectLinkColor
    	  }
	    },
    	{
    	  selector: 'edge.att',
    	  css: {				    	   		    		  
    	    'line-color':attributeLinkColor
    	  }
	    },
	    {
	      selector: 'edge.attRef',
	      css: {				    	   
	        'line-color':attributeRefLinkColor
	      }
		}
	    ],
  layout: { name: 'grid', columns: 2}});

tgdsCy.contextMenus({
menuItems: [
      {
        id: 'remove',
        content: 'remove',
        tooltipText: 'remove',
        image: {src : "cytoscape/remove.svg", width : 12, height : 12, x : 6, y : 4},
        selector: 'edge',
        onClickFunction: function (event) {
          var target = event.target || event.cyTarget;
          
          let currentLink=graphTGDs.getCell(target.id());
	    	  currentLink.remove();
	    	  /*if (target.id()==greenLink.id){
	    		  
  	    	        	    	  
	    	  }else{
	    		  target.remove();
	    	  }*/
        },
        hasTrailingDivider: true
      },
      {
          id: 'remove-condition',
          content: 'remove Condition',
          tooltipText: 'remove Condition',
          image: {src : "cytoscape/remove.svg", width : 12, height : 12, x : 6, y : 4},
          selector: 'edge.entity',
          onClickFunction: function (event) {
            var target = event.target || event.cyTarget;
            
            let auxLink;
            for (var link of graphTGDs.getLinks()){        
                if (link.id==target.id()){
                    auxLink=link;
                    break;
                }
            }
            if (auxLink.labels().length>1){
                auxLink.removeLabel(-1)
                //update link 
                tgdsCy.$('#'+auxLink.id).data('labelS','');                        
            }
          }
        },
        {
            id: 'remove-Param',
            content: 'remove Parameter',
            tooltipText: 'remove Parameter',
            image: {src : "cytoscape/remove.svg", width : 12, height : 12, x : 6, y : 4},
            selector: 'edge.att',
            onClickFunction: function (event) {
              var target = event.target || event.cyTarget;
              
              let auxLink;
              for (var link of graphTGDs.getLinks()){        
                  if (link.id==target.id()){
                      auxLink=link;
                      break;
                  }
              }
              if (auxLink.labels().length>1){
                  auxLink.removeLabel(-1)
                  //update link 
                  tgdsCy.$('#'+auxLink.id).data('label','');                        
              }
            }
          },
      {
          id: 'add-Where',
          content: 'add Conditions',
          selector: 'edge.entity',
          tooltipText: 'add Conditions to the Entity Mapping',
          image: {src : "cytoscape/add.svg", width : 12, height : 12, x : 6, y : 4},
          coreAsWell: true,
          onClickFunction: function (event) {                	  
        	  var target = event.target || event.cyTarget;
        	  try{
        	  let auxLink;
        	  for (var link of graphTGDs.getLinks()){        
        	        if (link.id==target.id()){
        	            auxLink=link;
        	            break;
        	        }
        	    }
        	  let linkView=auxLink.findView(paperTGDs);
        	  loadWhereParam(auxLink,linkView.sourceView.model.attributes.options,tgdsCy);
        	  }catch(err){
        		  console.log("id not selected");
        	  }
          }
        },
        {
            id: 'attach-file',
            content: 'Attach file Constructor',
            selector: 'edge.entity',
            tooltipText: 'Attach file Constructor',
            image: {src : "cytoscape/add.svg", width : 12, height : 12, x : 6, y : 4},
            onClickFunction: function (event) {                	  
          	  var target = event.target || event.cyTarget;                  	  
          	  let auxLink;
          	  for (var link of graphTGDs.getLinks()){        
      	        if (link.id==target.id()){
      	            auxLink=link;
      	            break;
      	        }
          	  }
          	  let linkView=auxLink.findView(paperTGDs);
          	  loadAttachFile(auxLink,tgdsCy);                	  
            }
          },
          {
              id: 'unattach-file',
              content: 'Unattach file Constructor',
              selector: 'edge.entity',
              tooltipText: 'Unattach file Constructor',
              image: {src : "cytoscape/remove.svg", width : 12, height : 12, x : 6, y : 4},
              onClickFunction: function (event) {                	              	   
            	  tgdCy.$id(target.id()).data('labelT','');
              }
            },
        {
            id: 'add-Param',
            content: 'add Parameters',
            selector: 'edge.att',
            tooltipText: 'add Parameters to the attribute',
            image: {src : "cytoscape/add.svg", width : 12, height : 12, x : 6, y : 4},
            coreAsWell: true,
            onClickFunction: function (event) {                  	  
          	  var target = event.target || event.cyTarget;                  	
              	let auxLink;
                for (var link of graphTGDs.getLinks()){        
                    if (link.id==target.id()){
                        auxLink=link;
                        break;
                    }
                }
                loadModalFunctions(auxLink,tgdsCy);
            }
          },
        {
            id: 'modify-IRI',
            content: 'modify IRI',
            selector: 'edge.entity',
            tooltipText: 'add Conditions to the Entity Mapping',
            image: {src : "cytoscape/add.svg", width : 12, height : 12, x : 6, y : 4},
            coreAsWell: true,
            onClickFunction: function (event) {  
            	var target = event.target || event.cyTarget;
            	var auxKeySymbols=[];
                for (const key of mapSymbols.keys()) {
                    var obj={text:key};                        
                    auxKeySymbols.push(obj);
                }
                let auxLink;
                for (var link of graphTGDs.getLinks()){        
                    if (link.id==target.id()){
                        auxLink=link;
                        break;
                    }
                }
                let linkView=auxLink.findView(paperTGDs)
                var pks=getKeys(linkView.sourceView.model.attributes.options);
                if (pks.length>1 || mapSymbols.size>1){        
                    loadModalGreenFromTable(auxLink,auxKeySymbols,linkView.sourceView.model.attributes.options,mapSymbols,tgdsCy);
                }
            }
          },
          {
              id: 'modify-IRI-Ref',
              content: 'modify IRI',
              selector: 'edge.attRef',
              tooltipText: 'Modify IRI',
              image: {src : "cytoscape/add.svg", width : 12, height : 12, x : 6, y : 4},                      
              onClickFunction: function (event) {  
              	var target = event.target || event.cyTarget;
              	var auxKeySymbols=[];
                for (const key of mapSymbols.keys()) {
                    var obj={text:key};                        
                    auxKeySymbols.push(obj);
                }
                let auxLink;
                for (var link of graphTGDs.getLinks()){        
                    if (link.id==e.currentTarget.id){
                        auxLink=link;
                        break;
                    }
                }
                let linkView=auxLink.findView(paperTGDs);
            	var tablesConnected=[{id:linkView.sourceView.model.id,text:linkView.sourceView.model.attributes.question}];   	
                var intargetLinks=graphTGDs.getConnectedLinks(linkView.targetView.model, {inbound:true});
                var portType=linkView.targetView.model.attributes.ports.items[0];
                var tLinks=getLinkTarget(intargetLinks,portType);                                        
                let sourceAtt=getSourceOptionNameLinkView(linkView)
                for (var tlink of tLinks){							
                    var tView=tlink.findView(paperTGDs);  							
                    var visited=[];
                    getJoinsTableFromTo(linkView.sourceView.model,tablesConnected,tView.sourceView.model.id,visited,tablesConnected[0]);	
                }
                
                if (tablesConnected.length>1 || auxKeySymbols.length>1){
                	loadModalRedFromTable(auxLink,auxKeySymbols,tablesConnected,mapSymbols,sourceAtt,intargetLinks,tgdsCy);
            	}
              }
            }
      ]});
tgdsCy.panzoom({});
var makeTippy = function(node, text){
	return tippy( node.popperRef(), {
		content: function(){
			var div = document.createElement('div');

			div.innerHTML = text;

			return div;
		},
		trigger: 'manual',
		arrow: true,
		placement: 'top',
		hideOnClick: false,
		multiple: true,
		sticky: true
	} );
};