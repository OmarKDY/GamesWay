function CEndPanel(){
    var _oPointText;
    var _oNumWordFoundText;
    var _oLongestWordText;
    var _oBestWordText;
    var _oButExit;
    var _oButRestart;
    var _oGroup;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('gameover_bg'));
        _oGroup.addChild(oBg);
        
        
        
        var oTotScore = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 90, 600, 56, 
                    56, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_TOT_SCORE,
                    true, true, false,
                    false );
                    

        
        _oPointText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 150, 600, 56, 
                    56, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    "0",
                    true, true, false,
                    false );

        
        var oWordFoundText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 230, 600, 32, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_WORD_FOUND,
                    true, true, false,
                    false );
                    
 
        
        _oNumWordFoundText =  new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 260, 600, 32, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    "0",
                    true, true, false,
                    false );
 
        
        var oLongestText =  new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 330, 600, 32, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_LONGEST_WORD,
                    true, true, false,
                    false );
                    

                
        _oLongestWordText =  new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 360, 600, 32, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    "WORD",
                    true, true, false,
                    false );

        
        var oBestText  = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 430, 600, 32, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_BEST_WORD,
                    true, true, false,
                    false );
                    

        
        _oBestWordText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, 460, 600, 32, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );

        
        var oSprite = s_oSpriteLibrary.getSprite('but_home');
        _oButExit = new CGfxButton((CANVAS_WIDTH/2) - 215,CANVAS_HEIGHT - 170,oSprite,_oGroup);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);     
        
        oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _oButRestart = new CGfxButton((CANVAS_WIDTH/2) + 215,CANVAS_HEIGHT - 170,oSprite,_oGroup);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);     
    };
    
    this.unload = function(){
        _oButExit.unload();
    };
    
    this.show = function(iScore,iNumWords,szLongest,szBestWord,iBestScore){
        _oPointText.refreshText(""+iScore);
        _oNumWordFoundText.refreshText(""+iNumWords);
        _oLongestWordText.refreshText(szLongest);
        
        if(szBestWord !== ""){
            _oBestWordText.refreshText(szBestWord +" +"+iBestScore);
        }
        

        _oGroup.visible = true;

        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function(){$(s_oMain).trigger("show_interlevel_ad");});
        
        $(s_oMain).trigger("save_score",[iScore,s_iLangSelected]);		
    };
    
    this._onExit = function(){
        s_oGame.onExit();
    };
    
    this._onRestart = function(){
        s_oGame._init();
    };
    
    this._init();
    
    return this;
}