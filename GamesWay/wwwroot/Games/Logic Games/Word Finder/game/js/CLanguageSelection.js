function CLanguageSelection(){
    var _aToggles;
    var _pStartPosPlay;
    var _oListener;
    
    var _oBg;
    var _oCurButSelected;
    var _oButPlay;
    var _oMsgText;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.alpha = 0;
        _oContainer.visible=false;
        s_oStage.addChild(_oContainer);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_language_selection'));
        _oListener = _oBg.on("click",function(){});
        _oContainer.addChild(_oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _pStartPosPlay = {x:CANVAS_WIDTH - 10 - (oSprite.width*0.5)/2,y:CANVAS_HEIGHT - 10 - (oSprite.height*0.5)/2};
        _oButPlay = new CGfxButton(_pStartPosPlay.x ,_pStartPosPlay.y,oSprite,_oContainer);
        _oButPlay.setScale(0.5);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        
        //INIT LANGUAGE TOGGLE
        var iYPos = 182;
        _aToggles = new Array();
        for(var i=0;i<NUM_LANGUAGES;i++){
            if(i === 0){
                
                var oLangToggle = new CToggle(380,iYPos,s_oSpriteLibrary.getSprite('toggle_lang'),true,_oContainer);
                _oCurButSelected = oLangToggle;
            }else{
                var oLangToggle = new CToggle(380,iYPos,s_oSpriteLibrary.getSprite('toggle_lang'),false,_oContainer);
            }
            _aToggles.push(oLangToggle);
            
            oLangToggle.addEventListenerWithParams(ON_MOUSE_UP, this._onLangToggle, this,{index:i,but:oLangToggle});
            
            iYPos += 79;
        }
        
        _oMsgText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-400, 66, 800, 60, 
                    60, "center", "#55bcff", FONT_GAME, 1,
                    0, 0,
                    TEXT_CHOOSE_LANG,
                    true, true, false,
                    false );

    };
    
    this.unload = function(){
        _oBg.off("click",_oListener);
        
         for(var i=0;i<_aToggles.length;i++){
             _aToggles[i].unload();
         }
         
         _oButPlay.unload();
    };
    
    this.show = function(){
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1}, 500);
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButPlay.setPosition(_pStartPosPlay.x - iNewX,_pStartPosPlay.y - iNewY);
    };
    
    this._onLangToggle = function(oRetParams){
        if(oRetParams.but === _oCurButSelected){
            _oCurButSelected.setActive(true);
            return;
        }

        var iIndex = oRetParams.index;

        _oCurButSelected.setActive(false);
        s_iLangSelected = window["LABEL_LANG_"+ iIndex];

        _oCurButSelected = oRetParams.but;

        changeLanguage();
        
        _oMsgText.text = TEXT_CHOOSE_LANG;
    };
    
    this._onButPlayRelease = function(){
        changeLanguage();
        s_oMenu.unload();
        s_oMain.setLanguage();
    };
    
    this._init();
}