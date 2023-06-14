function CEncouragement(iX,iY,szText,oParentContainer){
    var _oContainer;
    var _oTextStroke;
    var _oText;
    var _oParentContainer = oParentContainer;
    
    this._init = function(szText,iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.alpha = 0;
        _oParentContainer.addChild(_oContainer);
        
        _oTextStroke = new createjs.Text(szText," 50px "+FONT_GAME, "#01295b");
        _oTextStroke.textAlign="center";
        _oTextStroke.outline = 3;
        _oContainer.addChild(_oTextStroke);
        
        _oText = new createjs.Text(szText," 50px "+FONT_GAME, "#fff");
        _oText.textAlign="center";
        _oContainer.addChild(_oText);
        
        var oParent = this;
        createjs.Tween.get(_oContainer).to({alpha:1}, 200, createjs.Ease.quadIn).call(function(){oParent.moveUp();});  
    };
	
    this.moveUp = function(){
        var iNewY = _oContainer.y-400;
        var oParent = this;
        createjs.Tween.get(_oContainer).to({y:iNewY}, 1500, createjs.Ease.sineIn).call(function(){oParent.unload();});
        createjs.Tween.get(_oContainer).wait(800).to({alpha:0}, 500);
    };
	
    this.unload = function(){
        _oParentContainer.removeChild(_oText);
    };
	
    this._init(szText,iX,iY);
}