/*https://github.com/393799203/rappid/blob/master/apps/QAD/src/snippet.js*/
joint.shapes.db = {};
joint.dia.Element.define('db.Table',{
    optionHeight: 30,
    questionHeight: 45,
    paddingBottom: 30,
    minWidth: 150,
    portMarkup: [{ tagName: 'rect', selector: 'portBody' },{ tagName: 'circle', selector: 'portBody2' }],
    ports: {
        groups: {
            'in': {
                position:'top',
                attrs: {
                    portBody: {
                        width: 10,
                        height: 10,
                        stroke: 'white',
                        fill: 'gray',
                        magnet: 'active'
                    }
                }
            },
            'pk':{
                position:'left',
                attrs: {
                    portBody2: {
                        r:4,
                         magnet: 'passive'
                    }
                }
            },
            'fk':{
                position:'left',
                attrs: {
                    portBody: {
                        width: 5,
                        height: 10,
                        stroke: 'white',
                        fill: 'gray',
                        magnet: 'passive'
                    }
                }
            },
            out: {
                position: 'right',
                attrs:{
                 portBody2: {
                        magnet: 'active',
                        stroke: 'none', fill: '#31d0c6', r: 9
                 }
                }
            },
            'outfk':{
                position: 'right',
                attrs:{
                 portBody2: {
                        magnet: true,
                        stroke: 'none', fill: '#7275db', r: 9
                 }
                }
            },
			'outpk':{
                position: 'right',
                attrs:{
                 portBody2: {
                        magnet: true,
                        stroke: 'none', fill: '#7275db', r: 9
                 }
                }
            }
        },
        items: [
            { group: 'in'}
        ]
    },
    attrs: {
        '.': { magnet: false },
        '.body': {
            width: 150, height: 250,
            rx: '1%', ry: '2%',
            stroke: 'none',
            fill: {
                type: 'linearGradient',
                stops: [
                    { offset: '0%', color: '#7275db' },
                    { offset: '100%', color: '#31D0C6' }
                ],
                // Top-to-bottom gradient.
                attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }
            }
        },
        '.options': { ref: '.body', 'ref-x': 0 },

        // Text styling.
        text: { 'font-family': 'Arial' },
        '.option-text': { 'font-size': 11, fill: '#4b4a67', 'y-alignment': .7, 'x-alignment': 30 },
        '.question-text': {
            fill: 'black',
            refX: '50%',
            refY: 15,
            'font-size': 15,
            'text-anchor': 'middle',
            style: { 'text-shadow': '1px 1px 0px gray' }
        },

        // Options styling.
        '.option-rect': {
            rx: 3, ry: 3,
            stroke: 'white', 'stroke-width': 1, 'stroke-opacity': .5,
            'fill-opacity': .5,
            fill: 'white',
            ref: '.body',
            'ref-width': 1
        }
    }       
},{   markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="question-text"/><g class="options"></g></g>',optionMarkup: '<g class="option"><rect class="option-rect"/><text class="option-text"/></g>',
    initialize: function() {        
        joint.dia.Element.prototype.initialize.apply(this, arguments);        
        this.on('change:options', this.onChangeOptions, this);
        this.on('change:question', function() {
            this.attr('.question-text/text', this.get('question') || '');
            this.autoresize();
        }, this);

        this.on('change:questionHeight', function() {
            this.attr('.options/ref-y', this.get('questionHeight'), { silent: true });
            this.autoresize();
        }, this);

        this.on('change:optionHeight', this.autoresize, this);

        this.attr('.options/ref-y', this.get('questionHeight'), { silent: true });
        this.attr('.question-text/text', this.get('question'), { silent: true });
        //var 
        this.onChangeOptions();
        //draw the foreign keys
    },
    onChangeOptions: function() {

        var options = this.get('options');
        var optionHeight = this.get('optionHeight');

        // First clean up the previously set attrs for the old options object.
        // We mark every new attribute object with the `dynamic` flag set to `true`.
        // This is how we recognize previously set attributes.
        var attrs = this.get('attrs');
        _.each(attrs, function(attrs, selector) {

            if (attrs.dynamic) {
                // Remove silently because we're going to update `attrs`
                // later in this method anyway.
                this.removeAttr(selector, { silent: true });
            }
        }, this);

        // Collect new attrs for the new options.
        var offsetY = 0;
        var attrsUpdate = {};
        var questionHeight = this.get('questionHeight');

        _.each(options, function(option) {

            var selector = '.option-' + option.id;            

            attrsUpdate[selector] = { transform: 'translate(0, ' + offsetY + ')', dynamic: true };
            attrsUpdate[selector + ' .option-rect'] = { height: optionHeight, dynamic: true };            
            attrsUpdate[selector + ' .option-text'] = { text: option.text, dynamic: true };

            offsetY += optionHeight;

            var portY = offsetY - optionHeight / 2 + questionHeight;
            if (option.iskey ){          
            	console.log('pk-'.concat(this.get('question')).concat(option.id));
            	if(!this.getPort('pk-'.concat(this.get('question')).concat(option.id))){
            		this.addPort({group:'pk',id:'pk-'.concat(this.get('question')).concat(option.id),args:{y: portY }});
            	}
            	            	                  
            }
            if (!this.getPort(option.id)) {
                if (option.ref!=null){
                    this.addPort({ group: 'outfk', id: option.id, args: { y: portY } });
                }else{
					if (option.iskey){
						this.addPort({ group: 'outpk', id: option.id, args: { y: portY } });
					}else{
						this.addPort({ group: 'out', id: option.id, args: { y: portY } });
					}
                }
                                
            } else {
                this.portProp(option.id, 'args/y', portY);
            }
            
            if (option.ref!=null){
            	if (!this.getPort('fk-'.concat(option.id))){
            		this. addPort({group:'fk',id:'fk-'.concat(option.id),args:{y: portY }});
            	}                
            }
            
        }, this);
        this.attr(attrsUpdate);
        this.autoresize();
    },
    autoresize: function() {

        var options = this.get('options') || [];
        var gap = this.get('paddingBottom') || 20;
        var height = options.length * this.get('optionHeight') + this.get('questionHeight') + gap;
        var width = 150;
        /*var width = joint.util.measureText(this.get('question'), {
            fontSize: this.attr('.question-text/font-size')
        }).width;*/
        this.resize(Math.max(this.get('minWidth') || 150, width), height);
    },
    changeOption: function(id, option) {

        if (!option.id) {
            option.id = id;
        }

        var options = JSON.parse(JSON.stringify(this.get('options')));
        options[_.findIndex(options, { id: id })] = option;
        this.set('options', options);
    }
    
    
});

joint.shapes.db.TableView = joint.dia.ElementView.extend({
    

    initialize: function() {

        joint.dia.ElementView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, 'change:options', this.renderOptions, this);
    },

    renderMarkup: function() {

        joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);

        // A holder for all the options.
        this.$options = this.$('.options');
        // Create an SVG element representing one option. This element will
        // be cloned in order to create more options.
        this.elOption = V(this.model.optionMarkup);

        this.renderOptions();
    },

    renderOptions: function() {

        this.$options.empty();

        _.each(this.model.get('options'), function(option, index) {

            var className = 'option-' + option.id;
            var elOption = this.elOption.clone().addClass(className);
            elOption.attr('option-id', option.id);
            this.$options.append(elOption.node);

        }, this);

        // Apply `attrs` to the newly created SVG elements.
        this.update();
    }
});

