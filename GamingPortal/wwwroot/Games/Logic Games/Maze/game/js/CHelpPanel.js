function CHelpPanel(){
    var _oText1;
    var _oText2;
    var _oText3;
    var _oHelpBg;
    var _oGroup;
    var _oFade;
    var _oImageHand;
    var _oImagePress;
    var _oImageKeys;

    this._init = function(){
        
        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;}); 

        var _oShadow = new createjs.Shape();
        _oShadow.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oShadow.alpha = 0.7;
        _oGroup.addChild(_oShadow);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oHelpBg = createBitmap(oSprite);
        _oHelpBg.regX = 570/2;
        _oHelpBg.regY = 575/2;
        _oHelpBg.x = CANVAS_WIDTH/2;
        _oHelpBg.y = CANVAS_HEIGHT/2;
        _oGroup.addChild(_oHelpBg);
        
        var pTextPos = {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2};        

        var iWidth = 500;
        var iHeight = 80;
        var iTextX = pTextPos.x;
        var iTextY = pTextPos.y - 60;
        _oText1 = new CTLText(_oGroup, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    32, "center", "#FFFFFF", PRIMARY_FONT, 1,
                    2, 2,
                    " ",
                    true, true, true,
                    false );
        _oText1.setShadow("#000000", 2, 2, 5);       

       
        var iWidth = 500;
        var iHeight = 80;
        var iTextX = pTextPos.x;
        var iTextY = pTextPos.y;
        _oText2 = new CTLText(_oGroup, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    32, "center", "#FFFFFF", PRIMARY_FONT, 1,
                    2, 2,
                    " ",
                    true, true, true,
                    false );
        _oText2.setShadow("#000000", 2, 2, 5);   


        var iWidth = 500;
        var iHeight = 80;
        var iTextX = pTextPos.x;
        var iTextY = pTextPos.y + 110;
        _oText3 = new CTLText(_oGroup, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    32, "center", "#FFFFFF", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        _oText3.setShadow("#000000", 2, 2, 5);   

        
        if(s_bMobile=== false){
            // A "keyboard" icon
            var oImageKeys = s_oSpriteLibrary.getSprite('keyboard');
            _oImageKeys = createBitmap(oImageKeys);
            _oImageKeys.regX = 172;
            _oImageKeys.regY = 125;
            _oImageKeys.x = pTextPos.x;
            _oImageKeys.y = pTextPos.y - 130;
            _oImageKeys.scaleX = _oImageKeys.scaleY = 0.5;
            _oGroup.addChild(_oImageKeys);

            _oText2.refreshText( TEXT_HELP );
        } else {
            // A "touch hand" icon
            var oPressHand = s_oSpriteLibrary.getSprite('press_hand');
            _oImagePress = createBitmap(oPressHand);
            _oImagePress.x = pTextPos.x - 220;
            _oImagePress.y = pTextPos.y - 220;
            createjs.Tween.get(_oImagePress, {loop:true}).to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.Linear).to({scaleX: 0.85, scaleY: 0.85}, 500, createjs.Ease.Linear);
            _oGroup.addChild(_oImagePress);
            
            // A "drag hand" icon
            var oTouchHand = s_oSpriteLibrary.getSprite('touch_hand');
            _oImageHand = createBitmap(oTouchHand);
            _oImageHand.x = pTextPos.x - 150;
            _oImageHand.y = pTextPos.y - 220;
            createjs.Tween.get(_oImageHand, {loop:true}).to({x:_oImageHand.x+310}, 2500, createjs.Ease.cubicIn).to({x:pTextPos.x - 150}, 1000, createjs.Ease.cubicIn);
            _oGroup.addChild(_oImageHand);

            _oText1.refreshText( TEXT_HELP_MOB1 );
            _oText1.lineWidth = 440;
            _oText1.textAlign = "center";
            _oText1.setX( pTextPos.x );

            _oText2.refreshText( TEXT_HELP_MOB2 );
            _oText2.lineWidth = 440;
            _oText2.textAlign = "center";
            _oText2.setX( pTextPos.x );
            _oText2.setY( pTextPos.y + 30 );

            _oText3.setY( pTextPos.y + 130 );
        }
        
        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExitHelp()});
        s_oGame._bDisableEvents = true;
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);
        s_oGame._bDisableEvents = false;
        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onExitHelp = function(){
        this.unload();
        s_oGame._onExitHelp();
    };

    this._init();

}