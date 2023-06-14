function CLevel(iRandomN) {
    var _iCurPage;
    var _iHeightToggle;
    var _aLevelButs;
    var _aPointsX;
    var _aContainerPage;
    var _pStartPosSelect;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oButExit;
    var _oAudioToggle;
    var _oArrowRight = null;
    var _oArrowLeft = null;
    var _oTextSelectLevelBack;
    var _oTextSelectLevel;
    var _oContainer;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        
        _iCurPage = 0;
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        if (iRandomN !== 0) {
            iRandomN = 3;
        }
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'+iRandomN));
        var oRock = createBitmap(s_oSpriteLibrary.getSprite('rock_'+iRandomN));
	_oContainer.addChild(oBg,oRock);
        _oContainer.addChild(shape);
        
        _pStartPosSelect = {x:CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF - 470};
        _oTextSelectLevelBack = new createjs.Text(TEXT_LEVELSELECT, FONT_SIZE_TITLES + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oTextSelectLevelBack.x = _pStartPosSelect.x;
        _oTextSelectLevelBack.y = _pStartPosSelect.y;
        _oTextSelectLevelBack.textAlign = "center";
        _oTextSelectLevelBack.outline = 5;
        s_oStage.addChild(_oTextSelectLevelBack);
        
        _oTextSelectLevel = new createjs.Text(TEXT_LEVELSELECT, FONT_SIZE_TITLES + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oTextSelectLevel.x = _pStartPosSelect.x;
        _oTextSelectLevel.y = _pStartPosSelect.y;
        _oTextSelectLevel.textAlign = "center";        
        s_oStage.addChild(_oTextSelectLevel);

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
	_iHeightToggle = oSpriteExit.height;
        
        _pStartPosExit = {x: CANVAS_WIDTH - oSpriteExit.width/2 - 20, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            
            _pStartPosAudio = {x: _pStartPosExit.x - oSpriteExit.width/2 - oSprite.width/4 - 10, y: _pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,_oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSpriteExit.width/2 - oSprite.width/4 - 10,y:(oSprite.height / 2) + 10};
        }else{
            _pStartPosFullscreen = {x: _pStartPosExit.x - oSpriteExit.width - 10, y: _pStartPosExit.y};
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

        this._checkBoundLimits();

        //FIND X COORDINATES FOR LEVEL BUTS
        _aPointsX = new Array();
        var iWidth = CANVAS_WIDTH - (EDGEBOARD_X*2) ;
        var iOffsetX = Math.floor(iWidth/NUM_COLS_PAGE_LEVELS)/2-30;
        var iXPos = 0;
        for(var i=0;i<NUM_COLS_PAGE_LEVELS;i++){
            _aPointsX.push(iXPos);
            iXPos += iOffsetX*2;
        }

        _aContainerPage = new Array();
        this._createNewPage(0, LEVELS_NUMBER);

        if(_aContainerPage.length > 1){
            //MULTIPLE PAGES
            for(var k=1;k<_aContainerPage.length;k++){
                _aContainerPage[k].visible = false;
            }

            _oArrowRight = new CGfxButton(CANVAS_WIDTH_HALF + 450,CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level'),s_oStage);
            _oArrowRight.getButtonImage().rotation = 90;
            _oArrowRight.addEventListener(ON_MOUSE_UP, this._onRight, this);
            
            _oArrowLeft = new CGfxButton(CANVAS_WIDTH_HALF - 450, CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level'),s_oStage);
            _oArrowLeft.getButtonImage().rotation = -90;
            _oArrowLeft.addEventListener(ON_MOUSE_UP, this._onLeft, this);
        }

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(oFade);

        createjs.Tween.get(oFade).to({alpha: 0}, 1000).call(function () {
            oFade.visible = false;
        });
    };
    
    this.unload = function(){
        for(var i=0;i<_aLevelButs.length;i++){
            _aLevelButs[i].unload();
        }  
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        
        if(_oArrowLeft !== null){
            _oArrowLeft.unload();
            _oArrowRight.unload();
        }
        
        s_oStage.removeAllChildren();
        s_oLevelSelection = null;
    };
    
    this.refreshButtonPos = function(iNewX, iNewY){
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        };
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        };
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY); 
    };
    
    this._checkBoundLimits = function(){
        var oSprite = this.getButLevelSprite();
        var iY = 0;
        
        var iHeightBound = CANVAS_HEIGHT - (EDGEBOARD_Y*2) - (_iHeightToggle * 2);
        var iNumRows = 0;

        while(iY < iHeightBound){
            iY += oSprite.height + 20;
            iNumRows++;
        }
        if (NUM_ROWS_PAGE_LEVELS > iNumRows){
            NUM_ROWS_PAGE_LEVELS = iNumRows;
        }

        var iNumCols = 0;
        var iX = 0;
        var iWidthBounds = CANVAS_WIDTH - (EDGEBOARD_X*2);
        var oSprite = this.getButLevelSprite();

        while(iX < iWidthBounds){
            iX += (oSprite.width/2) + 5;
            iNumCols++;  
        }
        if(NUM_COLS_PAGE_LEVELS > iNumCols){
            NUM_COLS_PAGE_LEVELS = iNumCols;
        }
    };
    
    this.getButLevelSprite = function(i){
        var oSprite;
        if (i < 3) {
            oSprite = s_oSpriteLibrary.getSprite('but_level0');
        } else if (i > 2 && i < 6) {
            oSprite = s_oSpriteLibrary.getSprite('but_level1');
        } else if (i > 5 && i < 9) {
            oSprite = s_oSpriteLibrary.getSprite('but_level2');
        } else {
            oSprite = s_oSpriteLibrary.getSprite('but_level3');
        }  
        
        return oSprite;
    };
    
    this._createNewPage = function(iStart,iEnd){
        var oContainerLevelBut = new createjs.Container();
        _oContainer.addChild(oContainerLevelBut);
        _aContainerPage.push(oContainerLevelBut);
        
        _aLevelButs = new Array();
        var iCont = 0;
        var iY = 0;
        var iNumRow = 1;
        var bNewPage = false;
        
        for(var i=iStart;i<iEnd;i++){
            var oSprite = this.getButLevelSprite(i);
            var bActive = true;
            if (!ALL_LEVELS_UNLOCKED && s_iLastLevel < i) {
                bActive = false;
            };
            var oBut = new CLevelBut(_aPointsX[iCont] + oSprite.width/4, iY + oSprite.height/2+30, i, oSprite, bActive,oContainerLevelBut);
            oBut.addEventListenerWithParams(ON_MOUSE_UP, this.onButLevelRelease, this,i);            
            _aLevelButs.push(oBut);
            
            iCont++;
            if(iCont === _aPointsX.length && i<iEnd-1){
                iCont = 0;
                iY += oSprite.height + 50;
                iNumRow++;
                if(iNumRow > NUM_ROWS_PAGE_LEVELS){
                    bNewPage = true;
                    break;
                }
            }
        }
        oContainerLevelBut.x = CANVAS_WIDTH_HALF ;
        oContainerLevelBut.y = CANVAS_HEIGHT_HALF;
        oContainerLevelBut.regX = oContainerLevelBut.getBounds().width/2;
        oContainerLevelBut.regY = oContainerLevelBut.getBounds().height/2;
        if(bNewPage){
            this._createNewPage(i+1,iEnd);
        }                
    };
    
    this._onRight = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage++;
        if(_iCurPage >=  _aContainerPage.length){
            _iCurPage = 0;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this._onLeft = function(){
        _aContainerPage[_iCurPage].visible = false;
        
        _iCurPage--;
        if(_iCurPage <  0){
            _iCurPage =_aContainerPage.length-1;
        }
        
        _aContainerPage[_iCurPage].visible = true;
    };
    
    this.onButLevelRelease = function(iLevel){
        _aLevelButs[iLevel].setActive(0, true);
        s_iLevel = iLevel;
        
        this.unload();
        s_oMain.gotoGame();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
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
	if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
	};
    };
    
    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };

    s_oLevelSelection = this;
    this._init();
}

var s_oLevelSelection = null;