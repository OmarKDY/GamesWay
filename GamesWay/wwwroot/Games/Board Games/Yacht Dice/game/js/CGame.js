function CGame() {
    var _iTurn;
    var _iDiceLaunch;
    var _iCPU_Timer;
    var _iPlayerTimer;
    
    var _bStartGame;
    var _bClickBlocked;
    var _bPaused;
    var _bLaunchDone;
    var _bEndOfTurn;
    var _bTurnStart;
    var _bWaitingForPlayer;
    
    var _oGameContainer;
    var _oPopupContainer;
    var _oHelpPanel;
    var _oScoreBoard;
    var _oInterface;
    var _oWinPanel;
    var _oLosePanel;
    var _oBg;
    var _oHandAnimation;
    var _oArtificialIntelligence;
    
    var _aPlayers;
    var _aMomentaryCombinations;
    var _aTurnDicesValues;

    this._init = function() {
        this._resetVariables();       
        $(s_oMain).trigger("start_session");
       
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);
       
        var oSprite = s_oSpriteLibrary.getSprite("bg_game");
        _oBg = createBitmap(oSprite);
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oGameContainer.addChild(_oBg);
        
        _oScoreBoard = new CScoreboard(_oGameContainer);
        this._initPlayers();
        this._initHandAnimation();
        
        _oArtificialIntelligence = new CArtificialIntelligence();
        _oInterface = new CInterface(_oGameContainer);
        
        _oPopupContainer = new createjs.Container;
        _oGameContainer.addChild(_oPopupContainer);
        
        this._setTurnIcons();
        _oHelpPanel = new CHelpPanel();

        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
    };
    
    this._resetVariables = function(){
        _aPlayers = [];
        _aMomentaryCombinations = [];
        this._resetTurnDicesValue();
        
        _oWinPanel = null;
        _oLosePanel = null;

        _iTurn = PLAYER_HUMAN_NUMBER;
        _iDiceLaunch = 0;
        _iCPU_Timer = 0;
        _iPlayerTimer = 0;        
        
        _bStartGame = false;
        _bClickBlocked = false;
        _bPaused = false;
        _bTurnStart = false;
        _bLaunchDone = false;
        _bEndOfTurn = false;
        _bWaitingForPlayer = false;
    };
    
    this._resetTurnDicesValue = function(){
        _aTurnDicesValues = [];        
        for (var i = 0; i < DICES_NUMBER; i++) {
            _aTurnDicesValues.push(0);
        };
    };
    
    this._getSortedDicesValues = function(){
        var aSortedHand = new Array();
        for (var i = 0; i < _aTurnDicesValues.length; i++) {
            aSortedHand.push(_aTurnDicesValues[i]);
        };
        aSortedHand.sort();
        
        return aSortedHand;
    };
    
    this._initPlayers = function(){
        for (var i = 0; i < s_iPlayersNumber; i++) {
            var oPlayer = new CPlayer(i, _oGameContainer);
            _aPlayers.push(oPlayer);
        };        
    };

    this._initHandAnimation = function(){
        var oSprite = s_oSpriteLibrary.getSprite("hand_anim");
        _oHandAnimation = createBitmap(oSprite);
        _oHandAnimation.regX = oSprite.width * 0.5;
        _oHandAnimation.regY = oSprite.height * 0.5;
        _oHandAnimation.x = CANVAS_WIDTH_HALF - 250;
        _oHandAnimation.y = CANVAS_HEIGHT_HALF + 170;
        _oHandAnimation.rotation = -135;
        _oHandAnimation.visible = false;
        _oGameContainer.addChild(_oHandAnimation);
        
        this._resetHandMoviment();
    };
    
    this._resetHandMoviment = function(){
        var iSpeed = 500;
        var oParent = this;
        createjs.Tween.get(_oHandAnimation)
            .to({x: CANVAS_WIDTH_HALF - 240, y: CANVAS_HEIGHT_HALF + 180}, iSpeed, createjs.Ease.cubicOut)
            .to({x: CANVAS_WIDTH_HALF - 260, y: CANVAS_HEIGHT_HALF + 200}, iSpeed, createjs.Ease.cubicIn)
            .call(function(){ oParent._resetHandMoviment(); });
    };
            
    this._setHandAnimationVisible = function(bValue){
        if (bValue === true) {
            _oHandAnimation.alpha = 0;
            _oHandAnimation.visible = true;
            createjs.Tween.get(_oHandAnimation)
                .to({alpha: HAND_ANIMATION_MAX_ALPHA}, HAND_ANIMATION_FADE_SPEED, createjs.Ease.cubicOut)
        } else {
            _oHandAnimation.alpha = HAND_ANIMATION_MAX_ALPHA;
            
            createjs.Tween.get(_oHandAnimation)
                .to({alpha: 0}, HAND_ANIMATION_FADE_SPEED*0.2, createjs.Ease.cubicOut)
                .call(function(){
                    _oHandAnimation.visible = false;
                });
        }        
    };
    
    this._resetMomentaryCombinations = function(){
        for (var i = 0; i < COMBINATIONS_NUMBER; i++) {
            _aMomentaryCombinations[i] = 0;
        };        
    };
    
    this._resetPlayerCombinations = function(){
        var iPreviousTurn = _iTurn-1;        
        if (iPreviousTurn < 0) {
            iPreviousTurn = s_iPlayersNumber-1;            
        }
        
        var aCombinations = _aPlayers[iPreviousTurn].getCombinations();        
        for (var i = 0; i < aCombinations.length; i++) {
            _oScoreBoard.updateCombinationValue(iPreviousTurn, i, aCombinations[i].value);
        };
    };
    
    this._unload = function() {
        _bStartGame = false;

        if (_oWinPanel !== null) {
            _oWinPanel.unload(); 
        }
        if (_oLosePanel !== null) {
            _oLosePanel.unload(); 
        }
        
        _oInterface.unload();
        _oGameContainer.removeAllChildren();
        createjs.Tween.removeAllTweens();

        if (s_bMobile === false) {
            document.onkeydown = null;
            document.onkeyup = null;
        }
    };

    this.onExit = function(){
        this._unload();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu();
    };

    this._onExitHelp = function(){
        _bStartGame = true;
    };

    this.pause = function(bValue){
        _bStartGame = !bValue;
        _bPaused = bValue;        
    };
    
    this._checkIfCombinationsAreCompleted = function(){
        // CHECK IF THERE'S ANY COMBINATION LEFT IN THE LAST PLAYER
        var iLastPlayer = _aPlayers.length-1;
        var iCompletedCombinations = 0;
        var aPlayerCombination = _aPlayers[iLastPlayer].getCombinations();            
        for (var j = 0; j < aPlayerCombination.length; j++) {
            if (aPlayerCombination[j].completed === true) {
                iCompletedCombinations++;
            }
        };

        if (iCompletedCombinations === COMBINATIONS_NUMBER) {
            return true;
        }        
        return false;
    };
    
    this._findWinner = function(){
        var iMax = _aPlayers[0].getTotal(ID_SCORE_TOP_TOTAL) + _aPlayers[0].getTotal(ID_SCORE_BOTTOM_TOTAL);;
        var iWinner = 0;
        
        // CHECK FOR WINNER (HIGHEST SCORE)
        for (var i = 1; i < _aPlayers.length; i++) {
            var iPlayerTotal = _aPlayers[i].getTotal(ID_SCORE_TOP_TOTAL) + _aPlayers[i].getTotal(ID_SCORE_BOTTOM_TOTAL);
            if (iPlayerTotal > iMax) {
                iMax = iPlayerTotal;
                iWinner = i;
            }
        };
        return iWinner;
    };
    
    this.isTurnBlocked = function() {
        return _aPlayers[_iTurn].isTurnBlocked();
    };
    
    this._checkForGameOver = function(){
        // CHECK IF THERE'S NO MORE COMBINATIONS TO FIND
        if (this._checkIfCombinationsAreCompleted() === true) {
            _bStartGame = false;
            
            var aPlayersScore = [];
            for (var i = 0; i < _aPlayers.length; i++) {
                var oScore = _aPlayers[i].getTotal(ID_SCORE_TOP_TOTAL) + _aPlayers[i].getTotal(ID_SCORE_BOTTOM_TOTAL);
                aPlayersScore.push(oScore);
            };
            
            // IF THE WINNER IS THE HUMAN PLAYER, IT'S GAME WIN, ELSE IT'S GAME LOSE
            var iWinner = this._findWinner();
            var iBestScore = _aPlayers[iWinner].getTotal(ID_SCORE_TOP_TOTAL) + _aPlayers[iWinner].getTotal(ID_SCORE_BOTTOM_TOTAL);
            
            if (iWinner === PLAYER_HUMAN_NUMBER) {
                this._gameWin(iBestScore, aPlayersScore);
            } else {
                this._gameOver(iWinner, iBestScore, aPlayersScore);
            }
            return true;
        } else {
            return false;
        }
    };
    
    this._gameWin = function(iBestScore, aPlayersScore){
        var bNewHighScore = false;
        
        if (_oWinPanel === null) {
            $(s_oMain).trigger("share_event", iBestScore);
            $(s_oMain).trigger("save_score", iBestScore);
            
            // IF THERE'S A NEW HIGH SCORE
            if (iBestScore > s_iBestScore) {
                s_iBestScore = iBestScore;
                saveItem("yachtdicegame_best_score", iBestScore);
                bNewHighScore = true;
            }
            
            playSound("game_win",1,false);
            _oWinPanel = new CWinPanel(iBestScore, aPlayersScore, _oPopupContainer, bNewHighScore);
            _oWinPanel.show();
        }
    };

    this._gameOver = function(iWinner, iBestScore, aPlayersScore){
        if (_oLosePanel === null) {
            playSound("game_over",1,false);
            _oLosePanel = new CLosePanel(iWinner, iBestScore, aPlayersScore, _oPopupContainer);
            _oLosePanel.show();
        }
    };
    
    this.restartGame = function(){
        this._unload();
        $(s_oMain).trigger("restart_level", 1);
        s_oMain.gotoGame();        
    };
    
    this.isStartGame = function(){
        return _bStartGame;
    };
    
    this.isLaunchDone = function(){
        return _bLaunchDone;
    };
    
    this.isTurnStarted = function(){
        return _bTurnStart;        
    };
    
    this._updateTotalScores = function(){
        var iTopBonus = _aPlayers[_iTurn].getTotal(ID_SCORE_TOP_BONUS);
        _oScoreBoard.updateTotalBoardTexts(_iTurn, ID_SCORE_TOP_BONUS, iTopBonus);
        
        var iTopTotal = _aPlayers[_iTurn].getTotal(ID_SCORE_TOP_TOTAL);
        _oScoreBoard.updateTotalBoardTexts(_iTurn, ID_SCORE_TOP_TOTAL, iTopTotal);
        
        var iBottomrTotal = _aPlayers[_iTurn].getTotal(ID_SCORE_BOTTOM_TOTAL);
        _oScoreBoard.updateTotalBoardTexts(_iTurn, ID_SCORE_BOTTOM_TOTAL, iBottomrTotal);
        
        var iGrandTotal = iTopTotal+iBottomrTotal;
        _oScoreBoard.updateTotalBoardTexts(_iTurn, ID_SCORE_GRAND_TOTAL, iGrandTotal);
    };
    
    this.getTurn = function(){
        return _iTurn;
    };
    
    this._resetPlayerDices = function(){
        var aDices = _aPlayers[_iTurn].getDices();        
        for (var i = 0; i < aDices.length; i++) {
            aDices[i].resetDice();
        };
    };
    
    this._changeTurn = function(){
        _bLaunchDone = false;
        _bEndOfTurn = false;
        
        this._resetPlayerDices();
        
        _iTurn++;
        if (_iTurn === s_iPlayersNumber) {
            _iTurn = 0;
        }
        
        _iDiceLaunch = 0;
        _iCPU_Timer = 0;
        
        this._setTurnIcons();
        this._resetTurnDicesValue();
        this._resetMomentaryCombinations();
        this._resetPlayerCombinations();

        _oInterface.setRollButtonActive(false);
        if (_iTurn === PLAYER_HUMAN_NUMBER) {
            _oInterface.setRollButtonActive(true);
        }
    };
    
    this._setNextLaunch = function(){
        _bLaunchDone = false;
    };
    
    this._setTurnIcons = function(){
        for (var i = 0; i < _aPlayers.length; i++) {
            _aPlayers[i].setTurn(false);
            if (i === _iTurn) {
                _aPlayers[i].setTurn(true);
            }
        };
    };
    
    this.hasLaunched = function(){
        if (_iDiceLaunch > 0) {
            return true;
        }        
        return false;
    };
    
    this.onRollDices = function(){
        if (_bLaunchDone === true || _aPlayers[_iTurn].isTurnBlocked() === true) {
            return;
        }
        
        playSound("rolldices",1,false);
        
        _bTurnStart = true;
        _bLaunchDone = true;
        _iDiceLaunch++;
        
        var aPlayerDices = _aPlayers[_iTurn].getDices();        
        for (var i = 0; i < _aTurnDicesValues.length; i++) {
            var oDice = aPlayerDices[i];
            // IF THE DICE IS LOCKED, DON'T CHANGE IT
            if (oDice.isLocked() === false) {
                _aTurnDicesValues[i] = Math.floor(Math.random() * 6);
            }
        };
        
        _aPlayers[_iTurn].setDicesValues(_aTurnDicesValues);
        this._checkForNewLaunch();
    };
    
    this.onAnimationsOver = function(){
        this._checkDiceCombinations();
    };
    
    this._calculateTopSectionValues = function(){
        var aDiceValues = [0,0,0,0,0,0];
        
        for (var i = 0; i < _aTurnDicesValues.length; i++) {
            // ADD DICE VALUE TO EACH TOP SECTION'S CATEGORY
            var iFaceValue = _aTurnDicesValues[i];
            aDiceValues[iFaceValue] += DICE_VALUES[iFaceValue];
        };
        
        return aDiceValues;
    };
    
    this._calculateThreeOfAKind = function(){
        var iThreeKindValue = 0;
        var aSortedHand = this._getSortedDicesValues();
        // FIND THREE EQUAL DICES
        if (aSortedHand[0] === aSortedHand[2] ||
            aSortedHand[1] === aSortedHand[3] ||
            aSortedHand[2] === aSortedHand[4]) {
            iThreeKindValue = DICE_VALUES[aSortedHand[2]] * 3;
        }
        
        return iThreeKindValue;
    };
    
    this._calculateFourOfAKind = function(){
        var iFourKindValue = 0;
        var aSortedHand = this._getSortedDicesValues();
        // FIND FOUR EQUAL DICES
        if (aSortedHand[0] === aSortedHand[3] || 
            aSortedHand[1] === aSortedHand[4]) {
            iFourKindValue = DICE_VALUES[aSortedHand[1]] * 4;
        }
        
        return iFourKindValue;
    };
    
    this._calculateFullHouse = function(){
        var iFullHouseValue = 0;        
        var aSortedHand = this._getSortedDicesValues();
        // FIND THREE EQUAL DICES AND TWO EQUAL DICES
        if (aSortedHand[0] === aSortedHand[1] && aSortedHand[2] === aSortedHand[4] ||
            aSortedHand[0] === aSortedHand[2] && aSortedHand[3] === aSortedHand[4] ) {
           iFullHouseValue = COMBINATION_VALUE_FULL_HOUSE;
        }
        
        return iFullHouseValue;
    };
    
    this._calculateSmallStraight = function(){
        var iStraightValue = 0;
        var aSortedHand = this._getSortedDicesValues();
        
        // FIND FOUR SEQUENTIAL DICES
        var aComb = [[0,1,2,3],[1,2,3,4],[0,2,3,4],[0,1,3,4]];
        var aCombAnswers = [[0,1,2,3],[1,2,3,4],[2,3,4,5]];

        for (var i = 0; i < aComb.length; i++) {
            for (var j = 0; j < aCombAnswers.length; j++) {
                if (aSortedHand[aComb[i][0]] === aCombAnswers[j][0] &&
                    aSortedHand[aComb[i][1]] === aCombAnswers[j][1] &&
                    aSortedHand[aComb[i][2]] === aCombAnswers[j][2] &&
                    aSortedHand[aComb[i][3]] === aCombAnswers[j][3] ) {
                    iStraightValue = COMBINATION_VALUE_SMALL_STRAIGHT;
                }
            }; 
        };  
        
        return iStraightValue;
    };
    
    this._calculateLargeStraight = function(){
        var iStraightValue = 0;
        var aSortedHand = this._getSortedDicesValues();
        
        // FIND FIVE SEQUENTIAL DICES
        var aCombAnswers = [[0,1,2,3,4],[1,2,3,4,5]];
        for (var i = 0; i < aCombAnswers.length; i++) {
            if (aSortedHand[0] === aCombAnswers[i][0] &&
                aSortedHand[1] === aCombAnswers[i][1] &&
                aSortedHand[2] === aCombAnswers[i][2] &&
                aSortedHand[3] === aCombAnswers[i][3] &&
                aSortedHand[4] === aCombAnswers[i][4] ) {
                iStraightValue = COMBINATION_VALUE_LARGE_STRAIGHT;
            }
        };
        
        return iStraightValue;
    };
    
    this._calculateYacht = function(){
        var iYachtValue = 0;
        
        // IF ALL THE DICES HAVE THE SAME VALUE
        var aSortedHand = this._getSortedDicesValues();
        if (aSortedHand[0] === aSortedHand[4]) {
            iYachtValue = COMBINATION_VALUE_YACHT;
        }
        
        return iYachtValue;
    };
    
    this._calculateChance = function(){
        var iChanceValue = 0;
        // SUM THE VALUE OF EACH DICE
        for (var i = 0; i < _aTurnDicesValues.length; i++) {
            iChanceValue += DICE_VALUES[_aTurnDicesValues[i]];
        };
        
        return iChanceValue;
    };
    
    this._checkDiceCombinations = function(){
        // CHECK THE TOP SECTION
        var aDiceValues = this._calculateTopSectionValues();    // ADD DICE VALUE TO EACH TOP SECTION'S CATEGORY
        this.setTopLevelValues(aDiceValues);                    // UPDATE THE SCOREBOARD TEXTS        
        
        // THIS MOMENTARY ARRAY WILL BE USED TO UPDATE THE SCOREBOARD
        for (var i = 0; i < aDiceValues.length; i++) {
            _aMomentaryCombinations[i] = aDiceValues[i];
        };
        
        // CHECK THE BOTTOM SECTION
        var aPlayerCombinations = _aPlayers[_iTurn].getCombinations();
        
        if (aPlayerCombinations[ID_3_OF_A_KIND].completed === false) {
            var iValue = this._calculateThreeOfAKind();
            this._checkAndUpdateBottomSectionCombination(ID_3_OF_A_KIND, iValue);
        }
        if (aPlayerCombinations[ID_4_OF_A_KIND].completed === false) {
            var iValue = this._calculateFourOfAKind();
            this._checkAndUpdateBottomSectionCombination(ID_4_OF_A_KIND, iValue);
        }
        if (aPlayerCombinations[ID_FULL_HOUSE].completed === false) {
            var iValue = this._calculateFullHouse();
            this._checkAndUpdateBottomSectionCombination(ID_FULL_HOUSE, iValue);
        }
        if (aPlayerCombinations[ID_SMALL_STRAIGHT].completed === false) {
            var iValue = this._calculateSmallStraight();
            this._checkAndUpdateBottomSectionCombination(ID_SMALL_STRAIGHT, iValue);
        }
        if (aPlayerCombinations[ID_LARGE_STRAIGHT].completed === false) {
            var iValue = this._calculateLargeStraight();
            this._checkAndUpdateBottomSectionCombination(ID_LARGE_STRAIGHT, iValue);
        }
        if (aPlayerCombinations[ID_YACHT].completed === false) {
            var iValue = this._calculateYacht();
            this._checkAndUpdateBottomSectionCombination(ID_YACHT, iValue);
        }
        if (aPlayerCombinations[ID_CHANCE].completed === false) {
            var iValue = this._calculateChance();
            this._checkAndUpdateBottomSectionCombination(ID_CHANCE, iValue);
        }        
    };
    
    this.checkToActivateRollButton = function(){
        if (_iTurn === PLAYER_HUMAN_NUMBER && _iDiceLaunch < DICES_LAUNCH_POSSIBILITIES) {
            _oInterface.setRollButtonActive(true);
        }
    };
    
    this._checkAndUpdateBottomSectionCombination = function(iID, iValue){
        _aMomentaryCombinations[iID] = iValue;
        _oScoreBoard.updateCombinationValue(_iTurn, iID, _aMomentaryCombinations[iID]);
    };
    
    this.setTopLevelValues = function(aValues) {
        var aPlayerCombinations = _aPlayers[_iTurn].getCombinations();
        for (var i = 0; i < aPlayerCombinations.length; i++) {
            // IF THE PLAYER HAS NOT COMPLETED THAT COMBINATION YET, SHOW IT IN THE SCOREBOARD
            if (aPlayerCombinations[i].completed === false) {
                _oScoreBoard.updateCombinationValue(_iTurn, i, aValues[i]);
            }
        };
    };
    
    this.confirmCombinationValue = function(iID) {
        var iValue = _aMomentaryCombinations[iID];
        _aPlayers[_iTurn].setCombinationValue(iID, iValue);
        _oScoreBoard.updateCombinationValue(_iTurn, iID, iValue);
        _oScoreBoard.showConfirmation(_iTurn, iID);
        
        if (iValue === 0) {
            playSound("wrong",1,false);
        } else {
            playSound("correct",1,false);
        }
        
        this._onConfirmedSelection();
    };
    
    this._onConfirmedSelection = function(){
        _bTurnStart = false;
        _bWaitingForPlayer = false;
        this._setHandAnimationVisible(false);
        this._updateTotalScores();
        
        if (this._checkForGameOver() === false) {
            this._changeTurn();
        }
    };
    
    this.isEndOfTurn = function(){
        return _bEndOfTurn;
    };
    
    this._onEndOfTurn = function(){
        _bEndOfTurn = true;

        if (_iTurn === PLAYER_HUMAN_NUMBER && _bStartGame) {
            _iPlayerTimer = 0;
            _bWaitingForPlayer = true;
            _oInterface.setRollButtonActive(false);            
        }
    };
    
    this._checkForNewLaunch = function(){
        // CHECK IF THE PLAYER HAS ANOTHER LAUNCH OR MUST CHANGE TURN
        if (_iDiceLaunch === DICES_LAUNCH_POSSIBILITIES) {
            // AT THE END OF THE TURN, THE PLAYER MUST CONFIRM A SELECTION, OR THE TURN WON'T CHANGE
            this._onEndOfTurn();
        } else {
            this._setNextLaunch();
        }
    };
    
    this._CPUConfirmSelection = function(){
        // FIND THE HIGHEST VALUED COMBINATION
        var aPlayerCombinations = _aPlayers[_iTurn].getCombinations();
        var iID = _oArtificialIntelligence.checkForBestCombination(_aMomentaryCombinations, aPlayerCombinations);
        this.confirmCombinationValue(iID);
    };
    
    this._CPULockDices = function(){
        // IF THERE'S NO OTHER LAUNCH, SKIP THIS AND CONFIRM A SELECTION
        if (_iDiceLaunch === DICES_LAUNCH_POSSIBILITIES) {
            return false;
        }
        
        var aDices = _aPlayers[_iTurn].getDices();
        var aCombinations = _aPlayers[_iTurn].getCombinations();
        
        // UNLOCK THE DICES IN CASE IT'S NEEDED
        for (var i = 0; i < aDices.length; i++) {
            if (aDices[i].isLocked() === true) {
                aDices[i].setLocked(false);
                aDices[i].setHighlightVisible(false);
            }
        };
        
        // CHECK FOR ANY DICE TO KEEP FOR NEXT ROLL; ELSE, SKIP THIS AND CONFIRM A COMBINATION
        var bKeepDices = _oArtificialIntelligence.checkForDicesToKeep(aDices, aCombinations);
        return bKeepDices;
    };
    
    this._areDicesLocked = function(){
        // CHECK IF ALL THE DICES ARE LOCKED OR NOT
        var aDices = _aPlayers[_iTurn].getDices();
        for (var i = 0; i < aDices.length; i++) {
            if (aDices[i].isLocked() === false) {
                return false;
            }
        };
        
        return true;
    };
    
    this._decideCPUAction = function() {
        if (_bEndOfTurn === false) {
            // IF THE CPU HAS TO LAUNCH DICES
            if (_bLaunchDone === false) {
                // LAUNCH DICES, CHECK FOR COMBINATIONS VALUE
                this.onRollDices();
                _bLaunchDone = true;
            } else {
                // AFTER LAUNCHED, THE CPU HAS TO DECIDE ITS NEXT MOVE
                if (this._CPULockDices() === true && this._areDicesLocked() === false) {
                    this._setNextLaunch();         // LOCK DICES, CHECK FOR NEXT TURN
                } else {
                    this._CPUConfirmSelection();  // CONFIRM A COMBINATION, GO TO NEXT TURN
                }
            }
        // WE'RE AT THE END OF THE TURN, CONFIRM A COMBINATION AND CHANGE TURN
        } else {
            this._CPUConfirmSelection();
        }
    };

    this.update = function() {
        if (_bStartGame === false) {
            return;
        }
        
        // IF THE HUMAN PLAYER DOESN'T DO ANYTHING, SET THE HELPING HAND VISIBLE
        if (_bWaitingForPlayer) {
            _iPlayerTimer += s_iTimeElaps;
            if (_iPlayerTimer > HAND_ANIMATION_DELAY) {
                _iPlayerTimer = 0;
                this._setHandAnimationVisible(true);
                _bWaitingForPlayer = false;
            }
        }        
        // THE NEXT UPDATES WILL BE USED FOR CPU PLAYERS ONLY        
        if (_iTurn === PLAYER_HUMAN_NUMBER) {
            return;
        }
        // CHECK IF THE HAND ANIMATION NEEDS TO BE SET INVISIBLE
        if (_oHandAnimation.alpha === HAND_ANIMATION_MAX_ALPHA) {
            this._setHandAnimationVisible(false);
        }        
        // AFTER SOME TIME INTERVAL, THE CPU PLAYER WILL CHECK WHAT TO DO            
        _iCPU_Timer += s_iTimeElaps;
        if (_iCPU_Timer > CPU_TIMER_VALUE_MAX) {
            _iCPU_Timer = 0;
            this._decideCPUAction();
        }        
    };
    
    s_oGame = this;

    this._init();
}

var s_oGame;