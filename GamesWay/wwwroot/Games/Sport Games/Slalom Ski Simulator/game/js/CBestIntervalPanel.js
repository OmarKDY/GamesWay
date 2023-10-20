function CBestIntervalPanel(iX,iY,oSprite,oParentContainer){
    var _iStartY = iY;
    var _iFinalY;
    var _iHeight;
    
    var _oNumText;
    var _oIntervalText;
    var _oPanel;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY,oSprite){
        _iHeight = oSprite.height;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height}, 
                        animations: {state_green:[0],state_red:[1]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _oPanel = createSprite(oSpriteSheet,"state_red",0,0,oSprite.width/2,oSprite.height);
        _oContainer.addChild(_oPanel);
        
        
        _oNumText = new createjs.Text("","34px "+FONT_GAME, "#fff");
        _oNumText.x = 20;
        _oNumText.y = 32;
        _oNumText.textBaseline = "alphabetic";
        _oNumText.textAlign = "center";
        _oContainer.addChild(_oNumText);
        
        _oIntervalText = new createjs.Text("","28px "+FONT_GAME, "#fff");
        _oIntervalText.x = 60;
        _oIntervalText.y = 32;
        _oIntervalText.textBaseline = "alphabetic";
        _oIntervalText.textAlign = "left";
        _oContainer.addChild(_oIntervalText);
    };
    
    this.setMask = function(oMask){
        _oContainer.mask = oMask;
    };
    
    this.reset = function(){
        _oContainer.y = _iStartY;
    };
    
    this.show = function(iNum,iDiff){
        _iFinalY =_iStartY + (_iHeight*iNum);
        
        var szTime = formatTime(Math.abs(iDiff),true,3);
        if(iDiff > 0){
            szTime = "+"+szTime;
            _oPanel.gotoAndStop("state_red");
        }else{
            szTime = "-"+szTime;
            _oPanel.gotoAndStop("state_green");
        }

        
        _oNumText.text = iNum;
        _oIntervalText.text = szTime;

        createjs.Tween.get(_oContainer).to({y:_iFinalY}, 300, createjs.Ease.quartOut);
    };
    
    this._init(iX,iY,oSprite);
}