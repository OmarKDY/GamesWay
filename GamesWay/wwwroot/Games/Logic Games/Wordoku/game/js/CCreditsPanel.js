function CCreditsPanel(){
    var _oListener;
    var _oListenerLogo;
    var _oFade;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    var _oPanel;
    
    var _pStartPanelPos;
    
    this._init = function(){

        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('credit_bg');
        _oPanel = createBitmap(oSprite);        
        _oPanel.regX = oSprite.width/2;
        _oPanel.regY = oSprite.height/2;
        _oListener = _oPanel.on("click", function(){});
        _oPanelContainer.addChild(_oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};

        
        var oLinkStroke = new createjs.Text("www.codethislab.com","60px "+PRIMARY_FONT, "#ffffff");
        oLinkStroke.y = 200;
        oLinkStroke.textAlign = "center";
        oLinkStroke.textBaseline = "middle";
        oLinkStroke.lineWidth = 600;
        oLinkStroke.outline = 5;

        var oLink = new createjs.Text("www.codethislab.com","60px "+PRIMARY_FONT, "#ffffff");
        oLink.y = oLinkStroke.y;
        oLink.textAlign = "center";
        oLink.textBaseline = "middle";
        oLink.lineWidth = 600;
        _oPanelContainer.addChild(oLink);
        
        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        _oListenerLogo = _oLogo.on("click",this._onLogoButRelease);
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oPanelContainer.addChild(_oLogo);
      
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(371, -184, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
    };
    
    this.unload = function(){

        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oButExit.unload();

        _oLogo.off("click",_oListenerLogo);
        _oPanel.off("click", _oListener);
        
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };

    
    this._init();
    
    
};


