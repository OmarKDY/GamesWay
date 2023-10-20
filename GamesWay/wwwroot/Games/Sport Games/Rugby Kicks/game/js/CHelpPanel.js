function CHelpPanel(){
    var _oText1;
    var _oText2;  

    var _oParent;
    var _oFade;
    var _oPanelContainer;

    var _oListener;
    var _pStartPanelPos;

    this._init = function(){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oListener = _oFade.on("mousedown", this._onExitHelp);
        s_oStage.addChild(_oFade);
        
        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;      
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2},500, createjs.Ease.quartIn).call(function(){

        });

        var szMsg = TEXT_HELP1;
        if(s_bMobile){
            szMsg = TEXT_HELP1_MOB;
        }
  
        var oText1Pos = {x: 0, y: -110};
        _oText1 = new CTLText(_oPanelContainer, 
                    oText1Pos.x-200,oText1Pos.y, 400, 52, 
                    26, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    szMsg,
                    true, true, true,
                    false );
                    
         
  
        var _oMcContainer=new createjs.Container();
        _oMcContainer.x = 0;
        _oMcContainer.y = 0;
        _oPanelContainer.addChild(_oMcContainer)

        var oTopBar = s_oSpriteLibrary.getSprite("top_bar");
        var oBar = createBitmap(oTopBar);
        oBar.regX = oTopBar.width/2;
        oBar.regY = oTopBar.height/2;
        _oMcContainer.addChild(oBar);

        var oCursorSprite = s_oSpriteLibrary.getSprite("arrow_bar");
        var oCursor = createBitmap(oCursorSprite);
        oCursor.regX = oCursorSprite.width/2;
        oCursor.regY = oCursorSprite.height;
        oCursor.x = -20;
        _oMcContainer.addChild(oCursor); 
        
        var oArrow = s_oSpriteLibrary.getSprite("arrow");
        var oGreenIndicator1 = createBitmap(oArrow);
        oGreenIndicator1.regX = oArrow.width/2;
        oGreenIndicator1.regY = 5;
        oGreenIndicator1.x = -25;
        _oMcContainer.addChild(oGreenIndicator1);

        var oArrow = s_oSpriteLibrary.getSprite("arrow");
        var oGreenIndicator2 = createBitmap(oArrow);
        oGreenIndicator2.regX = oArrow.width/2;
        oGreenIndicator2.regY = 5;
        oGreenIndicator2.x = 25;
        _oMcContainer.addChild(oGreenIndicator2);
  
        var oText2Pos = {x: -200, y: 30};
  
        _oText2 = new CTLText(_oPanelContainer, 
                    oText2Pos.x,oText2Pos.y, 300, 52, 
                    26, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP2,
                    true, true, true,
                    false );

     
        var szTag = 3;
        var oSprite = s_oSpriteLibrary.getSprite('green_area_'+szTag);
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {off:[0],on:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var _oGreenSprite = new createjs.Sprite(oSpriteSheet);
        _oGreenSprite.gotoAndStop("on");
        _oGreenSprite.x = 160;
        _oGreenSprite.y = 65;
        _oGreenSprite.scaleX = _oGreenSprite.scaleY = 0.8;
        _oPanelContainer.addChild(_oGreenSprite);

        
    };

    this.unload = function(){
        s_oStage.removeChild(_oPanelContainer);
        
        _oFade.off("mousedown",_oListener);
        
        s_oStage.removeChild(_oFade);
    };

    this._onExitHelp = function(){
        
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){

            _oParent.unload();
            s_oGame._onExitHelp();
            
        }); 
    };

    _oParent=this;
    this._init();

}
