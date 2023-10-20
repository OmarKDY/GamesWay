function CLanguageSelection(){
    var _szLangSelected;
    var _oCurButSelected;
    var _oButPlay;
    var _oMsgTextBack;
    var _oMsgText;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.alpha = 0;
        _oContainer.visible=false;
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_language_selection'));
        _oContainer.addChild(oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_game');
        _oButPlay = new CTextButton(CANVAS_WIDTH/2 ,CANVAS_HEIGHT - 110,oSprite,TEXT_PLAY,FONT_GAME,"#ffffff",52,_oContainer);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oContainer.addChild(_oButPlay.getSprite());
        
        //INIT LANGUAGE TOGGLE
        var iYPos = 182;
        for(var i=0;i<NUM_LANGUAGES;i++){
            if(i === DEFAULT_LANG){
                var oLangToggle = new CToggle(380,iYPos,s_oSpriteLibrary.getSprite('toggle_lang'),true,_oContainer);
                _oCurButSelected = oLangToggle;
                _szLangSelected = window["LABEL_LANG_"+ i];
            }else{
                var oLangToggle = new CToggle(380,iYPos,s_oSpriteLibrary.getSprite('toggle_lang'),false,_oContainer);
            }
            
            oLangToggle.addEventListenerWithParams(ON_MOUSE_UP, this._onLangToggle, this,{index:i,but:oLangToggle});
            
            iYPos += 79;
        }

        _oMsgTextBack = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-248, 82, 500, 60, 
                    70, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_CHOOSE_LANG,
                    true, true, false,
                    false );

        
        _oMsgText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, 80, 500, 60, 
                    70, "center", "#FFCC00", FONT_GAME, 1,
                    0, 0,
                    TEXT_CHOOSE_LANG,
                    true, true, false,
                    false );
    };
    
    this.show = function(){
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1}, 500);
    };
    
    this._onLangToggle = function(oRetParams){
        var oParam = oRetParams.params;

        if(oParam.but === _oCurButSelected){
            _oCurButSelected.setActive(true);
            return;
        }

        var iIndex = oParam.index;
        this.changeLanguage(iIndex);
        
        _oCurButSelected.setActive(false);
        _oCurButSelected = oParam.but;
    };
    
    this.changeLanguage = function(iIndex){
        _szLangSelected = window["LABEL_LANG_"+ iIndex];

        changeLanguage(_szLangSelected);

        _oButPlay.changeText(TEXT_PLAY);
        _oMsgTextBack.refreshText( TEXT_CHOOSE_LANG);
        _oMsgText.refreshText( TEXT_CHOOSE_LANG);
    };
    
    this.startGame = function(){
        s_oMenu.unload();
        s_oMain.setLanguage(_szLangSelected);
    };
    
    this._onButPlayRelease = function(){
        this.startGame();
    };
    
    this._init();
}