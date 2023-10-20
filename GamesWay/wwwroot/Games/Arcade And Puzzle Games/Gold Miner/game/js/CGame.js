function CGame(oData){
    var _bUpdate = false;
    var _iState;
    var _oDraggingNugget = null;
    var _iDirHook;
    var _iHookSpeed;
    var _iRopeSpeed;
    var _iSlowDown;
    var _iScore = 0;
    var _iCurLevel = 1;
    var _iCurTargetLevel;
    var _iNuggetToRemove;
    var _iTimeElaps;
    var _aNuggets;
    var _aMalus;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    var _oHook;
    var _oHurt;
    var _oBg;
    var _oHelpPanel;
    var _oButExit;
    var _oButStart;
    var _oEndPanel;
    var _oChangeLevel;
    var _oAudioToggle;
    var _oLevelText;
    var _oTimeText;
    var _oTargetText;
    var _oLevelTextBack;
    var _oTimeTextBack;
    var _oTargetTextBack;
    var _oClockSprite;
    var _oLevelSettings;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        this.changeState(STATE_HOOK_ROTATE);
        
        _oLevelSettings = new CLevelSettings();
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
         s_oStage.addChild(_oBg);   

        _oLevelTextBack = new createjs.Text(TEXT_LEVEL+" 1","32px "+FONT_GAME, "#000");
        _oLevelTextBack.x = 310;
        _oLevelTextBack.y = CANVAS_HEIGHT - 30;
        _oLevelTextBack.textAlign = "left";
        _oLevelTextBack.textBaseline = "alphabetic";
        s_oStage.addChild(_oLevelTextBack);

        _oLevelText = new createjs.Text(TEXT_LEVEL+" 1","32px "+FONT_GAME, "#fff");
        _oLevelText.x = 308;
        _oLevelText.y = CANVAS_HEIGHT - 32;
        _oLevelText.textAlign = "left";
        _oLevelText.textBaseline = "alphabetic";
        s_oStage.addChild(_oLevelText);
        
        _oClockSprite = createBitmap(s_oSpriteLibrary.getSprite('clock'));
        _oClockSprite.x = 298;
        _oClockSprite.y = 10;
        s_oStage.addChild(_oClockSprite);
        
        _oTimeTextBack = new createjs.Text((LEVEL_TIME/1000),"40px "+FONT_GAME, "#000");
        _oTimeTextBack.x = 380;
        _oTimeTextBack.y = 57;
        _oTimeTextBack.textAlign = "center";
        _oTimeTextBack.textBaseline = "alphabetic";
        s_oStage.addChild(_oTimeTextBack);
        
        _oTimeText = new createjs.Text((LEVEL_TIME/1000),"40px "+FONT_GAME, "#fff");
        _oTimeText.x = 378;
        _oTimeText.y = 55;
        _oTimeText.textAlign = "center";
        _oTimeText.textBaseline = "alphabetic";
        s_oStage.addChild(_oTimeText);

        _iSlowDown = 0;
        _iRopeSpeed = 0.05;
        _iHookSpeed = HOOK_SPEED;

	_iTimeElaps = LEVEL_TIME;
        _iCurTargetLevel = _oLevelSettings.getLevelTarget(_iCurLevel);
        _iCurTarget = 0;

        _oTargetTextBack = new createjs.Text(_iScore+"$/"+_iCurTargetLevel+"$","40px "+FONT_GAME, "#000");
        _oTargetTextBack.x = 310;
        _oTargetTextBack.y = 117;
        _oTargetTextBack.textAlign = "left";
        _oTargetTextBack.textBaseline = "alphabetic";
        s_oStage.addChild(_oTargetTextBack);

        _oTargetText = new createjs.Text(_iScore+"$/"+_iCurTargetLevel+"$","40px "+FONT_GAME, "#fff");
        _oTargetText.x = 308;
        _oTargetText.y = 115;
        _oTargetText.textAlign = "left";
        _oTargetText.textBaseline = "alphabetic";
        s_oStage.addChild(_oTargetText);

        var oSpriteHook = s_oSpriteLibrary.getSprite("hook");
        _oHook = new CHook(oSpriteHook);
       
        this._initNuggets();
        
        _oButStart = new createjs.Shape();
        _oButStart.graphics.beginFill("yellow").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oButStart.alpha = 0.01;
        s_oStage.addChild(_oButStart);
        
        var oParent = this;
        _oButStart.on("pressup",function(){oParent._onStartDig()}); 
        
        _oHurt = new createjs.Shape();
        _oHurt.graphics.beginFill("red").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oHurt.alpha = 0.1;
        _oHurt.visible =  false;      
        s_oStage.addChild(_oHurt);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon')
            _pStartPosAudio = {x: CANVAS_WIDTH - 170, y: 60};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: CANVAS_WIDTH - 170, y: 60};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && inIframe() === false){
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.width/2) - 10, y: 10+ (oSprite.height/2)};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,true);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oSprite = s_oSpriteLibrary.getSprite('bg_help');
        _oHelpPanel = new CHelp(oSprite);

        var oSprite = s_oSpriteLibrary.getSprite("msg_box");
        _oChangeLevel = new CChangeLevel(oSprite);
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        } 
        
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };
    
    this.unload = function(){
        s_oStage.removeAllChildren(); 
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
	
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload(); 
        _oButExit = null;
        
		
        for(var j=0;j<_aNuggets.length;j++){
            _aNuggets[j].unload();
        }
		
        for(var i=0;i<_aMalus.length;i++){
                _aMalus[i].unload();
        }
        
        s_oGame = null;
    };
    
    this.resetFullscreenBut = function(){
	_oButFullscreen.setActive(s_bFullscreen);
    };
    
    this._initNuggets = function(){
        _aNuggets = new Array();
        _aMalus = new Array();
        
        var aPos = _oLevelSettings.getNuggetPosInLevel(_iCurLevel);
        var aInfo = _oLevelSettings.getNuggetInfoInLevel(_iCurLevel);
        for(var k=0;k<aPos.length;k++){
            var oSprite = s_oSpriteLibrary.getSprite('nugget_'+aInfo[k].type);       
            var oNugget = new CNugget(aPos[k].x,aPos[k].y,aInfo[k].scale,oSprite);  
            
            _aNuggets.push(oNugget);
        }

        var oSpriteMalus = s_oSpriteLibrary.getSprite('malus'); 
        var aMalusPos = _oLevelSettings.getMalusPosInLevel(_iCurLevel);
        for(var j=0;j<aMalusPos.length;j++){
            var oMalus = new CMalus(aMalusPos[j].x,aMalusPos[j].y,1,oSpriteMalus);
            _aMalus.push(oMalus);
        }
        
        _iNuggetToRemove = aPos.length;
    };
    
    this.changeLevel = function(){
        for(var i=0;i<_aNuggets.length;i++){
            _aNuggets[i].unload();
        }
        
        for(var t=0;t<_aMalus.length;t++){
            _aMalus[t].unload();
        }
        
        _iSlowDown = 0;
        _iHookSpeed = HOOK_SPEED;
	_oHook.reset();
        
        _iRopeSpeed+=0.025;
        _iTimeElaps = LEVEL_TIME;
        
        _aNuggets = new Array();
        var aPos = _oLevelSettings.getNuggetPosInLevel(_iCurLevel);
        var aInfo = _oLevelSettings.getNuggetInfoInLevel(_iCurLevel);
        for(var k=0;k<aPos.length;k++){
            var oSprite = s_oSpriteLibrary.getSprite('nugget_'+aInfo[k].type);       
            var oNugget = new CNugget(aPos[k].x,aPos[k].y,aInfo[k].scale,oSprite);  
            
            _aNuggets.push(oNugget);
        }
        
        _aMalus= new Array();
        var oSpriteMalus = s_oSpriteLibrary.getSprite('malus');
        var aMalusPos = _oLevelSettings.getMalusPosInLevel(_iCurLevel);
        for(var j=0;j<aMalusPos.length;j++){
            var oMalus = new CMalus(aMalusPos[j].x,aMalusPos[j].y,1,oSpriteMalus);
            _aMalus.push(oMalus);
        }
        
        _iNuggetToRemove = aPos.length;
        
	this.changeState(STATE_HOOK_ROTATE);
        _bUpdate = true;
        
        $(s_oMain).trigger("start_level",_iCurLevel);
    };
    
    this.changeState = function(iState){
        _iState = iState;
        
        switch(_iState){
            case STATE_HOOK_ROTATE:{
                if(_oDraggingNugget){
                    if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                        playSound("bonus",1,false);
                    }
                    
                    _iScore += _oDraggingNugget.getValue();
                    _oTargetTextBack.text = _iScore + "$/" + _iCurTargetLevel+"$";
                    _oTargetText.text = _iScore + "$/" + _iCurTargetLevel+"$";
                    
                    _oDraggingNugget.hide();
                    _oDraggingNugget = null;
                    
                    _iNuggetToRemove--;

                    if(_iNuggetToRemove === 0){
                        this._endLevel();
                    }
                }else if(_oHook){
                    _oHook.reset();
                }				
                break;
            }
        }
    };
    
    this._checkCollision = function( oHook, oNugget ){
        var vHookPos   = oHook.getPos();
        var vNuggetPos = oNugget.getPos();
        var fNuggetRadius = oNugget.getRadius();
        
        var fDistance =  Math.sqrt( ( (vNuggetPos.x - vHookPos.x)*(vNuggetPos.x - vHookPos.x) ) + 
                                    ( (vNuggetPos.y - vHookPos.y)*(vNuggetPos.y - vHookPos.y) ) );
        
        if ( fDistance < fNuggetRadius ){
            return true;
        }else{
            return false;
        }
    };
    
    this.hookOutOfBounds = function(){
        _iSlowDown = 0;
        this.changeState(STATE_HOOK_MOVE_BACK);
    };
    
    
    this._endLevel = function(){
        _bUpdate = false;
	_iState = -1;
        $(s_oMain).trigger("end_level",_iCurLevel);
        
        if(_iScore < _iCurTargetLevel){
            this._gameOver();
        }else{
            _iCurLevel++;

            if(_iCurLevel > _oLevelSettings.getNumLevels()){
                this._win();
            }else{
                _iCurTargetLevel = _oLevelSettings.getLevelTarget(_iCurLevel);
                _oLevelText.text = TEXT_LEVEL + " "+_iCurLevel;
                _oLevelTextBack.text = TEXT_LEVEL + " "+_iCurLevel;
                _oTargetText.text = _iScore + "$/"+ _iCurTargetLevel + "$";
                _oTargetTextBack.text = _iScore + "$/" + _iCurTargetLevel+"$";
                
                _oChangeLevel = new CChangeLevel(s_oSpriteLibrary.getSprite("msg_box"));
                _oChangeLevel.show(_iCurLevel,_iCurTargetLevel);
            }
        }
    };
    
    this.showHurt = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            playSound("explosion",1,false);
        }
                    
       _oHurt.visible = true;
        var oParent = this;
        
        createjs.Tween.get(_oHurt).to({alpha:0.6 }, 400).call(function() {oParent._resetHurt();});  
    };

    this._resetHurt = function(){
        _oHurt.visible = false;
        _oHurt.alpha = 0.5;
    };
    
    this._gameOver = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            playSound("game_over",1,false);
        }
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
                                   
        _oEndPanel.show(_iScore,false);
    };
    
    this._win = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            playSound("win",1,false);
        }
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore,true);
    };
    
    this._onStartDig = function(){
        if(_iState === STATE_HOOK_ROTATE){
            _iDirHook = (_oHook.getRotationDeg()+90)*0.0174532925;

            this.changeState(STATE_HOOK_MOVE);
        }
    };
    
    this.onExitHelp = function(){
        _bUpdate = true;
    };
    
    this._onExit = function(){
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event",_iScore);
        $(s_oMain).trigger("save_score",_iScore);
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
        _iTimeElaps -= s_iTimeElaps;
        var iCurSec = Math.floor(_iTimeElaps/1000);
	_oTimeText.text = ""+ iCurSec;
        _oTimeTextBack.text = ""+ iCurSec;
        
        if(_iTimeElaps < 0){
            _oTimeText.text = "0";
            _oTimeTextBack.text = "0";
            this._endLevel();
        }
        
        switch(_iState){
            case STATE_HOOK_ROTATE:{
                _oHook.updateRotation(_iRopeSpeed);    
                break;
            }
            case STATE_HOOK_MOVE:{
                _oHook.updateMove(); 
               
                for(var i=0;i<_aNuggets.length;i++){
                    if(_aNuggets[i].isActive() && this._checkCollision(_oHook,_aNuggets[i])){ 
                        //console.log("COLLIDE WITH "+_aNuggets[i].getX()+","+_aNuggets[i].getY()+" WIDTH: "+_aNuggets[i].getWidth());
                        
                        _iSlowDown = Math.floor(_aNuggets[i].getRadius()) / 8;
                        _oDraggingNugget = _aNuggets[i];
                        
                        this.changeState(STATE_HOOK_MOVE_BACK);
                        break;
                    }
                }
                
                for(var j=0;j<_aMalus.length;j++){
                    if(this._checkCollision(_oHook,_aMalus[j])){
                        _iSlowDown = 0;
                        this.showHurt();
                        
                        this.changeState(STATE_HOOK_MOVE_BACK);
                        
                        _iScore -= MALUS_SCORE;
                        if(_iScore<0){
                            _iScore = 0;
                        }
                        _oTargetText.text = _iScore + "$/"+ _iCurTargetLevel + "$";
                        _oTargetTextBack.text = _iScore + "$/" + _iCurTargetLevel+"$";
                        
                        _aMalus[j].unload();
                        _aMalus.splice(j,1);
                        break;
                    }
                }
                break;
            }
            case STATE_HOOK_MOVE_BACK:{
                _oHook.updateMoveBack(_iSlowDown);
                if(_oDraggingNugget){
                    _oDraggingNugget.updateMoveBack(_iHookSpeed - _iSlowDown,_iDirHook);
                }
                break;
            }
        }
    };
    
    s_oGame=this;

    MALUS_SCORE = oData.malus_score;
    HOOK_SPEED = oData.hook_speed;
    LEVEL_TIME = oData.level_time;

    this._init();
}

var s_oGame = null;
