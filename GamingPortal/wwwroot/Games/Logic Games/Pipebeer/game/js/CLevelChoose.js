function CLevelChoose(){
    var _aLevels = new Array();
    var _aLevelNum;
    
    var _bNumActive;
    
    var _oModeNumOff;
    var _oModeNumOn;
    var _oLevelSettings;
    var _oBg;
    var _oFade;
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    this._init = function(){  
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_level_select'));
        s_oStage.addChild(_oBg);
        
        _oLevelSettings = new CLevelSettings();
        _aLevelNum = _oLevelSettings.getNumLevels();
        
        _bNumActive = false;
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('bg_help');
        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width/2 + 20;
        _oBg.regY = oSpriteMsgBox.height/2;
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        s_oStage.addChild(_oBg);
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        var iWidth = oSpriteMsgBox.width-150;
        var iHeight = 50;
        var iX = CANVAS_WIDTH/2 -20;
        var iY = 248;
        var oTitleStroke = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_SELECT_LEVEL,
                    true, true, false,
                    false );
        oTitleStroke.setOutline(5);           
        var oTitle = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_SELECT_LEVEL,
                    true, true, false,
                    false );
       
        var oModePos = {x: CANVAS_WIDTH_HALF - 20, y: 270};
        
        var offset_x = 0;
        var offset_y = 50;

        for(var i = 0; i < _aLevelNum; i++, offset_x += 100 ){
            if(offset_x > 400){
                offset_x = 0;
                offset_y += 100;
            }

            if( i < s_iLastLevel){
                _aLevels.push(new CLevelBut((oModePos.x - 200)+offset_x,oModePos.y+offset_y, s_oSpriteLibrary.getSprite('level_sprite'),true,i+1));
            }else{
                _aLevels.push(new CLevelBut((oModePos.x - 200)+offset_x,oModePos.y+offset_y, s_oSpriteLibrary.getSprite('level_sprite'),false,i+1));
            }
            _aLevels[i].addEventListenerWithParams(ON_MOUSE_UP, this._onClick, this, i);
            
            s_bFirstTime = true;
        }
        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height / 2) - 20, y: (oSprite.height / 2) + 20};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _pStartPosAudio = {x: CANVAS_WIDTH - oSprite.width - 65, y: (oSprite.height/2) + 20};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.setRotation(7);   // ADD A SMALL ROTATION FOR GRAPHIC EFFECT
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
            _pStartPosFullscreen = {x: _pStartPosAudio.x - (oSprite.width/4) - 50,y:_pStartPosAudio.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });
    };  
    
    this.unload = function(){
        for(var i = 0; i < _aLevelNum; i++ ){
            _aLevels[i].unload();
        }
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oLevelChoose = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,iNewY + _pStartPosFullscreen.y);
        }
    };
    
    this._onNumModeToggle = function(iData){
        if(iData === NUM_ACTIVE){
            _bNumActive = true;
            _oModeNumOff.setActive(false);
            _oModeNumOn.setActive(true);
            
        }else {
            _bNumActive = false;
            _oModeNumOff.setActive(true);
            _oModeNumOn.setActive(false);
        }
    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onClick = function(i){        
        var level = i;
        var clickable = _aLevels[i].ifClickable();
        if(clickable){
            s_oLevelChoose.unload();
            s_oMain.gotoGame(level);
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
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	};
    };

    
    this._onExit = function(){
        s_oLevelChoose.unload();

        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_level");
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };   

    s_oLevelChoose = this;        
    this._init();
};

var s_oLevelChoose = null;