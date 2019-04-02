package des.models;

import java.util.Map;

public class TGDS {
	public TGDS(Map<String, String> functions, Object rules) {
		super();
		this.functions = functions;
		this.rules = rules;
	}
	private Map<String,String> functions;
	private Object rules;
	public Map<String, String> getFunctions() {
		return functions;
	}
	public void setFunctions(Map<String, String> functions) {
		this.functions = functions;
	}
	public Object getRules() {
		return rules;
	}
	public void setRules(Rule[] rules) {
		this.rules = rules;
	}
	/*private Object functions;
	private Object rules;
	public Object getFunctions() {
		return functions;
	}
	public void setFunctions(Object functions) {
		this.functions = functions;
	}
	public Object getRules() {
		return rules;
	}
	public void setRules(Object rules) {
		this.rules = rules;
	}*/

	
}
