

class AnimateEngineExt{
   
    makeMath(){

        if(typeof this.math == 'function'){
            this.math();
        }

        if(typeof this.math == 'object'){

            Object.keys(this.math).forEach(functionName => {
                this[functionName] = this.math[functionName];
                this[functionName]();
            });
        }


    }

    getTemplate(templateName, data = false){
        var template = this[templateName](data),
            renderedTemplate = '';
            Object.keys(template).forEach(cssParamName => {
                renderedTemplate += cssParamName+`(${template[cssParamName]}) `;
            });

            return renderedTemplate;
    }

    setCssProperty(Element, type = 'transform', style){
        style = style.toString().trim();
        Element.style['-o-'+type] = style;
        Element.style['-ms-'+type] = style;
        Element.style['-moz-'+type] = style;
        Element.style['-webkit-'+type] = style;
        Element.style[type] = style;
    }

    

    constructor(params){ 
        var self = this;
            Object.keys(params.on || {}).forEach(eventName => self[eventName] = params.on[eventName]);
            
            if(this['beforeInit']) this.beforeInit();
            this.data = params.data || {};

            Object.keys(this.data).forEach(stateName => {
                var getter = function () {
                        return this.data[stateName];
                    },
                    setter = function (value) {
                        this.data[stateName] = value;
                        this.makeMath();
                    }
                    Object.defineProperty(this, stateName, {get:getter,  set:setter});
            });

            
            this.templates = {};
          
            
            Object.keys(params.templates || {}).forEach(templateName => {
                this[templateName] = params.templates[templateName];
            });

            Object.keys(params.selectors || {}).forEach(selectorName => {
                let currentSelectors = params.selectors[selectorName];
                
                    currentSelectors.setCss3Property = function(data){
                        console.log(this);
                    }
                this["$"+selectorName] = currentSelectors;
            });
            
            if(this['beforeMount']) this.beforeMount();
            if(params.mount) this.mount = params.mount; this.mount();

            if(this['beforeMath']) this.beforeMath();
            if(params.math) this.math = params.math;

    }
}




class AnimateEngine{
    constructor(params){
        var self = this;

            if(params.events) Object.keys(params.events).forEach(eventName => self[eventName] = params.events[eventName]);
            
            
            this.$controll = (typeof params.controll    == 'string' ? document.querySelectorAll(params.controll)  : params.controll) || [];
            this.$elements = (typeof params.elements    == 'string' ? document.querySelectorAll(params.elements)  : elements.move)   || [];

            this.params = {
                ratioX:params.params.ratioX || params.params.ratio || 100,
                ratioY:params.params.ratioY || params.params.ratio || 100,
                type:params.params.type || 'translate',
                reverse:(params.params.reverse != undefined) ? params.params.reverse: true,
            }

            this.state = {
                'scrollTop':window.pageYOffset || document.documentElement.scrollTop,
            }


            this.mask = params.templates.mask || false;
    

            if(this['onBeforeInit']) this.onBeforeInit();


            if(typeof this.$controll != 'object' ){
                this.$controll.forEach(Selector => Selector.addEventListener('mousemove', Event => this.onMouseMove(Selector, Event)));
            }else{
                this.$controll.addEventListener('mousemove', Event => this.onMouseMove(this.$controll, Event))
            }
            this.$elements.forEach(Element => {
                this.bindElement(Element); // бинд реактивности

                window.CurrentElement = Element.animation;


                var data = Element.dataset;
                
                Element['params'] = {
                    position:   Element.getBoundingClientRect(),
                    ratioX:     data.ratioX || data.ratio || this.params.ratioX,
                    ratioY:     data.ratioY || data.ratio || this.params.ratioY,
                    reverse:    (data.reverse != undefined) ? data.reverse: self.params.reverse,
                }
                if(typeof this.$controll != 'object' && !this.$controll.length){
                    Element.addEventListener('mousemove', Event => this.onMouseMove(Element, Event))
                }
                
                
            });


            if(this['onScroll']){
                document.addEventListener('scroll', Event =>{
                    this.state.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    this.onScroll(Event);
                });
            }

            if(this['onResize']){
                document.addEventListener('resize', Event =>{
                    this.state.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    this.onResize(Event);
                });
            }


            if(this['onAfterInit']) this.onAfterInit();
    }

    bindElement(Element){
        if(Element.animation == undefined){
            Element.animation = {
                items:{},
                completeString:'',
                makeString:function(params){
                    Element.animation.items[name] = value;
                }
            };
    
            var props =['matrix', 'translate','translateX', 'translateY', 'translateZ', 'scale', 'rotate', 'rotateX', 'rotateY', 'skew', 'matrix3d', 'translate3d', 'scale3d', 'rotate3d', 'perspective'];
    
            
            props.forEach(name => {
                Object.defineProperty(Element, name, {
                    get: function() {
                        return Element.animation.items[name] || false;
                    },
                  
                    set: function(value) {
                        Element.animation.makeString(name, value);
    
                        console.log('set'+Element.animation[name]);
                    }
    
                });
                
            })
        }
    }
    
    onMouseMove(Element, Event){
        var ClientRect = (Element['getBoundingClientRect']) ? Element.getBoundingClientRect() : {width:window.innerWidth, height:window.innerHeight};
            
            this.makeAnimation(
                Event.clientX - ClientRect.width/2, 
                Event.clientY - ClientRect.height/2, 
            );
    }


    makeAnimation(moveX = 0,moveY = 0){

        if(this['onBeforeAnimation']) {
            var newPostion = this.onBeforeAnimation(moveX,moveY);
                moveX = (newPostion) ?  newPostion[0] : moveX;
                moveY = (newPostion) ?  newPostion[1] : moveY;
        };


        this.$elements.forEach(Element => {
            
            var X = (Element.params.ratioX)? moveX/Element.params.ratioX : moveX/this.params.ratioX,
                Y = (Element.params.ratioY)? moveY/Element.params.ratioY : moveY/this.params.ratioY,
                P = {
                    'X': (this.params.reverse || Element.params.reverse) ? (X < 0) ? Math.abs(X) : -X : X,
                    'Y': (this.params.reverse || Element.params.reverse) ? (Y < 0) ? Math.abs(Y) : -Y : Y,
                }


                Element

                console.log(this.mask(P.X, P.Y));

                this.setCss3Styles(0, this.getStyleType(P.X, P.Y));
          })

        if(this['onAfterAnimation']) this.onAfterAnimation(moveX,moveY);
    }

    setCss3Styles(Element, style){

        Element.style['-o-transform'] = style;
        Element.style['-ms-transform'] = style;
        Element.style['-moz-transform'] = style;
        Element.style['-webkit-transform'] = style;
        Element.style['transform'] = style;
    }

    getMask(x, y){

        if(this.mask){

            /*
            Object.keys(this.mask).forEach(key => {
                console.log(this.mask )
            })
            */

            return this.mask(x,y);
        }else{
            return this.getAnimationMask(this.params.type, x, y);
        }
    }
    getAnimationMask(animationType = this.params.type,x,y,z){

        var masks =  {
            matrix: `(1.0, 2.0, 3.0, 4.0, 5.0, 6.0)`,
            translate: `(${x}px, ${y}px)`,
            translateX: `(${x})`,
            translateY: `(${x})`,
            translateZ: `(${x})`,
            scale: `(${x}, ${y})`,
            rotate: `(${x}deg, ${y}deg)`,
            rotateX: `(${x}deg)`,
            rotateY: `(${x}deg)`,
            skew: `(${x}deg, ${y}deg)`,
            matrix3d: `(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`,
            translate3d:`(${x}px, ${y}px, ${z}px)`,
            scale3d: `(2.5, 1.2, 0.3)`,
            rotate3d: `(1, 2.0, 3.0, 10deg)`,
            perspective: `(${x}${y})`,

        }

        return animationType+masks[animationType];
    }

    isMobile(){
        return false;
    }
    inViewport(element, callback = false){

    }
}


const 

createDOMEl = function(type, params, attrs = {}) {
    var el = document.createElement(type);  
        Object.keys(params).map((p) =>  el[p] = params[p]);
        Object.keys(attrs).map((o) => el.setAttribute(o,attrs[o]));
        return el;
},


inViewport = (el) => {
    const scroll = window.scrollY || window.pageYOffset
    const boundsTop = el.getBoundingClientRect().top + scroll

    const viewport = {
        top: scroll,
        bottom: scroll + winsize.height
    }

    const bounds = {
        top: boundsTop,
        bottom: boundsTop + el.clientHeight
    }

    return (
        ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom ) || 
        ( bounds.top <= viewport.bottom && bounds.top >= viewport.top )
    );
},

randNumber  = (min = 0 ,max = 100) => Math.floor(Math.random() * (max - min + 1)) + min,
removeSpace     = (s) => s.toString().replace(/\s/g, ''),
addSpace    = (s) => String(removeSpace(s)).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');

