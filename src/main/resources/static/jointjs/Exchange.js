//https://stackoverflow.com/questions/39059349/dynamic-predicate-in-r2rml
function Exchange(){}
//TODO IMPLEMENT DE VERIFICATION PROCESS THAT ALWAYS SHOULD BE TYPED the first element
Exchange.prototype.checkComplete=function(jsonTGD,graphST){
	let lsMsg=[];
	let nattrlines=0;
	for (let l of graphST.getLinks()){
		if (l.attr('line/stroke')==attributeLinkColor || l.attr('line/stroke')==attributeRefLinkColor){
			nattrlines++;
		}
	}
	if (nattrlines!=jsonTGD.rules){
		lsMsg.push("Error in rules");
	}	
	jsonTGD.rules.forEach(function(rule,i){		
		if (rule.yield.length!=2){
			lsMsg.push("Error in rule "+i+". There must be a Triple Atom and Type Atom in the rule.");
		}
	});
	return lsMsg;
}

Exchange.prototype.buildRMLMap=function(simpleQRML){
	let qRML="";
	qRML=qRML.concat('rr:logicalTable [ rr:sqlQuery """ ').concat(simpleQRML).concat('""" ];');								
	qRML=qRML.concat("rr:subjectMap [");	
	qRML=qRML.concat('rr:column "s"];');
	qRML=qRML.concat("rr:predicateObjectMap [");	
	qRML=qRML.concat('rr:predicateMap [rr:template  "vocab:{p}"];');
	qRML=qRML.concat("rr:objectMap [");
	qRML=qRML.concat('rr:column  "o"];');	
	qRML=qRML.concat("].\n");
	return qRML;
}

Exchange.prototype.getSourceOptionNameLinkView=function(linkView){
	for (var opt of linkView.sourceView.model.attributes.options){                        
        if (opt.id==V(linkView.sourceMagnet.parentNode).attr('port')){                            
            return opt.text;            
        }
    }
};

Exchange.prototype.getNameAttribute=function(attributes,id){
    for (var att of attributes){
        if (att.id==id)
            return att.text;
    }
};

Exchange.prototype.getKeyByValue=function(object, value){
	  return Object.keys(object).find(key => object[key] === value);
};

Exchange.prototype.getSubjectFunctionTerm=function(graph, model,s_fterm, portType,bind){
	    var aux_links=graph.getConnectedLinks(model, {outbound:true});
	    for (var s_link of aux_links){                                
	        if (model.getPort(s_link.attributes.source.port).group=='in' && s_link.attributes.target.port==portType){
	            var fterm=s_link.labels()[0].attrs.text.text.split('(');
	            s_fterm.push({function:fterm[0],args:[{rel:this.getKeyByValue(bind,model.attributes.question),attr:fterm[1].slice(0,-1)}]});
	            break;
	        }
	    }        
};

Exchange.prototype.convert_map_to_obj=( aMap => {
    const obj = {};
    aMap.forEach ((v,k) => { obj[k] = v });
    return obj;
});

Exchange.prototype.getTokens=function (value){
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
};

Exchange.prototype.GML=function(mapSymbols,rows,mapTables){
	let comparisonOp=["le","leq","gt","geq"];
	console.log(mapSymbols);	
	let mapLines=new Map();
	rows.forEach(function(row){				
		if (row.pid==0){
			//TODO CHOOSE THE PATH LONG AND ALSO THE WHERE CONDITIONS
			
			let entities= [];
			$('<div>', {html: row.ex }).find('span').each(function(){
				entities.push( $(this).text() );
			});
			let gml="\n=>\n";
			let annotations=[];
			$('<div>', {html: row.ex }).find('div.iri_tgd').each(function(){
				annotations.push( $(this).text() );
			});			
			let iri=annotations[0];
			let funI=iri.split('(');
			gml=gml.concat(funI[0]).concat('(').concat(entities[0]).concat('.').concat(funI[1]).concat(' as ').concat(entities[1]).concat('\n');
			//set the where it there is
			$('<div>', {html: row.ex }).find('div.tgd_cond').each(function(){
				annotations.push( $(this).text() );
			});
			let header=[entities[0]];
			if (annotations.length>1 && annotations[1].length>0){
				header.push(annotations[1]);
			}
			let objQ={query:header,des:gml};
			mapLines.set(row.id,objQ);
		}else{
			let detailTGD=mapLines.get(row.pid);
			
			let entities= $('div.li_body_tgd', row.ex).map(function(){
			    return $(this).text();
			}).get();
			
			let path=$('div.path_tgd', row.ex).map(function(){
			    return $(this).text();
			}).get();
			let taNames=this.getTokens(path[0]);
			
			console.log(taNames);
			
			if (taNames.length>1){
				for (let i=0;i<taNames.length-1;i++){
					if (!detailTGD.query[0].includes(taNames[i])){
						detailTGD.query[0]=detailTGD.query[0].concat(" JOIN ").concat(taNames[i]);
					}					
				}				
			}
			let iri=$('div.iri_tgd', row.ex).map(function(){
			    return $(this).text();
			}).get();
			if (iri.length>0){
				let fIri=iri[0].split("(");
				detailTGD.des=detailTGD.des.concat('\t:').concat(entities[1]).concat(' ').concat(fIri[0]).concat("(").concat(taNames[0]).concat(".").concat(fIri[1]).concat(';\n');
			}else{
				detailTGD.des=detailTGD.des.concat('\t:').concat(entities[1]).concat(' ').concat(taNames[0]).concat(".").concat(entities[0]).concat(';\n');
			}
		}
	});
	
	let mapToStr="";
	for (var value of mapLines.values()) {
		 if (value.query.length>1){
			 mapToStr=mapToStr.concat(value.query[0]).concat(' WHERE ').concat(value.query[1]);
		 }else{
			 mapToStr=mapToStr.concat(value.query[0]);
		 }
		 mapToStr=mapToStr.concat(value.des.substr(0,value.des.length-2)).concat(".\n");
	}
	
	return mapToStr;
};

Exchange.prototype.stTGD=function(mapSymbols,graph,paper,mapTables){
	let comparisonOp=["le","leq","gt","geq"];
    var bindNames={}
    graph.getElements().forEach(function(element){
        if (element.attributes.type=="db.Table"){
            bindNames[element.attributes.question]=element.attributes.question;
        }
    });    
    var sigma={functions:this.convert_map_to_obj(mapSymbols),rules:[]};    
    for (var link of graph.getLinks()){
    	
    	if (link!=='undefined'){    		
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
                    objterm.push({function:fterm[0],args:[{rel:this.getKeyByValue(rule.bind,linkView.sourceView.model.attributes.question),attr:fterm[1].slice(0,-1)}]});                                   
                } else if (annotation.includes('function')||annotation.includes('filter')){
					
					annotation=annotation.replace(/[\[\]]/g,"")					
					let paramAnnots=annotation.split(",")
					for (let  paramAnnot of paramAnnots){
                        if (paramAnnot.includes("function") && comparisonOp.includes(paramAnnot.split(":")[1].split(" ")[0]) ){                            
							rule.constraints.push({type:paramAnnot.split(":")[1].split(" ")[0],left:{rel:linkView.sourceView.model.attributes.question,attrs:[{attr:this.getSourceOptionNameLinkView(linkView)}]},right:{value:paramAnnot.split(":")[1].split(" ")[1]}})
						} else if (paramAnnot.includes("function")){                            
							rule.constraints.push({type:"apply",left:{rel:linkView.sourceView.model.attributes.question,attrs:[{attr:this.getSourceOptionNameLinkView(linkView)}]},right:{function:paramAnnot.split(":")[1]}})
						}
						if (paramAnnot.includes("filter")){							
							rule.constraints.push({type:"like",left:{rel:linkView.sourceView.model.attributes.question,attrs:[{attr:this.getSourceOptionNameLinkView(linkView)}]},right:{value:paramAnnot.split(":")[1]}})
						}
					}
					
					
				}else{
                    relNames=this.getTokens(annotation);                    
                    if (relNames.length==1){
                        //get subject term 
                        this.getSubjectFunctionTerm(graph,linkView.sourceView.model,s_fterm, linkView.targetView.model.attributes.ports.items[0].id,rule.bind);
                        
                    }else{
                        
                        for (var i=0;i<relNames.length;i++){
                            var name=relNames[i];
                            var mapFD=new Map();
                            var mapBFD=new Map();
                            for (var element of graph.getElements()){                            
                                if (mapTables.get(name)==element.id){
                                    var elementView=element.findView(paper);  
									
									if (i==relNames.length-1)
										this.getSubjectFunctionTerm(graph,elementView.model,s_fterm, linkView.targetView.model.attributes.ports.items[0].id,rule.bind);
									
                                    mapFD.set(name,[]);
                                    mapFD.set(relNames[i+1],[]);
                                    for (var opt of elementView.model.attributes.options){                                        
                                        if (!!opt.ref){											
                                            if (i<relNames.length && opt.ref.name==relNames[i+1]){
                                                var joinsA=mapFD.get(name);
                                                joinsA.push({name:opt.text});
                                                
                                                //obtain the attribute to which goes
                                                var nameAttRef="";
                                                for (var taElem of graph.getElements()){
                                                    if (mapTables.get(opt.ref.name)==taElem.id){
                                                        var taView=taElem.findView(paper);
                                                        nameAttRef=this.getNameAttribute(taView.model.attributes.options,opt.ref.id);
                                                        break;
                                                    }
                                                }                                                
                                                var joinsB=mapFD.get(opt.ref.name);
                                                joinsB.push({name:nameAttRef});         
                                            }else if (typeof(relNames[i-1])!=='undefined' && opt.ref.name==relNames[i-1]){
                                                if (mapBFD.has(name)){
                                                    var joinsA=mapBFD.get(name);
                                                    joinsA.push({name:opt.text});
                                                }else
                                                    mapBFD.set(name,[{name:opt.text}])
                                                //obtain the attribute to which goes
                                                var nameAttRef="";
                                                for (var taElem of graph.getElements()){
                                                    if (mapTables.get(opt.ref.name)==taElem.id){
                                                        var taView=taElem.findView(paper);
                                                        nameAttRef=this.getNameAttribute(taView.model.attributes.options,opt.ref.id);
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
							objterm.push({rel:this.getKeyByValue(rule.bind,relNames[0]),attr:opt.text})
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
    }    
    return sigma;
    
};

Exchange.prototype.getDeepSize=function(constraints,visited,map){
	var self = this; 	
	let onlyTypes=constraints.filter(tc=> tc.type!=='Literal');
	if (onlyTypes.length==0){
		return 1;
	}else{
		let times=1;
		let max=0;
		onlyTypes.forEach(function (curr,index,arr){
			if (!visited.includes(curr.type)){
				visited.push(curr.type)				
				times= times+self.getDeepSize(map.get(curr.type),visited,map);
			}
			if (times>max){
				max=times;
			}
		});
		
		return max;
	}
};

Exchange.prototype.generateQuery = function(mapSymbols,graphST,paperTGDs,mapTables) {		
	let chaseQ="";
	let msgs=[];
	let miShex=new Map();
	let schShex=new Map();
	let missing=false;
	graphST.getElements().forEach(function(element){		
		if (element.attributes.type=="shex.Type"){				
			miShex.set(element.attributes.question,[]);
			var elementView=element.findView(paperTGDs);
			var intargetLinks=graphST.getConnectedLinks(elementView.model, {inbound:true});
			if (intargetLinks.length==0){
				element.attributes.options.forEach(function(tc) {					  				
				  if (tc.mult=="1" || tc.mult=="+"){
					  let msg='<div class="alert alert-warning alert-dismissible fade show" role="alert"> <strong>'+element.attributes.question+'</strong> Triple constraint ('+tc.label+":"+tc.type +') needs to be linked.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'					  
					  msgs.push(msg)
					  var tcs=miShex.get(element.attributes.question);
					  tcs.push(tc)
					  missing=true;
				  }
				});
			}else{				
				element.attributes.ports.items.forEach(function(pt) {
					if (pt.group!="inType" && pt.group!="refType" && pt.group!="outRefType"){	
						if(!intargetLinks.some(function(itLink){
							return itLink.attributes.target.port==pt.id;
						})){
							var tc=pt.id.split(",");
							if (tc[2]=="1" || tc[2]=="+"){
								let msg='<div class="alert alert-warning alert-dismissible fade show" role="alert"> <strong>'+element.attributes.question+'</strong> Triple constraint ('+tc[0]+":"+tc[1]+') needs to be linked.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
								msgs.push(msg)
								var tcs=miShex.get(element.attributes.question);
								tcs.push({label:tc[0],type:tc[1],mult:tc[2]})
								missing=true;
							}
						}
					}					  
				});
			}
			var constraints=[];
			element.attributes.options.forEach(function(tc) {
				constraints.push(tc)
			})
			schShex.set(element.attributes.question,constraints)
			
		}        	
    });	
	let deePath=new Array(schShex.size);
	let i=0;
	var mapIter = schShex.entries();
	for (let iterator =mapIter, r; !(r = iterator.next()).done; ) {
	    let visit=[];
		deePath[i]=this.getDeepSize(r.value[1],visit,schShex);
		i++;
	}
	console.log(deePath);
	let max=Math.max.apply(Math, deePath);
	//construct sql query
	let tgds=this.stTGD(mapSymbols,graphST,paperTGDs,mapTables);
	
	
	
	let TyName="TypesFact";
	let TriName="Triples";
	let ShName="SHEX";
	let c1="CREATE TABLE "+ TriName +" (s varchar,p varchar, o varchar);\n";
	let c2="CREATE TABLE "+TyName +" (term varchar,type varchar);\n";
	let c3="DROP TABLE IF EXISTS "+ShName+";\n CREATE TABLE "+ShName+ "(typeS varchar,label varchar,typeO varchar, mult varchar);\n";	
	let chase="";
	
	let indexTM=1;
	let file2RML="@prefix rr: <http://www.w3.org/ns/r2rml#>.\n@prefix vocab: <vocab/>.\n";
	let typesRML="(";
	let triplesAllRML="(";
	try{
	tgds.rules.forEach(function(rule){
		let tmQ="";
		tmQ=tmQ.concat("<#TriplesMap").concat(indexTM).concat(">\n");		
		rule.yield.forEach(function(atom){
			var q="";				
			if (atom.args.length==1){					
				q=q.concat("CREATE OR REPLACE VIEW").concat(" ").concat(TyName).concat(indexTM).concat(" (term,type) AS ");			
				//consider that the length of args in case of type atom will allays be one 			
				q=q.concat("SELECT").concat(" ").concat("CONCAT('").concat(tgds.functions[atom.args[0].function]).concat("/',").concat(atom.args[0].args[0].attr).concat(")").concat(",").concat("'").concat(atom.atom).concat("'").concat(" ").concat("FROM").concat(" ").concat(atom.args[0].args[0].rel);
				typesRML=typesRML.concat("SELECT").concat(" ").concat("CONCAT('").concat(tgds.functions[atom.args[0].function]).concat("/',").concat(atom.args[0].args[0].attr).concat(") as term").concat(",").concat("'").concat(atom.atom).concat("'").concat(" as type ").concat("FROM").concat(" ").concat(atom.args[0].args[0].rel).concat(" UNION ");
				q=q.concat(";\n");			
			}else if (atom.args.length==3){//it is the triple atom				
				q=q.concat("CREATE OR REPLACE VIEW").concat(" ").concat(TriName).concat(indexTM).concat(" AS ");
				let qTri="SELECT DISTINCT  ";
				let lastRel="";
				let simpleQRML="";
				atom.args.forEach(function(term){
					if (Array.isArray(term)){							
						if (typeof(term[0].function)==='undefined'){
							lastRel=term[0].rel;//concat(lastRel).concat(".")
							qTri=qTri.concat("cast( ").concat(lastRel).concat(".").concat(term[0].attr).concat(" as varchar )");							
						}else{								
							lastRel=term[0].args[0].rel;
							//q=q.concat("CONCAT('").concat(tgds.functions[term[0].function]).concat("/',").concat("Convert(varchar,").concat(lastRel).concat(".").concat(term[0].args[0].attr).concat("))");
							qTri=qTri.concat("CONCAT('").concat(tgds.functions[term[0].function]).concat("/',").concat(lastRel).concat(".").concat(term[0].args[0].attr).concat(")");
						}														
					}else{
						qTri=qTri.concat(",'").concat(term).concat("' as p,");							
					}						
				});
				let sT=atom.args[0];					
				let oT=atom.args[2];				
				if (typeof(oT[0].function)==='undefined'){
					simpleQRML="SELECT "+ sT[0].args[0].attr+","+oT[0].rel+"."+oT[0].attr;
				}else{					
					simpleQRML="SELECT "+ sT[0].args[0].attr+", "+oT[0].args[0].rel+"."+oT[0].args[0].attr;
				}
				if (rule.constraints.length==0){
					
					qTri=qTri.concat(" FROM ").concat(lastRel);									
					triplesAllRML=triplesAllRML.concat(qTri).concat(" UNION ");
					qTri=qTri.concat(";\n");
					simpleQRML=simpleQRML.concat(" FROM ").concat(lastRel);
				}else{
					let lsTables=[];
					let whereQ="";
					if (rule.constraints.length==1 && rule.constraints[0].type=="apply"){
						qTri=qTri.replace(rule.constraints[0].left.attrs[0].attr,rule.constraints[0].right.function+"("+rule.constraints[0].left.attrs[0].attr+")");
						simpleQRML=simpleQRML.replace(rule.constraints[0].left.attrs[0].attr,rule.constraints[0].right.function+"("+rule.constraints[0].left.attrs[0].attr+")");
					}else{
					
						whereQ=whereQ.concat(" WHERE ");
						rule.constraints.forEach(function(joinQ){
							if (joinQ.type=="apply"){
								qTri=qTri.replace(joinQ.left.attrs[0].attr,joinQ.right.function+"("+joinQ.left.attrs[0].attr+")");
								simpleQRML=simpleQRML.replace(joinQ.left.attrs[0].attr,joinQ.right.function+"("+joinQ.left.attrs[0].attr+")");
							}
							if (joinQ.type=="like"){
								whereQ=whereQ.concat(joinQ.left.rel).concat(".").concat(joinQ.left.attrs[0].attr).concat(" LIKE '%").concat(joinQ.right.value).concat("%' AND ");
							}
							if (joinQ.type=='le'){
								whereQ=whereQ.concat(joinQ.left.rel).concat(".").concat(joinQ.left.attrs[0].attr).concat(" < ").concat(joinQ.right.value).concat(" AND ");
							}
							
							if (joinQ.type=='leq'){
								whereQ=whereQ.concat(joinQ.left.rel).concat(".").concat(joinQ.left.attrs[0].attr).concat(" <= ").concat(joinQ.right.value).concat(" AND ");
							}
							
							if (joinQ.type=='gt'){
								whereQ=whereQ.concat(joinQ.left.rel).concat(".").concat(joinQ.left.attrs[0].attr).concat(" > ").concat(joinQ.right.value).concat(" AND ");
							}
							
							if (joinQ.type=='geq'){
								whereQ=whereQ.concat(joinQ.left.rel).concat(".").concat(joinQ.left.attrs[0].attr).concat(" >= ").concat(joinQ.right.value).concat(" AND ");
							}
							if (joinQ.type=='eq' && typeof(joinQ.right.rel)!=='undefined'){							
								if (!lsTables.includes(joinQ.left.rel))
									lsTables.push(joinQ.left.rel)
								if (!lsTables.includes(joinQ.right.rel))
									lsTables.push(joinQ.right.rel)
								let indexAtt=0;
								joinQ.left.attrs.forEach(function(attribute){
									whereQ=whereQ.concat(joinQ.left.rel).concat(".").concat(attribute.name).concat("=").concat(joinQ.right.rel).concat(".").concat(joinQ.right.attrs[indexAtt].name).concat(" AND ");
									indexAtt++;
								})
							}	
						});
						whereQ=whereQ.slice(0,-5);
					
					}
					qTri=qTri.concat(" FROM ");
					simpleQRML=simpleQRML.concat(" FROM ");
					if (lsTables.length==0){
						qTri=qTri.concat(lastRel).concat(" ");
						simpleQRML=simpleQRML.concat(lastRel).concat(" ");
					}else{					
						lsTables.forEach(function(tableN,idx,array){
							if (idx==array.length-1){
								qTri=qTri.concat(rule.bind[tableN]).concat(" AS ").concat(tableN)
								simpleQRML=simpleQRML.concat(rule.bind[tableN]).concat(" AS ").concat(tableN)
							}else{
								qTri=qTri.concat(rule.bind[tableN]).concat(" AS ").concat(tableN).concat(",")
								simpleQRML=simpleQRML.concat(rule.bind[tableN]).concat(" AS ").concat(tableN).concat(",")
							}
						})
					}
					triplesAllRML=triplesAllRML.concat(qTri).concat(whereQ).concat(" UNION ");
					qTri=qTri.concat(whereQ).concat(";\n");									
					simpleQRML=simpleQRML.concat(whereQ);
				}
				q=q.concat(qTri);
				//add to RML query
				tmQ=tmQ.concat('rr:logicalTable [ rr:sqlQuery """ ').concat(simpleQRML).concat('""" ];');								
				tmQ=tmQ.concat("rr:subjectMap [");
				let termS=atom.args[0];
				let subTerm=termS[0];				
				let fpTerm=subTerm.args[0]
				tmQ=tmQ.concat('rr:template "').concat(tgds.functions[subTerm.function]).concat('/{').concat(fpTerm.attr).concat('}"];');
				tmQ=tmQ.concat("rr:predicateObjectMap [");
				let termP=atom.args[1];
				tmQ=tmQ.concat("rr:predicate vocab:").concat(termP).concat(";");
				tmQ=tmQ.concat("rr:objectMap [");
				let termO=atom.args[2];
				let objTerm=termO[0];				
				if (typeof(objTerm.function)!=='undefined'){
					tmQ=tmQ.concat('rr:template "').concat(tgds.functions[objTerm.function]).concat('/{').concat(objTerm.args[0].attr).concat('}"];');
				}else{
					tmQ=tmQ.concat('rr:column  "').concat(objTerm.attr).concat('"];');
				}
				tmQ=tmQ.concat("].\n");
				file2RML=file2RML.concat(tmQ);
			}						
			chase=chase.concat(q);
			chaseQ=chaseQ.concat(q);
		})
		indexTM++;
		
	});
	}
	catch(err){
		alert("Error in mappings "+err.message)
	}
	
	
	
	let headerTri="INSERT INTO "+TriName+" ";
	let headerTy="INSERT INTO "+TyName+" ";
	let triSql=""
	let tySql=""
	for (let i=1;i< indexTM;i++){		
		tySql=tySql.concat("SELECT * FROM ").concat(TyName).concat(i).concat(" UNION ");
		triSql=triSql.concat("SELECT * FROM ").concat(TriName).concat(i).concat(" UNION ");
	}
	tySql=tySql.slice(0,-7).concat(";\n");
	triSql=triSql.slice(0,-7).concat(";\n");
	
	let allTri="CREATE OR REPLACE VIEW Triples (s,p,o) AS ";
	allTri=allTri.concat(triSql);
	let allTy="CREATE OR REPLACE VIEW Types (term,type) AS "
	allTy=allTy.concat(tySql)
	
	let schQ="";
	let shexView="(";
	schShex.forEach(function(tcs, type, miMapa){
		tcs.forEach(function(tc){
			schQ=schQ.concat("INSERT INTO ").concat(ShName).concat(" (typeS,label,typeO,mult) VALUES ('").concat(type).concat("','").concat(tc.label).concat("','").concat(tc.type).concat("','").concat(tc.mult).concat("');\n");
			shexView=shexView.concat("SELECT '").concat(type).concat("' AS typeS,'").concat(tc.label).concat("' AS label,'").concat(tc.type).concat("' AS typeO,'").concat(tc.mult).concat("' AS mult").concat(" UNION ");
		})
	});
	typesRML=typesRML.slice(0,-7).concat(") AS Ts");
	console.log(triplesAllRML);
	triplesAllRML=triplesAllRML.slice(0,-7).concat(") AS T");
	shexView=shexView.slice(0,-7).concat(") AS Sh");
	chase=chase.concat(c3).concat(schQ);
	chaseQ=chaseQ.concat(c3).concat(schQ);
	
	let F="SELECT Ts.term,Sh.label,CASE WHEN Sh.typeO ='Literal' THEN '@PERU@' ELSE CONCAT('http://example.com/',Sh.typeO,'/','@PERU@')  END AS typeO FROM Shex AS Sh,Types AS Ts WHERE Ts.type=Sh.typeS AND Sh.mult IN ('1','+') AND CONCAT(Ts.term,Sh.typeS,Sh.label) NOT IN (SELECT CONCAT(T.s,Ty.type,T.p) FROM Triples as T, Types AS Ty WHERE T.s=Ty.term);\n";
	let tripleSimulation="CREATE OR REPLACE VIEW TripleSim (s,p,o) AS SELECT * FROM Triples UNION ".concat(F);
	
	let tripleSimRML="SELECT Ts.term as s,Sh.label as p,CASE WHEN Sh.typeO ='Literal' THEN '@PERU@' ELSE CONCAT('http://example.com/',Sh.typeO,'/','@PERU@')  END AS o FROM "+shexView +","+typesRML+" WHERE Ts.type=Sh.typeS AND Sh.mult IN ('1','+') AND CONCAT(Ts.term,Sh.typeS,Sh.label) NOT IN (SELECT CONCAT(T.s,Ts.type,T.p) FROM "+triplesAllRML+", "+typesRML+" WHERE T.s=Ts.term) ORDER BY Sh.label";
	let qRML="<#TM>\n";
	qRML=qRML.concat(this.buildRMLMap(tripleSimRML));	
	file2RML=file2RML.concat(qRML);
	
	chaseQ=chaseQ.concat(allTri);
	chase=chase.concat(allTri);
	chaseQ=chaseQ.concat(allTy);
	chase=chase.concat(allTy);
	chaseQ=chaseQ.concat(tripleSimulation);
	chase=chase.concat(tripleSimulation);		
	
	//repeat the creation of triplesim many times as the long path is find in the schema
	let idx=1;
	while (max>0){
		let numPrefix="";
		if (idx-1>0){
			numPrefix=idx-1;
		}
		let objectTypes="SELECT DISTINCT Tri.o AS term,typeO AS type FROM TripleSim"+numPrefix+" AS Tri,Types"+numPrefix+" AS Ty,SHEX AS Sh WHERE Tri.s=Ty.term AND Ty.type=Sh.typeS AND Sh.mult IN ('1','+') AND Sh.label=Tri.p ;\n";
		let typesM="CREATE OR REPLACE VIEW Types"+idx+" (term,type) AS ".concat(objectTypes);
		chaseQ=chaseQ.concat(typesM);
		chase=chase.concat(typesM);
		let MTriples="SELECT Ts.term,Sh.label,CASE WHEN Sh.typeO ='Literal' THEN '@PERU@' ELSE CONCAT('http://example.com/',Sh.typeO,'/','@PERU@')  END AS typeO FROM Shex AS Sh,Types"+idx+" AS Ts WHERE Ts.type=Sh.typeS AND Sh.mult IN ('1','+') AND CONCAT(Ts.term,Sh.typeS,Sh.label) NOT IN (SELECT CONCAT(T.s,Ty.type,T.p) FROM TripleSim"+numPrefix+" as T, Types"+numPrefix+" AS Ty WHERE T.s=Ty.term);\n";
		let tripleSimIt="CREATE OR REPLACE VIEW TripleSim".concat(idx).concat(" (s,p,o) AS ").concat(MTriples);
		chaseQ=chaseQ.concat(tripleSimIt);
		chase=chase.concat(tripleSimIt);
		max--;
		idx++;
	}
	let solution="CREATE OR REPLACE VIEW Solution AS ";
	let allTyped="CREATE OR REPLACE VIEW AllTyped AS ";
	while(idx>0){
		solution=solution.concat("SELECT * FROM TripleSim").concat(idx-1==0?"":idx-1).concat(" UNION ");
		allTyped=allTyped.concat("SELECT * FROM Types").concat(idx-1==0?"":idx-1).concat(" UNION ");
		idx--;
	}
	solution=solution.slice(0,-7).concat(";\n");
	allTyped=allTyped.slice(0,-7).concat(";\n");
	chaseQ=chaseQ.concat(solution);
	chase=chase.concat(solution);
	chaseQ=chaseQ.concat(allTyped);
	chase=chase.concat(allTyped);
	
	if (missing){
		let msgDanger='<div class="alert alert-danger alert-dismissible fade show" role="alert"> The chase SQL script generates additional rows to satisfy approximatelly ShEx schema<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
		msgs.push(msgDanger);
		
	}
			
	//return a set of triples
	let comment="/*";
	comment=comment.concat("To materialize the set of triples, execute the following sentence\n")
	comment=comment.concat(c1);
	comment=comment.concat(c2);
	comment=comment.concat(headerTri).concat(triSql)
	comment=comment.concat(headerTy).concat(tySql)		
	comment=comment.concat("*/");
	chase=chase.concat(comment);
	
	this.chaseQueryDB=chaseQ;
	this.chaseScript=chase;
	this.RMLScript=file2RML;
};