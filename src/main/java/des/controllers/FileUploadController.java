package des.controllers;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import com.restlet.sqlimport.model.sql.Database;
import com.restlet.sqlimport.parser.SqlImport;
import com.restlet.sqlimport.report.Report;
import com.restlet.sqlimport.util.Util;

import des.models.SchemaTableJSON;
import des.services.DBService;
import des.storage.StorageFileNotFoundException;
import des.storage.StorageService;

@RestController
public class FileUploadController {
	private final StorageService storageService;
	private final DBService dbService;
	private Util util = new Util();
	private Report report = new Report();
	private SqlImport sqlImport = new SqlImport(report);

	@Autowired
	public FileUploadController(StorageService storageService,DBService dbService) {
		this.storageService = storageService;
		this.dbService=dbService;
	}
	@GetMapping(path="/listFiles")
    public String listUploadedFiles(Model model) throws IOException {

        model.addAttribute("files", storageService.loadAll().map(
                path -> MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
                        "serveFile", path.getFileName().toString()).build().toString())
                .collect(Collectors.toList()));
        System.out.println(model.asMap().values());
        return "greeting";
    }
		
	@GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
	
	@PostMapping("/uploadFile")
    public @ResponseBody List<SchemaTableJSON> handleFileUpload(@RequestParam("file") MultipartFile file) throws FileNotFoundException, IOException, SQLException {
        storageService.store(file);
        Resource sqlFile = storageService.loadAsResource(file.getOriginalFilename());        
        final InputStream in = new FileInputStream(sqlFile.getFile());
		final String sqlContent = util.read(in);
		//create the database in a parallel process		
		final Database database = sqlImport.getDatabase(sqlContent);		
        //Return the structure that will draw the graphic        		
        return dbService.createH2DB(database);
    }
	
	@PostMapping("/uploadShexFile")
	public String handleShexFileUpload(@RequestParam("file") MultipartFile file) {		
		storageService.store(file);		
		return "ok";		
	}
	
	@ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
