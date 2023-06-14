function CCreditsPanel(){
    var _oListener;
    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    
    var _oHitArea;
    
    var _oLink;
    
    var _pStartPosExit;
    
    this._init = function(){
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", this._onLogoButRelease);
        s_oStage.addChild(_oHitArea);
                
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height / 2) - PADDING, y: (oSprite.height / 2) + PADDING};
        _oButExit = new CGfxButton(s_oStage,_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
       
        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "60px " + PRIMARY_FONT, "#ff21fe");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
	    _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = CANVAS_HEIGHT/2-180+60;
	    s_oStage.addChild(_oMsgText);
		
        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width/2;
        _oButLogo.regY = oSprite.height/2;
        _oButLogo.x = CANVAS_WIDTH/2;
        _oButLogo.y = CANVAS_HEIGHT/2;
        s_oStage.addChild(_oButLogo);
        
        _oLink = new createjs.Text("www.codethislab.com", "60px " + PRIMARY_FONT, "#ff21fe");
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
	    _oLink.x = CANVAS_WIDTH/2;
        _oLink.y = CANVAS_HEIGHT/2+180;
        s_oStage.addChild(_oLink);
		
		this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
	
	this.refreshButtonPos = function (iNewX, iNewY) {
		_oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
    };
    
    this.unload = function(){
        _oHitArea.off("click", _oListener);
        
        _oButExit.unload(); 
        _oButExit = null;

        s_oStage.removeChild(_oBg);
        s_oStage.removeChild(_oButLogo);
        s_oStage.removeChild(_oHitArea);
        s_oStage.removeChild(_oLink);
        s_oStage.removeChild(_oMsgText);

        s_oMenu.exitFromCredits();
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._init();
    
    
};


