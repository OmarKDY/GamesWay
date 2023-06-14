function CGameSettings(_iLang, Level) {
    var _iLanguage;
    var _szAnswerWords;
    var _aImgWords = [];
    var _aImgCopyright = [];
    var _i;
    var _aNumOfLetterBox;
    var _aLetBoxOccupied;
    var _aLetters;
    var _iNumber_Of_Char;
    var _iMoveNumber;
    var _oButNext;
    var _oButMistake;
    var _oButSuccess;
    var _oButDelSomeLetters;
    var _oButAddALetter;
    var _iLevel;
    var _aChoosedWords;
    var _iLetterAdded;
    var _aNumQuests;
    var _bPlay;
    
    this._init = function () {
        _iLanguage = _iLang;
        _iLevel = Level;
        _iMoveNumber = 0;
        _aNumOfLetterBox = new Array();
        _aLetBoxOccupied = new Array();
        _aLetters = new Array();
        _aChoosedWords = new Array();
        _aNumQuests = new Array();
        _iLetterAdded = 0;
        
        _bPlay = true;

        if (NUMBER_QUEST_IMAGE > 4) {
            NUMBER_QUEST_IMAGE = 4;
        }

        for (_i = 0; _i < N_MAX_WORDS_TO_GUESS; _i++) {
            _aImgWords[_i] = new Array(NUMBER_QUEST_IMAGE);
            _aImgCopyright[_i] = new Array(NUMBER_QUEST_IMAGE);
        }

        for (var k = 0; k < NUMBER_OF_WORDS; k++) {
            _aNumQuests[k] = k;
        }

        _aNumQuests = shuffle(_aNumQuests);

        var oSpriteSuccess = s_oSpriteLibrary.getSprite('success');
        _oButSuccess = createBitmap(oSpriteSuccess);
        _oButSuccess.x = CANVAS_WIDTH / 2;
        _oButSuccess.y = CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 50;
        _oButSuccess.regX = oSpriteSuccess.width / 2;
        _oButSuccess.regY = oSpriteSuccess.height / 2;
        _oButSuccess.visible = false;
        s_oStage.addChild(_oButSuccess);

        var oSpriteMistake = s_oSpriteLibrary.getSprite('mistake');
        _oButMistake = createBitmap(oSpriteMistake);
        _oButMistake.x = CANVAS_WIDTH / 2;
        _oButMistake.y = CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 50;
        _oButMistake.regX = oSpriteMistake.width / 2;
        _oButMistake.regY = oSpriteMistake.height / 2;
        _oButMistake.visible = false;
        s_oStage.addChild(_oButMistake);

        var _oSpriteNext = s_oSpriteLibrary.getSprite('but_next');
        _oButNext = new CGfxButton(s_oStage,CANVAS_WIDTH / 2 + 430, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 700, _oSpriteNext);
        _oButNext.addEventListener(ON_MOUSE_UP, this._onNextLevel, this);
        _oButNext.setVisible(false);
        _oButNext.setCursorType("pointer");

        var _oSpriteDSL = s_oSpriteLibrary.getSprite('but_remove_letters');
        _oButDelSomeLetters = new CGfxButton(s_oStage,CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 910, _oSpriteDSL);
        _oButDelSomeLetters.addEventListener(ON_MOUSE_UP, this.removeSomeLetters, this);
        _oButDelSomeLetters.setCursorType("pointer");

        var _oSpriteAAL = s_oSpriteLibrary.getSprite('but_add_a_letter');
        _oButAddALetter = new CGfxButton(s_oStage,CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 910, _oSpriteAAL);
        _oButAddALetter.addEventListener(ON_MOUSE_UP, this.addALetter, this);
        _oButAddALetter.setCursorType("pointer");
    };

    this.loadQuest = function () {
        _szAnswerWords = s_aQuestions[_aNumQuests[_iLevel]].answer[_iLanguage];
		
        for (var i = 0; i < NUMBER_QUEST_IMAGE; i++) {
            var _oSpriteImgWords = s_oSpriteLibrary.getSprite(s_aQuestions[_aNumQuests[_iLevel]].img[0].file[i]);
            _aImgWords[_iLevel][i] = new CGfxButton(s_oStage,CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT, _oSpriteImgWords);

            var _oSpriteImgCopyright = s_oSpriteLibrary.getSprite('text_copyright');
            _aImgCopyright[_iLevel][i] = new CText(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 320, _oSpriteImgCopyright, s_aQuestions[_aNumQuests[_iLevel]].img[0].copyright[i], PRIMARY_FONT, "#ffffff", 25, 0);
            _aImgCopyright[_iLevel][i].setVisible(false);
        }
    };

    this.unloadQuest = function (iNumber) {
        for (var k = 0; k < 4; k++) {
            _aImgWords[iNumber][k].unload();
            _aImgWords[iNumber][k] = null;
            _aImgCopyright[iNumber][k].unload();
            _aImgCopyright[iNumber][k] = null;
        }

        for (_i = 0; _i < _iNumber_Of_Char; _i++) {
            _aNumOfLetterBox[_i].unload();
            _aNumOfLetterBox[_i] = null;

        }

        for (_i = 0; _i < NUM_OF_SPAWN_LETTER; _i++) {
            _aLetters[_i].unload();
            _aLetters[_i] = null;
        }
    };

    this.unload = function () {
        _oButAddALetter.unload();
        _oButAddALetter = null;

        s_oStage.removeChild(_oButMistake);
        _oButMistake = null;

        s_oStage.removeChild(_oButSuccess);
        _oButSuccess = null;

        _oButDelSomeLetters.unload();
        _oButDelSomeLetters = null;

        this.unloadQuest(_iLevel);

        s_oGameSettings = null;
    };

    this.removeSomeLetters = function () {
        if (s_oGame.getMoney() < COST_FOR_REMOVE_LETTERS - 1) {
            return;
        }
        var aArray = new Array();
        //SELEZIONA LETTERE RESTANTI
        for (var i = 0; i < NUM_OF_SPAWN_LETTER; i++) {
            if (_aLetters[i].getVisible()) {
                aArray.push(_aLetters[i]);
            }
        }
        //MESCOLIAMO LE LETTERE
        var iCnt = 3;
        var bRemoveAlmostALetter = false;
        for (var i = 0; i < aArray.length; i++) {
            var bTest = true;
            for (var j = 0; j < _iNumber_Of_Char; j++) {
                if (aArray[i].getText() === _szAnswerWords.charAt(j)) {
                    bTest = false;
                    break;
                }
            }
            if (bTest === true) {
                aArray[i].setVisible(false);
                _aLetBoxOccupied[aArray[i].getExtraData("boxposition")] = false;
                aArray[i].setExtraData("boxposition", null);
                iCnt--;
                bRemoveAlmostALetter = true;
                if (iCnt === 0) {
                    break;
                }
            }
        }
        if (bRemoveAlmostALetter === true) {
            s_oGame.animSpentMoney(-COST_FOR_REMOVE_LETTERS);
        }
    };

    this.addALetter = function () {
        var bFlag = true;
        var iLimitRepeat = 0;
        if (s_oGame.getMoney() < COST_OF_A_LETTER - 1) {
            return;
        }
        if (_iLetterAdded < _iNumber_Of_Char && s_oGame.getMoney() > COST_OF_A_LETTER - 1) {
            while (bFlag === true) {
                var iRandom = Math.floor(Math.random() * _iNumber_Of_Char);
                if (_aLetBoxOccupied[iRandom] === true) {
                    if (iLimitRepeat === _iNumber_Of_Char)
                        bFlag = false;
                    iLimitRepeat++;
                }
                else {
                    for (_i = 0; _i < NUM_OF_SPAWN_LETTER; _i++) {
                        if (_aLetters[_i].getText() === _szAnswerWords.charAt(iRandom) && _aLetters[_i].getUsed() === false) {
                            _aLetters[_i].setPosition(_aNumOfLetterBox[iRandom].getX(), _aNumOfLetterBox[iRandom].getY());
                            _aLetters[_i].block(true);
                            _aLetters[_i].setUsed(true);
                            _aChoosedWords[iRandom] = _szAnswerWords.charAt(iRandom);
                            _aLetters[_i].setExtraData("boxposition", iRandom);
                            _aLetBoxOccupied[_aLetters[_i].getExtraData("boxposition")] = true;
                            s_oGame.animSpentMoney(-COST_OF_A_LETTER);
                            bFlag = false;
                            _iLetterAdded++;
                            this.checkVictory();
                            break;
                        }
                    }
                }
            }
        }
    };

    this._onNextLevel = function () {
        createjs.Tween.get(_oButSuccess).to({alpha: 0}, 1000, createjs.Ease.cubicOut).call(function () {
            _oButSuccess.visible = false;
        });
        _oButNext.setVisible(false);
        _iMoveNumber = 0;
        _iLetterAdded = 0;
        s_oGame.wordGuessed();
    };

    this.placeLetters = function () {
        var oSprite = s_oSpriteLibrary.getSprite('letter');
        var iSpriteWidth = oSprite.width;
        var iSpriteRegX = oSprite.width/2;
        var iTotalWidth = (Math.round(NUM_OF_SPAWN_LETTER/2)) * iSpriteWidth;
        var iX = CANVAS_WIDTH/2 - iTotalWidth/2 +iSpriteRegX-iSpriteWidth;
        var iY;
        var iRandomLetter;
        for(var i=0; i<_iNumber_Of_Char; i++){
            if (i%2 != 0) {
                iY = CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 750;
            }else{
                iY = CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 630;
                iX += iSpriteWidth;
            }

            _aLetters[i] = new CTextButton(iX,iY, oSprite, _szAnswerWords.charAt(i), PRIMARY_FONT, "#382074", 66, -10,s_oStage);
            _aLetters[i].addEventListenerWithParams(ON_MOUSE_UP, this._onChooseWord, this, _szAnswerWords.charAt(i), i);
            
            if (s_bMobile === false) {
                _aLetters[i].setCursorType("pointer");
            }
        };

        for(var i=_iNumber_Of_Char; i<NUM_OF_SPAWN_LETTER; i++){

            iRandomLetter = Math.floor(Math.random() * ALPHABET[_iLanguage].length);

            if (i%2 != 0) {
                iY = CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 750;
            }else{
                iY = CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 630;
                iX += iSpriteWidth;
            }

            _aLetters[i] = new CTextButton(iX,iY, oSprite, ALPHABET[_iLanguage][iRandomLetter], PRIMARY_FONT, "#382074", 66, -10,s_oStage);
            _aLetters[i].addEventListenerWithParams(ON_MOUSE_UP, this._onChooseWord, this, ALPHABET[_iLanguage][iRandomLetter], i);
            
            if (s_bMobile === false) {
                _aLetters[i].setCursorType("pointer");
            }
        };

        _oButAddALetter.block(false);
        _oButDelSomeLetters.block(false);
    };

    this.returnPosition = function (X, Y, iID, lastLetter, imovedNum) {
        _aLetters[iID].setPosition(X, Y);
        _aLetters[iID].addEventListenerWithParams(ON_MOUSE_UP, this._onChooseWord, this, lastLetter, iID);
        _aLetters[iID].setUsed(false);
        _aChoosedWords[imovedNum] = null;

        _bPlay = true;


        if (_oButMistake.visible === true) {
            createjs.Tween.get(_oButMistake).to({alpha: 0}, 500, createjs.Ease.cubicOut).call(function () {
                _oButMistake.visible = false;
            });
        }
        _aLetBoxOccupied[imovedNum] = false;
        _i = 0;
        var bFlag = false;
        while (_i < _iNumber_Of_Char && bFlag === false) {
            if (_aLetBoxOccupied[_i] === false) {
                _iMoveNumber = _i;
                bFlag = true;
            }
            else
            {

            }
            _i++;
        }
    };

    this.shuffleLetters = function () {
        for (_i = 0; _i < NUM_OF_SPAWN_LETTER; _i++) {
            var j = Math.floor(Math.random() * NUM_OF_SPAWN_LETTER);
            var tempX = _aLetters[_i].getX();
            var tempY = _aLetters[_i].getY();
            _aLetters[_i].setPosition(_aLetters[j].getX(), _aLetters[j].getY());
            _aLetters[j].setPosition(tempX, tempY);
        }
    };

    this._onChooseWord = function (cLetter, iID) {
        if (_iMoveNumber < _iNumber_Of_Char) {
            var _iK = 0;
            var bFlag = false;
            while (_iK < _iNumber_Of_Char && bFlag === false) {
                if (_aLetBoxOccupied[_iK] === false) {
                    _aLetters[iID].addEventListenerWithParams(ON_MOUSE_UP, this.returnPosition, this, _aLetters[iID].getX(), _aLetters[iID].getY(), iID, _aLetters[iID].getText(), _iK);
                    _aLetters[iID].setPosition(_aNumOfLetterBox[_iK].getX(), _aNumOfLetterBox[_iK].getY());
                    _aChoosedWords[_iK] = cLetter;
                    _aLetBoxOccupied[_iK] = true;
                    _aLetters[iID].setExtraData("boxposition", _iK);
                    _aLetters[iID].setUsed(true);
                    bFlag = true;
                }
                else
                {
                    _iMoveNumber++;
                }
                _iK++;
            }
            _iMoveNumber = _iK;
        }

        this.checkVictory();
    };

    this.checkVictory = function () {
        var _iOccupied = 0;
        for (_i = 0; _i < _iNumber_Of_Char; _i++) {
            if (_aLetBoxOccupied[_i] === true) {
                _iOccupied++;
            }
        }

        if (_iOccupied < _iNumber_Of_Char) {
            return;
        }

        if (_iOccupied === _iNumber_Of_Char) {
            var bFlag = true;
            for (_i = 0; _i < _iNumber_Of_Char; _i++) {
                if (_aChoosedWords[_i] === _szAnswerWords.charAt(_i))
                {

                }
                else
                {
                    bFlag = false;
                }
            }
            if (bFlag === true) {
                _oButSuccess.alpha = 0;
                _oButSuccess.visible = true;
                s_oStage.setChildIndex(_oButSuccess, s_oStage.numChildren - 1);
                createjs.Tween.get(_oButSuccess).to({alpha: 1}, 700, createjs.Ease.cubicOut);
                _oButNext.setVisible(true);
                s_oGame.stoppedTime(true);
                
                playSound("guessed",1,false);
                
                s_oGame.animEarnedMoney(_iNumber_Of_Char);
                for (_i = 0; _i < NUM_OF_SPAWN_LETTER; _i++)
                    _aLetters[_i].block(true);

                for (var i = 0; i < NUMBER_QUEST_IMAGE; i++) {
                    _aImgWords[_iLevel][i].block(true);
                }
                $(s_oMain).trigger("end_level", {ilevel: _iLevel});
                _oButAddALetter.block(true);
                _oButDelSomeLetters.block(true);
            }
            else
            {
                _oButMistake.alpha = 0;
                _oButMistake.visible = true;
                s_oStage.setChildIndex(_oButMistake, s_oStage.numChildren - 1);
                createjs.Tween.get(_oButMistake).to({alpha: 1}, 700, createjs.Ease.cubicOut);
                if (_bPlay === true) {
                    playSound("wrong",1,false);
                    _bPlay = false;
                }
            }
        }
    };

    this.setLevel = function (Level) {
        _iLevel = Level;
    };

    this.showPicture = function ()
    {


        _aImgWords[_iLevel][0].setPosition(CANVAS_WIDTH / 2 - 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT - 100);
        if (s_bMobile === false) {
            _aImgWords[_iLevel][0].setCursorType("pointer");
        }

        switch (NUMBER_QUEST_IMAGE) {
            case 2:
                _aImgWords[_iLevel][1].setPosition(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT - 100);
                _aImgWords[_iLevel][1].setCursorType("pointer");
                break;
            case 3:
                _aImgWords[_iLevel][1].setPosition(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT - 100);
                _aImgWords[_iLevel][2].setPosition(CANVAS_WIDTH / 2 - 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 200);
                if (s_bMobile === false) {
                    _aImgWords[_iLevel][1].setCursorType("pointer");
                    _aImgWords[_iLevel][2].setCursorType("pointer");
                }
                break;
            case 4:
                _aImgWords[_iLevel][1].setPosition(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT - 100);
                _aImgWords[_iLevel][2].setPosition(CANVAS_WIDTH / 2 - 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 200);
                _aImgWords[_iLevel][3].setPosition(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 200);
                if (s_bMobile === false) {
                    _aImgWords[_iLevel][1].setCursorType("pointer");
                    _aImgWords[_iLevel][2].setCursorType("pointer");
                    _aImgWords[_iLevel][3].setCursorType("pointer");
                }
                break;
        }
        for (_i = 0; _i < 4; _i++)
            this.addEventForImage(_i, 0);

        _iNumber_Of_Char = _szAnswerWords.length;
        var oSpriteLetBox = s_oSpriteLibrary.getSprite('letterbox');
        var iSpriteWidth = oSpriteLetBox.width;
        var iTotalWidth = iSpriteWidth * _iNumber_Of_Char;
        var iSpriteRegX = iSpriteWidth/2;
        var iX = CANVAS_WIDTH/2 - iTotalWidth/2 + iSpriteRegX;
        for (_i = 0; _i < _iNumber_Of_Char; _i++) {
            _aNumOfLetterBox[_i] = new CGfxButton(s_oStage,iX, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 470, oSpriteLetBox, true);
            _aNumOfLetterBox[_i].block(true);
            _aLetBoxOccupied[_i] = false;

            iX += iSpriteWidth; 
        }
    };

    this.addEventForImage = function (iID, iReAdd, iExPosX, iExPosY, fExScale) {
        if (iReAdd === 0) {
            _aImgWords[_iLevel][iID].addEventListenerWithParams(ON_MOUSE_UP, this.zoomImage, this, _aImgWords[_iLevel][iID].getX(), _aImgWords[_iLevel][iID].getY(), _aImgWords[_iLevel][iID].getScale(), iID);
        }
        if (iReAdd === 1) {
            _aImgWords[_iLevel][iID].setPosition(iExPosX, iExPosY);

            _aImgWords[_iLevel][iID].setScale(fExScale);
            _aImgWords[_iLevel][iID].addEventListenerWithParams(ON_MOUSE_UP, this.zoomImage, this, iExPosX, iExPosY, fExScale, iID);
            _aImgCopyright[_iLevel][iID].setVisible(false);
        }
    };

    this.zoomImage = function (iExPosX, iExPosY, fExScale, iID) {
        _aImgWords[_iLevel][iID].setPosition(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + GAME_ELEMENT_HEIGHT + 50);
        _aImgWords[_iLevel][iID].setScale(2);
        _aImgWords[_iLevel][iID].changeChildIndex(s_oStage.numChildren - 5);

        _aImgWords[_iLevel][iID].addEventListenerWithParams(ON_MOUSE_UP, this.addEventForImage, this, iID, 1, iExPosX, iExPosY, fExScale);
        _aImgCopyright[_iLevel][iID].setVisible(true);
        _aImgCopyright[_iLevel][iID].changeChildIndex(s_oStage.numChildren - 4);

    };

    s_oGameSettings = this;
    this._init();
}

var s_oGameSettings;

