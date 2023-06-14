function CGame(oData){
    var _iScore;
    var _iPlayerLife;
    var _iTimerSpawn;
    var _iTimerStage;
    var _iSpawnTime;
    var _iStageTime;
    var _iStage;   
    var _iMaxSpawn;
    var _iBgDepth;
    var _iSpawnSurvivor;
    var _iWave;
    var _iAdCounter;

    var _bStartGame=false;
    var _bTouchActive;
    var _bStopSpawn=false;
      
    var _oTextStageBack;
    var _oTextStage;
    var _oInterface;
    var _oEndPanel = null;
    var _oHelpPanel;
    var _oZombieContainer; 
    var _oBridgeContainer;
    var _oParent;
    var _oFeedbackRed;
    var _oFeedbackGreen;
    var _oZombieSound;
    var _oPausePanel;
    
    var _aZombie;
    var _aSpawnProb;
    var _aOrder;

    var _oClickArea;
    
    this._init = function(){
	_iTimerSpawn=0;
        _iTimerStage=0;
        _iMaxSpawn=0;        
        _iSpawnTime = SPAWN_TIME;
        _iStageTime = STAGE_START_TIME;
        _iStage = 0;
        _iScore = 0;
        _iWave=_iStage;
        _iPlayerLife=PLAYER_LIFE;
        _iAdCounter=0;
        
        _bTouchActive=false;
        
        _aOrder = new Array();
        
        _aSpawnProb= new Array();
        this._setProbability();
 
        
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas
        _iBgDepth = s_oStage.getChildIndex(oBg);
        

        _aZombie = new Array();
        _oZombieContainer = new createjs.Container();
        s_oStage.addChild(_oZombieContainer);               
                
        var oSprite = s_oSpriteLibrary.getSprite('bridge');
        var oBridge = createBitmap(oSprite);
        _oBridgeContainer = new createjs.Container();
        _oBridgeContainer.regY = oSprite.height;
        _oBridgeContainer.y = CANVAS_HEIGHT;
        s_oStage.addChild(_oBridgeContainer);               
        _oBridgeContainer.addChild(oBridge);
        
        var graphics = new createjs.Graphics().beginFill("rgba(158,158,158,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - oSprite.height);
        _oClickArea = new createjs.Shape(graphics);   
        _oClickArea.on("mousedown", this._onShoot);
        s_oStage.addChild(_oClickArea);
        
        
        _oTextStageBack = new createjs.Text("","60px "+PRIMARY_FONT, "#ffffff");
        _oTextStageBack.x = CANVAS_WIDTH/2+2;
        _oTextStageBack.y = -98;
        _oTextStageBack.textAlign="center";
        s_oStage.addChild(_oTextStageBack);
        
        _oTextStage = new createjs.Text("","60px "+PRIMARY_FONT, "#fe0000");
        _oTextStage.x = CANVAS_WIDTH/2;
        _oTextStage.y = -100;
        _oTextStage.textAlign="center";
        s_oStage.addChild(_oTextStage);
        
        _oPausePanel = new CPausePanel(s_oStage);
        
        _oInterface = new CInterface();
        
        _oFeedbackRed = new createjs.Shape();
        _oFeedbackRed.graphics.beginFill("rgba(255,0,0,1)").drawRect(0, 0, CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFeedbackRed.alpha=0;
        s_oStage.addChild(_oFeedbackRed);   
        
        _oFeedbackGreen = new createjs.Shape();
        _oFeedbackGreen.graphics.beginFill("rgba(0,255,0,1)").drawRect(0, 0, CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFeedbackGreen.alpha=0;
        s_oStage.addChild(_oFeedbackGreen); 
        
        _oHelpPanel = new CHelpPanel();
        
        if(!s_bMobile){
            document.onkeydown   = onKeyDown;
        }
 
    };
    
    this.tryShowAd = function(){
        _iAdCounter++;
        if(_iAdCounter === AD_SHOW_COUNTER){
            _iAdCounter = 0;
            $(s_oMain).trigger("show_interlevel_ad");
        }
    };

    this.unload = function(){
        _bStartGame = false;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        
        stopSound("zombie_crowd");
        setVolume("soundtrack", 1);
   
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }           
    };
 
    this.onExit = function(){
        createjs.Ticker.paused = false;
        s_bPlayActive=true;
        this.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("end_level",_iWave);
        $(s_oMain).trigger("show_interlevel_ad");
    };
    
    this._onExitHelp = function () {
        _bStartGame = true;
        this.newStage();
        
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        _oZombieSound = playSound("zombie_crowd",1,true);
        setVolume("zombie_crowd", 1);
    };
    
    function onKeyDown(evt){
        if(evt.keyCode === 80){
            s_oInterface.pressPauseButton();            
        }
    };
    
    this.pauseGame = function(){
        s_bPlayActive = !s_bPlayActive;
        
        if(s_bPlayActive){
            _bStartGame = true;
            _oPausePanel.show(false);
            createjs.Ticker.paused = false;
            
        } else {
            _bStartGame = false;
            _oPausePanel.show(true);
            createjs.Ticker.paused = true;
        }
    };
    
    this.gameOver = function(){        
        setVolume("soundtrack", 1);
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('game_over_bg'));
        _oEndPanel.show(_iScore);
    };

    this.getBgDepth = function(){
        return _iBgDepth;
    };
    
    this._onShoot = function(event){

        var iCurTouchX = event.stageX / s_iScaleFactor;
        var iCurTouchY = event.stageY / s_iScaleFactor;
        
        var rRect;
        for(var i=_aOrder.length-1; i>=0; i--){
            rRect = _aOrder[i].zombie.getRect();
            
            if(rRect.contains(iCurTouchX, iCurTouchY) && _aOrder[i].zombie.getState() !== "death"){
                _aOrder[i].zombie.hitZombie();
                break;
            }            
        }        
    };

    this.subtractLife = function(iType){                
        _iPlayerLife=_iPlayerLife + DAMAGE[iType];
        if(_iPlayerLife<=0){
            _bStartGame=false;
            createjs.Tween.removeAllTweens();
            this.gameOver();
        } else if (_iPlayerLife > PLAYER_LIFE){
            _iPlayerLife = PLAYER_LIFE;
        }
        var iRate = (_iPlayerLife/PLAYER_LIFE)+0.001;
        
        _oInterface.refreshBar(iRate);
        
        if(iType===4){
            createjs.Tween.get(_oFeedbackGreen, {override:true}).to({alpha:0.5}, 150, createjs.Ease.linear).to({alpha:0}, 150, createjs.Ease.linear);
        } else {
            createjs.Tween.get(_oFeedbackRed, {override:true}).to({alpha:0.6}, 150, createjs.Ease.linear).to({alpha:0}, 150, createjs.Ease.linear);
        }
    };
    
    this.updateScore = function(iType){        
        _iScore=_iScore + SCORE[iType];
        if(_iScore<0){
            _iScore=0;
        }
        _oInterface.refreshScore(_iScore);
    };
    
    this._checkHit = function(coordX,coordY){ 
        
        for (var i=0; i<_aZombie.length; i++){
            if(coordX > _aZombie[i].target().x){
                if(coordX < _aZombie[i].target().x+_aZombie[i].target().w){
                    if(coordY > _aZombie[i].target().y){
                        if(coordY < _aZombie[i].target().y+_aZombie[i].target().h){
                            _aZombie[i].kill();
                        }                        
                    }
                }
            }
            
            if(_aZombie[i].checkGone()){
                    _aZombie.splice(i,1);
                }
            
        }
    };

    this._setProbability = function() {
        if(_iStage===ZOMBIE_ON_STAGE.length){
            _iStage--;
        }
        
        _aSpawnProb=[];
        
        for (var j=0; j<ZOMBIE_ON_STAGE[_iStage].length; j++){
            for (var i=0; i<ZOMBIE_ON_STAGE[_iStage][j]; i++){
                _aSpawnProb.push(j);
            }
        }        
        _iSpawnSurvivor = SURVIVOR_ON_STAGE[_iStage];

    };

    this._sortZombie = function(){  
       
        for (var i=0; i < _aZombie.length; i++) {
            _aOrder[i]={y:_aZombie[i].getPos().y, zombie: _aZombie[i] };
            if(_aZombie[i].checkGone()){
                    _aZombie.splice(i,1);
                }
       
        }
        
        function compare(a,b) {
            if (a.y < b.y)
                return -1;
            if (a.y > b.y)
                return 1;
            return 0;
        }
       
        _aOrder.sort(compare);       
       
        for (var i=0; i < _aOrder.length; i++) {
            var oZombie = _aOrder[i].zombie;
            var scale = (0.000857143*_aOrder[i].y)+0.442857;
            oZombie.scaleMe(scale);
            if(oZombie.getState() === "run"){
                _oZombieContainer.setChildIndex(oZombie.getContainerRun(),i);
            }else{
                _oZombieContainer.setChildIndex(oZombie.getContainerDeath(),i);
            }
        }
       
    };

    this._spawnZombie = function() {
        
        var iStart;
        var iEnd;
        var iType;
        var iRandSpawn;
        var iDepth;
        
        iRandSpawn = Math.ceil(Math.random()*MAX_SPAWN[_iMaxSpawn]);
       
        for(var i=0; i<iRandSpawn; i++){
            iStart= (Math.random()*START_SIZE)+MAX_START_TOP;
            iEnd= (Math.random()*END_SIZE)+MAX_END_TOP;
            iDepth = Math.floor(Math.random()*300);
 
            iType = Math.floor(Math.random()*_aSpawnProb.length);
            
            _aZombie.push(new CCharacter(_aSpawnProb[iType],iStart,iEnd, iDepth, _oZombieContainer)); 
        }
    };
    
    this._spawnSurvivor = function(){
        var iStart;
        var iEnd;
        var iDepth;
        var iRand = Math.random()*100;
        if(iRand<_iSpawnSurvivor){
            
            iStart= (Math.random()*START_SIZE)+MAX_START_TOP;
            iEnd= (Math.random()*END_SIZE)+MAX_END_TOP;
            iDepth = Math.floor(Math.random()*200);
            _aZombie.push(new CCharacter(4,iStart,iEnd, iDepth, _oZombieContainer));
        }
    };
    
    this.newStage = function(){
        this.tryShowAd();
        
        _iWave++;
        
        $(s_oMain).trigger("start_level",_iWave);
        
        _oTextStage.text= TEXT_WAVE+" " +_iWave;
        _oTextStageBack.text= TEXT_WAVE+" " +_iWave;
        createjs.Tween.get(_oTextStage).to({y:CANVAS_HEIGHT/2-220}, 2000, createjs.Ease.bounceOut).to({alpha:0}, 2000, createjs.Ease.linear);
        createjs.Tween.get(_oTextStageBack).to({y:CANVAS_HEIGHT/2-218}, 2000, createjs.Ease.bounceOut).to({alpha:0}, 2000, createjs.Ease.linear).call(function(){_oParent._removeTweens()});
        s_oGame.startStage();   
    };

    this._removeTweens = function(){
        _oTextStage.alpha=1;
        _oTextStage.y=-100;
        _oTextStageBack.alpha=1;
        _oTextStageBack.y=-98;
        createjs.Tween.removeTweens(_oTextStage);
        createjs.Tween.removeTweens(_oTextStageBack);
    };
    
    this.startStage = function(){
        _bStartGame=true;
        _bStopSpawn=false;
    };
    
    this.update = function(){
        if(_bStartGame){  
			
            _iTimerStage += s_iTimeElaps;

            if(_bStopSpawn === false){
                if(_iTimerStage > _iStageTime){

                    _iTimerStage=0;
                    _iStage++;//CAMBIARE POSIZIONE!!
                    _iMaxSpawn++;
                    if(_iMaxSpawn === MAX_SPAWN.length){
                            _iMaxSpawn--;
                    }
                    this._setProbability();

                    _iStageTime += STAGE_TIME_INCREASE;
                    if(_iSpawnTime > 550){
                            _iSpawnTime-=SPAWN_TIME_DECREASE;
                    }    
                    _bStopSpawn=true;

                }else{
                    _iTimerSpawn +=s_iTimeElaps;
                    if(_iTimerSpawn > _iSpawnTime){
                            _iTimerSpawn = 0;
                            this._spawnZombie();
                            this._spawnSurvivor();
                    }
                }
            }


            for (var i=0; i<_aZombie.length; i++){
                _aZombie[i].update();
            }
            
            if (_bStopSpawn && _aZombie.length===0){
                _bStartGame=false;
                _oZombieContainer.removeAllChildren();
                this.newStage(_iWave);
            }
            
            this._sortZombie();
        }
    };
    s_oGame=this;
    
    PLAYER_LIFE = oData.playerlife;
    
    DAMAGE[0] = oData.damage_zombie_0;
    DAMAGE[1] = oData.damage_zombie_1;
    DAMAGE[2] = oData.damage_zombie_2;
    DAMAGE[3] = oData.damage_zombie_3;
    DAMAGE[4] = oData.damage_survivor;
    
    LIFE[0] = oData.life_zombie_0;
    LIFE[1] = oData.life_zombie_1;
    LIFE[2] = oData.life_zombie_2;
    LIFE[3] = oData.life_zombie_3;
    LIFE[4] = oData.life_survivor;
    
    SCORE[0] = oData.score_zombie_0;
    SCORE[1] = oData.score_zombie_1;
    SCORE[2] = oData.score_zombie_2;
    SCORE[3] = oData.score_zombie_3;
    SCORE[4] = oData.score_survivor;
    
    SPAWN_TIME = oData.start_spawn_time;
    SPAWN_TIME_DECREASE = oData.spawn_time_decrease;
    
    STAGE_START_TIME = oData.stage_start_time;
    STAGE_TIME_INCREASE = oData.stage_time_increase;
    
    MAX_SPAWN = oData.max_spawn_onstages;
    
    ZOMBIE_ON_STAGE[0]= oData.zombie_rate_onstage_0;
    ZOMBIE_ON_STAGE[1]= oData.zombie_rate_onstage_1;
    ZOMBIE_ON_STAGE[2]= oData.zombie_rate_onstage_2;
    ZOMBIE_ON_STAGE[3]= oData.zombie_rate_onstage_3;
    ZOMBIE_ON_STAGE[4]= oData.zombie_rate_onstage_4;
    ZOMBIE_ON_STAGE[5]= oData.zombie_rate_onstage_5;
    ZOMBIE_ON_STAGE[6]= oData.zombie_rate_onstage_6;
    ZOMBIE_ON_STAGE[7]= oData.zombie_rate_onstage_7;
    
    
    SURVIVOR_ON_STAGE = oData.survivor_rate_onstages;
    
    AD_SHOW_COUNTER = oData.ad_show_counter; 
    
    _oParent=this;
    this._init();
}

var s_oGame;