function CCreditsPanel(){
    var _oListenerDown;
    var _oListenerLogo;
    var _oFade;
    var _oMainContainer;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    var _oPanel;
    
    var _pStartPanelPos;
    
    this._init = function(){
        _oMainContainer = new createjs.Container();        
        s_oStage.addChild(_oMainContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListenerDown = _oFade.on("click",function(){});
        _oFade.alpha = 0;
        _oMainContainer.addChild(_oFade);

        _oPanelContainer = new createjs.Container();     
        _oMainContainer.addChild(_oPanelContainer);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        _oPanel = createBitmap(oSpriteBg);    
        _oListenerLogo = _oPanel.on("click",this._onLogoButRelease);
        _oPanelContainer.addChild(_oPanel);

        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        
        var oTitleOutline = new createjs.Text(TEXT_DEVELOPED," 50px "+FONT, "#410701");
        oTitleOutline.x = oSpriteBg.width/2 + 2;
        oTitleOutline.y = oSpriteBg.height/2-8;
        oTitleOutline.textAlign = "center";
        oTitleOutline.textBaseline = "middle";
        oTitleOutline.lineWidth = 600;
        _oPanelContainer.addChild(oTitleOutline);
        
        var oTitle = new createjs.Text(TEXT_DEVELOPED," 50px "+FONT, "#ffb400");
        oTitle.x = oSpriteBg.width/2;
        oTitle.y = oSpriteBg.height/2-10;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 600;
        _oPanelContainer.addChild(oTitle);

        var oLinkOutline = new createjs.Text("www.codethislab.com"," 40px "+FONT, "#410701");
        oLinkOutline.x = oSpriteBg.width/2;
        oLinkOutline.y = oSpriteBg.height/2+152;
        oLinkOutline.textAlign = "center";
        oLinkOutline.textBaseline = "middle";
        oLinkOutline.lineWidth = 600;
        _oPanelContainer.addChild(oLinkOutline);
        
        var oLink = new createjs.Text("www.codethislab.com"," 40px "+FONT, "#ffb400");
        oLink.x = oSpriteBg.width/2;
        oLink.y = oSpriteBg.height/2+150;
        oLink.textAlign = "center";
        oLink.textBaseline = "middle";
        oLink.lineWidth = 600;
        _oPanelContainer.addChild(oLink);
        
        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        _oLogo.x = oSpriteBg.width/2;
        _oLogo.y = oSpriteBg.height/2+70;
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oPanelContainer.addChild(_oLogo);
      
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(470, 350, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        _oPanelContainer.regX = oSpriteBg.width/2;
        _oPanelContainer.regY = oSpriteBg.height/2;
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = -oSpriteBg.height;
        
        createjs.Tween.get(_oFade).to({alpha: 0.7}, 1000,createjs.Ease.cubicOut);
        createjs.Tween.get(_oPanelContainer).to({y: CANVAS_HEIGHT/2}, 1000,createjs.Ease.bounceOut);
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oMainContainer);

        _oButExit.unload();
        
        _oFade.off("click",_oListenerDown);
        _oPanel.off("click",_oListenerLogo);  
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };

    
    this._init();
    
    
};


