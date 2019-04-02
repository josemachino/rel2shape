var menuView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#menu_template").html(), {} );
    this.$el.html( template );
},
events: {
    "click #sidebarCollapse": "activate"
},
activate:function(e){    
    //$(e.target).toggleClass('active');
    $('#sidebar').toggleClass('active');
}
});

var menu_view = new menuView({ el: $("#menu") });
