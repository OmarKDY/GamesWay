function CScoreboard(oParentContainer){
    var _oParentContainer;
    var _oScoreboardContainer;
    
    var _aScoresSprites;
    var _aPlayerScoresTexts;
    var _aPlayerTotalsTexts;
    var _aHumanPlayerConfirmations;
    var _aHitAreas;

    this._init = function(){
        _oScoreboardContainer = new createjs.Container();
        _oParentContainer.addChild(_oScoreboardContainer);
        this._addPlayerStripes();

        _aScoresSprites = [];
        _aPlayerScoresTexts = [];
        _aPlayerTotalsTexts = [];
        _aHumanPlayerConfirmations = [];
        _aHitAreas = [];
        
        var iOffsetXLeft = -260;
        var iOffsetXRight = 5;
        var iStartPositionY = -133;
        var iOffsetPositionY = 30;

        var aTexts = [TEXT_COMBINATION_0,   // ACES
                      TEXT_COMBINATION_1,   // TWOS
                      TEXT_COMBINATION_2,   // THREES
                      TEXT_COMBINATION_3,   // FOURS
                      TEXT_COMBINATION_4,   // FIVES
                      TEXT_COMBINATION_5,   // SIXES
                      TEXT_BONUS,
                      TEXT_TOTAL_TOP ];
        for (var i = 0; i < aTexts.length; i++) {
            var oText = new CTLText(_oScoreboardContainer, 
                    CANVAS_WIDTH_HALF + iOffsetXLeft, CANVAS_HEIGHT_HALF + iStartPositionY+(i*iOffsetPositionY), 130, 20, 
                    20, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    aTexts[i],
                    true, true, false,
                    false);

        };
        
        var aTexts = [TEXT_COMBINATION_6,   // 3 OF A KIND
                      TEXT_COMBINATION_7,   // 4 OF A KIND
                      TEXT_COMBINATION_8,   // FULL HOUSE
                      TEXT_COMBINATION_9,   // SM. STRAIGHT
                      TEXT_COMBINATION_10,  // LG. STRAIGHT
                      TEXT_COMBINATION_11,  // YACHT
                      TEXT_COMBINATION_12,  // CHANCE
                      TEXT_TOTAL_BOTTOM,
                      TEXT_GRAND_TOTAL ];
        for (var i = 0; i < aTexts.length; i++) {
            var oText = new CTLText(_oScoreboardContainer, 
                    CANVAS_WIDTH_HALF + iOffsetXRight, CANVAS_HEIGHT_HALF + iStartPositionY+(i*iOffsetPositionY), 130, 20, 
                    20, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    aTexts[i],
                    true, true, false,
                    false);

        };
        
        this._initPlayersScoreTexts();
        this._initAutomaticScoreText();
    };
    
    this.addStripe = function(szSpriteA, szSpriteB, iPlayerN) {
        var iSquareSize = 30;
        var iStripesY = CANVAS_HEIGHT_HALF - 4;
        var oSpriteA = s_oSpriteLibrary.getSprite(szSpriteA);
        var oSpriteB = s_oSpriteLibrary.getSprite(szSpriteB);
        
        var oPlayerStripe1 = createBitmap(oSpriteA);
        var oPlayerStripe2 = createBitmap(oSpriteB);
        oPlayerStripe1.regX = oSpriteA.width * 0.5;
        oPlayerStripe1.regY = (oSpriteA.height * 0.5) + (iSquareSize * 0.5);
        oPlayerStripe2.regX = oSpriteB.width * 0.5;
        oPlayerStripe2.regY = oSpriteB.height * 0.5;
        oPlayerStripe1.x = CANVAS_WIDTH_HALF - 105 + (iSquareSize*iPlayerN);
        oPlayerStripe2.x = CANVAS_WIDTH_HALF + 155 + (iSquareSize*iPlayerN);
        oPlayerStripe1.y = oPlayerStripe2.y = iStripesY;
        _oScoreboardContainer.addChild(oPlayerStripe1, oPlayerStripe2);
    };
    
    this._addPlayerStripes = function(){
        if (s_iPlayersNumber > 1) {
            this.addStripe("player_stripes1a", "player_stripes1b", 1);
        }
        if (s_iPlayersNumber > 2) {
            this.addStripe("player_stripes2a", "player_stripes2b", 2);
        }
        if (s_iPlayersNumber > 3) {
            this.addStripe("player_stripes3a", "player_stripes3b", 3);
        }
    };
    
    this._addHumanPlayerConfirmation = function(iX, iY, iID, oContainer){
        var iHitAreaX = iX-155;
        var iHitAreaY = iY-18;
        var oHitArea = new CHitArea(HIT_AREA_WIDTH, HIT_AREA_HEIGHT, iHitAreaX, iHitAreaY, iID, oContainer);
        oHitArea.addEventListenerWithParams(ON_MOUSE_UP, this._onConfirmationButtonClick, this, iID);
        _aHitAreas.push(oHitArea);
        
        var oButton = new CConfirmationButton(iX, iY, iID, oContainer);
        oButton.addEventListenerWithParams(ON_MOUSE_UP, this._onConfirmationButtonClick, this, iID);
        _aHumanPlayerConfirmations.push(oButton);
    };
    
    this._onConfirmationButtonClick = function(iID){
        if (s_oGame.getTurn() !== PLAYER_HUMAN_NUMBER || 
            s_oGame.isTurnBlocked() === true ||
            s_oGame.isTurnStarted() === false) {
            return;
        }
        
        playSound("select",1,0);

        s_oGame.confirmCombinationValue(iID);
        this.lockConfirmationButton(iID, false);
    };
    
    this.lockConfirmationButton = function(iID, bValue) {
        _aHumanPlayerConfirmations[iID].setClickable(bValue);
        _aHumanPlayerConfirmations[iID].setVisible(bValue);
        _aHitAreas[iID].setClickable(bValue);
    };
    
    this._initPlayersScoreTexts = function(){
        var iOffsetUpperStartX = -105;
        var iOffsetLowerStartX = 156;
        var iOffsetSpaceX = 30;
        
        for (var i = 0; i < s_iPlayersNumber; i++) {
            var aScoreTexts = [];
            var aScoreSprites = [];
            for (var j = 0; j < COMBINATIONS_NUMBER; j++) {
                var iX = CANVAS_WIDTH_HALF + (iOffsetLowerStartX+(iOffsetSpaceX*i));
                if (j < COMBINATION_TOP_LIMIT){
                    iX = CANVAS_WIDTH_HALF + (iOffsetUpperStartX+(iOffsetSpaceX*i));
                }
                var iY = CANVAS_HEIGHT_HALF + PLAYER_SCORE_TEXTS_POSITION_Y[j];
                
                if (i === PLAYER_HUMAN_NUMBER) {
                    this._addHumanPlayerConfirmation(iX, iY, j, _oScoreboardContainer);
                }

                var oScoreSprite = this.createScoreSprite(iX, iY);
                var oCombinationScoreText = this.createScoreBoardText(" ", iX, iY);
                aScoreTexts.push(oCombinationScoreText);
                aScoreSprites.push(oScoreSprite);                
            };
            _aPlayerScoresTexts.push(aScoreTexts);
            _aScoresSprites.push(aScoreSprites);
        };
    };
    
    this.createScoreSprite = function(iX, iY){
        var oSprite = s_oSpriteLibrary.getSprite("score_confirm");
        var oScoreSprite = createBitmap(oSprite);
        oScoreSprite.regX = oSprite.width * 0.5;
        oScoreSprite.regY = oSprite.height * 0.5;
        oScoreSprite.x = iX;
        oScoreSprite.y = iY;
        oScoreSprite.alpha = 0;
        _oScoreboardContainer.addChild(oScoreSprite);
        return oScoreSprite;
    };
    
    this._initAutomaticScoreText = function(){
        var iOffsetUpperStartX = -105;
        var iOffsetLowerStartX = 156;
        var iOffsetSpaceX = 30;
        
        for (var i = 0; i < s_iPlayersNumber; i++) {
            var aPlayerTotalsTexts = [];
            
            for (var j = 0; j < 4; j++) {
                var iX = CANVAS_WIDTH_HALF + (iOffsetLowerStartX+(iOffsetSpaceX*i));
                if (j < 2){
                    iX = CANVAS_WIDTH_HALF + (iOffsetUpperStartX+(iOffsetSpaceX*i));
                }
                var iY = CANVAS_HEIGHT_HALF + PLAYER_TOTALS_TEXTS_POSITION_Y[j];
                var oCombinationScoreText = this.createScoreBoardText(" ", iX, iY);
                aPlayerTotalsTexts.push(oCombinationScoreText);
            };
            _aPlayerTotalsTexts.push(aPlayerTotalsTexts);
        };        
    };
    
    this.createScoreBoardText = function(szText, iX, iY){
        var oText = new createjs.Text(szText, FONT_SIZE_SCOREBOARD + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        oText.x = iX;
        oText.y = iY;
        oText.textAlign = "center";
        oText.textBaseline = "middle";
        _oScoreboardContainer.addChild(oText);
        return oText;
    };
    
    this.updateTotalBoardTexts = function(iPlayerN, iScoreIndex, iScore){
        _aPlayerTotalsTexts[iPlayerN][iScoreIndex].text = iScore;
    };
    
    this.updateCombinationValue = function(iPlayerN, iScoreIndex, iScore) {
        _aPlayerScoresTexts[iPlayerN][iScoreIndex].text = iScore;        
    };
    
    this.showConfirmation = function(iPlayerN, iScoreIndex) {
        var oScoreSprite = _aScoresSprites[iPlayerN][iScoreIndex];
        createjs.Tween.get(oScoreSprite, {loop: false})
            .to({alpha: 1}, 200, createjs.Ease.cubicOut)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function(){
                createjs.Tween.removeTweens(oScoreSprite);
            });
    };
    
    _oParentContainer = oParentContainer;   
    
    this._init();
};