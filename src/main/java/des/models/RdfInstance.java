package des.models;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;

public class RdfInstance {
	private Model tripleSet;
	private Map<Resource, Set<String>> instanceTypeAnnotationMap;

	public RdfInstance() {
		tripleSet = ModelFactory.createDefaultModel();
		instanceTypeAnnotationMap = new HashMap<Resource, Set<String>>();
	}

	public Model getTripleSet() {
		return tripleSet;
	}

	public Map<Resource, Set<String>> getInstanceTypeAnnotationMap() {
		return instanceTypeAnnotationMap;
	}

	public void putTypes(Resource rs, String type) {
		Set<String> mTypes = this.instanceTypeAnnotationMap.get(rs);
		if (mTypes != null && mTypes.size() > 0) {
			mTypes.add(type);
		} else {
			mTypes = new HashSet<String>();
			mTypes.add(type);
		}
		this.instanceTypeAnnotationMap.put(rs, mTypes);
	}

	public void setInstanceTypeAnnotationMap(Map<Resource, Set<String>> instanceTypeAnnotationMap) {
		this.instanceTypeAnnotationMap = instanceTypeAnnotationMap;
	}

	public Set<Resource> getInstancesofType(String type) {
		Set<Resource> instances = new HashSet<Resource>();
		for (Map.Entry<Resource, Set<String>> entry : instanceTypeAnnotationMap.entrySet()) {
			for (String mType : entry.getValue()) {
				if (mType.equals(type)) {
					instances.add(entry.getKey());
				}
			}

		}
		return instances;
	}

	public Set<String> getTypesIdentified() {
		Set<String> types = new HashSet<String>();
		for (Map.Entry<Resource, Set<String>> entry : instanceTypeAnnotationMap.entrySet()) {
			for (String mType : entry.getValue()) {
				types.add(mType);
			}

		}
		return types;
	}
}
