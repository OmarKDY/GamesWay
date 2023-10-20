function CGame(iLevel) {
    var _iTotalScore;
    var _iLevelStars;
    var _iLevel;
    var _iLevelScore;    
    var _iSleepTimer;
    
    var _aCoins;    // THESE ARE THE STRAWBERRIES
    var _aStones;   // THESE ARE THE BARRELS
    var _aBlocks;
    
    var _bStartGame;
    var _bPaused;
    
    var _oPhysicWorld;
    var _oPhysicObjectsCreator;
    var _oGameContainer;
    var _oPopupContainer;
    var _oHelpPanel;
    var _oFloor;
    var _oBall;     // THIS IS THE CHEESE
    var _oPlayer;   // THIS IS THE MOUSE
    var _oInterface;
    var _oWinPanel;
    var _oLosePanel;
    var _oBg;
    var _oHelpingHand;
    var _oScoreTextBack;
    var _oScoreText;

    this._init = function() {
        s_oRollingTextManager = new CRollingTextManager();
        
        this.resetVariables();
        $("#canvas").trigger("start_level", _iLevel+1);
       
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("bg_game");
        _oBg = createBitmap(oSprite);
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oGameContainer.addChild(_oBg);
        
        this._addProps();
        this._addHitArea();
        this._initPhysicObjects();

        _oInterface = new CInterface(_iLevel+1, _oGameContainer);
        
        _oPopupContainer = new createjs.Container;
        _oGameContainer.addChild(_oPopupContainer);
        
        if (_iLevel === 0) {
            _oHelpPanel = CHelpPanel();
            this.addHelpingHand();
        } else {
            this._onExitHelp();
        };

        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        
        // ADD A FADE EFFECT
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oGameContainer.addChild(oFade);
        createjs.Tween.get(oFade).to({alpha: 0}, 1000).call(function () {
            createjs.Tween.removeTweens(oFade);
            _oGameContainer.removeChild(oFade);
        });
    };
    
    this._addHitArea = function(){
        var oHitArea = new createjs.Shape();
        oHitArea.graphics.beginFill("white").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oHitArea.alpha = 0.01;
        oHitArea.on("mousedown", this.onClick);
        _oGameContainer.addChild(oHitArea);
    };
    
    this._addProps = function(){
        for (var i = 0; i < PROPS_INFOS[_iLevel].length; i++) {
            var oSprite;
            if (PROPS_INFOS[_iLevel][i].type === PROPS_HOLE) {
                oSprite = s_oSpriteLibrary.getSprite("hole");
            } else {
                oSprite = s_oSpriteLibrary.getSprite("prop_"+PROPS_INFOS[_iLevel][i].type);
            }
            var oPropImage = createBitmap(oSprite);
            oPropImage.regX = oSprite.width * 0.5;
            oPropImage.regY = oSprite.height * 0.5;
            oPropImage.x = PROPS_INFOS[_iLevel][i].x;
            oPropImage.y = PROPS_INFOS[_iLevel][i].y;
            _oGameContainer.addChild(oPropImage);
        };
    };

    this.addCoinTaken = function(){
        _iLevelStars++;
        if (_iLevelStars > 3) {
            _iLevelStars = 3;
        }
        _oInterface.pulseScoreIcon();
        _oInterface.updateCoinsTaken(_iLevelStars);
    };
    
    this.onBarrellRoll = function(){
        if (!_bStartGame) {
            return;
        }        
        if (soundPlaying("barrel") === false) {
            playSound("barrel", 1, 0);
        }
    };
    
    this.onBallBounce = function(){
        if (!_bStartGame) {
            return;
        }        
        if (soundPlaying("bouncing_cheese") === false) {
            playSound("bouncing_cheese", 1, 0);
        }
    };
    
    this.addHelpingHand = function(){
        var oSprite = s_oSpriteLibrary.getSprite("help_hand");
        _oHelpingHand = createBitmap(oSprite);
        _oHelpingHand.regX = oSprite.width * 0.5;
        _oHelpingHand.regY = oSprite.height * 0.5;
        _oHelpingHand.x = CANVAS_WIDTH_HALF + 50;
        _oHelpingHand.y = CANVAS_HEIGHT_HALF - 5;
        _oHelpingHand.alpha = 0.5;
        _oGameContainer.addChild(_oHelpingHand);
        
        createjs.Tween.get(_oHelpingHand, {loop:true})
            .to({scaleX: 0.8, scaleY: 0.8}, 1000, createjs.Ease.cubicIn)
            .to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.cubicOut);
    };
    
    this.onCoinTweenFinished = function(){
        _oPlayer.animationEatCoin();        
    };

    this.findCoinTaken = function(iID){
        for (var i = 0; i < _aCoins.length; i++) {
            // GET THE COIN WITH THIS ID 
            if (_aCoins[i].getID() === iID && _aCoins[i].isActive()) {
                _aCoins[i].onCoinTaken(PLAYER_POSITION[_iLevel]);
                this.addCoinTaken();
                if (soundPlaying("strawberry") === false) {
                    playSound("strawberry", 1, 0);
                }
            }
        };
    };
    
    this._initLevelObjects = function(){
        // INIT LEVEL OBJECTS        
        for (var i = 0; i < BLOCKS_DATA[_iLevel].length; i++) {
            var oBlock = _oPhysicObjectsCreator.addBlock(BLOCKS_DATA[_iLevel][i], _oGameContainer);
            _aBlocks.push(oBlock);
        };
        for (var i = 0; i < STONES_POSITION[_iLevel].length; i++) {
            var oStone = _oPhysicObjectsCreator.addStone(STONES_POSITION[_iLevel][i], _oGameContainer);
            _aStones.push(oStone);
        };

        // THE PLAYER WILL BE THE MOUSE
        _oPlayer = _oPhysicObjectsCreator.addPlayer(_iLevel, _oGameContainer);
        // THE BALL WILL BE THE CHEESE
        _oBall = _oPhysicObjectsCreator.addBall(BALL_POSITION[_iLevel], _oGameContainer);
        
        // THE COIN BONUSES WILL BE THE STRAWBERRIES
        for (var i = 0; i < COINS_POSITION[_iLevel].length; i++) {
            var oCoin = _oPhysicObjectsCreator.addCoin(COINS_POSITION[_iLevel][i], i, _oGameContainer);
            _aCoins.push(oCoin);
        };        

        this.updatePhysics();
    };
        
    this._initPhysicObjects = function(){
        s_oPhysicsController = new CPhysicsController();
        _oPhysicObjectsCreator = new CPhysicObjectsCreator(s_oPhysicsController.getWorld());
        _oPhysicWorld = new CPhysicWorld(_oPhysicObjectsCreator, _oGameContainer);
        
        _oFloor = _oPhysicObjectsCreator.addFloor();
        this._initLevelObjects();        
    };
    
    this.resetVariables = function(){
        _iLevel = iLevel;
        _iTotalScore = s_iTotalScore;
        _iLevelScore = 0;
        _iLevelStars = 0;
        _iSleepTimer = 0;
        
        _aCoins = [];
        _aBlocks = [];
        _aStones = [];
        
        _oWinPanel = null;
        _oLosePanel = null;
        _oScoreTextBack = null;
        _oScoreText = null;

        _bStartGame = false;
        _bPaused = false;
    };

    this.unload = function() {
        _bStartGame = false;

        if (_oWinPanel !== null){
            _oWinPanel.unload(); 
        }
        if (_oLosePanel !== null){
            _oLosePanel.unload(); 
        }
        
        _oInterface.unload();
        createjs.Tween.removeAllTweens();        
        this.destroyPhysicsEngine();
        _oGameContainer.removeAllChildren();        
        s_oStage.removeChild(_oGameContainer);

        if (s_bMobile === false) {
            document.onkeydown = null;
            document.onkeyup = null;
        }
    };
    
    this.destroyPhysicsEngine = function () {
        for (var i = 0; i < _aCoins.length; i++) {
            s_oPhysicsController.destroyBodyVector( _aCoins[i].getPhysic() );
            _aCoins[i].unload();
            _aCoins[i] = null;
        };
        for (var i = 0; i < _aStones.length; i++) {
            s_oPhysicsController.destroyBodyVector( _aStones[i].getPhysic() );
            _aStones[i].unload();
            _aStones[i] = null;
        };
        for (var i = 0; i < _aBlocks.length; i++) {
            s_oPhysicsController.destroyBodyVector( _aBlocks[i].getPhysic() );
            _aBlocks[i].unload();
            _aBlocks[i] = null;
        };

        s_oPhysicsController.destroyBodyVector(_oFloor);
        s_oPhysicsController.destroyWorld();
        _oPlayer.unload();
        _oPlayer = null;
        _oPhysicObjectsCreator = null;
        _oPhysicWorld = null;
        s_oPhysicsController = null;
    };

    this.onExit = function(){
        this.unload();
        $("#canvas").trigger("show_interlevel_ad");
        $("#canvas").trigger("end_session");
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu();
    };

    this._onExitHelp = function(){
        if (_bPaused) {
            return;
        }
        _bStartGame = true;        
    };

    this.pause = function(bValue){
        _bStartGame = !bValue;
        _bPaused = bValue;
    };
    
    this.getBallToPlayer = function(){
        _oBall.setActive(false);
        createjs.Tween.get(_oBall.getSprite())
            .to({x:PLAYER_POSITION[_iLevel].x,y:PLAYER_POSITION[_iLevel].y-20,scaleX:0.7,scaleY:0.7}, 500, createjs.Ease.sineOut)
            .call(s_oGame.onBallArrivedToPlayer);
    };
    
    this.addScoreText = function(){
        _oScoreTextBack = new createjs.Text("+" + LEVEL_POINTS, FONT_SIZE_MESSAGE_BOX +"px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oScoreText = new createjs.Text("+" + LEVEL_POINTS, FONT_SIZE_MESSAGE_BOX +"px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oScoreTextBack.x = _oScoreText.x = PLAYER_POSITION[_iLevel].x;
        _oScoreTextBack.y = _oScoreText.y = PLAYER_POSITION[_iLevel].y - 50;
        _oScoreTextBack.textAlign = _oScoreText.textAlign = "center";
        _oScoreTextBack.textBaseline = _oScoreText.textBaseline = "middle";
        _oScoreTextBack.outline = 3;
        _oGameContainer.addChild(_oScoreTextBack, _oScoreText);
            
        var iTweenSpeed = 1000;
        createjs.Tween.get(_oScoreTextBack)
            .to({y: 0, alpha: 0}, iTweenSpeed, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(_oScoreTextBack);
                _oGameContainer.removeChild(_oScoreTextBack);
            });
        createjs.Tween.get(_oScoreText)
            .to({y: 0, alpha: 0}, iTweenSpeed, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(_oScoreText);
                _oGameContainer.removeChild(_oScoreText);
            });
    };
    
    this.onBallArrivedToPlayer = function(){
        if (_oScoreText === null) {
            s_oGame.addScoreText();
        };

        createjs.Tween.removeTweens( _oBall.getSprite() );                
        s_oPhysicsController.destroyBodyVector( _oBall.getPhysic() );            
        _oBall.unload();
        _oBall = null;
        s_oGame.gameWin();        
    };
    
    this.gameWin = function(){
        _bStartGame = false;
        stopSound("soundtrack");
        $("#canvas").trigger("end_level", _iLevel);
        playSound("game_win",1,false);
        s_iAnimationIndex = 0;
        
        // UPDATE THE LAST LEVEL PLAYABLE
        if (s_iLastLevel < _iLevel+2) {
            s_iLastLevel = _iLevel+2;
            saveItem("rolling_cheese_lastlevel", s_iLastLevel);
        }

        _iLevelScore = LEVEL_POINTS + (_iLevelStars*LEVEL_POINTS);
        _oInterface.refreshScore(_iTotalScore,_iLevelScore);
        // UPDATE AND SAVE SCORE
        _iTotalScore += _iLevelScore;
        s_iTotalScore = _iTotalScore;            
        saveItem("rolling_cheese_totalscore", s_iTotalScore);
        
        if (s_aStars[_iLevel] < _iLevelStars) {
            s_aStars[_iLevel] = _iLevelStars;
            setItemJson("rolling_cheese_stars", s_aStars);
        }
        if (s_aScores[_iLevel] < _iLevelScore) {
            s_aScores[_iLevel] = _iLevelScore;
            setItemJson("rolling_cheese_scores", s_aScores);
        }
        if (_oWinPanel === null){
            _oPlayer.animationWin();
            _oWinPanel = CWinPanel(_iLevelStars, _iLevelScore, _oPopupContainer);
            _oWinPanel.show();
            setTimeout(function(){ playSound("soundtrack",SOUNDTRACK_VOLUME_IN_GAME,true); }, 1000);
        }
    };

    this.gameOver = function(){
        setTimeout(function(){ _bStartGame = false; }, 1000);
        stopSound("soundtrack");        
        $("#canvas").trigger("end_level", _iLevel);
        
        if (_oLosePanel === null){
            setTimeout(function(){ playSound("soundtrack",SOUNDTRACK_VOLUME_IN_GAME,true); }, 3000);
            playSound("game_over",1,false);            
            s_iAnimationIndex++;
            _oPlayer.animationLose();
            _oLosePanel = CLosePanel(_oPopupContainer);
            _oLosePanel.show();
        }
    };
    
    this.checkForActiveBlocks = function(){
        var bActiveBlocks = false;
        for (var i = 0; i < _aBlocks.length; i++) {
            if (_aBlocks[i].isBreakable()) {
                bActiveBlocks = true;
            }
        }
        
        return bActiveBlocks;        
    };

    this._checkForPossibleSolution = function() {
        if (_iLevel === 0) {
            return true;
        }
        // CHECK IF THERE ARE BLOCKS TO BREAK
        if (this.checkForActiveBlocks() === true) {
            return true;
        } else {
            return false;
        }
    };

    this.onBallStopped = function(){
        // IF THERE'S STILL ANY POSSIBLE SOLUTION, CONTINUE THE GAME, ELSE IT'S GAMEOVER
        if (this._checkForPossibleSolution() === false) {
            this.gameOver();
        } else {
            return;
        }
    };

    this.onBallOutOfScreen = function(){
        this.gameOver();
    };

    this.restartGame = function(){
        $("#canvas").trigger("restart_level", _iLevel);        
        this.unload();
        this.resetVariables();
        s_oMain.gotoGame(_iLevel);
    };
    
    this.onNextLevel = function(){
        this.unload();
        $("#canvas").trigger("end_level", _iLevel);        
        if (_iLevel+1 === LEVELS_NUMBER) {
            s_oMain.gotoLevelChoose();
        } else {
            s_oMain.gotoGame(_iLevel+1);
            $("#canvas").trigger("show_interlevel_ad");
        }
    };
    
    this.getLevel = function(){
        return _iLevel;
    };
    
    this.isStartGame = function() {
        return _bStartGame;
    };
    
    this.onBlockClicked = function(){
        if (!_oHelpingHand) {
            return;
        }
        createjs.Tween.removeTweens(_oHelpingHand);
        createjs.Tween.get(_oHelpingHand)
            .to({alpha:0}, 200)
            .call(function(){
                createjs.Tween.removeTweens(_oHelpingHand);
                _oGameContainer.removeChild(_oHelpingHand);
            });
    };
    
    this.onClick = function(){
        // RESTART THE SLEEP TIMER FOR THE PLAYER
        _iSleepTimer = 0;
        
        if (_oPlayer.isSleeping()){
            _oPlayer.onWakeUp();
        }
    };    
    
    this.updatePhysics = function(){
        // KEEP THE SPRITES' POSITION ON THEIR PHYSIC OBJECTS
        for (var i = 0; i < _aCoins.length; i++) {
            if (_aCoins[i]) {
                _aCoins[i].update();
            }
        };
        for (var i = 0; i < _aBlocks.length; i++) {
            if (_aBlocks[i]) {
                _aBlocks[i].update();
            }
        };
        for (var i = 0; i < _aStones.length; i++) {
            if (_aStones[i]) {
                _aStones[i].update();
            }
        };
        
        if (_oBall) {
            _oBall.update();
        }
        
        s_oPhysicsController.update();
    };
    
    this.update = function() {
        s_oRollingTextManager.update();
        
        if (!_bStartGame) {
            return;
        }
        
        // TIMER TO MAKE THE PLAYER SLEEP
        _iSleepTimer += s_iTimeElaps;
        if (_iSleepTimer >= SLEEP_TIMER_MAX){
            _iSleepTimer = 0;
            _oPlayer.onSleep();
        }
        
        for (var i = 0; i < UPDATE_LOOP_VAR; i++) {            
            this.updatePhysics();
        };                
    };

    s_oGame = this;

    this._init();
}

var s_oGame;
var s_oRollingTextManager;