document.addEventListener('DOMContentLoaded', (event)=>{
    window.AE = new AnimateEngineExt({
        data:{
            mainX:0,
            mainY:0,
            mainZ:500,
            addictZ:90,
        },
        selectors:{
            gallery:document.querySelector('.gallery-line'),
        },
        templates:{
            css3Transition:function(){
                return {
                    'translateX':'-50%',
                    'translateY':'-50%',
                    'perspective':`500px`,
                    'rotateX':`${this.mainY}deg`,
                    'rotateY':((this.mainX<0)?Math.abs(this.mainX):-this.mainX) + 'deg',
                }
            },
            css3TransitionAddicts:function(z){
                return {
                    'translateZ':`${z || this.addictZ}px`,
                    'translateX':`${-this.mainX * 3}px`,
                    'translateY':`${-this.mainY * 3}px`,
                }
            },
            css3TransitionCentered:function(z){
                return {
                    'translateZ':`${this.addictZ * 2}px`,
                    'translateX':`calc(${-this.mainX * 10}px - 50%)`,
                    'translateY':`calc(${-this.mainY * 10}px - 50%)`,
                    
                }

            },
        },
        mount:function(){

            document.addEventListener('mousemove', Event =>{
                var ClientRect = (Element['getBoundingClientRect']) ? Element.getBoundingClientRect() : {width:window.innerWidth, height:window.innerHeight};

                this.mainX = (Event.clientX - ClientRect.width/2) / 40;
                this.mainY = (Event.clientY - ClientRect.height/2) / 40; 
            });


            var translateZ = 90;

            this.$gallery.addEventListener("wheel", Event => {

                translateZ += Event.deltaY / 50;
                
                
                if(translateZ < 0){
                    translateZ = 0;
                }

                this.addictZ = translateZ;
                
            });

        },
        math:function(){


            this.setCssProperty(this.$gallery, 'transform', this.getTemplate('css3Transition'));

            document.querySelectorAll('.image-item').forEach(Element => {
                this.setCssProperty(Element, 'transform', this.getTemplate('css3TransitionAddicts'));
            });

            document.querySelectorAll('.center-image').forEach(Element => {
                this.setCssProperty(Element, 'transform', this.getTemplate('css3TransitionCentered'));
            });


  

        },
        on:{
            reset:function(){

                this.mainX = 0;
                this.mainY = 0;
                this.mainZ = 500;
                this.addictZ = 90;

                return this;
            },
            beforeMount:function(){

            }
        }
    });
    
});

