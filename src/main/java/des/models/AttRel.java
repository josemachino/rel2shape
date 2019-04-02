package des.models;


public class AttRel {

	private String id;
	private String text;
	private boolean iskey;
	private String type;
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	private ReFK ref;

	public AttRel(String string, String name, boolean contains,String type) {
		this.setId(string);
		this.setText(name);
		this.setIskey(contains);
		this.setType(type);
		this.ref=null;
	}
	
	public AttRel(String string, String name, boolean contains,String type,ReFK ref) {
		this.setId(string);
		this.setText(name);
		this.setIskey(contains);
		this.setType(type);
		this.ref=ref;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean isIskey() {
		return iskey;
	}

	public void setIskey(boolean iskey) {
		this.iskey = iskey;
	}

	public ReFK getRef() {
		return ref;
	}

	public void setRef(ReFK ref) {
		this.ref = ref;
	}
}
