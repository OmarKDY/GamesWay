function CCreditsPanel(){
    
    var _oFade;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    
    var _pStartPanelPos;
    
    this._init = function(){
        _oPanelContainer = new createjs.Container(); 
        _oPanelContainer.alpha = 0;
        s_oStage.addChild(_oPanelContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.on("mousedown",function(){});
        _oFade.alpha = 0.7;
        _oPanelContainer.addChild(_oFade);
        
        createjs.Tween.get(_oPanelContainer).to({alpha:1},150, createjs.quartOut);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        oPanel.x = CANVAS_WIDTH/2;
        oPanel.y = CANVAS_HEIGHT/2;
        _oPanelContainer.addChild(oPanel);
        
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};

        
        var oTitleStroke = new createjs.Text(TEXT_DEVELOPED,"50px "+FONT_GAME, TEXT_COLOR_STROKE);
        oTitleStroke.x = CANVAS_WIDTH/2;
        oTitleStroke.y = CANVAS_HEIGHT/2 - 70;
        oTitleStroke.textAlign = "center";
        oTitleStroke.textBaseline = "middle";
        oTitleStroke.lineWidth = 500;
        oTitleStroke.outline = 3;
        _oPanelContainer.addChild(oTitleStroke);

        var oTitle = new createjs.Text(oTitleStroke.text,"50px "+FONT_GAME, TEXT_COLOR);
        oTitle.x = oTitleStroke.x
        oTitle.y = oTitleStroke.y
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 500;
        _oPanelContainer.addChild(oTitle);
        
        var oLinkStroke = new createjs.Text("www.codethislab.com"," 50px "+FONT_GAME, TEXT_COLOR_STROKE);
        oLinkStroke.x = CANVAS_WIDTH/2;
        oLinkStroke.y = CANVAS_HEIGHT/2+80;
        oLinkStroke.textAlign = "center";
        oLinkStroke.textBaseline = "middle";
        oLinkStroke.lineWidth = 300;
        oLinkStroke.outline = 3;
        _oPanelContainer.addChild(oLinkStroke);

        var oLink = new createjs.Text(oLinkStroke.text," 50px "+FONT_GAME, TEXT_COLOR);
        oLink.x = oLinkStroke.x;
        oLink.y = oLinkStroke.y;
        oLink.textAlign = "center";
        oLink.textBaseline = "middle";
        oLink.lineWidth = 300;
        _oPanelContainer.addChild(oLink);
        
        var oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oLogo = createBitmap(oSprite);
        _oLogo.on("click",this._onLogoButRelease);
        _oLogo.x = CANVAS_WIDTH/2;
        _oLogo.y = CANVAS_HEIGHT/2;
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oPanelContainer.addChild(_oLogo);
      
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(962, 186, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
    };
    
    this.unload = function(){

        s_oStage.removeChild(_oPanelContainer);

        _oButExit.unload();

        _oFade.removeAllEventListeners();
        _oLogo.removeAllEventListeners();
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._onMoreGamesReleased = function(){
        window.open("http://codecanyon.net/collections/5409142-games");
    };
    
    this._init();
    
    
};


