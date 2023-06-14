function CSolutionWord(iX,iY,szWord,oSpriteBg,oParentContainer){
    var _bShown;
    var _aTexts;
    var _aBg;
    
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(iXPos,iYPos,szWord,oSpriteBg){
        _bShown = false;
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild(_oContainer);
        
        var iX = 0;
        _aTexts = new Array();
        _aBg = new Array();
        for(var i=0;i<szWord.length;i++){
            var szChar = szWord.charAt(i);
            
            var oData = {   
                        images: [oSpriteBg], 
                        // width, height & registration point of each sprite
                        frames: {width: oSpriteBg.width/3, height: oSpriteBg.height, regX: (oSpriteBg.width/2)/3, regY: oSpriteBg.height/2}, 
                        animations: {state_0:[0,0],state_1:[1,1],state_2:[2,2]}
                   };
                   
            var oSpriteSheet = new createjs.SpriteSheet(oData);
        
            var oBg = createSprite(oSpriteSheet,"state_0",(oSpriteBg.width/2)/3,oSpriteBg.height/2,oSpriteBg.width/3,oSpriteBg.height);
            oBg.x = iX;
            _oContainer.addChild(oBg);
            
            _aBg.push(oBg);
           
            var oText = new createjs.Text(szChar.toUpperCase(),"20px "+PRIMARY_FONT, "#007eff");
            oText.textAlign = "center";
            oText.textBaseline = "middle";   
            oText.x = iX;
            oText.y = 0;
            oText.visible = false;
            _oContainer.addChild(oText);
            
            _aTexts.push(oText);
            
            iX+= oSpriteBg.width/3+2;
        }
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.show = function(){
        for(var i=0;i<_aBg.length;i++){
            createjs.Tween.get(_aBg[i]).to({scaleX: 0.05}, 500,createjs.Ease.cubicIn).to({scaleX: 1}, 500,createjs.Ease.cubicOut);
            _aTexts[i].visible = true;
            _aTexts[i].alpha = 0;
            _aTexts[i].scaleX = 0.05;
            createjs.Tween.get(_aTexts[i]).wait(500).to({scaleX:1,alpha:1}, 500,createjs.Ease.cubicOut);
        }
        
        _bShown = true;
    };
    
    this.changeColorText = function(szColor){
        for(var i=0;i<_aTexts.length;i++){
            _aTexts[i].color = szColor;
        }
    };
    
    this.changeBg = function(iState){
        for(var i=0;i<_aBg.length;i++){
            _aBg[i].gotoAndStop("state_"+iState);
        }
        
    };
    
    this.isGuessed = function(){
        return _bShown;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY,szWord,oSpriteBg);
}