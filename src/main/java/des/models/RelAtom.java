package des.models;

import java.util.Map;

public class RelAtom {
	public RelAtom(String atom, Map<String, String>[] args) {
		super();
		this.atom = atom;
		this.args = args;
	}
	private String atom;
	private Map<String,String>[] args;
	public String getAtom() {
		return atom;
	}
	public void setAtom(String atom) {
		this.atom = atom;
	}
	public Map<String,String>[] getArgs() {
		return args;
	}
	public void setArgs(Map<String,String>[] args) {
		this.args = args;
	}
}
