function CGame(){
    var _bUpdate = false;
    var _bStartEnemySpawn;
    var _bKeyDownLeft;
    var _bKeyDownRight;
    var _bArrival;
    var _bGameOver;
    
    var _iTotScore;
    var _iCurLevelScore;
    var _iCurLevel;
    var _iTimeElapsSpawn;
    var _iNumEnemiesSpawn;
    var _iCurEnemySpawnTime;
    var _iCurMaxEnemySpawnNumber;
    var _iOffsetYBg;
    var _iCurTrembleIndex;
    var _iIdInterval;
    var _aOpponent;
    var _aFinalX;
    var _aTrembleSequence;
    
    var _oBg;
    var _oField;
    var _oInterface;
    var _oContainerField;
    var _oContainerOpponent;
    var _oCountdown;
    var _oPlayer;
    var _oHelpPanel;
    var _oEndPanel;
    var _oNextLevelPanel;
    
    this._init = function(){
        _iCurLevel = s_iLevelSelected;
        _iTotScore = s_oMain.getScoreTillLevel(_iCurLevel);
        
        _aTrembleSequence = new Array({x:10,y:0},{x:-20,y:0},{x:10,y:-10},{x:0,y:20},{x:10,y:-10},{x:-10,y:0},{x:10,y:0},{x:-20,y:0},{x:10,y:-10},{x:0,y:20},{x:10,y:-10},{x:-10,y:0});
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_game');
        _oContainerField = new createjs.Container();
        _oContainerField.x = oSpriteBg.width/2;
        _oContainerField.y = CANVAS_HEIGHT/2;
        _oContainerField.regX = oSpriteBg.width/2;
        _oContainerField.regY = 424;
        s_oStage.addChild(_oContainerField);
        
	
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = -50;
        _oContainerField.addChild(_oBg);
        
        _oField = new CField(-50,220,_oContainerField);
        _oField.addEventListener(ON_READY_FOR_PLAYER_ARRIVAL,this.playArrival,this);

        _oContainerOpponent = new createjs.Container();
        _oContainerField.addChild(_oContainerOpponent);
        
        _oPlayer = new CPlayer(CANVAS_WIDTH/2,850,_oContainerOpponent);
        _oPlayer.addEventListener(ON_PLAYER_ARRIVAL,this._onWinLevel,this);
        _oPlayer.addEventListener(ON_PLAYER_FALL,this._onEndLevel,this);
        
        _oCountdown = new CCountdownController(CANVAS_WIDTH/2,CANVAS_HEIGHT/2-150,s_oStage);
        _oCountdown.addEventListener(ON_END_COUNTDOWN,this.startRace,this);
        _oInterface = new CInterface(_iTotScore);
        
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
        _iCurLevelScore = 0;
        _iTimeElapsSpawn = 0;

        _aOpponent = new Array();
        
        _iNumEnemiesSpawn = s_oLevelSettings.getEnemiesSpawn(_iCurLevel);
        _iCurEnemySpawnTime = s_oLevelSettings.getStartingEnemySpawn(_iCurLevel);
        _iCurMaxEnemySpawnNumber = s_oLevelSettings.getEnemySpawnNumber(_iCurLevel);
        
        
        _iTotScore = s_oMain.getScoreTillLevel(_iCurLevel);
        _iOffsetYBg = parseFloat( (-334/_iNumEnemiesSpawn).toFixed(2));
        
        
        _oBg.y = 0;
        _oPlayer.reset();
        _oInterface.reset(_iTotScore,_iCurLevel);
        _oCountdown.reset();
        _oField.reset();

        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME );
        $(s_oMain).trigger("start_level",_iCurLevel);
    };
    
    this.restart = function(){
        $(s_oMain).trigger("restart_level",_iCurLevel);
        
        //REMOVE OPPONENTS
        for(var i=0;i<_aOpponent.length;i++){
            _aOpponent[i].unload();
        }
        
        this.reset();
        
        this.startCountdown();
    };
    
    this.refreshButtonPos = function(){
        _oInterface.refreshButtonPos();
    };
    
    this.onKeyDown = function(evt) {
        if (!_bUpdate || _bGameOver || _oPlayer.getCurAnim() === PLAYER_ANIM_ARRIVAL){
            evt.preventDefault();
            return false;
        }
 
        if(!evt){ 
            evt = window.event; 
        }  
        
        switch(evt.keyCode) {  
            // left  
            case 37: {
                _bKeyDownLeft = true;
                _oPlayer.moveLeft(true);
                break; 
            }
                              
            // right  
            case 39: {
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
        
        
    };
    
    this._createSpawnArray = function(){
        _aFinalX = new Array();

        var iOffset = ARRIVAL_X_INTERVAL/5;

        var iCurX = MIN_ARRIVAL_X;
        for(var k=0;k<6;k++){ 
            _aFinalX.push(iCurX);
            iCurX += iOffset;
        }

        _aFinalX = shuffle(_aFinalX);
    };
    
    this.onExitFromHelp = function(){
        
        this.startCountdown();
    };
    
    this._spawnEnemy = function(){
        _bStartEnemySpawn = true;


        if(_iNumEnemiesSpawn === 0){
            return;
        }

        //SPAWN ENEMY
        _iNumEnemiesSpawn--;

        var bLastOpponent = false;
        if(_iNumEnemiesSpawn === 0){
            bLastOpponent = true;
            _bArrival = true;
        }else if(_iNumEnemiesSpawn === 2){
            _oField.prepareSponsorsForStop();
        }

        var iRandType = Math.floor(Math.random()*3);

        var iFinalX;
        if(Math.random()>0.3){
            iFinalX = ((_oPlayer.getX() - CANVAS_WIDTH/2)*1) + _oPlayer.getX();
        }else{
            this._createSpawnArray();
            iFinalX = _aFinalX.pop();
        }

        var iStartX = (((iFinalX -MIN_ARRIVAL_X )/ARRIVAL_X_INTERVAL)* START_X_INTERVAL ) + MIN_START_X;

        var oOpponent = new COpponent(bLastOpponent,iStartX,500,iFinalX,iRandType,_oContainerOpponent);
        oOpponent.addEventListener(ON_OPPONENT_HIDE,this.checkArrival,this);
        oOpponent.addEventListener(ON_OPPONENT_CHECK_COLLISION,this.checkCollision,this);
        _aOpponent.push(oOpponent);

        var iNewY = _oBg.y + _iOffsetYBg;
        new createjs.Tween.get(_oBg).to({y:iNewY},_iCurEnemySpawnTime);
        

    };
    
    this.checkArrival = function(bLast){
        if(bLast && !_bGameOver){
            _oField.readyForArrival();
            playSound("crowd_idle",1,false);
        }
    };
    
    this.checkCollision = function(oEnemyRect,oEnemyContainer){
        if(_bGameOver){
            return;
        }
        
        //CHECK COLLISION BETWEEN PLAYER AND OPPONENTS
        var oRectPlayer = _oPlayer.getRect();
        
        var iDistX = Math.abs(oEnemyRect.x-oRectPlayer.x);
        if( oRectPlayer.intersects(oEnemyRect)){
            _bGameOver = true;
            
            _iCurTrembleIndex = 0;
            var oParent = this;
            _iIdInterval = setInterval(function(){oParent.tremble();},20);

            _oPlayer.changeAnim(PLAYER_ANIM_FALL);
        }else{
            this.refreshScore(Math.floor(iDistX/200));
        }
        
        _oContainerOpponent.swapChildren(oEnemyContainer,_oPlayer.getContainer());
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
        _iCurLevelScore += iAmount;
        _iTotScore += iAmount;
        
        _oInterface.refreshScore(_iTotScore);
    };
    
    this.playArrival = function(){
        _bKeyDownLeft = false;
        _bKeyDownRight = false;
        _oPlayer.changeAnim(PLAYER_ANIM_ARRIVAL);
    };
    
    this._manageOpponentDepth = function(){
        var sortFunction = function(obj1, obj2, options) {
            if (obj1.y > obj2.y) { return 1;}
            if (obj1.y < obj2.y) { return -1;}
            return 0;
        };
        
        _oContainerOpponent.sortChildren(sortFunction);
    };

    this._onEndLevel = function(){
        $(s_oMain).trigger("end_level",_iCurLevel);
        
        _oField.stopAnim();
        for(var k=0;k<_aOpponent.length;k++){
            _aOpponent[k].stopUpdate();
        }
        
        
        setTimeout(function(){_oEndPanel.show(0,TEXT_GAME_OVER);},500);
    };
    
    this._onWinLevel = function(){
        
        $(s_oMain).trigger("end_level",_iCurLevel);
        $(s_oMain).trigger("save_score",_iTotScore);
        
        if(_iCurLevel === NUM_LEVELS){
            setTimeout(function(){_oEndPanel.show(_iTotScore,TEXT_CONGRATS);},500);
        }else{
            s_oMain.setLocalStorageLevel(_iCurLevel+1);
            
            setTimeout(function(){_oNextLevelPanel.show(_iCurLevelScore,_iTotScore,_iCurLevel);},500);
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
        
        //UPDATE SCREEN ROTATION
        if(_bKeyDownLeft && _oContainerField.rotation > -4 ){
            _oContainerField.rotation -= 0.5;
        }else if(_bKeyDownRight && _oContainerField.rotation < 4){
            _oContainerField.rotation += 0.5;
        }else if(_bKeyDownLeft === false && _bKeyDownRight === false){
            if(_oContainerField.rotation > 0){
                _oContainerField.rotation -= 0.5;
            }else if( _oContainerField.rotation < 0){
                _oContainerField.rotation += 0.5;
            }
        }
        
        _oPlayer.update();
        _oField.update();
        
        this._manageOpponentDepth();
        for(var i=0;i<_aOpponent.length;i++){
            _aOpponent[i].update();
        }
        
        if(!_bGameOver && _bStartEnemySpawn){
            _iTimeElapsSpawn += s_iTimeElaps;
            if(!_bArrival && _iTimeElapsSpawn > _iCurEnemySpawnTime){
                _iTimeElapsSpawn = 0;
                this._spawnEnemy();
            }
        }
    };
    
    s_oGame = this;

        
    this._init();
}

var s_oGame = null;