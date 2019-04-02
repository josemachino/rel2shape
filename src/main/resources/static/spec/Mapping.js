//https://www.npmjs.com/package/jasmine-collection-matchers
//https://stackoverflow.com/questions/32103252/expect-arrays-to-be-equal-ignoring-order/36801418
describe("Mappings", function() {
  var graphST;  
  var exchange;
  var paperTGDs;
  beforeEach(function() {
	graphST=new joint.dia.Graph;
	exchange=new Exchange();
	paperTGDs = new joint.dia.Paper({
		el: document.getElementById('mydb'),
		model:graphST,		
	    width: 10,
	    height: 10,    
	    gridSize: 10,
	    drawGrid: true,
	    snapLinks: { radius: 75 },
	    background: {
	        color: 'rgba(0, 255, 0, 0.3)'
	    },
	    snapLinks: {radius:75},
	    interactive: { labelMove: true },
	    linkPinning: false,
	    embeddingMode: true,	    
	    defaultConnectionPoint: { name: 'boundary' },
	    defaultLink:new joint.shapes.standard.Link()
	});
  });

  
  it("Mapping with filters in the attribute and long paths. Also the result does not satisfy the schema", function() {
	  var triples=[];
	  $.ajax({	  
	        url: "tgd/faculty_filtermap",
	        type: "GET",
	        async: false
	      })
	      .done(function(data) {	    	  
	    	 graphST.fromJSON(data);	
	    	 let mapSymbols=new Map();
	     	 let mapTableIdCanvas=new Map();
	     	 let num=1;
	     	 let namespace="http://example.com/"
	     	 graphST.getElements().forEach(function(element){
	    		if (element.attributes.type=="db.Table"){
	    			mapTableIdCanvas.set(element.attributes.question,element.id)
	    		}
	    		if (element.attributes.type=="shex.Type"){
	    			mapSymbols.set("f"+num,namespace+element.attributes.question);
	    			num++;
	    		}
	     	 });	     	 
	    	 exchange.generateQuery(mapSymbols,graphST,paperTGDs,mapTableIdCanvas);	    	 	    	 
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	      })
	      .always(function() {
	        
	      });		  
	  $.ajax({	  
	        url: "test",
	        type: "POST",
	        data:{nameTest:"faculty_filtermap",queries:exchange.chaseQueryDB},
	        async: false
	      })
	      .done(function(data) {
	        console.log(data);
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
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        	        
	        console.log(errorThrown)
	      })
	      .always(function() {
	        
	      });	
	var triplesExpected=[
		{ subject: 'http://example.com/StudentShape/102', predicate: 'worksWith', object: 'RAUL' },
		{ subject: 'http://example.com/StudentShape/102', predicate: 'worksWith', object: 'JOSE' },
		{ subject: 'http://example.com/StudentShape/102', predicate: 'scores', object: '18' },
		{ subject: 'http://example.com/StudentShape/102', predicate: 'name', object: 'Ines' },
		{ subject: 'http://example.com/StudentShape/102', predicate: 'goesTo', object: 'BIO-Agriculture' },
		{ subject: 'http://example.com/StudentShape/102', predicate: 'goesTo', object: 'BIO-Molecular' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'worksWith', object: 'RAUL' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'scores', object: '@PERU@' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'name', object: 'Pame' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'goesTo', object: 'BIO-Agriculture' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'goesTo', object: 'BIO-Molecular' },
		{ subject: 'http://example.com/StudentShape/103', predicate: 'worksWith', object: 'RAUL' },
		{ subject: 'http://example.com/StudentShape/103', predicate: 'scores', object: '17' },
		{ subject: 'http://example.com/StudentShape/103', predicate: 'name', object: 'Juan' },
		{ subject: 'http://example.com/StudentShape/103', predicate: 'goesTo', object: 'BIO-Agriculture' },
		{ subject: 'http://example.com/StudentShape/103', predicate: 'goesTo', object: 'BIO-Molecular' }
		];
	expect(triplesExpected).toEqual(triples);
  });
  
  it("Mapping with paths of length 4 with two attributes in the join that connect each other because they are pks", function() {
	  var triples=[];
	  $.ajax({	  
	        url: "tgd/department_mapping",
	        type: "GET",
	        async: false
	      })
	      .done(function(data) {	    	  
	    	 graphST.fromJSON(data);	
	    	 let mapSymbols=new Map();
	     	 let mapTableIdCanvas=new Map();
	     	 let num=1;
	     	 let namespace="http://example.com/"
	     	 graphST.getElements().forEach(function(element){
	    		if (element.attributes.type=="db.Table"){
	    			mapTableIdCanvas.set(element.attributes.question,element.id)
	    		}
	    		if (element.attributes.type=="shex.Type"){
	    			mapSymbols.set("f"+num,namespace+element.attributes.question);
	    			num++;
	    		}
	     	 });	     	 
	    	 exchange.generateQuery(mapSymbols,graphST,paperTGDs,mapTableIdCanvas);	    	 	    	 
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	      })
	      .always(function() {
	        
	      });		  
	  $.ajax({	  
	        url: "test",
	        type: "POST",
	        data:{nameTest:"department_mapping",queries:exchange.chaseQueryDB},
	        async: false
	      })
	      .done(function(data) {
	        console.log(data);
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
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        	        
	        console.log(errorThrown)
	      })
	      .always(function() {
	        
	      });	
	var triplesExpected=[	
		{ subject: 'http://example.com/ProfShape/@PERU@', predicate: 'office', object: '@PERU@' },
		{ subject: 'http://example.com/ProfShape/@PERU@', predicate: 'course', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/ProfShape/@PERU@', predicate: 'name', object: '@PERU@' },
		{ subject: 'http://example.com/CourseShape/300', predicate: 'prof', object: 'http://example.com/ProfShape/@PERU@' },
		{ subject: 'http://example.com/CourseShape/300', predicate: 'name', object: '@PERU@' },
		{ subject: 'http://example.com/ProfShape/101', predicate: 'worksWith', object: 'http://example.com/StudentShape/100' },
		{ subject: 'http://example.com/ProfShape/101', predicate: 'helpsIn', object: 'http://example.com/CourseShape/300' },
		{ subject: 'http://example.com/ProfShape/101', predicate: 'name', object: 'Pame' },
		{ subject: 'http://example.com/ProfShape/101', predicate: 'attends', object: 'http://example.com/CourseShape/300' },
		{ subject: 'http://example.com/ProfShape/100', predicate: 'name', object: 'Ana' },
		{ subject: 'http://example.com/ProfShape/100', predicate: 'attends', object: 'http://example.com/CourseShape/300' },
		{ subject: 'http://example.com/CourseShape/@PERU@', predicate: 'prof', object: 'http://example.com/ProfShape/@PERU@' },
		{ subject: 'http://example.com/CourseShape/@PERU@', predicate: 'name', object: '@PERU@' }
		];
	expect(triplesExpected).toEqual(triples);
  });
  
  
  
  it("Mapping two relational attributes to the same Triple constraint", function() {
	  var triples=[];
	  $.ajax({	  
	        url: "tgd/student_twoAttSameTC",
	        type: "GET",
	        async: false
	      })
	      .done(function(data) {	    	  
	    	 graphST.fromJSON(data);	
	    	 let mapSymbols=new Map();
	     	 let mapTableIdCanvas=new Map();
	     	 let num=1;
	     	 let namespace="http://example.com/"
	     	 graphST.getElements().forEach(function(element){
	    		if (element.attributes.type=="db.Table"){
	    			mapTableIdCanvas.set(element.attributes.question,element.id)
	    		}
	    		if (element.attributes.type=="shex.Type"){
	    			mapSymbols.set("f"+num,namespace+element.attributes.question);
	    			num++;
	    		}
	     	 });	     	 
	    	 exchange.generateQuery(mapSymbols,graphST,paperTGDs,mapTableIdCanvas);	    	 	    	 
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	      })
	      .always(function() {
	        
	      });		  
	  $.ajax({	  
	        url: "test",
	        type: "POST",
	        data:{nameTest:"student_twoAttSameTC",queries:exchange.chaseQueryDB},
	        async: false
	      })
	      .done(function(data) {
	        console.log(data);
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
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        	        
	        console.log(errorThrown)
	      })
	      .always(function() {
	        
	      });
	var triplesExpected=[
		{ subject: 'http://example.com/ProfShape/@PERU@', predicate: 'office', object: '@PERU@' },
		{ subject: 'http://example.com/ProfShape/@PERU@', predicate: 'course', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/ProfShape/@PERU@', predicate: 'name', object: '@PERU@' },
		{ subject: 'http://example.com/StudentShape/200', predicate: 'helps', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/200', predicate: 'course', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/200', predicate: 'name', object: 'Rosa' },
		{ subject: 'http://example.com/StudentShape/200', predicate: 'phone', object: '@PERU@' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'helps', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'course', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'name', object: 'Juan' },
		{ subject: 'http://example.com/StudentShape/101', predicate: 'phone', object: '@PERU@' },
		{ subject: 'http://example.com/StudentShape/201', predicate: 'helps', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/201', predicate: 'course', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/201', predicate: 'name', object: 'Pedro' },
		{ subject: 'http://example.com/StudentShape/201', predicate: 'phone', object: '@PERU@' },
		{ subject: 'http://example.com/StudentShape/100', predicate: 'helps', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/100', predicate: 'course', object: 'http://example.com/CourseShape/@PERU@' },
		{ subject: 'http://example.com/StudentShape/100', predicate: 'name', object: 'Ana' },
		{ subject: 'http://example.com/StudentShape/100', predicate: 'phone', object: '@PERU@' },
		{ subject: 'http://example.com/CourseShape/@PERU@', predicate: 'prof', object: 'http://example.com/ProfShape/@PERU@' },
		{ subject: 'http://example.com/CourseShape/@PERU@', predicate: 'name', object: '@PERU@' }
		];
	expect(triplesExpected).toEqual(triples);
  });
  
  
  it("Mapping on Supplier DB single green and blue links", function() {
	  var triples=[];
	  $.ajax({	  
	        url: "tgd/supplier_singleGB",
	        type: "GET",
	        async: false
	      })
	      .done(function(data) {	    	  
	    	 graphST.fromJSON(data);	
	    	 let mapSymbols=new Map();
	     	 let mapTableIdCanvas=new Map();
	     	 let num=1;
	     	 let namespace="http://example.com/"
	     	 graphST.getElements().forEach(function(element){
	    		if (element.attributes.type=="db.Table"){
	    			mapTableIdCanvas.set(element.attributes.question,element.id)
	    		}
	    		if (element.attributes.type=="shex.Type"){
	    			mapSymbols.set("f"+num,namespace+element.attributes.question);
	    			num++;
	    		}
	     	 });	     	 
	    	 exchange.generateQuery(mapSymbols,graphST,paperTGDs,mapTableIdCanvas);	    	 	    	 
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	      })
	      .always(function() {
	        
	      });		  
	  $.ajax({	  
	        url: "test",
	        type: "POST",
	        data:{nameTest:"supplier_singleGB",queries:exchange.chaseQueryDB},
	        async: false
	      })
	      .done(function(data) {
	        console.log(data);
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
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        	        
	        console.log(errorThrown)
	      })
	      .always(function() {
	        
	      });
	console.log(triples)
	var triplesExpected=[
		{ subject: 'http://example.com/SupplierShape/@PERU@', predicate: 'name', object: '@PERU@' },
		{ subject: 'http://example.com/SupplierShape/P1', predicate: 'supplier', object: 'http://example.com/SupplierShape/@PERU@' },
		{ subject: 'http://example.com/SupplierShape/P1', predicate: 'name', object: 'Carrot' },
		{ subject: 'http://example.com/SupplierShape/P2', predicate: 'supplier', object: 'http://example.com/SupplierShape/@PERU@' },
		{ subject: 'http://example.com/SupplierShape/P2', predicate: 'name', object: 'Potatoe' },
		{ subject: 'http://example.com/ProductShape/S1', predicate: 'name', object: 'Supp_North' },
		{ subject: 'http://example.com/SupplierShape/P3', predicate: 'supplier', object: 'http://example.com/SupplierShape/@PERU@' },
		{ subject: 'http://example.com/SupplierShape/P3', predicate: 'name', object: 'Onion' },
		{ subject: 'http://example.com/ProductShape/S2', predicate: 'name', object: 'Supp_South' }
		];
	expect(triplesExpected).toEqual(triples);
  });
  
  it("Mapping on Supplier DB single green, blue and red links", function() {
	  var triples=[];
	  $.ajax({	  
	        url: "tgd/supplier_singleGBR",
	        type: "GET",
	        async: false
	      })
	      .done(function(data) {	    	  
	    	 graphST.fromJSON(data);	
	    	 let mapSymbols=new Map();
	     	 let mapTableIdCanvas=new Map();
	     	 let num=1;
	     	 let namespace="http://example.com/"
	     	 graphST.getElements().forEach(function(element){
	    		if (element.attributes.type=="db.Table"){
	    			mapTableIdCanvas.set(element.attributes.question,element.id)
	    		}
	    		if (element.attributes.type=="shex.Type"){
	    			mapSymbols.set("f"+num,namespace+element.attributes.question);
	    			num++;
	    		}
	     	 });	     	 
	    	 exchange.generateQuery(mapSymbols,graphST,paperTGDs,mapTableIdCanvas);	    	 	    	 
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	      })
	      .always(function() {
	        
	      });		  
	  $.ajax({	  
	        url: "test",
	        type: "POST",
	        data:{nameTest:"supplier_singleGBR",queries:exchange.chaseQueryDB},
	        async: false
	      })
	      .done(function(data) {
	        console.log(data);
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
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        	        
	        console.log(errorThrown)
	      })
	      .always(function() {
	        
	      });
	console.log(triples)
	var triplesExpected=[
		{ subject: 'http://example.com/SupplierShape/S1', predicate: 'name', object: 'Supp_North' },
		{ subject: 'http://example.com/SupplierShape/S2', predicate: 'name', object: 'Supp_South' },
		{ subject: 'http://example.com/ProductShape/P2', predicate: 'supplier', object: 'http://example.com/SupplierShape/S1' },
		{ subject: 'http://example.com/ProductShape/P2', predicate: 'supplier', object: 'http://example.com/SupplierShape/S2' },
		{ subject: 'http://example.com/ProductShape/P2', predicate: 'name', object: 'Potatoe' },	
		{ subject: 'http://example.com/ProductShape/P3', predicate: 'supplier', object: 'http://example.com/SupplierShape/S2' },
		{ subject: 'http://example.com/ProductShape/P3', predicate: 'name', object: 'Onion' },
		{ subject: 'http://example.com/ProductShape/P1', predicate: 'supplier', object: 'http://example.com/SupplierShape/S1' },
		{ subject: 'http://example.com/ProductShape/P1', predicate: 'supplier', object: 'http://example.com/SupplierShape/S2' },
		{ subject: 'http://example.com/ProductShape/P1', predicate: 'name', object: 'Carrot' }		
		];
	expect(triplesExpected).toEqual(triples);
  });
  
  it("Bug Example Mapping with two Blank Nodes and four blank literals", function() {
	  var triples=[];
	  $.ajax({	  
	        url: "tgd/bug_mapping",
	        type: "GET",
	        async: false
	      })
	      .done(function(data) {	    	  
	    	 graphST.fromJSON(data);	
	    	 let mapSymbols=new Map();
	     	 let mapTableIdCanvas=new Map();
	     	 let num=1;
	     	 let namespace="http://example.com/"
	     	 graphST.getElements().forEach(function(element){
	    		if (element.attributes.type=="db.Table"){
	    			mapTableIdCanvas.set(element.attributes.question,element.id)
	    		}
	    		if (element.attributes.type=="shex.Type"){
	    			mapSymbols.set("f"+num,namespace+element.attributes.question);
	    			num++;
	    		}
	     	 });	     	 
	    	 exchange.generateQuery(mapSymbols,graphST,paperTGDs,mapTableIdCanvas);	    	 	    	 
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	      })
	      .always(function() {
	        
	      });		  
	  $.ajax({	  
	        url: "test",
	        type: "POST",
	        data:{nameTest:"bug_mapping",queries:exchange.chaseQueryDB},
	        async: false
	      })
	      .done(function(data) {
	        console.log(data);
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
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        	        
	        console.log(errorThrown)
	      })
	      .always(function() {
	        
	      });	
	var triplesExpected=[
		{ subject: 'http://example.com/TBug/1', predicate: 'descr', object: 'Boom!' },
		{ subject: 'http://example.com/TBug/1', predicate: 'rep', object: 'http://example.com/TUser/1' },
		{ subject: 'http://example.com/TBug/1', predicate: 'related', object: 'http://example.com/TBug/3' },
		{ subject: 'http://example.com/TBug/2', predicate: 'descr', object: 'Kabang!' },
		{ subject: 'http://example.com/TBug/2', predicate: 'rep', object: 'http://example.com/TUser/1' },
		{ subject: 'http://example.com/TBug/2', predicate: 'related', object: 'http://example.com/TBug/1' },
		{ subject: 'http://example.com/TBug/3', predicate: 'descr', object: 'Bang!' },
		{ subject: 'http://example.com/TBug/3', predicate: 'rep', object: 'http://example.com/TUser/2' },
		{ subject: 'http://example.com/TUser/1', predicate: 'email', object: 'j@ex.com' },
		{ subject: 'http://example.com/TUser/1', predicate: 'tracks', object: 'http://example.com/TBug/1' },
		{ subject: 'http://example.com/TUser/1', predicate: 'tracks', object: 'http://example.com/TBug/2' },
		{ subject: 'http://example.com/TUser/1', predicate: 'name', object: 'Jose' },
		{ subject: 'http://example.com/TUser/2', predicate: 'email', object: '@PERU@' },
		{ subject: 'http://example.com/TUser/2', predicate: 'tracks', object: 'http://example.com/TBug/@PERU@' },
		{ subject: 'http://example.com/TUser/2', predicate: 'name', object: 'Edith' },
		{ subject: 'http://example.com/TBug/@PERU@', predicate: 'descr', object: '@PERU@' },
		{ subject: 'http://example.com/TBug/@PERU@', predicate: 'rep', object: 'http://example.com/TUser/@PERU@' },
		{ subject: 'http://example.com/TUser/@PERU@', predicate: 'email', object: '@PERU@' },
		{ subject: 'http://example.com/TUser/@PERU@', predicate: 'tracks', object: 'http://example.com/TBug/@PERU@' },
		{ subject: 'http://example.com/TUser/@PERU@', predicate: 'name', object: '@PERU@' }
		];
	expect(triplesExpected).toEqual(triples);
  });
 
  it("ProdSupp Example with one table and two Pks Mapping with single paths to two Shapes", function() {
	  var triples=[];
	  $.ajax({	  
	        url: "tgd/prodsupp_mapping",
	        type: "GET",
	        async: false
	      })
	      .done(function(data) {	    	  
	    	 graphST.fromJSON(data);	
	    	 let mapSymbols=new Map();
	     	 let mapTableIdCanvas=new Map();
	     	 let num=1;
	     	 let namespace="http://example.com/"
	     	 graphST.getElements().forEach(function(element){
	    		if (element.attributes.type=="db.Table"){
	    			mapTableIdCanvas.set(element.attributes.question,element.id)
	    		}
	    		if (element.attributes.type=="shex.Type"){
	    			mapSymbols.set("f"+num,namespace+element.attributes.question);
	    			num++;
	    		}
	     	 });	     	 
	    	 exchange.generateQuery(mapSymbols,graphST,paperTGDs,mapTableIdCanvas);	    	 	    	 
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        
	        console.log(textStatus);
	      })
	      .always(function() {
	        
	      });		  
	  $.ajax({	  
	        url: "test",
	        type: "POST",
	        data:{nameTest:"prodsupp_mapping",queries:exchange.chaseQueryDB},
	        async: false
	      })
	      .done(function(data) {
	        console.log(data);
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
	      })
	      .fail(function(jqXHR, textStatus, errorThrown) {        	        
	        console.log(errorThrown)
	      })
	      .always(function() {
	        
	      });
	console.log(triples)
	var triplesExpected=[
		{ subject: 'http://example.com/SupplierShape/S1', predicate: 'name', object: 'Auchan' },{ subject: 'http://example.com/ProductShape/P2', predicate: 'supplier', object: 'http://example.com/SupplierShape/S2' },{ subject: 'http://example.com/ProductShape/P2', predicate: 'name', object: 'Carrot' },{ subject: 'http://example.com/SupplierShape/S2', predicate: 'name', object: 'Carrefour' },{ subject: 'http://example.com/ProductShape/P1', predicate: 'supplier', object: 'http://example.com/SupplierShape/S1' },{ subject: 'http://example.com/ProductShape/P1', predicate: 'name', object: 'Onion' }
		];
	expect(triplesExpected).toEqual(triples);
  });
  
  
})