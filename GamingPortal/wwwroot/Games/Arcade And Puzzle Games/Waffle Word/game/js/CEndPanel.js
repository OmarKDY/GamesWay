function CEndPanel(){
    var _oPointText;
    var _oNumWordFoundText;
    var _oLongestWordText;
    var _oBestWordText;
    var _oButExit;
    var _oGroup;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('gameover_bg'));
        _oGroup.addChild(oBg);
        
        var oTotScoreBack = new CTLText(_oGroup, 
                    402, 132, 480, 70, 
                    64, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_TOT_SCORE,
                    true, true, true,
                    false );
                    
        var oTotScore = new CTLText(_oGroup, 
                    400, 130, 480, 70, 
                    64, "center", "#FFCC00", FONT_GAME, 1,
                    0, 0,
                    TEXT_TOT_SCORE,
                    true, true, true,
                    false );
                    
                    
        _oPointText = new createjs.Text("0","64px "+FONT_GAME, "#fff");
        _oPointText.x = 640;
        _oPointText.y = 240; 
        _oPointText.textAlign = "center";
        _oPointText.textBaseline = "alphabetic";
        _oPointText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oGroup.addChild(_oPointText);
        
        var oWordFoundTextBack = new CTLText(_oGroup, 
                    402, 302, 480, 50, 
                    64, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_WORD_FOUND,
                    true, true, true,
                    false );
                    
        var oWordFoundText = new CTLText(_oGroup, 
                    400, 300, 480, 50, 
                    64, "center", "#FFCC00", FONT_GAME, 1,
                    0, 0,
                    TEXT_WORD_FOUND,
                    true, true, true,
                    false );
        
        _oNumWordFoundText = new createjs.Text("0","40px "+FONT_GAME, "#fff");
        _oNumWordFoundText.x = 640;
        _oNumWordFoundText.y = 380; 
        _oNumWordFoundText.textAlign = "center";
        _oNumWordFoundText.textBaseline = "alphabetic";
        _oNumWordFoundText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oGroup.addChild(_oNumWordFoundText);
        
        var oLongestTextBack = new CTLText(_oGroup, 
                    402, 402, 480, 50, 
                    64, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_LONGEST_WORD,
                    true, true, true,
                    false );
                    

        var oLongestText = new CTLText(_oGroup, 
                    400, 400, 480, 50, 
                    64, "center", "#FFCC00", FONT_GAME, 1,
                    0, 0,
                    TEXT_LONGEST_WORD,
                    true, true, true,
                    false );
                    
        _oLongestWordText = new createjs.Text("WORD","40px "+FONT_GAME, "#fff");
        _oLongestWordText.x = 640;
        _oLongestWordText.y = 480; 
        _oLongestWordText.textAlign = "center";
        _oLongestWordText.textBaseline = "alphabetic";
        _oLongestWordText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oGroup.addChild(_oLongestWordText);
        
        var oBestTextBack  = new CTLText(_oGroup, 
                    402, 507, 480, 50, 
                    64, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_BEST_WORD,
                    true, true, true,
                    false );      
                    
        var oBestText  = new CTLText(_oGroup, 
                    400, 505, 480, 50, 
                    64, "center", "#FFCC00", FONT_GAME, 1,
                    0, 0,
                    TEXT_BEST_WORD,
                    true, true, true,
                    false );
                    
              
        
        _oBestWordText = new createjs.Text("","40px "+FONT_GAME, "#fff");
        _oBestWordText.x = 640;
        _oBestWordText.y = 590; 
        _oBestWordText.textAlign = "center";
        _oBestWordText.textBaseline = "alphabetic";
        _oBestWordText.shadow = new createjs.Shadow("#000", 2, 2, 2);
        _oGroup.addChild(_oBestWordText);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_game');
        _oButExit = new CTextButton((CANVAS_WIDTH/2) - 160,CANVAS_HEIGHT - 110,oSprite,TEXT_EXIT,FONT_GAME,"#ffffff",52,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);      
    };
    
    this.unload = function(){
        _oButExit.unload();
    };
    
    this.show = function(iScore,iNumWords,szLongest,szBestWord,iBestScore){
        _oPointText.text=""+iScore;
        _oNumWordFoundText.text=""+iNumWords;
        _oLongestWordText.text=szLongest;
        
        if(szBestWord !== ""){
            _oBestWordText.text=szBestWord +" +"+iBestScore;
        }
        

        _oGroup.visible = true;

        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function(){$(s_oMain).trigger("show_interlevel_ad");});
        
        $(s_oMain).trigger("save_score",[iScore,s_szLangSelected]);		
    };
    
    this._onExit = function(){
        s_oGame.onExit();
    };
    
    this._init();
    
    return this;
}