function CHelp(iLevel){
    var _iLevel = iLevel ;
    var _oBg;
    var _oGroup;
    var _oHelp;
    
    var _oTitleTextOutline;
    var _oTitleText;
    var _oHelpTextOutline;
    var _oHelpText;
    
    var _oButPlay;
    
    this._init = function(iLevel){        
        _oGroup = new createjs.Container();
        
        //_oGroup.addChild(_oBg,  _oHelp, _oTitleTextOutline, _oTitleText, _oHelpTextOutline, _oHelpText);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        _oBg.x = 0;
        _oBg.y = 0;
        _oGroup.addChild(_oBg);
             
        var oSprite = s_oSpriteLibrary.getSprite('bg_help');
        _oHelp = createBitmap(oSprite);
        _oHelp.x = 0;
        _oHelp.y = 0;
        _oGroup.addChild(_oHelp);
        
        /*
        _oTitleTextOutline = new createjs.Text(TEXT_HELP_TITLE," 50px "+FONT, "#730358");
        _oTitleTextOutline.x = CANVAS_WIDTH/2;
        _oTitleTextOutline.y = (CANVAS_HEIGHT/2-230);
        _oTitleTextOutline.textAlign = "center";
        _oTitleTextOutline.textBaseline = "alphabetic";
        _oTitleTextOutline.outline = 4;
        _oTitleTextOutline.lineWidth = 470;
        
        _oTitleText = new createjs.Text(TEXT_HELP_TITLE," 50px "+FONT, "#ffd800");
        _oTitleText.x = CANVAS_WIDTH/2;
        _oTitleText.y = (CANVAS_HEIGHT/2-230);
        _oTitleText.textAlign = "center";
        _oTitleText.textBaseline = "alphabetic";
        _oTitleText.lineWidth = 470;
        */
       
        var iWidth = oSprite.width-200;
        var iHeight = 50;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2-250);
        var oTitleStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#730358", FONT, 1,
                    2, 2,
                    TEXT_HELP_TITLE,
                    true, true, false,
                    false );
        oTitleStroke.setOutline(4);            
       
        var oTitleText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#ffd800", FONT, 1,
                    2, 2,
                    TEXT_HELP_TITLE,
                    true, true, false,
                    false ); 
       
        var iSize = 38;        
        var iWidth = oSprite.width-200;
        var iHeight = 150;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2+110);
        var oHelpStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#730358", FONT, 1.1,
                    2, 2,
                    TEXT_HELP,
                    true, true, true,
                    false );
        oHelpStroke.setOutline(4);            
       
        var oHelpText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#fff", FONT, 1.1,
                    2, 2,
                    TEXT_HELP,
                    true, true, true,
                    false ); 
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play_small');
        _oButPlay = new CGfxButton((CANVAS_WIDTH/2+195),CANVAS_HEIGHT -230,oSprite, _oGroup);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        _oGroup.alpha = 0;
        s_oStage.addChild(_oGroup);
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {});
    };
    
    
    this._onExit = function(){
        _oButPlay.unload();
        s_oStage.removeChild(_oGroup);
        s_oMain.gotoGame(iLevel, 0);
    };
    
    this._init(iLevel);
    
    return this;
}
