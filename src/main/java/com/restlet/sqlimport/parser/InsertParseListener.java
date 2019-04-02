package com.restlet.sqlimport.parser;

import java.util.List;

import com.restlet.sqlimport.model.sql.Database;
import com.restlet.sqlimport.parser.SqlParser.Insert_stmtContext;
import com.restlet.sqlimport.util.Util;

/**
 * Parse Listener only for ALTER TABLE statements parsing.
 */
public class InsertParseListener extends SqlBaseListener {


	/**
	 * Debug mode to display ANTLR v4 contexts.
	 */
	private static boolean DEBUG = false;

	/**
	 * ANTLR Parser
	 */
	private final SqlParser sqlParser;

	/**
	 * Database schema
	 */
	private final Database database;

	
	private boolean inInsert = false; // CREATE TABLE

	/**
	 * Utils methods.
	 */
	Util util = new Util();

	/**
	 * Constructor.
	 * @param sqlParser SQL parser
	 * @param database Database
	 */
	public InsertParseListener(final SqlParser sqlParser, final Database db) {
		this.sqlParser = sqlParser;
		this.database = db;
	}

	/**
	* enter insert 
	**/
	public void enterInsert_stmt(final Insert_stmtContext ctx) {
		inInsert=true;
	}
	
	/**
	*exit  insert 
	**/
	public void exitInsert_stmt(final Insert_stmtContext ctx) {
		if (inInsert) {
			int children=ctx.getChildCount();
			StringBuilder sb=new StringBuilder();
			for (int j=0;j<children;j++) {				
				sb.append(ctx.getChild(j).getText()).append(" ");
			}
			database.getInserts().add(sb.toString());
			inInsert=false;
		}
	}
}
