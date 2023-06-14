function CInterface(){
    var _bCanPlay;
    
    var _iCurState;
    
    var _aShotIndicator;
    
    var _oAudioToggle;
    var _oButExit;
    var _oScoreText;
    var _oScoreTextNum;
    var _oParent;
    var _oShapeKeyListener;
    var _oStageText;
    var _oBestText;
    var _oTopBar;
    var _oRightBar;
    var _oShotsIndicator;
    var _oAreYouSurePanel;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosShotsIndicator;
    var _pStartPosStageText;
    var _pStartPosScoreText;
    var _pStartPosScoreTextNum;
    var _pStartPosBest;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    this._init = function(){  
        _bCanPlay = false;
        
        _iCurState = HORIZONTAL_SELECTION_STATE;
        
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 80;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);       
            
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: oExitX, y: (oSprite.height/2) + 10};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oTopBar = new CShotIndicatorController(CANVAS_WIDTH/2, 300, false);
        _oRightBar = new CShotIndicatorController(500, CANVAS_HEIGHT/2 - 20, true);

        if(!s_bMobile){
            document.onkeydown = onKeyDown; 
        }
        
        
        _oShapeKeyListener = new createjs.Shape();
        _oShapeKeyListener.graphics.beginFill("Black").drawRect(0,160,CANVAS_WIDTH,CANVAS_HEIGHT-160);
        _oShapeKeyListener.alpha = 0.01;
        s_oStage.addChild(_oShapeKeyListener);
        _oShapeKeyListener.on("mousedown", this._handleClick, this);

        _pStartPosStageText = {x:10 ,y:CANVAS_HEIGHT - 12};        
        _oStageText = new createjs.Text(TEXT_STAGE + ":  1","30px "+PRIMARY_FONT, "#fff");
        _oStageText.textAlign = "left";
        _oStageText.textBaseline = "alphabetic";
        _oStageText.lineWidth = 400;
        _oStageText.x = _pStartPosStageText.x;
        _oStageText.y = _pStartPosStageText.y;
        s_oStage.addChild(_oStageText);

        _pStartPosScoreText = {x:10 ,y:32};
        _oScoreText = new createjs.Text(TEXT_SCORE + ":","30px "+PRIMARY_FONT, "#17294d");
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 400;
        _oScoreText.x = _pStartPosScoreText.x;
        _oScoreText.y = _pStartPosScoreText.y;
        s_oStage.addChild(_oScoreText);

        _pStartPosScoreTextNum = {x:_pStartPosScoreText.x + _oScoreText.getMeasuredWidth() + 5,y:32};
        _oScoreTextNum = new createjs.Text(0,"30px "+PRIMARY_FONT, "#17294d");
        _oScoreTextNum.textAlign = "left";
        _oScoreTextNum.textBaseline = "alphabetic";
        _oScoreTextNum.lineWidth = 400;
        _oScoreTextNum.x = _pStartPosScoreTextNum.x;
        _oScoreTextNum.y = _pStartPosScoreTextNum.y;
        s_oStage.addChild(_oScoreTextNum);
        
        _pStartPosBest = {x:_pStartPosScoreText.x,y:_pStartPosScoreText.y + 32};
        _oBestText = new createjs.Text(TEXT_BEST + ": "+s_iBestScore,"30px "+PRIMARY_FONT, "#17294d");
        _oBestText.textAlign = "left";
        _oBestText.textBaseline = "alphabetic";
        _oBestText.lineWidth = 400;
        _oBestText.x = _pStartPosScoreText.x;
        _oBestText.y = _pStartPosScoreText.y;
        s_oStage.addChild(_oBestText);
        
        _pStartPosShotsIndicator = {x: CANVAS_WIDTH - 30, y: CANVAS_HEIGHT - 30};
        _oShotsIndicator = new createjs.Container();
        _oShotsIndicator.x = _pStartPosShotsIndicator.x;
        _oShotsIndicator.y = _pStartPosShotsIndicator.y;
        s_oStage.addChild(_oShotsIndicator);

        var oSprite = s_oSpriteLibrary.getSprite('ball');
        var iFrameWidth = oSprite.width/2;
        var iFrameHeight = oSprite.height/6;
        var oData = {   
                        images: [oSprite],
                        framerate: 30,
                        // width, height & registration point of each sprite
                        frames: {width: iFrameWidth, height: iFrameHeight, regX: iFrameWidth/2, regY: iFrameHeight/2}, 
                        animations: {static:[0]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _aShotIndicator = new Array();
        for(var i=0; i<SHOTS_PER_STAGE; i++){
            _aShotIndicator[i] = createSprite(oSpriteSheet, "static",0,0,0,0);
            _aShotIndicator[i].gotoAndStop("static");
            _aShotIndicator[i].scaleX = _aShotIndicator[i].scaleY = 0.15;
            _aShotIndicator[i].rotation = 30;
            _aShotIndicator[i].x = -i*26;
            _oShotsIndicator.addChild(_aShotIndicator[i]);
        }
        
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oAreYouSurePanel.addEventListener(ON_BUT_NO_DOWN,this._onHideExitPanel,this);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,s_oGame.onExit,s_oGame);
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oShapeKeyListener.off("mousedown");
        
        _oButExit.unload();
        _oAreYouSurePanel.unload();
        s_oInterface = null;
    };
    
    this._handleClick = function(e){
        if(_bCanPlay === true){
            switch(_iCurState){
                case HORIZONTAL_SELECTION_STATE:
                    
                    s_oGame.endGoalAnim();
                    
                    _oTopBar.endAnimation();

                    _iCurState++;
                    _oParent.controlState();
                    break;
                case VERTICAL_SELECTION_STATE:
                    
                    _oRightBar.endAnimation();

                    _iCurState++;
                    _oParent.controlState();
                    break;
            }
        }
    };	
    
    function onKeyDown(evt) { 
        if(!evt){ 
            evt = window.event; 
        }  

        switch(evt.keyCode) {  
            //spacebar
            case SPACE_BAR:{
                _oParent._handleClick();
                evt.preventDefault();
                return false;
            }
            // left  
            case LEFT: {
                evt.preventDefault();
                return false; 
            }
            //up  
            case UP: {
                evt.preventDefault();
                return false; 
            }         

            // right  
            case RIGHT: {
                evt.preventDefault();
                return false; 
            }
            //down
            case DOWN: {
                evt.preventDefault();
                return false; 
            }     
        }  
    }
    
    this.controlState = function(){
        _bCanPlay = true;
        switch(_iCurState){
            case HORIZONTAL_SELECTION_STATE:{
                    _oTopBar.startAnimation();
                    break;
            }
            case VERTICAL_SELECTION_STATE:{
                    _oRightBar.startAnimation();	
                    break;
            }
            case SHOT_SELECTION_STATE:{
                    _oTopBar.hide();
                    _oRightBar.hide();
                    s_oGame.playerShot(_oTopBar.getCursorPosition(), _oRightBar.getCursorPosition());
                    break;
            }
        }
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
	
        _oStageText.x = _pStartPosStageText.x + iNewX;
        _oStageText.y = _pStartPosStageText.y - iNewY;
        
        _oScoreText.x = _pStartPosScoreText.x + iNewX;
        _oScoreText.y = _pStartPosScoreText.y + iNewY;
        
        _oScoreTextNum.x = _pStartPosScoreTextNum.x + iNewX;
        _oScoreTextNum.y = _pStartPosScoreTextNum.y + iNewY;
        
        _oBestText.x = _pStartPosBest.x+s_iOffsetX;
        _oBestText.y = _pStartPosBest.y + s_iOffsetY;
        
        _oShotsIndicator.x = _pStartPosShotsIndicator.x - iNewX;
        _oShotsIndicator.y = _pStartPosShotsIndicator.y - iNewY;
    };

    this.refreshScore = function(iValue){
        new CRollingTextController(_oScoreTextNum, null, iValue, 1500, EASE_CUBIC_OUT);
    };

    this.refreshStage = function(iStage){
        _oStageText.text = TEXT_STAGE + ": " +iStage;
    };
    
    this.refreshBestScore = function(){
        _oBestText.text = TEXT_BEST+": "+s_iBestScore;
    };
    
    this.refreshShot = function(iValue){
        var iShot = iValue-1;
        _aShotIndicator[SHOTS_PER_STAGE - iShot].visible = false;
    };

    this.resetShotsIndicator = function(){
        for(var i=0; i<SHOTS_PER_STAGE; i++){
            _aShotIndicator[i].visible = true;
        };  
    };

    this.setControlPos = function(iStage){
        _oTopBar.setPos(CANVAS_WIDTH/2 + GOAL_AREA[iStage].x/2, CANVAS_HEIGHT/2 + GOAL_AREA[iStage].y/2 + Y_BAR_OFFSET[iStage], GREEN_INDICATOR_RANGE[iStage]);
        _oRightBar.setPos(CANVAS_WIDTH/2 + GOAL_AREA[iStage].x/2 + 200, CANVAS_HEIGHT/2 + GOAL_AREA[iStage].y/2, GREEN_INDICATOR_RANGE[iStage]);
    };

    this.stopControl = function(){
        
        _oTopBar.hide();
        _oTopBar.endAnimation();
        
        _oRightBar.hide();
        _oRightBar.endAnimation();
    };

    this.resetControl = function(iNewSpeed){
        _iCurState = 0;
        
        _oTopBar.reset(iNewSpeed);
        _oRightBar.reset(iNewSpeed);
        
        _oTopBar.show();
        _oRightBar.show();
        _oTopBar.startAnimation();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        _bCanPlay = false;
        _oAreYouSurePanel.show(TEXT_ARE_SURE);
    };
    
    this._onHideExitPanel = function(){
        _bCanPlay = true;
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
    
    s_oInterface = this;
    
    this._init();
    
    _oParent = this;
    return this;
}

var s_oInterface = null;