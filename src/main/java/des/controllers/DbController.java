package des.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import des.services.DBService;
//https://stackoverflow.com/questions/43503977/spring-mvc-jackson-mapping-query-parameters-to-modelattribute-lowercase-wi
//https://github.com/spring-guides?page=2
//https://www.callicoder.com/spring-boot-file-upload-download-jpa-hibernate-mysql-database-example/
//https://github.com/husseinterek/spring-boot-jpa-hibernate/blob/master/src/main/resources/application.properties
//https://github.com/lchaboud-restlet/antlr-sqlparser
//https://stackoverflow.com/questions/44550020/json-object-and-spring-requestparam
@RestController
public class DbController {
	private final DBService dbService;
	@Autowired
	public DbController(DBService dbService) {
		this.dbService = dbService;
	}	
	@PostMapping(path="/chase") 
	@Transactional(timeout = 5000)
    public @ResponseBody ResponseEntity<StreamingResponseBody> chaseRule(@RequestParam("queries") String queries) {
		//check that database is not empty
		String[] ls_Query=queries.split("\n");
		byte[] resultMapping=dbService.getResultFile("RDF/JSON",ls_Query);
		if (resultMapping==null) {
			return ResponseEntity.unprocessableEntity().body(null);
		}else {
        final StreamingResponseBody body = out -> out.write(resultMapping);       		
        
        final HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("filename", "triples.rj");
        
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.valueOf("application/rdf+json"))
                .body(body);
		}
    }
}
