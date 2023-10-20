function CCreditsPanel(){
    var _oListener;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    var _oPanel;
    
    this._init = function(){
        _oPanelContainer = new createjs.Container();   
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oPanel = createBitmap(oSprite);        
        _oPanel.x = CANVAS_WIDTH/2;
        _oPanel.y = CANVAS_HEIGHT/2;
        _oPanel.regX = oSprite.width/2;
        _oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(_oPanel);
        _oListener = _oPanel.on("click",this._onLogoButRelease);

        
        
        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;
        _oLogo.x = CANVAS_WIDTH/2;
        _oLogo.y = CANVAS_HEIGHT/2;
        _oPanelContainer.addChild(_oLogo);
      
      
        var oTitle = new createjs.Text(TEXT_DEVELOPED," 50px "+PRIMARY_FONT, "#ff8814");
        oTitle.x = _oLogo.x;
        oTitle.y = _oLogo.y -80;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "alphabetic";
        _oPanelContainer.addChild(oTitle);

        var oLink = new createjs.Text("www.codethislab.com"," 56px "+PRIMARY_FONT, "#ff8814");
        oLink.x = _oLogo.x;
        oLink.y = _oLogo.y + 86;
        oLink.textAlign = "center";
        oLink.textBaseline = "middle";
        oLink.lineWidth = 300;
        _oPanelContainer.addChild(oLink);
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(1500, 200, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        
        _oPanelContainer.alpha = 0;
        createjs.Tween.get(_oPanelContainer).to({alpha:1},400, createjs.Ease.cubicOut);
    };
    
    this.unload = function(){
        createjs.Tween.get(_oPanelContainer).to({alpha:0},400, createjs.Ease.cubicOut).call(function(){
            s_oStage.removeChild(_oPanelContainer);

            _oButExit.unload();
        }); 

        _oPanel.off("mousedown",_oListener);  
    };
    
    this._onLogoButRelease = function(){
        window.open("http://www.codethislab.com/index.php?&l=en");
    };
    
    this._init();
    
    
};


