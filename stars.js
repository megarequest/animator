document.addEventListener('DOMContentLoaded', (event)=>{
    var space = document.getElementById('space'),
        maxWidth = window.innerWidth,
        maxHeight = window.innerHeight,
        colors = ['00fdfa','042ac9','4362e6','437ce6','1edbe1','00bbdf','082662'];






    window.AE = new AnimateEngineExt({
        data:{
            mainX:1,
            mainY:1,
            mainZ:1,
            addictZ:1,
        },
        templates:{
            starsPosition:function(params){
                return {
                    'translateZ':`${params.z / (this.addictZ * 2)  }px`,
                    'translateX':`${params.x + (this.mainX / 100 * params.x / 100) }px`,
                    'translateY':`${params.y + (this.mainY / 100 * params.y / 100) }px`,
                }
            },

        },
        mount:function(){


            
            for (let index = 0; index < 1000; index++) {
                var el = document.createElement('div');  
                    el.classList.add('space-stars');




                const starSize = randNumber(1,3),
                    randColor = randNumber(0,colors.length),
                    x = randNumber(0,maxWidth) - starSize,
                    y = randNumber(0,maxHeight) - starSize,
                    z = randNumber(10,1000);


                    el.dataset.x = x;
                    el.dataset.y = y;
                    el.dataset.z = z;



                    el.style.setProperty('--color', "#"+colors[randColor]);
                    el.style.setProperty('--size', starSize + "px");


                    this.setCssProperty(el, 'transform', this.getTemplate('starsPosition', {
                        x:x,
                        y:y,
                        z:z,
                    }));
                

                    space.appendChild(el);
                
            }



            document.getElementById('space').addEventListener('mousemove', Event =>{
                var ClientRect = (Element['getBoundingClientRect']) ? Element.getBoundingClientRect() : {width:window.innerWidth, height:window.innerHeight};

                this.mainX = (Event.clientX - ClientRect.width/2) ;
                this.mainY = (Event.clientY - ClientRect.height/2) ; 

   
            
            });


            var translateZ = 90;

            document.addEventListener("wheel", Event => {

                translateZ += Event.deltaY / 50;
                
                
                if(translateZ < 0){
                    translateZ = 0;
                }

                this.addictZ = translateZ;
                
            });

 

        },
        math:function(){

            window.stars.forEach(Element => {

                this.setCssProperty(Element, 'transform', this.getTemplate('starsPosition', {
                    x:parseInt(Element.dataset.x),
                    y:parseInt(Element.dataset.y),
                    z:parseInt(Element.dataset.z),
                }));
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




    window.stars = document.querySelectorAll('.space-stars');
    
});