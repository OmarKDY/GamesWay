function CLanguagePanel(){
    var _aLangButs;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_selection'));
        _oContainer.addChild(oBg);
        
        var oText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-400, 24, 800, 160, 
                    80, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_CHOOSE_LANGUAGE,
                    true, true, true,
                    false );

        
        _aLangButs = new Array();
        var aPos = [{x:CANVAS_WIDTH/2 - 350,y:300},{x:CANVAS_WIDTH/2,y:300},{x:CANVAS_WIDTH/2 + 350,y:300},
                    {x:CANVAS_WIDTH/2 - 350,y:600},{x:CANVAS_WIDTH/2,y:600},{x:CANVAS_WIDTH/2 + 350,y:600}]
        for(var i=0;i<NUM_LANGUAGES;i++){
            var oBut = new CGfxButton(aPos[i].x,aPos[i].y,s_oSpriteLibrary.getSprite("but_lang_"+i),_oContainer);
            oBut.addEventListenerWithParams(ON_MOUSE_UP,this._onChooseLang,this,i);
            
            _aLangButs.push(oBut);
        }

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,_oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:(oSprite.height/2)+ 10, y:(oSprite.height/2) + 10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        _oContainer.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 1000).call(function(){oFade.visible = false;});  
        
        this.refreshButtonPos();
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }   
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this.unload = function(){
        for(var i=0;i<NUM_LANGUAGES;i++){
            _aLangButs[i].unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oStage.removeAllChildren();
        
        s_oLanguagePanel = null;
    };

    this._onChooseLang = function(iLang){
        s_oLanguagePanel.unload();
        s_oMain.selectLanguage(iLang);
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    s_oLanguagePanel = this;
    this._init();
}

var s_oLanguagePanel = null;