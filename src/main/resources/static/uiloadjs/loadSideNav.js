var sideLeftView = Backbone.View.extend({
initialize: function(){
    this.render();
},
render: function(){
    var template = _.template( $("#sideright_template").html(), {} );
    this.$el.html( template );
}

});

var side_left_view = new sideLeftView({ el: $("#sidebar-right") });
