var sideLeftView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#sideright_template").html(), {} );
    this.$el.html( template );
},
events: {
    "click #rightCollapsed":"activate"
},
activate:function(e){	
	
	let expand=$('#rightCollapsed').data('activate');
	if (expand){
		$('#rightCollapsed').html('<i class="fas fa-angle-double-right fa-2x"></i>');
		$('#rightCollapsed').attr('data-activate',false)
	}else{
		$('#rightCollapsed').html('<i class="fas fa-angle-double-left fa-2x"></i>');
		$('#rightCollapsed').attr('data-activate',true)
	}
	$('#sidebar-right').toggleClass('active');
}
});

var side_left_view = new sideLeftView({ el: $("#sidebar-right") });
