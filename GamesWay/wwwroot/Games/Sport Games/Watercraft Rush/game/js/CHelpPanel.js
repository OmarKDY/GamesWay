function CHelpPanel(){
    var _bExitPanel;
    
    var _oText1;
    var _oText1Back;
    var _oText2;
    var _oText2Back;    

    var _oFade;
    var _oPanelContainer;
    var _oParent;

    var _pStartPanelPos;

    this._init = function(){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 1;
        _oFade.on("mousedown",function(){_oParent._onExitHelp()});
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();     
        _oPanelContainer.on("pressup",function(){_oParent._onExitHelp()});
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 - 40},500, createjs.Ease.cubicOut);

        if(s_bMobile){
            var oText1Pos = {x: 0, y: -150};
            
            var iX = oText1Pos.x;
            var iY = oText1Pos.y;
            var iWidth = 500;
            var iHeight = 50;
            _oText1Back = new CTLText(_oPanelContainer, 
                    iX -iWidth/2,iY - iHeight/2, iWidth, iHeight, 
                    24, "center", "#3e240b", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1_MOBILE,
                    true, true, true,
                    false );
            _oText1Back.setOutline(4);
            _oText1 = new CTLText(_oPanelContainer, 
                    iX -iWidth/2,iY - iHeight/2, iWidth, iHeight, 
                    24, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1_MOBILE,
                    true, true, true,
                    false );


            var oSprite = s_oSpriteLibrary.getSprite('key_left');
            var oKeys = createBitmap(oSprite);
            oKeys.x = -170;
            oKeys.y = -60;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);

            var oSprite = s_oSpriteLibrary.getSprite('key_right');
            var oKeys = createBitmap(oSprite);
            oKeys.x = -80;
            oKeys.y = -60;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);
            
            var oSprite = s_oSpriteLibrary.getSprite('key_down');
            var oKeys = createBitmap(oSprite);
            oKeys.x = 80;
            oKeys.y = -60;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);
            
            var oSprite = s_oSpriteLibrary.getSprite('key_up');
            var oKeys = createBitmap(oSprite);
            oKeys.x = 170;
            oKeys.y = -60;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            oKeys.scaleX = oKeys.scaleY = 0.7;
            _oPanelContainer.addChild(oKeys);

            
        }else {
            var oText1Pos = {x: -280, y: -110};
  
            var iX = oText1Pos.x;
            var iY = oText1Pos.y;
            var iWidth = 300;
            var iHeight = 150;
            _oText1Back = new CTLText(_oPanelContainer, 
                    iX,iY - iHeight/2, iWidth, iHeight, 
                    24, "left", "#3e240b", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );
            _oText1Back.setOutline(4);
            _oText1 = new CTLText(_oPanelContainer, 
                    iX,iY - iHeight/2, iWidth, iHeight, 
                    24, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );

           
            var oSprite = s_oSpriteLibrary.getSprite('keys');
            var oKeys = createBitmap(oSprite);
            oKeys.x = 130;
            oKeys.y = -100;
            oKeys.regX = oSprite.width/2;
            oKeys.regY = oSprite.height/2;
            _oPanelContainer.addChild(oKeys);
        }
        
        
  
        var oText2Pos = {x: 80, y:74};
        
        var iX = oText2Pos.x;
        var iY = oText2Pos.y;
        var iWidth = 200;
        var iHeight = 150;
        _oText2Back = new CTLText(_oPanelContainer, 
                iX,iY - iHeight/2, iWidth, iHeight, 
                24, "left", "#3e240b", PRIMARY_FONT, 1,
                0, 0,
                TEXT_HELP2,
                true, true, true,
                false );
        _oText2Back.setOutline(4);
        _oText2 = new CTLText(_oPanelContainer, 
                iX,iY - iHeight/2, iWidth, iHeight, 
                24, "left", "#fff", PRIMARY_FONT, 1,
                0, 0,
                TEXT_HELP2,
                true, true, true,
                false );
        

        var oCarContainer = new createjs.Container();
        oCarContainer.x = -130;
        oCarContainer.y = 130;
        oCarContainer.scaleX = oCarContainer.scaleY = 0.3;
        _oPanelContainer.addChild(oCarContainer);

        var oSprite = s_oSpriteLibrary.getSprite('finish');
        var oFinish = createBitmap(oSprite);
        oFinish.regX = oSprite.width/2;
        oFinish.regY = oSprite.height;
        oFinish.scaleX = oFinish.scaleY = 0.3;
        oCarContainer.addChild(oFinish);
        
        new CPlayer(0,0, oCarContainer, oCarContainer);
    };

    this.unload = function(){
        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oPanelContainer.off("pressup",function(){_oParent._onExitHelp()});
        _oFade.off("pressup",function(){_oParent._onExitHelp()});

    };

    this._onExitHelp = function(){
        if(_bExitPanel){
            return;
        }
        _bExitPanel = true;

        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){

            _oParent.unload();
            s_oGame._onExitHelp();
        });
    };

    _oParent=this;
    this._init();

}
