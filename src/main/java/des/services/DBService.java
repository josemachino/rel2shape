package des.services;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import com.restlet.sqlimport.model.sql.Column;
import com.restlet.sqlimport.model.sql.Database;
import com.restlet.sqlimport.model.sql.Table;

import des.models.AttRel;
import des.models.RdfInstance;
import des.models.ReFK;
import des.models.SchemaTableJSON;

@Service
public class DBService {

	private Map<String, Set<String>> termShTypes;
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public byte[] getResultFile(String format, String[] queries) {

		try {
			// proceed to the chase with sql inserting the values in the triple store
			executeQueries(jdbcTemplate, Arrays.asList(queries));
		} catch (Exception ex) {
			System.out.println(ex.toString());
			return null;
		}

		termShTypes = jdbcTemplate.query("SELECT * FROM AllTyped", new ResultSetExtractor<Map<String, Set<String>>>() {
			@Override
			public Map<String, Set<String>> extractData(ResultSet rs) throws SQLException, DataAccessException {
				Map<String, Set<String>> termTypes = new HashMap<>();
				while (rs.next()) {
					Set<String> typesofTerm = termTypes.get(rs.getString(1));
					if (typesofTerm != null && typesofTerm.size() > 0) {
						typesofTerm.add(rs.getString(2));
					} else {
						typesofTerm = new HashSet<String>();
						typesofTerm.add(rs.getString(2));
					}
					termTypes.put(rs.getString(1), typesofTerm);
				}
				return termTypes;
			}
		});

		// query the triples solution
		RdfInstance rdfInstance = jdbcTemplate.query("SELECT * FROM Solution ORDER BY S ASC,P ", new ResultSetExtractor<RdfInstance>() {
			@Override
			public RdfInstance extractData(ResultSet rs) throws SQLException, DataAccessException {
				RdfInstance triples = new RdfInstance();
				List<Object []> tripleList=new ArrayList<Object []>();
				while (rs.next()) {
					Resource rSubject = ResourceFactory.createResource(rs.getString(1));
					Property predicate = ResourceFactory.createProperty("http://example.com/"+rs.getString(2));
					if (rs.getString(3).contains("http")) {
						// https://stackoverflow.com/questions/45309944/adding-blank-nodes-to-a-jena-model
						Resource rObject = ResourceFactory.createResource(rs.getString(3));
						Object [] objs= {rSubject, predicate, rObject};
						//triples.getTripleSet().add(rSubject, predicate, rObject);
						tripleList.add(objs );
					} else {
						Literal rObjectLit = ResourceFactory.createStringLiteral(rs.getString(3));
						Object [] objs= {rSubject, predicate, rObjectLit};
						//triples.getTripleSet().add(rSubject, predicate, rObjectLit);
						tripleList.add(objs );
					}
				}
				
				//Collections.reverse(tripleList);
				for (Object [] temp : tripleList) {
					System.out.println(temp[0]);
					System.out.println(temp[1]);
					System.out.println(temp[2]);
					if (temp[2] instanceof Resource) {
						triples.getTripleSet().add((Resource)temp[0],(Property)temp[1],(Resource)temp[2]);
					}
					else {
						triples.getTripleSet().add((Resource)temp[0],(Property)temp[1],(Literal)temp[2]);
					}
				}
				return triples;
			}
		});

		// Write to file of the format specified
		org.apache.jena.riot.RIOT.init();
		java.io.ByteArrayOutputStream os = null;
		// Serialize over an outputStream
		os = new java.io.ByteArrayOutputStream();
		System.out.println("ready to ");
		rdfInstance.getTripleSet().write(os, format);
		return os.toByteArray();
	}

	public List<SchemaTableJSON> createH2DB(Database db) throws SQLException {
		List<SchemaTableJSON> schemaTables = new ArrayList<SchemaTableJSON>();
		jdbcTemplate.execute("DROP ALL OBJECTS");
		for (Table ta : db.getTables()) {

			List<String> pks = ta.getPrimaryKey().getColumnNames();
			StringBuilder rString = new StringBuilder();
			String sep = ",";
			AttRel[] atts = new AttRel[ta.getColumnByNames().size()];
			int i = 0;

			for (Column col : ta.getColumnByNames().values()) {

				if (ta.getForeignKeyForColumnNameOrigin(col) == null) {
					atts[i] = new AttRel(ta.getName() + i, col.getName(), pks.contains(col.getName()), col.getType());
				} else {
					Table refTa = db.getTableForName(ta.getForeignKeyForColumnNameOrigin(col).getTableNameTarget());
					int j = 0;
					String refColName = ta.getForeignKeyForColumnNameOrigin(col).getColumnNameTargets().get(0);
					for (Column refCol : refTa.getColumnByNames().values()) {
						if (refCol.getName().equals(refColName)) {
							break;
						}
						j++;
					}
					// Set id of the column
					atts[i] = new AttRel(ta.getName() + i, col.getName(), pks.contains(col.getName()), col.getType(),
							new ReFK(refTa.getName(), refTa.getName() + j));
				}
				rString.append(col.getName()).append(" ").append(col.getType()).append(sep);
				i++;

			}
			AttRel[] attsOrdPk = new AttRel[ta.getColumnByNames().size()];
			int m = 0;
			for (AttRel att : atts) {
				if (pks.contains(att.getText())) {
					attsOrdPk[m] = att;
					m++;
				}
			}
			for (AttRel att : atts) {
				if (!pks.contains(att.getText())) {
					attsOrdPk[m] = att;
					m++;
				}
			}
			rString.setLength(rString.length() - 1);
			schemaTables.add(new SchemaTableJSON(ta.getName(), attsOrdPk));
			String taQ = "CREATE TABLE " + ta.getName() + " ( " + rString.toString() + " )";
			jdbcTemplate.execute(taQ);
		}
		executeQueries(jdbcTemplate, db.getInserts());
		return schemaTables;
	}

	private void executeQueries(JdbcTemplate jdbcTemplate, List<String> queries) {
		for (String q : queries) {
			q = q.replaceAll(";", "");
			System.out.println(q);
			jdbcTemplate.execute(q);
		}
	}

}
