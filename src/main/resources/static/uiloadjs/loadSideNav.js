var sideLeftView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#sideright_template").html(), {} );
    this.$el.html( template );
},
events: {
    "click #rightCollapsed":"activate",
    "click .edit_blue_tgd":"modifyTGD",
    "click .edit_green_tgd":"modifyLinkGreen",
    "click .rem_green_tgd":"removeGreenTGD",
    "click .edit_red_tgd":"modifyLinkRed",
    "click .rem_red_tgd":"removeLinkRed",
    "click .adc_green_tgd":"addCondition",
    "click .rem_param_blue_tgd":"removeParam",
    "click .dec_green_tgd":"removeParamGreen",
    "click .rem_blue_tgd":"removeBlueTGD",
},
activate:function(e){	
	
	let expand=$('#rightCollapsed').data('activate');
	if (expand){
		$('#rightCollapsed').html('<i class="fas fa-angle-double-right fa-2x"></i>');
		$('#rightCollapsed').attr('data-activate',false)
	}else{
		$('#rightCollapsed').html('<i class="fas fa-angle-double-left fa-2x"></i>');
		$('#rightCollapsed').attr('data-activate',true)
	}
	$('#sidebar-right').toggleClass('active');
},
removeBlueTGD:function(e){
	let currentLink=graphTGDs.getCell(e.currentTarget.id);
	currentLink.remove();
	drawSVGGraph();
},
removeLinkRed:function(e){
	let currentLink=graphTGDs.getCell(e.currentTarget.id);
	currentLink.remove();
	drawSVGGraph();
},
removeGreenTGD:function(e){
	let currentLink=graphTGDs.getCell(e.currentTarget.id);
	currentLink.remove();
	drawSVGGraph();
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
addCondition:function(e){
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
    loadIRIAttWhereParam(auxLink,auxKeySymbols,linkView.sourceView.model.attributes.options,mapSymbols);
    //if (pks.length>1 || mapSymbols.size>1){        
    //    loadModalGreenFromTable(auxLink,auxKeySymbols,linkView.sourceView.model.attributes.options,mapSymbols);
    //}
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

var side_left_view = new sideLeftView({ el: $("#sidebar-right") });
