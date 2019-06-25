
let shcolorbgEnt='#DABFFF';
let shcolorbgAtt='#8BAED0';

let shcolorTEnt='black';
let shcolorTAtt='black';

//let shportColorOutPk='#E80000';
let shportColorOutPk='#FF5A25';
//let shportColorOutAtt='#FF9B85';
let shportColorOutAtt='#6eb257';
joint.shapes.shex = {};
joint.dia.Element.define('shex.Type',{
    optionHeight: 30,
    questionHeight: 45,
    paddingBottom: 10,
    minWidth: 150,
    portMarkup: [{ tagName: 'rect', selector: 'portBody' },{ tagName: 'circle', selector: 'portBody2' }],
    ports: {
        groups: {
            'inType': { position:'top',
                attrs: {  portBody: {width: 10, height: 10,stroke: 'white', fill: '#feb663', magnet: 'passive' }},
                isConnected:false
            },
            /*position: function(ports, elBBox) {
            return ports.map(function(_, index) {
                var step = -Math.PI / 8;
                var y = Math.sin(index * step) * 50;
                return new g.Point({ x: index * 12, y: y + elBBox.height });
            });
        },*/
            'refType':{position:'absolute',attrs: {  portBody: {width: 1, height: 1,stroke: '#4b4a67', fill: '#4b4a67', magnet: 'passive' }}},
            'outRefType':{position:'right',attrs:{portBody: {width: 5, height: 10,stroke: 'white', fill: '#feb663', magnet: 'passive' }}},
            out: {position: 'left',
                attrs:{portBody2: {magnet: 'passive',stroke: 'none', fill: shportColorOutAtt, r: 9}}
            },
            outype: {position: 'left', attrs:{portBody2: {magnet: 'passive', stroke: 'none', fill: shportColorOutPk, r: 9 }}}
        },
        items: [{group:'inType'},{group:'refType'}]
    },
    attrs: {
        '.': { magnet: false },
        '.body': {
            width: 150, height: 120,
            rx: '1%', ry: '2%',
            stroke: 'none',            
            fill:shcolorbgEnt
        },
        '.options': { ref: '.body', 'ref-x': 0 },

        // Text styling.
        text: { 'font-family': fontFamily },
        '.option-text': { 'font-size': fontSizeAttribute, fill: shcolorTAtt, 'y-alignment': -1, 'x-alignment': 20 },
        '.question-text': {
            fill: shcolorTEnt,
            refX: '50%',
            refY: 15,
            'font-size': fontSizeEntity,
            'text-anchor': 'middle',
            style: { 'text-shadow': '1px 1px 0px gray' }
        },

        // Options styling.
        '.option-rect': {
            rx: 3, ry: 3,
            stroke: 'white', 'stroke-width': 1, 'stroke-opacity': .5,
            'fill-opacity': .5,
            fill: shcolorbgAtt,
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

        this.onChangeOptions();
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
            
            var selector = '.option-' + option.label;                    
            attrsUpdate[selector] = { transform: 'translate(0, ' + offsetY + ')', dynamic: true };
            attrsUpdate[selector + ' .option-rect'] = { height: optionHeight, dynamic: true };      
            tripleConstraint='';
            if (option.type=='Literal'){
                tripleConstraint=option.label+"::"+option.type + " ("+option.mult+")";
            }else{
                tripleConstraint=option.label+"::@"+option.type+ " ("+option.mult+")";
            }
            attrsUpdate[selector + ' .option-text'] = { text: tripleConstraint, dynamic: true };

            offsetY += optionHeight;

            var portY = offsetY - optionHeight / 2 + questionHeight;
            var aux_id=option.label+","+option.type+","+option.mult;
            if (!this.getPort(aux_id)) {
                
                if (option.type=='Literal'){                    
                    this.addPort({ group: 'out', id:aux_id , args: { y: portY } });
                }else{                                    
                    this.addPort({ group: 'outype', id: aux_id, args: { y: portY } });
                    this.addPort({ group:'outRefType',id: "ref"+aux_id, args: { y: portY } });
                }
            } else {                	
            	this.portProp(aux_id, 'args/y', portY);            	
            }
        }, this);
        this.attr(attrsUpdate);
        this.autoresize();
    },
    autoresize: function() {

        var options = this.get('options') || [];		
        var gap = this.get('paddingBottom') || 20;
        var height = options.length * this.get('optionHeight') + this.get('questionHeight') + gap;
        let sizeOpt=0;
        for (let option of options){            
            sizeOpt=Math.max(sizeOpt,option.label.length+option.type.length+option.mult.length)   
        }
        var width = sizeOpt*8+(fontSizeAttribute/6)*32+16;		
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

joint.shapes.shex.TypeView = joint.dia.ElementView.extend({
    

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

            var className = 'option-' + option.label;
            var elOption = this.elOption.clone().addClass(className);
            elOption.attr('option-id', option.id);
            this.$options.append(elOption.node);

        }, this);

        // Apply `attrs` to the newly created SVG elements.
        this.update();
    }
});

