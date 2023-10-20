function CQuestionAnim(iX,iY,szText1,szText2){
    var _oLeftText;
    var _oCenterText;
    var _oRightText;
    var _oMaskContainer;
    var _oContainerText;
    var _oContainer;
    
    this._init = function(iX,iY,szText1,szText2){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        s_oStage.addChild(_oContainer);
        
        _oContainerText = new createjs.Container();
        _oContainer.addChild(_oContainerText);

        var iWidth = 500;
        var iHeight = 50;
        _oCenterText = new CTLText(_oContainerText, 
                    -iWidth/2, 18 - iHeight/2, iWidth, iHeight, 
                    40, "center", "#FFCC00", FONT_GAME, 1,
                    2, 2,
                    szText1,
                    true, true, true,
                    false );
                    
        var iWidth = 500;
        var iHeight = 50;
        _oRightText = new CTLText(_oContainerText, 
                    530 -iWidth/2, 18 - iHeight/2, iWidth, iHeight, 
                    40, "center", "#FFCC00", FONT_GAME, 1,
                    2, 2,
                    szText2,
                    true, true, true,
                    false );
                    
        var iWidth = 500;
        var iHeight = 50;
        _oLeftText = new CTLText(_oContainerText, 
                    -530 -iWidth/2, 18 - iHeight/2, iWidth, iHeight, 
                    40, "center", "#FFCC00", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
        _oMaskContainer = new createjs.Shape();
        _oMaskContainer.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(-267, -10, 528,50);
        _oContainer.addChild(_oMaskContainer);
        
        _oContainerText.mask = _oMaskContainer;
    };
    
    this.moveRight = function(szTextLeft,szTextCenter){
        _oLeftText.refreshText( szTextLeft );
        _oCenterText.refreshText( szTextCenter );
        
        createjs.Tween.get(_oContainerText).to({x:530}, 1000,createjs.Ease.quartOut).call(function(){
            _oCenterText.refreshText( szTextLeft );
            _oContainerText.x = 0;
        });  
    };
    
    this.moveLeft = function(szTextCenter,szTextRight){
        _oCenterText.refreshText( szTextCenter );
        _oRightText.refreshText( szTextRight );
        
        createjs.Tween.get(_oContainerText).to({x:-530}, 1000,createjs.Ease.quartOut).call(function(){
            _oCenterText.refreshText( szTextRight );
            _oContainerText.x = 0;
        });  
    };
    
    this.hideQuestion = function(){
        _oCenterText.refreshText( "" );
    };
    
    this.showQuestion = function(szText){
        _oCenterText.refreshText( szText );
    };
    
    this.isAvailable = function(){
        return !createjs.Tween.hasActiveTweens(_oContainerText);
    };
    
    this._init(iX,iY,szText1,szText2);
}