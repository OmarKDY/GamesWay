function CConfigPanel(){

    var _oBg;
    var _oAudioToggle = null;
    var _oTextAudio;
    var _oButExit;
    
    var _oCountToggle;
    var _oTextCount;

    this._init = function(){

        s_oGame.pauseGame(true);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oBg.on("mousedown", function(){});
        s_oStage.addChild(_oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(993, 640, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon_big');
            _oAudioToggle = new CToggle(350,860,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this); 
            
            var iWidth = 550;
            var iHeight = 190;
            var iTextX = 460;
            var iTextY = 860;
            _oTextAudio = new CTLText(s_oStage, 
                        iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                        60, "left", "#fff", PRIMARY_FONT, 1,
                        2, 2,
                        TEXT_AUDIO,
                        true, true, true,
                        false );
            
            var oSprite = s_oSpriteLibrary.getSprite('but_flip');
            _oCountToggle = new CToggle(350,1130,oSprite,s_bShowFlip,s_oStage);
            _oCountToggle.addEventListener(ON_MOUSE_UP, this._onShowNumFlip, this); 

            var iWidth = 550;
            var iHeight = 190;
            var iTextX = 460;
            var iTextY = 1130;
            _oTextCount = new CTLText(s_oStage, 
                        iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                        60, "left", "#fff", PRIMARY_FONT, 1,
                        2, 2,
                        TEXT_COUNT,
                        true, true, true,
                        false );
           
            
        }  else {
            
            var oSprite = s_oSpriteLibrary.getSprite('but_flip');
            _oCountToggle = new CToggle(350,860,oSprite, s_bShowFlip,s_oStage);
            _oCountToggle.addEventListener(ON_MOUSE_UP, this._onShowNumFlip, this); 

            var iWidth = 550;
            var iHeight = 190;
            var iTextX = 460;
            var iTextY = 860;
            _oTextCount = new CTLText(s_oStage, 
                        iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                        60, "left", "#fff", PRIMARY_FONT, 1,
                        2, 2,
                        TEXT_COUNT,
                        true, true, true,
                        false );
        }
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oTextCount.getText());
        s_oStage.removeChild(_oBg);
        _oButExit.unload();
        _oCountToggle.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            s_oStage.removeChild(_oTextAudio.getText());
            _oAudioToggle.unload();
        }
        
        s_oGame.pauseGame(false);
        
        _oBg.removeAllEventListeners();
    };
    
    this._onExit = function(){
        this.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onShowNumFlip = function(){
        s_bShowFlip = !s_bShowFlip;
        s_oGame.setShowNumFlip();
    };
    
    this._init();
    
};

