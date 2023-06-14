function CGame(){
    var _bUpdate = false;
    var _bRightDir;
    var _bStartEnemySpawn;
    var _bStartRace;
    var _bKeyDownLeft;
    var _bKeyDownRight;
    var _bJumpGateOnRight;
    var _bArrival;
    var _bGameOver;
    
    var _iTotScore;
    var _iTotBest;
    var _iCurLevelScore;
    var _iCurLevel;
    var _iCurGateType;
    var _iTimeElapsSpawn;
    var _iCurIntervalNumCheck;
    var _iIntervalNumCheck;
    var _iCurGateSpawn;
    var _iCurEnemySpawnTime;
    var _iRemainingTimeFromPrev;
    var _iOffsetYBg;
    var _iTimeTrack;
    var _iCurBestIndex;
    var _iCurTrembleIndex;
    var _iIdInterval;
    var _aGate;
    var _aGateInfos;
    var _aTrembleSequence;
    var _aBestTimeInterval;
    var _aTmpBestTime;
    
    var _oBg;
    var _oContainerParallax;
    var _oField;
    var _oInterface;
    var _oMap;
    var _oContainerField;
    var _oContainerGate;
    var _oCountdown;
    var _oPlayer;
    var _oHelpPanel;
    var _oEndPanel;
    var _oNextLevelPanel;
    
    var _fCameraAcc;
    
    this._init = function(){
        _iCurLevel = s_iLevelSelected;
        _iTotScore = s_oMain.getScoreTillLevel(_iCurLevel);
        
        _aTrembleSequence = new Array({x:10,y:0},{x:-20,y:0},{x:10,y:-10},{x:0,y:20},{x:10,y:-10},{x:-10,y:0},
                                        {x:10,y:0},{x:-20,y:0},{x:10,y:-10},{x:0,y:20},{x:10,y:-10},{x:-10,y:0});
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_game');
        _oContainerField = new createjs.Container();
        _oContainerField.x = (oSpriteBg.width/2);
        _oContainerField.y = CANVAS_HEIGHT/2;
        _oContainerField.regX = oSpriteBg.width/2;
        _oContainerField.regY = 420;
        s_oStage.addChild(_oContainerField);
        
	
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = -50;
        _oContainerField.addChild(_oBg);
        
        _oContainerParallax = new createjs.Container();
        _oContainerField.addChild(_oContainerParallax);
        
        var oParallax1 = createBitmap(s_oSpriteLibrary.getSprite("parallax_0"));
        oParallax1.x = -15;
        oParallax1.y = 100;
        _oContainerParallax.addChild(oParallax1);
        
        var oParallax2 = createBitmap(s_oSpriteLibrary.getSprite("parallax_1"));
        oParallax2.x = 825;
        oParallax2.y = 150;
        _oContainerParallax.addChild(oParallax2);
        
        
        _oField = new CField(-50,131,_oContainerField);
        _oField.addEventListener(ON_READY_FOR_PLAYER_ARRIVAL,this.playArrival,this);

        _oContainerGate = new createjs.Container();
        _oContainerField.addChild(_oContainerGate);
        
        _oPlayer = new CPlayer(CANVAS_WIDTH/2,850,_oContainerGate);
        _oPlayer.addEventListener(ON_PLAYER_ARRIVAL,this._onWinLevel,this);
        _oPlayer.addEventListener(ON_PLAYER_FALL,this._onEndLevel,this);
        
        _oCountdown = new CCountdownController(CANVAS_WIDTH/2,CANVAS_HEIGHT/2-150,s_oStage);
        _oCountdown.addEventListener(ON_END_COUNTDOWN,this.startRace,this);
        
        _oInterface = new CInterface(_iTotScore);
        
        _oMap = new CMap(CANVAS_WIDTH - 150, 200,s_oStage);
        this.reset();
        
        _oHelpPanel = new CHelpPanel();
        _oHelpPanel.show();
        
        _oEndPanel = new CEndPanel();
        _oEndPanel.addEventListener(ON_RESTART,this.restart,this);
        _oEndPanel.addEventListener(ON_BACK_MENU,this.onExit,this);

        _oNextLevelPanel = new CNextLevelPanel();
        _oNextLevelPanel.addEventListener(ON_RESTART,this.restart,this);
        _oNextLevelPanel.addEventListener(ON_BACK_MENU,this.onExit,this);
        _oNextLevelPanel.addEventListener(ON_NEXT_LEVEL,this._onNextLevel,this);
        
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 400).call(function(){oFade.visible = false;}); 
    };
    
    this.unload = function(){
        _bUpdate = false;
        
        _oInterface.unload();
       
        s_oStage.removeAllChildren();
		
	s_oGame = null;
    };
    
    this.reset = function(){    
        _bArrival = false;
        _bKeyDownLeft = false;
        _bKeyDownRight = false;
        _bGameOver = false;
        _bStartEnemySpawn = false;
        _bStartRace = false;
        _bJumpGateOnRight = true;
        _bRightDir = true;
        _iCurLevelScore = 0;
        _iTimeElapsSpawn = 0;
        _iTimeTrack = 0;
        _iCurBestIndex = 0;
        _iRemainingTimeFromPrev = 0;
        _iCurIntervalNumCheck = 0;
        _iCurGateType = "red";
        _aTmpBestTime = new Array();

        _fCameraAcc = 0;

        _aGate = new Array();
        _aBestTimeInterval = s_oMain.getBestIntervalsPerLevel(_iCurLevel);
        
        _aGateInfos = s_oLevelSettings.getGateInfos(_iCurLevel);
        _iCurGateSpawn = 0;
        _iCurEnemySpawnTime = _aGateInfos[_iCurGateSpawn].time_next;
        
        _iIntervalNumCheck = Math.round(_aGateInfos.length/NUM_INTERVAL);
        _iTotScore = s_oMain.getScoreTillLevel(_iCurLevel);
        _iOffsetYBg = parseFloat( (-200/_aGateInfos.length).toFixed(2));
        
        
        _iTotBest = s_oMain.getTotBestTimePerLevel(_iCurLevel);
        if(_iTotBest === null){
            _iTotBest = "00:00:00";
        }
        
        _oBg.y = -50;
        _oContainerParallax.y = 200;
        _oPlayer.reset();
        _oInterface.reset(_iTotScore,_iCurLevel,_iTotBest);
        _oCountdown.reset();
        _oField.reset();
        _oMap.reset(_aGateInfos.length+1);

        setMusicVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME );
        $(s_oMain).trigger("start_level",_iCurLevel);
    };
    
    this.restart = function(){
        $(s_oMain).trigger("restart_level",_iCurLevel);
        
        //REMOVE GATES
        for(var i=0;i<_aGate.length;i++){
            _aGate[i].unload();
        }
        
        this.reset();
        
        this.startCountdown();
    };
    
    this.refreshButtonPos = function(){
        _oInterface.refreshButtonPos();
        _oMap.refreshButtonPos();
    };
    
    this.onKeyDown = function(evt) {
        if (!_bUpdate || _bGameOver || _oPlayer.getCurAnim() === PLAYER_ANIM_ARRIVAL ){
            evt.preventDefault();
            return false;
        }
 
        if(!evt){ 
            evt = window.event; 
        }  
        _oPlayer.resetMovGates();
        switch(evt.keyCode) {  
            // left  
            case 37: {
                _bKeyDownRight = false;
                _bKeyDownLeft = true;
                _oPlayer.moveLeft(true);
                break; 
            }
                              
            // right  
            case 39: {
                _bKeyDownLeft = false;
                _bKeyDownRight = true;
                _oPlayer.moveRight(true);
                break; 
            }
        } 
        
        evt.preventDefault();
        return false;
    };
    
    this.onKeyUp = function(evt) { 
        if (!_bUpdate ||   _bGameOver || _oPlayer.getCurAnim() === PLAYER_ANIM_ARRIVAL){
            evt.preventDefault();
            return false;
        }
        
        if(!evt){ 
            evt = window.event; 
        } 

        _bKeyDownLeft = false;
        _bKeyDownRight = false;
        switch(evt.keyCode) {  
           // left  
           case 37: {
                   _oPlayer.moveLeft(false);
                   break; 
               }
                              
           // right  
           case 39: {
                   _oPlayer.moveRight(false);
                   break; 
               }
        } 
        
        evt.preventDefault();
        return false;
    };
    
    this.moveLeft = function(bLeft){
        if(!_bUpdate || (bLeft && _bKeyDownLeft) || _bGameOver || _oPlayer.getCurAnim() === PLAYER_ANIM_ARRIVAL){
            return;
        }
        
        _bKeyDownLeft = bLeft;
        _oPlayer.moveLeft(bLeft);
    };
    
    this.moveRight = function(bRight){
        if(!_bUpdate || (bRight && _bKeyDownRight) || _bGameOver || _oPlayer.getCurAnim() === PLAYER_ANIM_ARRIVAL){
            return;
        }
        
        _bKeyDownRight = bRight;
        _oPlayer.moveRight(bRight);
    };
    
    this.startCountdown = function(){
        _oPlayer.show();
        _oField.show();
        _oCountdown.start();
        
        _bUpdate = true;
    };
    
    this.startRace = function(){
        this._spawnEnemy();
        _bStartRace = true;
    };

    
    this.onExitFromHelp = function(){
        
        this.startCountdown();
    };
    
    this._spawnEnemy = function(){
        _bStartEnemySpawn = true;
        

        if(_iCurGateSpawn === _aGateInfos.length){
            _oMap.reachFinalPos(_iCurEnemySpawnTime+_iRemainingTimeFromPrev);
            return;
        }
        
        if(_iCurGateSpawn <3){
            _oInterface.showHandCursor(_bRightDir);
            _bRightDir = !_bRightDir;
        }else{
            _oInterface.hideHandCursor();
        }
        
        
        //SPAWN ENEMY
        _iCurGateSpawn++;
        var bLastGate = false;
        if(_iCurGateSpawn === _aGateInfos.length){
            bLastGate = true;
            _bArrival = true;
            _oMap.refreshPlayerPos(_iCurEnemySpawnTime+_iRemainingTimeFromPrev,true);
            
        }else{
            if(_iCurGateSpawn === _aGateInfos.length-2){
                _oField.prepareSponsorsForStop();
            }
            _oMap.refreshPlayerPos(_iCurEnemySpawnTime+_iRemainingTimeFromPrev,false);
        }
        
        
        
        //CHECK INTERVAL TIME
        _iCurIntervalNumCheck++;

        if(_iCurIntervalNumCheck === _iIntervalNumCheck){
            _iCurIntervalNumCheck = 0;
            if(_aBestTimeInterval.length>0 && _iCurBestIndex < _aBestTimeInterval.length-1){
                //COMPARE BEST TIME INTERVAL WITH THE CURRENT TIME INTERVAL
                var iDiff = _iTimeTrack-_aBestTimeInterval[_iCurBestIndex];

                _oInterface.showNextInterval(_iCurBestIndex,iDiff);
                
                _iCurBestIndex++;
            }

            _aTmpBestTime.push(_iTimeTrack);
        }
        
        
        var iFinalX = _aGateInfos[_iCurGateSpawn-1].final_x;

        var iStartX = (((iFinalX -MIN_ARRIVAL_X )/ARRIVAL_X_INTERVAL)* START_X_INTERVAL ) + MIN_START_X;
        
        
        var oGate = new CGate(bLastGate,iStartX,500,iFinalX,_iCurGateType,_oContainerGate);
        oGate.addEventListener(ON_GATE_HIDE,this.checkArrival,this);
        oGate.addEventListener(ON_GATE_CHECK_COLLISION,this.checkCollision,this);
        _aGate.push(oGate);
        
        var iNewY = _oBg.y + _iOffsetYBg;
        new createjs.Tween.get(_oBg).to({y:iNewY},_iCurEnemySpawnTime);
        
        var iNewY = _oContainerParallax.y + _iOffsetYBg*1.5;
        new createjs.Tween.get(_oContainerParallax).to({y:iNewY},_iCurEnemySpawnTime);
        
        _iCurEnemySpawnTime = _aGateInfos[_iCurGateSpawn-1].time_next;
        _iCurGateType = (_iCurGateType==="red"?"blue":"red");
    };
    
    this.checkArrival = function(bLast){
        if(bLast && !_bGameOver){
            _oField.readyForArrival();
            playSfxSound("crowd_idle",1,false);
        }
    };
    
    this.checkCollision = function(oEnemyRect,oEnemy){
        if(_bGameOver){
            return;
        }
        
        //CHECK COLLISION BETWEEN PLAYER AND GATES
        var oRectPlayer = _oPlayer.getRect();
        
        if( oRectPlayer.intersects(oEnemyRect)){
            _bGameOver = true;
            _bStartRace = false;
            
            _iCurTrembleIndex = 0;
            var oParent = this;
            _iIdInterval = setInterval(function(){oParent.tremble();},20);

            _oPlayer.changeAnim(PLAYER_ANIM_FALL);
            oEnemy.playAnim(oEnemyRect.x>oRectPlayer.x?"left":"right");
        }else{
            var iDistX = Math.abs(oEnemyRect.x-oRectPlayer.x);
            if(iDistX < DIST_X_FOR_GATE_ANIM){
                oEnemy.playAnim(oEnemyRect.x>oRectPlayer.x?"left":"right");
                
            }
            
            //CHECK IF GATE WAS JUMPED
            if( (_bJumpGateOnRight && oRectPlayer.x < oEnemyRect.x) || (_bJumpGateOnRight === false && oRectPlayer.x > oEnemyRect.x) ){
                _bGameOver = true;
                _bStartRace = false;
                stopSfxSound("skiing");
                this._onEndLevel(TEXT_JUMP_GATE);
            }else{
                if(iDistX < DIST_X_FOR_GATE_ANIM){
                    new CEncouragement(oEnemyRect.x,400,TEXT_ENCOURAGEMENT[Math.floor(Math.random()*TEXT_ENCOURAGEMENT.length)],s_oStage);
                }
                
                iDistX = Math.abs(iDistX);
                this.refreshScore(DIST_X_FOR_GATE_ANIM - iDistX );
            }
            
            _bJumpGateOnRight = !_bJumpGateOnRight;
            
        }
  
        _oContainerGate.swapChildren(oEnemy.getContainer(),_oPlayer.getContainer());
    };
    
    this.tremble = function(){
        var oDir = _aTrembleSequence[_iCurTrembleIndex];
        _oContainerField.x = _oContainerField.x + oDir.x;
        _oContainerField.y = _oContainerField.y + oDir.y;

        _iCurTrembleIndex++;
        if(_iCurTrembleIndex === _aTrembleSequence.length){
            _iCurTrembleIndex = 0;
            clearInterval(_iIdInterval);
        }
    };
    
    this.refreshScore = function(iAmount){
        if(iAmount<0){
            iAmount = 0;
        }else{
            iAmount = parseInt(iAmount);
        }
        
        _iCurLevelScore += iAmount;
        _iTotScore += iAmount;
        
        _oInterface.refreshScore(_iTotScore);
    };
    
    this.playArrival = function(){
        _bKeyDownLeft = false;
        _bKeyDownRight = false;
        _oPlayer.changeAnim(PLAYER_ANIM_ARRIVAL);
    };
    
    this._manageGateDepth = function(){
        var sortFunction = function(obj1, obj2, options) {
            if (obj1.y > obj2.y) { return 1;}
            if (obj1.y < obj2.y) { return -1;}
            return 0;
        };
        
        _oContainerGate.sortChildren(sortFunction);
    };
    
    this.endTrack = function(){
        _bStartRace = false;
        
        _aTmpBestTime[NUM_INTERVAL-1]= _iTimeTrack;
        
        if(_aBestTimeInterval.length>0){
            var iDiff = _iTimeTrack-_aBestTimeInterval[NUM_INTERVAL-1];
            _oInterface.showNextInterval(NUM_INTERVAL-1,iDiff);
        }
        
                
        
        //CHECK IF BEST TIME
        if(_aBestTimeInterval.length === 0 || _aBestTimeInterval[_aBestTimeInterval.length-1] > _iTimeTrack){
            s_oMain.setBestTime(_iCurLevel,_aTmpBestTime);
        }
    };
    
    this._onEndLevel = function(szMsg){
        $(s_oMain).trigger("end_level",_iCurLevel);

        _oInterface.hideHandCursor();
        
        setTimeout(function(){  
                                _oPlayer.stopAnim();
                                _oField.stopAnim();
                                for(var k=0;k<_aGate.length;k++){
                                    _aGate[k].stopUpdate();
                                }
                                _oEndPanel.show(_iTotScore,szMsg);
                            },500);
    };
    
    this._onWinLevel = function(){
        
        $(s_oMain).trigger("end_level",_iCurLevel);
        $(s_oMain).trigger("save_score",_iTotScore);
   
        if(_iCurLevel === NUM_LEVELS){
            setTimeout(function(){_oEndPanel.show(_iTotScore,TEXT_CONGRATS);},500);
        }else{
            s_oMain.setLocalStorageLevel(_iCurLevel+1);

            setTimeout(function(){_oNextLevelPanel.show(_iTimeTrack,_iTotBest,_iCurLevelScore,_iTotScore,_iCurLevel);},500);
        }
        s_oMain.setLocalStorageScore(_iCurLevelScore,_iCurLevel);
    };
    
    this._onNextLevel = function(){
        _iCurLevel++;
        
        this.reset();
        
        this.startCountdown();
    };

    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        
	$(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event",_iTotScore);
    };
    
    this.getPlayerX = function(){
        return _oPlayer.getX();
    };
    
    
    
    this.update = function(){
        if(_oHelpPanel.isVisible()){
            _oHelpPanel.update();
        }
        
        if(_bUpdate === false){
            return;
        }
        
        if(_bStartRace){
            _iTimeTrack += s_iTimeElaps;
            _oInterface.refreshTime(_iTimeTrack);
        }
        
        //UPDATE SCREEN ROTATION
        var fAccFactor = 0.4;
        
        if(_bKeyDownLeft && _oContainerField.rotation > -MAX_ROT_FIELD ){
            _fCameraAcc -= fAccFactor;
            if(_fCameraAcc < -MAX_ROT_FIELD){
                _fCameraAcc = -MAX_ROT_FIELD;
            }
        }else if(_bKeyDownRight && _oContainerField.rotation < MAX_ROT_FIELD){
          _fCameraAcc += fAccFactor;
          if(_fCameraAcc > MAX_ROT_FIELD){
                _fCameraAcc = MAX_ROT_FIELD;
            }
        }else if(_bKeyDownLeft === false && _bKeyDownRight === false){
            _fCameraAcc /= 1.1;
        }
        
        _oContainerField.rotation = _fCameraAcc;

        var iAccelleration = _oPlayer.update();
        _iCurEnemySpawnTime += iAccelleration;
        
        _oField.update();
        
        this._manageGateDepth();
        for(var i=0;i<_aGate.length;i++){
            _aGate[i].update();
        }
        
        if(!_bGameOver && _bStartEnemySpawn){
            _iTimeElapsSpawn += s_iTimeElaps;
            if(!_bArrival && _iTimeElapsSpawn > _iCurEnemySpawnTime){
                _iTimeElapsSpawn = 0;
                _iRemainingTimeFromPrev =  _iCurEnemySpawnTime-_aGateInfos[_iCurGateSpawn-1].time_next;
                //trace("_aGateInfos["+(_iCurGateSpawn-1)+"].time_next "+_aGateInfos[_iCurGateSpawn-1].time_next)
                //trace("_iCurEnemySpawnTime "+_iCurEnemySpawnTime)
                //trace("_iRemainingTimeFromPrev "+_iRemainingTimeFromPrev)
                this._spawnEnemy();
            }
        }
    };
    
    s_oGame = this;

        
    this._init();
}

var s_oGame = null;