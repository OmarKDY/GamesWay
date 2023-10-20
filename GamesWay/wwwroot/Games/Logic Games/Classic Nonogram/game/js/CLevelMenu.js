function CLevelMenu(){

    var _oExitBut;
    var _aLevelsBoxes = new Array();
    var _aDimLevelsBoxes = new Array();
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oBg;
    var _oHelpBut;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oLeftBut;
    var _oRightBut;
    var _oBackBut;
    var _iCurrentPage = 0;
    var _aLevelsDims = new Array();
    var _iNumDimsPages;
    var _iNumLevelsPages;
    var _iChosenDim = 0;
    var _iDimButtons;
    var _iWidthLevelBox;
    var _iHeightLevelBox;

    var _pStartPosBoxes;
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    var _pStartPosLeft;
    var _pStartPosRight;
    var _pStartPosBack;
    var _pStartPosHelp;

    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_level_menu'));
        s_oStage.addChild(_oBg);

        /*LEVELS BOXES*/
        var oSprite = s_oSpriteLibrary.getSprite('levels_box');
        _pStartPosBoxes = {x: CANVAS_WIDTH/2, y:CANVAS_HEIGHT/2};
        /*-----LEVELS BOX (DIM)-----*/
        LEVELS.forEach((element,index) => {
            if(element.length>0){
                _aLevelsDims.push(index);
                s_aUnlockedLevels.push(parseInt(getSavedLevel(index)));
            }
        });

        _iDimButtons = _aLevelsDims.length;
        _iNumDimsPages = Math.ceil(_iDimButtons/12)-1;

        this._createDimLevelsBoxes();
        _iWidthLevelBox = _aDimLevelsBoxes[0].getWidth();
        _iHeightLevelBox = _aDimLevelsBoxes[0].getHeight();

        /*-----LEFT ARROW BUTTON-----*/
        var oSprite = s_oSpriteLibrary.getSprite('but_left');
        _pStartPosLeft = {x: CANVAS_WIDTH/2-(_iWidthLevelBox/2)-oSprite.width/2, y: (CANVAS_HEIGHT/2)};            
        _oLeftBut = new CGfxButton(_pStartPosLeft.x,_pStartPosLeft.y,oSprite, s_oStage);
        _oLeftBut.addEventListener(ON_MOUSE_UP, this._onLeftBut, this);
        if(_iCurrentPage == 0){
            _oLeftBut.setVisible(false);
            _oLeftBut.deactivate();
        }

        /*-----RIGHT ARROW BUTTON-----*/
        var oSprite = s_oSpriteLibrary.getSprite('but_right');
        _pStartPosRight = {x: CANVAS_WIDTH/2+(_iWidthLevelBox/2)+oSprite.width/2, y: (CANVAS_HEIGHT/2)};            
        _oRightBut = new CGfxButton(_pStartPosRight.x,_pStartPosRight.y,oSprite, s_oStage);
        _oRightBut.addEventListener(ON_MOUSE_UP, this._onRightBut, this);
        if(_iCurrentPage == _iNumDimsPages){
            _oRightBut.setVisible(false);
            _oRightBut.deactivate();
        }
        
        /*-----BUTTON EXIT-----*/
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 10};            
        _oExitBut = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite, s_oStage);
        _oExitBut.addEventListener(ON_MOUSE_UP, this._onExitBut, this);
        
        /*-----BUTTON AUDIO-----*/
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - oSprite.width/2 - 10, y: (oSprite.height/2) + 10};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }
        /*-----BUTTON FULLSCREEN-----*/
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:oSprite.width/4  + 10, y: (oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);

            var oSprite = s_oSpriteLibrary.getSprite('but_help');
            _pStartPosHelp = {x:_pStartPosFullscreen.x + oSprite.width + 10,y:(oSprite.height/2) + 10};
        }else{
            var oSprite = s_oSpriteLibrary.getSprite('but_help');
            _pStartPosHelp = {x:oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
        }

        /*-----HELP BUTTON-----*/      
        _oHelpBut = new CGfxButton(_pStartPosHelp.x,_pStartPosHelp.y,oSprite, s_oStage);
        _oHelpBut.addEventListener(ON_MOUSE_UP, this._onHelpBut, this);

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 1000).call(function(){oFade.visible = false;}); 
        
        setVolume("soundtrack",1);
        
        this.refreshButtonPos();

        
        if(!s_bStorageAvailable){
            new CAlertLocalStorage();
        }
    }

    this.unload = function(){
        _oExitBut.unload();
        _oLeftBut.unload();
        _oRightBut.unload();
        _oHelpBut.unload();

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.unload();
        }

        _aDimLevelsBoxes.forEach(element => {
            element.unload();
        });

        _aLevelsBoxes.forEach(element => {
            element.unload();
        });

        s_aUnlockedLevels = new Array();
        s_oLevelMenu = null;
        s_oStage.removeAllChildren();  
    }

    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oExitBut.setPosition(_pStartPosExit.x - s_iOffsetX,s_iOffsetY + _pStartPosExit.y);
        _oHelpBut.setPosition(_pStartPosHelp.x + s_iOffsetX,s_iOffsetY + _pStartPosHelp.y);

        if(_iChosenDim == 0){
            _aDimLevelsBoxes.forEach(element => {
                element.setPosition(_pStartPosBoxes.x, _pStartPosBoxes.y);
            });
        }else{
            _aLevelsBoxes.forEach(element => {
                element.setPosition(_pStartPosBoxes.x, _pStartPosBoxes.y);
            });
        }
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExitBut = function(){
        s_oLevelMenu.unload();
        s_oMain.gotoMenu();
    }

    this._onHelpBut = function(){
        s_oLevelMenu.unload();
        s_oMain.gotoTutorial();
    };

    this.onLevelBoxBut = function(iType){
        if(_iChosenDim == 0){
            _aDimLevelsBoxes[0].unload();
            if(_aDimLevelsBoxes[1]){
                _aDimLevelsBoxes[1].unload();
            }
 
            _iChosenDim = iType;
            var iNumButtons = LEVELS[_iChosenDim].length;
            _iCurrentPage = 0;

            _iNumLevelsPages =  Math.ceil(iNumButtons/12)-1;
            var oSprite = s_oSpriteLibrary.getSprite('levels_box');
            _aLevelsBoxes[0] = new CLevelsBox(_pStartPosBoxes.x, _pStartPosBoxes.y, s_oStage,iNumButtons,oSprite, _iChosenDim);
            _aLevelsBoxes[0].playPulseAnimation();
            _aLevelsBoxes[0].show(_iCurrentPage, undefined);
            

            if(_iNumLevelsPages >= 1){
                _aLevelsBoxes[1] = new CLevelsBox(_pStartPosBoxes.x, _pStartPosBoxes.y, s_oStage,iNumButtons,oSprite, _iChosenDim);
                _aLevelsBoxes[1].setVisible(false);
            }
            
            _oLeftBut.setVisible(false);
            _oLeftBut.deactivate();

            if(_iCurrentPage != _iNumLevelsPages){
                _oRightBut.setVisible(true);
                _oRightBut.activate();
            }

            s_oStage.setChildIndex(_oLeftBut.getButtonImage(),s_oStage.numChildren-2);
            s_oStage.setChildIndex(_oRightBut.getButtonImage(),s_oStage.numChildren-3);
            
            this.refreshButtonPos();
        }
        else{
            this.unload();
            s_oMain.gotoGame(_iChosenDim, iType-1);
        }
    }

    this._onLeftBut = function(){
        var iLevelBoxToShow;
        var iLevelBoxToHide;

        _iCurrentPage--;
        
        if(isEven(_iCurrentPage)){
            iLevelBoxToShow = 1;
            iLevelBoxToHide = 0;
        }
        else{
            iLevelBoxToShow = 0;
            iLevelBoxToHide = 1;
        }

        if(_iChosenDim == 0){
            _aDimLevelsBoxes[iLevelBoxToShow].show(_iCurrentPage,_aLevelsDims, true);
            _aDimLevelsBoxes[iLevelBoxToHide].hide(false);
        }
        else{
            _aLevelsBoxes[iLevelBoxToShow].show(_iCurrentPage,undefined,true);
            _aLevelsBoxes[iLevelBoxToHide].hide(false);
        }
        

        this._blockLeftAndRightBut();

        if(_iCurrentPage == 0){
            _oLeftBut.setVisible(false);
            _oLeftBut.deactivate();
        }
        _oRightBut.setVisible(true);
        _oRightBut.activate();
    }

    this._onRightBut = function(){
        var iLevelBoxToShow;
        var iLevelBoxToHide;

        _iCurrentPage++;
        
        if(isEven(_iCurrentPage)){
            iLevelBoxToShow = 1;
            iLevelBoxToHide = 0;
        }
        else{
            iLevelBoxToShow = 0;
            iLevelBoxToHide = 1;
        }
        
        if(_iChosenDim == 0){
            _aDimLevelsBoxes[iLevelBoxToShow].show(_iCurrentPage,_aLevelsDims, false);
            _aDimLevelsBoxes[iLevelBoxToHide].hide(true);
        }
        else{
            _aLevelsBoxes[iLevelBoxToShow].show(_iCurrentPage,undefined, false);
            _aLevelsBoxes[iLevelBoxToHide].hide(true);
        }

        this._blockLeftAndRightBut();

        if(_iCurrentPage < _iChosenDim == 0?_iNumDimsPages:_iNumLevelsPages){
            _oRightBut.setVisible(false);
            _oRightBut.deactivate();
        }
        _oLeftBut.setVisible(true);
        _oLeftBut.activate();
    }

    this.onBackBut = function(){
        _iChosenDim = 0;
        _iCurrentPage = 0;

        _aLevelsBoxes.forEach(element => {
            element.unload();
        })

        this._createDimLevelsBoxes();

        _oLeftBut.setVisible(false);
        _oLeftBut.deactivate();

        if(_iCurrentPage != _iNumDimsPages){
            _oRightBut.setVisible(true);
            _oRightBut.activate();
        }
        else{
            _oRightBut.setVisible(false);
            _oRightBut.deactivate();
        }

        s_oStage.setChildIndex(_oLeftBut.getButtonImage(),s_oStage.numChildren-2);
        s_oStage.setChildIndex(_oRightBut.getButtonImage(),s_oStage.numChildren-1);
    }

    this._blockLeftAndRightBut = function(){
        _oLeftBut.deactivate();
        _oRightBut.deactivate();
        setTimeout(_oLeftBut.activate,300);
        setTimeout(_oRightBut.activate,300);
    }

    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
    
    this._createDimLevelsBoxes = function(){
        var oSprite = s_oSpriteLibrary.getSprite('levels_box');
        
        _aDimLevelsBoxes[0] = new CLevelsBox(_pStartPosBoxes.x, _pStartPosBoxes.y, s_oStage,_iDimButtons,oSprite);
        _aDimLevelsBoxes[0].playPulseAnimation();
        _aDimLevelsBoxes[0].setVisible(true);
        _aDimLevelsBoxes[0].show(_iCurrentPage,_aLevelsDims);

        if(_iNumDimsPages >= 1){
            _aDimLevelsBoxes[1] = new CLevelsBox(_pStartPosBoxes.x, _pStartPosBoxes.y, s_oStage,_iDimButtons,oSprite);
            _aDimLevelsBoxes[1].setVisible(false);
        }
    }

    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    s_oLevelMenu = this;

    this._init();
}

var s_oLevelMenu = null;
var s_aUnlockedLevels = new Array();