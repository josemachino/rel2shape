var loadTGDView = Backbone.View.extend({
	initialize: function(){
	    this.render();
	},
	render: function(){    
		var template = _.template( $("#tgd_template").html(), {} );
	    this.$el.html( template );
	}
});

var tgd_view = new loadTGDView({ el: $("#tgds_container") });
