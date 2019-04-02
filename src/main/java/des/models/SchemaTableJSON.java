package des.models;

public class SchemaTableJSON {	
	private String key;
	private AttRel[] items;
	public SchemaTableJSON(String name, AttRel[] items) {
		// TODO Auto-generated constructor stub
		this.setKey(name);
		this.setItems(items);
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public AttRel[] getItems() {
		return items;
	}
	public void setItems(AttRel[] items) {
		this.items = items;
	}
}
