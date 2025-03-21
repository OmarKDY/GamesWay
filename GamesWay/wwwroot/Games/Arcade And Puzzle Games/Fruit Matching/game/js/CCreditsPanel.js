function CCreditsPanel(){
    
    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    
    var _oHitArea;
    var _oContainer;
    var _oLink;
    var _oListener;
    
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('pause_panel'));
        _oContainer.addChild(_oBg);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);
                
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(440, 300, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        var oMsgOutlineText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "30px " + PRIMARY_FONT, "#ff0000");
        oMsgOutlineText.textAlign = "center";
        oMsgOutlineText.textBaseline = "alphabetic";
        oMsgOutlineText.x = CANVAS_WIDTH/2;
        oMsgOutlineText.y = 410;
        oMsgOutlineText.outline = 4;
        _oContainer.addChild(oMsgOutlineText);
        
        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "30px " + PRIMARY_FONT, "#ffffff");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = 410;
        _oContainer.addChild(_oMsgText);
		
        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width/2;
        _oButLogo.regY = oSprite.height/2;
        _oButLogo.x = CANVAS_WIDTH/2;
        _oButLogo.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oButLogo);
        
        var oLinkOutline = new createjs.Text("www.codethislab.com", "24px " + PRIMARY_FONT, "#ff0000");
        oLinkOutline.textAlign = "center";
        oLinkOutline.textBaseline = "alphabetic";
	oLinkOutline.x = CANVAS_WIDTH/2;
        oLinkOutline.y = 560;
        oLinkOutline.outline = 4;
        _oContainer.addChild(oLinkOutline);
        
        _oLink = new createjs.Text("www.codethislab.com", "24px " + PRIMARY_FONT, "#ffffff");
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
	_oLink.x = CANVAS_WIDTH/2;
        _oLink.y = 560;
        _oContainer.addChild(_oLink);

    };

    
    this.unload = function(){
        _oHitArea.off("click", _oListener);
        
        _oButExit.unload(); 
        _oButExit = null;

        s_oStage.removeChild(_oContainer);
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._init();
    
    
};


