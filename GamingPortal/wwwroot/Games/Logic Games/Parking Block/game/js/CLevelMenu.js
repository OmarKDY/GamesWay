function CLevelMenu(){
    
    var _bNumActive;
    
    var _iHeightToggle;
    var _iCurPage;
    
    var _aLevels = new Array();
    var _aPointsX;
    var _aContainerPage;
    var _oModeNumOff;
    var _oModeNumOn;
    var _oArrowRight;
    var _oArrowLeft;
    var _oScoreText;
    
    var _oBg;
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oFade;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosRight;
    var _pStartPosLeft;
    var _pStartPosTotalScore;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);
        
        _bNumActive = false;
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width/2;
        _oBg.regY = oSpriteMsgBox.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        s_oStage.addChild(_oBg);
        
        var oDifficultyTextOutline = new CTLText(s_oStage, 
                     CANVAS_WIDTH/2-500, 470, 1000, 80, 
                    80, "center", "#0075b8", FONT, 1,
                    0, 0,
                    TEXT_SELECT_LEVEL,
                    true, true, false,
                    false );
        
        oDifficultyTextOutline.setOutline(8);
        
        var oDifficultyText = new CTLText(s_oStage, 
                     CANVAS_WIDTH/2-500, 470, 1000, 80, 
                    80, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_SELECT_LEVEL,
                    true, true, false,
                    false );
        
        var szText = TEXT_TOTAL_SCORE + ": " +s_oLocalStorage.getTotalScore();
        _pStartPosTotalScore = {x: 20, y: CANVAS_HEIGHT-60};
        _oScoreText = new CTLText(s_oStage, 
                    _pStartPosTotalScore.x-300, _pStartPosTotalScore.y, 600, 50, 
                    50, "left", "#FFFFFF", FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );
                    

    
        
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 16};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = _pStartPosExit.x - (oSprite.width)- 10;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 16};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
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
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:oSprite.height/2 + 16};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _iHeightToggle = 50;
        _iCurPage = 0;
       
        //FIND X COORDINATES FOR LEVEL BUTS
        _aPointsX = new Array();
        var iWidth = oSpriteMsgBox.width - 100;

        var iOffsetX = Math.floor(iWidth/NUM_COLS_PAGE_LEVEL)/2;
        var iXPos = 0;
        for(var i=0;i<NUM_COLS_PAGE_LEVEL;i++){
            _aPointsX.push(iXPos);
            iXPos += iOffsetX*2;
        }
        
        _aContainerPage = new Array();
        _aLevels = new Array();
        this._createNewLevelPage(0,s_oLevelSettings.getLevels().length);
        
        if(_aContainerPage.length > 1){
            //MULTIPLE PAGES
            for(var k=1;k<_aContainerPage.length;k++){
                _aContainerPage[k].visible = false;
            }
            
            _pStartPosRight = {x:CANVAS_WIDTH - 620,y:CANVAS_HEIGHT - 520};
            _oArrowRight = new CGfxButton(_pStartPosRight.x,_pStartPosRight.y,s_oSpriteLibrary.getSprite('but_right'),s_oStage);
            _oArrowRight.addEventListener(ON_MOUSE_UP, this._onRight, this);
            
            _pStartPosLeft = {x:620,y:CANVAS_HEIGHT - 520};
            _oArrowLeft = new CGfxButton(_pStartPosLeft.x,_pStartPosLeft.y,s_oSpriteLibrary.getSprite('but_left'),s_oStage);
            _oArrowLeft.addEventListener(ON_MOUSE_UP, this._onLeft, this);
        }
        
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
        this.setCurPageToLastLevel();
    };  
    
    this.unload = function(){
        for(var i = 0; i < NUM_LEVELS; i++ ){
            _aLevels[i].unload();
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        if(_aContainerPage.length > 1){
            _oArrowRight.unload();
            _oArrowLeft.unload();
        }
        
        s_oLevelMenu = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
        //_oScoreText.setPosition(_pStartPosTotalScore.x + iNewX, _pStartPosTotalScore.y - iNewY);
        _oScoreText.setX(_pStartPosTotalScore.x + iNewX);
        _oScoreText.setY(_pStartPosTotalScore.y - iNewY);
    };
    
    this._checkBoundLimits = function(){
        var oSprite = s_oSpriteLibrary.getSprite('level_sprite');
        var iY = 0;
        
        var iHeightBound = CANVAS_HEIGHT - (EDGEBOARD_Y*2) - (_iHeightToggle * 2);
        var iNumRows = 0;

        while(iY < iHeightBound){
            iY += oSprite.height + 20;
            iNumRows++;
        }

        if(NUM_ROWS_PAGE_LEVEL > iNumRows){
            NUM_ROWS_PAGE_LEVEL = iNumRows;
        }
        
        
        var iNumCols = 0;
        var iX = 0;
        var iWidthBounds = CANVAS_WIDTH - (EDGEBOARD_X*2);
        var oSprite = s_oSpriteLibrary.getSprite('level_sprite'); 

        while(iX < iWidthBounds){
            iX += (oSprite.width/2) + 5;
            iNumCols++;  
        }
        if(NUM_COLS_PAGE_LEVEL > iNumCols){
            NUM_COLS_PAGE_LEVEL = iNumCols;
        }
    };
    
    this._createNewLevelPage = function(iStartLevel,iEndLevel){
        var oContainerLevelBut = new createjs.Container();
        s_oStage.addChild(oContainerLevelBut);
        _aContainerPage.push(oContainerLevelBut);
        
        
        var iCont = 0;
        var iY = 0;
        var iNumRow = 1;
        var bNewPage = false;
        var oSprite = s_oSpriteLibrary.getSprite('level_sprite');
        
        var iLevelIndex;
        for(var i=iStartLevel;i<iEndLevel;i++){
            iLevelIndex = i+1;
            var oBut = new CLevelBut(_aPointsX[iCont] + oSprite.width/4, iY + oSprite.height/2,oSprite, iLevelIndex>s_iLastLevel?false:true, iLevelIndex, oContainerLevelBut);
            if( i === 0){
                oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onClickHelp, this, i);
            }else{
                oBut.addEventListenerWithParams(ON_MOUSE_UP, this._onClick, this, i);
            }

            if(i<s_iLastLevel - 1){
                oBut.setStars(s_aStars[i]);
            }else if(i=== s_iLastLevel - 1){
                oBut.pulseAnimation();
            }

            _aLevels.push(oBut);
            
            iCont++;
            if(iCont === _aPointsX.length){
                iCont = 0;
                iY += oSprite.height + 20;
                iNumRow++;

                if(iNumRow > NUM_ROWS_PAGE_LEVEL){
                    bNewPage = true;
                    break;
                }
            }
        }
        
        if(oContainerLevelBut.getBounds() !== null){
            oContainerLevelBut.x = CANVAS_WIDTH/2 ;
            oContainerLevelBut.y = 720;
            oContainerLevelBut.regX = oContainerLevelBut.getBounds().width/2;
        }
        
        if(bNewPage && _aLevels.length < s_oLevelSettings.getLevels().length){
            //ADD A PAGE
            this._createNewLevelPage(i+1,iEndLevel);
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
    
    this.setCurPageToLastLevel = function(){
        for(var i=0; i<_aContainerPage.length; i++){
            _aContainerPage[i].visible = false;
        }
        _iCurPage = Math.floor( s_iLastLevel/(NUM_ROWS_PAGE_LEVEL*NUM_COLS_PAGE_LEVEL) )
        if(_iCurPage >= Math.floor(NUM_LEVELS/(NUM_ROWS_PAGE_LEVEL*NUM_COLS_PAGE_LEVEL))){
            _iCurPage = NUM_LEVELS/(NUM_ROWS_PAGE_LEVEL*NUM_COLS_PAGE_LEVEL) - 1;
        }
        _aContainerPage[_iCurPage].visible = true;
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
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onClickHelp = function(i){
        var level = i;

        var clickable = _aLevels[i].ifClickable();
        if(clickable){
            s_oLevelMenu.unload();
            s_oMain.gotoHelp(level);
        } 
    };
    
    this._onClick = function(i){
        var level = i;
        var clickable = _aLevels[i].ifClickable();
        if(clickable){
            s_oLevelMenu.unload();
            s_oMain.gotoGame(level, 0);
        } 
    };
    
    this._onModeAdventure = function(){
            _oMode.setActive(true);
    };
     
    this._onExit = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        s_oLevelMenu.unload();
        s_oMain.gotoMenu();
    };   
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
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
    
    s_oLevelMenu = this;        
    this._init();
    
    
    
};

var s_oLevelMenu = null;