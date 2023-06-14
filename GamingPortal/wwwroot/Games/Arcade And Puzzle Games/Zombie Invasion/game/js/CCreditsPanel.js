function CCreditsPanel(){
    var _oListener;
    var _oListenerLogo;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    
    var _pStartPanelPos;
    
    this._init = function(){
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT/2;  
        _oListener = _oPanelContainer.on("click",function(){});
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};

        var iWidth = 350;
        var iHeight = 40;
        var iTextX = 0;
        var iTextY = -60;
        var oTitle = new CTLText(_oPanelContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    36, "center", "#ffffff", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_DEVELOPED,
                    true, true, true,
                    false );
        
        var iWidth = 350;
        var iHeight = 40;
        var iTextX = 0;
        var iTextY = 70;
        var oLink = new CTLText(_oPanelContainer, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    36, "center", "#ffffff", PRIMARY_FONT, 1,
                    2, 2,
                    "www.codethislab.com",
                    true, true, true,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        _oListenerLogo = _oLogo.on("click",this._onLogoButRelease);
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oPanelContainer.addChild(_oLogo);
      
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(234, -120, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
    };
    
    this.unload = function(){
        
        _oButExit.setClickable(false);

        s_oStage.removeChild(_oPanelContainer);

        _oButExit.unload();

        
        _oLogo.off("click",_oListenerLogo);
        _oPanelContainer.off("click",_oListener);
        
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._init();
    
    
};


