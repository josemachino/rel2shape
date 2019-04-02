package des.models;

import java.util.Map;

public class Rule {
	public Rule(Map<String, String> bind, Map<String, Object>[] constraints, RelAtom[] yield) {
		super();
		this.bind = bind;
		this.constraints = constraints;
		this.yield = yield;
	}

	private Map<String, String> bind;
	private Map<String, Object>[] constraints;
	private Object yield;

	public Map<String, String> getBind() {
		return bind;
	}

	public void setBind(Map<String, String> bind) {
		this.bind = bind;
	}


	public Object getYield() {
		return yield;
	}

	public void setYield(RelAtom[] yield) {
		this.yield = yield;
	}

	public Map<String, Object>[] getConstraints() {
		return constraints;
	}

	public void setConstraints(Map<String, Object>[] constraints) {
		this.constraints = constraints;
	}
}
