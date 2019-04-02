package com.restlet.sqlimport.model.sql;

import java.util.ArrayList;
import java.util.List;

/**
 * Database
 */
public class Database {

	/**
	 * Tables
	 */
	private List<Table> tables = new ArrayList<Table>();
	private List<String> inserts=new ArrayList<String>();
	
	public Table getTableForName(final String tableName) {
		for(final Table table : tables) {
			if(table.getName().equalsIgnoreCase(tableName)) {
				return table;
			}
		}
		return null;
	}

	public List<Table> getTables() {
		return tables;
	}

	public List<String> getInserts(){
		return inserts;
	}
	
	public void setTables(final List<Table> tables) {
		this.tables = tables;
	}

}
