function CComboBox (iX,iY,oParentContainer){
    var _oContainer;
    var _oSpriteSheet;
    var _oParentContainer;
    
    this.init = function(iX,iY,oParentContainer){
       _oContainer = new createjs.Container();
       _oContainer.x = iX;
       _oContainer.y = iY;
       _oParentContainer = oParentContainer; 
       
       var oSprite = s_oSpriteLibrary.getSprite("balls");
       
       var oData = {
          images: [oSprite],
          frames: {width: BALL_WIDTH_HEIGHT, height: BALL_WIDTH_HEIGHT, regX: BALL_WIDTH_HEIGHT/2, regY: BALL_WIDTH_HEIGHT/2}, 
          animations: {
              gray: [0], black: [1]
          }
       };
       
       _oSpriteSheet = new createjs.SpriteSheet(oData);
       _oParentContainer.addChild(_oContainer);
    };
    
    this.getPosition = function(){
       return{x: _oContainer.x, y: _oContainer.y}; 
    };
    
    this.addBalls = function(iBlackBalls,iGrayBalls){
        var oBall;
        var iBalls = iBlackBalls+iGrayBalls;
       for (var i=0;i<iBalls;i++){
           if (i<iBlackBalls){
                oBall = createSprite(_oSpriteSheet,"black",BALL_WIDTH_HEIGHT/2,BALL_WIDTH_HEIGHT/2,BALL_WIDTH_HEIGHT,BALL_WIDTH_HEIGHT);
           }else{
                oBall = createSprite(_oSpriteSheet,"gray",BALL_WIDTH_HEIGHT/2,BALL_WIDTH_HEIGHT/2,BALL_WIDTH_HEIGHT,BALL_WIDTH_HEIGHT);
           }
            
           if (i < 3){           
                oBall.x = (BALL_WIDTH_HEIGHT + 5) * i+5;
                oBall.y = 0;
           }else if(i===3){
               oBall.x = (BALL_WIDTH_HEIGHT + 5) +5;
               oBall.y = BALL_WIDTH_HEIGHT;
           }else{
               oBall.x = (BALL_WIDTH_HEIGHT + 5) * (i-4) +5;
               oBall.y = BALL_WIDTH_HEIGHT*2;
           }
                _oContainer.addChild(oBall);
          
       }
    };
    
    this.init(iX,iY,oParentContainer);
}