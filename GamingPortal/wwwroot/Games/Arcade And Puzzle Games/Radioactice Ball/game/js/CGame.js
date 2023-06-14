function CGame(oData) {

    var _oBgLevel;
    var _oInterface;
    var _iLevel;
    var _bPause;
    var _aBall;
    var _pCharacterDim = {};
    var _pPlatformDim = {};
    var _fPhysicsTime = 0;
    var _iCanvasWidthDiv;
    var _iCanvasHeightDiv;
    var _iSpaceBetWall;
    var _iScore;
    var _iAccScore;
    var _iScoreExtraLife;
    var _iSpeedBallRate;
    var _bPressedKeys;
    var _bPressedKeyLeft;
    var _bPressedKeyRight;
    var _iDir;
    var _oCharacter;
    var _iCnt;
    var _aRope;
    var _iRopeHeight;
    var _iRopeWidth;
    var _iRopeX;
    var _iRopeY;
    var _iRopeID;
    var _aExplosion;
    var _oDoor;
    var _iTime;
    var _bInput;
    var _oRays;
    var _oNextLevel;
    var _iCombo;
    var _iLife;
    var _aPlatform;
    var _iOffsetXPlat;
    var _iOffsetYPlat;
    var _oJoypad;
    var _iSegmentOffset;
    var _bDead;
    var _iTimeRestart;
    var _iLevelAds;
    var _aBallCached;
    var _iCount;
    var _iMaxInstance;

    this._init = function () {
        _bPause = false;
        _iCanvasWidthDiv = CANVAS_WIDTH / 2;
        _iCanvasHeightDiv = CANVAS_HEIGHT / 2;
        _aBall = new Array();
        _aRope = new Array();
        _aExplosion = new Array();
        _aPlatform = new Array();
        _aBallCached = new Array();
        _iSpaceBetWall = 8;
        _iCount = 0;
        _iMaxInstance = 0;
        var oSpritePlatform = s_oSpriteLibrary.getSprite("platform");
        _pPlatformDim = {x: oSpritePlatform.width / 2, y: oSpritePlatform.height / 2};

        _iOffsetXPlat = _pPlatformDim.x + 1;
        _iOffsetYPlat = _pPlatformDim.y - 1;

        _iSpeedBallRate = 1;
        _iLevel = 0;
        _iScore = 0;
        _iAccScore = 0;
        _iScoreExtraLife = 0;
        _iLife = CHARACTER_LIVES;
        _iCnt = 0;
        _iLevelAds = 0;
        _iTime = TIME_LEVEL[_iLevel];
        _bPressedKeys = false;

        _iTimeRestart = TIME_RESTART;

        _oBgLevel = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(_oBgLevel); //Draws on canvas
        s_oStage.setChildIndex(_oBgLevel, 0);
            
        var iLv=_iLevel+1;
        _oInterface = new CInterface(iLv);

        _oInterface.refreshLife(_iLife);
        _oInterface.refreshTime(_iTime);
        _oInterface.refreshLevel(_iLevel);

        this.createLevel();
        this.createLevelPlatform();
        $(s_oMain).trigger("start_level", _iLevel);

        _bDead = false;

        var oSpriteCharacter = s_oSpriteLibrary.getSprite("character");
        _pCharacterDim = {x: ((oSpriteCharacter.width - 200) / 2) / 6, y: (oSpriteCharacter.height - 60) / 2};
        _oCharacter = new CCharacter(_iCanvasWidthDiv, oSpriteCharacter, 1);

        var oSpriteRope = s_oSpriteLibrary.getSprite("rope");
        _iRopeWidth = oSpriteRope.width / 2;
        _iRopeHeight = oSpriteRope.height;

        this.createDoor(_iCanvasWidthDiv, _iCanvasHeightDiv + 50);

        _iDir = 0;

        if (s_bMobile === true) {
            this.createJoypad();
        } else {
            document.onkeydown = onKeyDown;
            document.onkeyup = onKeyUp;
        }
        _oInterface.helpPage1(_iLevel);

    };

    this.createJoypad = function () {
        var oJoypadSprite = s_oSpriteLibrary.getSprite('joypad');
        _oJoypad = new CJoypad(oJoypadSprite, 100, 700, s_oStage, false);
        _oJoypad.addFireButtonListener(ON_MOUSE_DOWN, this.shootMobile, this);

        this.blockJoypad(true);

        _iSegmentOffset = Math.PI / 8;
    };

    this.instanceBall = function (iColor) {

        for (var i = 0; i < MAX_BALL_INSTANCE; i++) {
            var oSpriteBall = s_oSpriteLibrary.getSprite("ball" + iColor + "_" + 3);
            _aBallCached.push(new CBall(-50 + (-50 * iColor), -50 + (-50 * i), oSpriteBall, 0, _iSpeedBallRate, 3, iColor, false));
        }
    };

    this.createLevel = function () {
        var aBallsLevel = BALLS_LEVEL[_iLevel];
        var bCol1 = false;
        var bCol2 = false;
        var bCol3 = false;

        for (var i = 0; i < aBallsLevel.length; i++) {
            var iColor = aBallsLevel[i].color;
            if (iColor === 0) {
                bCol1 = true;
            } else if (iColor === 1) {
                bCol2 = true;
            } else if (iColor === 2) {
                bCol3 = true;
            }
        }

        if (bCol1 === true) {
            this.instanceBall(0);
        }
        if (bCol2 === true) {
            this.instanceBall(1);
        }
        if (bCol3 === true) {

            this.instanceBall(2);
        }
        var iCnt = 0;
        for (var i = 0; i < aBallsLevel.length; i++) {
            var iBallX = aBallsLevel[i].x;
            var iBallY = aBallsLevel[i].y;
            var iType = aBallsLevel[i].type;
            var iXDir = aBallsLevel[i].XDir;
            var iColor = aBallsLevel[i].color;
            for (var j = 0; j < _aBallCached.length; j++) {
                if (_aBallCached[j].getInfoData("Color") === iColor && _aBallCached[j].getActive() === false) {
                    _aBall[iCnt] = _aBallCached[j];
                    _aBall[iCnt].setPosition(iBallX, iBallY);
                    _aBall[iCnt].changeDirection(iXDir);
                    _aBall[iCnt].changeType(iType);
                    _aBall[iCnt].setActive(true);
                    _aBall[iCnt].setInfoData("ID", iCnt);
                    iCnt++;
                    break;
                }
            }
        }
        this.setPause(true);
        this.canInput(false);
    };

    this.createLevelPlatform = function () {
        var aPlatformsLevel = BRICKS_LEVEL[_iLevel];
        var oSpritePlatform = s_oSpriteLibrary.getSprite("platform");
        for (var i = 0; i < aPlatformsLevel.length; i++) {
            var iPlatformX = aPlatformsLevel[i].x;
            var iPlatformY = aPlatformsLevel[i].y;
            this.createAPlatform(i, iPlatformX, iPlatformY, oSpritePlatform);
        }
    };

    this.createABall = function (iID, iXPos, iYPos, oSpriteBall, iXDir, iBallType, iColor) {
        _aBall.push(new CBall(iXPos, iYPos, oSpriteBall, iXDir, _iSpeedBallRate, iBallType, iColor, false));
        _aBall[iID].setInfoData("ID", iID);
    };

    this.createAPlatform = function (i, iXPos, iYPos, oSprite) {
        _aPlatform[i] = createBitmap(oSprite);
        _aPlatform[i].x = iXPos;
        _aPlatform[i].y = iYPos;
        _aPlatform[i].regY = oSprite.height / 2;
        _aPlatform[i].regX = oSprite.width / 2;

        s_oStage.addChild(_aPlatform[i]);
        s_oStage.setChildIndex(_aPlatform[i], 5);

    };

    this.createDoor = function (iXPos, iYPos) {
        var oSpriteDoor = s_oSpriteLibrary.getSprite("door");
        _oDoor = new CDoor(iXPos, iYPos, oSpriteDoor);
        _oDoor.changeState("open", false);
    };

    this.onExit = function () {
        s_oGame.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_level", _iLevel);
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };

    this.unload = function () {
        _oInterface.unload();
        for (var i = 0; i < _aBall.length; i++) {
            _aBall[i].unload();
        }
        for (var i = 0; i < _aRope.length; i++) {
            _aRope[i].unload();
        }
        if (s_bMobile === true) {
            if (_oJoypad) {
                _oJoypad.unload();
                _oJoypad = null;
            }
        }

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };

    this.blockJoypad = function (bVal) {
        if (_oJoypad)
            _oJoypad.block(bVal);
    };

    function onKeyDown(evt) {
        if (_bInput === true) {
            if (evt.keyCode === 32 && _aRope.length < MAX_ROPE) {
                s_oGame.shoot();
            }
            if (!_bPressedKeys) {
                if (evt.keyCode === 37) {
                    s_oGame.moveLeft();
                } else if (evt.keyCode === 39) {
                    s_oGame.moveRight();
                }
            }
        }
        evt.preventDefault();
        return false;
    }

    this.shoot = function () {
        _iDir = 0; //space
        _oCharacter.changeState("shoot");
        s_oGame.createARope(_aRope.length);
    };

    this.moveLeft = function () {
        _bPressedKeys = true;
        _bPressedKeyLeft = true;
        _iDir = -1; //left
        _oCharacter.changeState("run");
        _oCharacter.rotate(-1);
    };

    this.moveRight = function () {
        _bPressedKeys = true;
        _bPressedKeyRight = true;
        _iDir = 1; //right
        _oCharacter.changeState("run");
        _oCharacter.rotate(1);
    };

    function onKeyUp(evt) {
        if (_bPressedKeys && _bInput === true) {
            if (evt.keyCode === 37) {
                _bPressedKeys = false;
                _iDir = 0;
                _bPressedKeyLeft = false;
                if (_bInput === true)
                    _oCharacter.changeState("idle");
            }
            if (evt.keyCode === 39) {
                _bPressedKeys = false;
                _iDir = 0;
                _bPressedKeyRight = false;
                if (_bInput === true)
                    _oCharacter.changeState("idle");
            }
            if (evt.keyCode === 32) {
                if (_bPressedKeyLeft === true) {
                    _iDir = -1;
                    _oCharacter.changeState("run");
                } else if (_bPressedKeyRight === true) {
                    _iDir = 1;
                    _oCharacter.changeState("run");
                } else if (_bPressedKeyLeft === false && _bPressedKeyRight === false) {
                    _bPressedKeys = false;
                }
            }
        }
        evt.preventDefault();
        return false;
    }

    this.createARope = function (iID) {
        var oSpriteRope = s_oSpriteLibrary.getSprite("rope");
        _aRope.push(new CRope(_oCharacter.getX(), _oCharacter.getY(), oSpriteRope, 1));
        _aRope[iID].setInfoData("ID", iID);
    };

    this.combo = function (iXPos, iYPos, bHit) {
        if (bHit === true && _iCombo > 0) {
            var oCombo;
            var oComboCont;
            var pComboPos;
            var oComboContainer;
            if (iXPos > CANVAS_WIDTH / 2) {
                pComboPos = {x: -50, y: 0};
            } else
            {
                pComboPos = {x: 50, y: 0};
            }

            oCombo = new createjs.Text(COMBO_SCORE[_iCombo], "bold " + 40 + "px " + PRIMARY_FONT, "#ffffff");
            oCombo.textAlign = "left";
            oCombo.textBaseline = "alphabetic";
            oCombo.x = pComboPos.x;
            oCombo.y = pComboPos.y;

            oComboCont = new createjs.Text(COMBO_SCORE[_iCombo], "bold " + 40 + "px " + PRIMARY_FONT, "#000000");
            oComboCont.textAlign = "left";
            oComboCont.textBaseline = "alphabetic";
            oComboCont.x = pComboPos.x;
            oComboCont.y = pComboPos.y;
            oComboCont.outline = 0.2;

            oComboContainer = new createjs.Container();
            oComboContainer.addChild(oCombo, oComboCont);
            oComboContainer.scaleX = 0;
            oComboContainer.scaleY = 0;
            oComboContainer.x = iXPos;
            oComboContainer.y = iYPos;
            s_oStage.addChild(oComboContainer);

            createjs.Tween.get(oComboContainer).to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.backOut).call(function () {
                createjs.Tween.get(oComboContainer).to({scaleX: 0, scaleY: 0}, 500, createjs.Ease.backIn).call(function () {
                    s_oStage.removeChild(oComboContainer);
                });
            });
            this.addScore(COMBO_SCORE[_iCombo]);
        }
        else
        {
            _iCombo = 0;
        }

        if (_iCombo < 4 && bHit === true) {
            _iCombo++;
        }
    };

    this.__updatePhysics = function (fPhysicsScaleTime) {
        if (_bPressedKeys) {
            _oCharacter.update(_iDir);
        }
        
        if (_aRope.length === 0) {
            _iRopeY = -1;
            _iRopeX = -1;
        } else {
            for (var j = 0; j < _aRope.length; j++) {
                _aRope[j].update();
            }
        }
        for (var i = 0; i < _aBall.length; i++) {
            if (_aBall[i].getActive() === true) {
                //ROPE COLLISION
                var iBallX = _aBall[i].getX();
                var iBallY = _aBall[i].getY();
                var iRadius = _aBall[i].getInfoData("Radius");
                _aBall[i].update(fPhysicsScaleTime);
                //BRICK COLLISION BALL
                for (var k = 0; k < _aPlatform.length; k++) {
                    var iPlatX = _aPlatform[k].x;
                    var iPlatY = _aPlatform[k].y;
                    if (iBallX > iPlatX - _pPlatformDim.x - iRadius && iBallX < iPlatX + _pPlatformDim.x + iRadius && iBallY > iPlatY - _pPlatformDim.y - iRadius && iBallY < iPlatY + _pPlatformDim.y + iRadius) {
                        if (iBallY > iPlatY) {
                            _aBall[i].bounceDown();

                        }
                        else
                        {
                            _aBall[i].bounceUp();
                        }
                    }
                }
                if (_aRope.length !== 0) {
                    for (var j = 0; j < _aRope.length; j++) {
                        _iRopeX = _aRope[j].getX();
                        _iRopeY = _aRope[j].getY();
                        _iRopeID = j;
                        //BRICK COLLISION ROPE
                        for (var k = 0; k < _aPlatform.length; k++) {
                            var iPlatX = _aPlatform[k].x;
                            var iPlatY = _aPlatform[k].y;
                            if (_iRopeX > iPlatX - _pPlatformDim.x && _iRopeX < iPlatX + _pPlatformDim.x && _iRopeY > iPlatY - _pPlatformDim.y && _iRopeY < iPlatY + _pPlatformDim.y) {
                                _aRope[_iRopeID].aggance(true);
                            }
                        }
                        if (iBallX > _iRopeX - _iRopeWidth - iRadius && iBallX < _iRopeX + _iRopeWidth + iRadius && iBallY > _iRopeY - iRadius && iBallY < _iRopeY + _iRopeHeight + iRadius) {
                            this.addScore(_aBall[i].getInfoData("Score"));
                            _aBall[i].addExplosion();
                            switch (_aBall[i].getInfoData("Type")) {
                                case 0:
                                    this.unloadBall(i);
                                    break;
                                case 1:
                                    _aBall[i].changeType(0);
                                    _aBall[i].changeDirection(-1);
                                    _aBall[i].resetSpeed();
                                    for (var k = 0; k < _aBallCached.length; k++) {
                                        if (_aBallCached[k].getInfoData("Color") === _aBall[i].getInfoData("Color") && _aBallCached[k].getActive() === false) {
                                            this.activeABallChached(0, k, iBallX, iBallY);
                                            break;
                                        }
                                    }

                                    break;
                                case 2:
                                    _aBall[i].changeType(1);
                                    _aBall[i].changeDirection(-1);
                                    _aBall[i].resetSpeed();
                                    for (var k = 0; k < _aBallCached.length; k++) {
                                        if (_aBallCached[k].getInfoData("Color") === _aBall[i].getInfoData("Color") && _aBallCached[k].getActive() === false) {
                                            this.activeABallChached(1, k, iBallX, iBallY);
                                            break;
                                        }
                                    }
                                    break;
                                case 3:
                                    _aBall[i].changeType(2);
                                    _aBall[i].changeDirection(-1);
                                    _aBall[i].resetSpeed();
                                    for (var k = 0; k < _aBallCached.length; k++) {
                                        if (_aBallCached[k].getInfoData("Color") === _aBall[i].getInfoData("Color") && _aBallCached[k].getActive() === false) {
                                            this.activeABallChached(2, k, iBallX, iBallY);
                                            break;
                                        }
                                    }
                                    break;
                            }
                            _aRope[_iRopeID].setInfoData("Unloaded", false);
                            this.unloadRope(_iRopeID);
                            this.combo(iBallX, iBallY, true);
                            this.ballFinished();
                            break;
                        }
                    }
                }
                var iCharX = _oCharacter.getX();
                var iCharY = _oCharacter.getY();
                //CHARACTER COLLISON
                if (iBallX > iCharX - _pCharacterDim.x - iRadius && iBallX < iCharX + _pCharacterDim.x + iRadius && iBallY > iCharY - _pCharacterDim.y - iRadius && iBallY < iCharY + _pCharacterDim.y + iRadius) {
                    _aBall[i].addExplosion();
                    _aBall[i].setActive(false);
                    _aBall[i].setPosition(-100, -100);
                    this.setPause(true);
                    this.canInput(false);
                    if (s_bMobile === true) {
                        this.blockJoypad(true);
                        _oJoypad.resetJoy();
                    }
                    _oCharacter.changeState("death");
                    _iScore = _iAccScore;
                    _oInterface.refreshScore(_iScore);
                    _bDead = true;
                    
                    playSound("dead",1,false);
                }
            }
        }
        if (_iAccScore > _iScore) {
            _iScore += 5;
            _oInterface.refreshScore(_iScore);
        }
    };

    this.activeABallChached = function (iType, iID, iXpos, iYPos) {
        _aBallCached[iID].changeType(iType);
        _aBallCached[iID].changeDirection(1);
        _aBallCached[iID].setPosition(iXpos, iYPos);
        _aBallCached[iID].setActive(true);
        _aBall.push(_aBallCached[iID]);
    };

    this.restartLevelFromGameOver = function () {
        _iLife = CHARACTER_LIVES + 1;
        _iScore = 0;
        _iAccScore = 0;
        _oInterface.refreshScore(_iScore);
        $(s_oMain).trigger("restart_level", _iLevel);
        this.restartLevel();
    };

    this.restartLevel = function () {
        if (_iLife > 0) {
            s_oGame.addLife(-1);
            var iCnt = 0;
            for (var i = 0; i < _aBall.length; i++) {
                _aBall[i].unload();
                iCnt++;
            }
            _aBall.splice(0, iCnt);

            iCnt = 0;
            for (var i = 0; i < _aRope.length; i++) {
                _aRope[i].unload();
                iCnt++;
            }
            _aRope.splice(0, iCnt);

            iCnt = 0;
            for (var i = 0; i < _aBallCached.length; i++) {
                _aBallCached[i].unload();
                iCnt++;
            }
            _aBallCached.splice(0, iCnt);

            createjs.Tween.removeAllTweens();

            _oInterface.showLevelNum(_iLevel);

            _oCharacter.changeState("idle");
            _oCharacter.setPosition(_iCanvasWidthDiv, null);

            _iCombo = 0;

            _iDir = 0;
            this.resetTime();

            this.createLevel();
        } else {
            _iScore = _iAccScore;
            _oInterface.refreshScore(_iScore);
            _oInterface.gameOver(_iScore);
        }
    };

    this.resetTime = function () {
        _iTime = TIME_LEVEL[_iLevel];
        _oInterface.refreshTime(_iTime);
    };

    this.addLife = function (iValue) {
        var oLifeContainer = new createjs.Container();
        
        oLifeContainer.scaleX = 0;
        oLifeContainer.scaleY = 0;
        oLifeContainer.x = CANVAS_WIDTH / 2;
        oLifeContainer.y = CANVAS_HEIGHT / 2;
        s_oStage.addChild(oLifeContainer);
        
        var oLifeText  = new CTLText(oLifeContainer, 
                    -120, -100, 240, 120, 
                    60, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_EXTRA_LIFE,
                    true, true, true,
                    false );


        var oLifeTextCont = new CTLText(oLifeContainer, 
                    -120, -100, 240, 120, 
                    60, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_EXTRA_LIFE,
                    true, true, true,
                    false );
                    
        oLifeTextCont.setOutline(1);
        
        if (iValue !== null) {
            _iLife += iValue;
            _oInterface.refreshLife(_iLife);
        }
        else
        {
            oLifeText.refreshText(TEXT_ADDED + " " + EXTRA_POINT + " " + TEXT_SCORE);
            oLifeTextCont.refreshText(TEXT_ADDED + " " + EXTRA_POINT + " " + TEXT_SCORE);
        }
        

        createjs.Tween.get(oLifeContainer).to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.elasticOut).call(function () {
            createjs.Tween.get(oLifeContainer).wait(300).to({scaleX: 0, scaleY: 0}, 1000, createjs.Ease.elasticIn).call(function () {
                s_oStage.removeChild(oLifeContainer);
            });
        });
    };

    this.canInput = function (bVal) {
        _bInput = bVal;
    };

    this.ballFinished = function () {
        if (_aBall.length === 0) {
            this.setPause(true);
            this.canInput(false);
            _bPressedKeys = false;
            _iDir = 0;
            if (s_bMobile === true) {
                _oJoypad.unload();
                this.blockJoypad(true);
                _oJoypad.resetJoy();
                _oJoypad = null;
            }
            _oDoor.openDoorAndRemain();
            var oSpriteRays = s_oSpriteLibrary.getSprite("rays");
            var oData = {
                images: [oSpriteRays],
                // width, height & registration point of each sprite
                frames: {width: oSpriteRays.width / 3, height: oSpriteRays.height, regX: (oSpriteRays.width / 2) / 3, regY: oSpriteRays.height / 2},
                animations: {cast: [0, 2, "cast", 0.4]}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oRays = createSprite(oSpriteSheet, "cast", (oSpriteRays.width / 2) / 2, oSpriteRays.height / 2, oSpriteRays.width / 3, oSpriteRays.height);
            _oRays.x = CANVAS_WIDTH / 2;
            _oRays.y = CANVAS_HEIGHT / 2 + 53;

            s_oStage.addChild(_oRays);
            s_oStage.setChildIndex(_oRays, 2);
            _oDoor.childIndex(4);

            _iLevelAds++;
            if (_iLevelAds === NUM_LEVELS_FOR_ADS) {
                _iLevelAds = 0;
                $(s_oMain).trigger("show_interlevel_ad");
            }

            if (_iLevel + 1 < BALLS_LEVEL.length) {
                this.createButNextLevel();
                _oInterface.animContrast(0.0);
            }
            else {
                _iScore = _iAccScore;
                _oInterface.finishGame(_iScore);
            }
            $(s_oMain).trigger("end_level", _iLevel);
            _oCharacter.changeState("idle");
            _iScore = _iAccScore;
            _oInterface.refreshScore(_iScore);
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                var oGameCompleted;
                oGameCompleted = playSound("game_completed",1,false);
                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                oGameCompleted.on("end", function () {
                    setVolume("soundtrack",1);
                    oGameCompleted = null;
                });
            }
        }
    };

    this.createButNextLevel = function () {

        var oSpiriteNextLevel = s_oSpriteLibrary.getSprite("next_level");
        var oData = {images: [oSpiriteNextLevel],
            // width, height & registration point of each sprite
            frames: {width: oSpiriteNextLevel.width / 2, height: oSpiriteNextLevel.height, regX: (oSpiriteNextLevel.width / 2) / 2, regY: oSpiriteNextLevel.height},
            animations: {blink: [0, 1, "blink", 0.3]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oNextLevel = createSprite(oSpriteSheet, "blink", (oSpiriteNextLevel.width / 2) / 2, oSpiriteNextLevel.height, oSpiriteNextLevel.width / 2, oSpiriteNextLevel.height);

        _oNextLevel.x = CANVAS_WIDTH / 2;
        _oNextLevel.y = CANVAS_HEIGHT / 2 + 115;
        _oNextLevel.cursor = "pointer";
        _oNextLevel.on("mousedown", this.nextLevel);

        s_oStage.addChild(_oNextLevel);
        s_oStage.setChildIndex(_oNextLevel, s_oStage.numChildren - 1);
    };

    this.nextLevel = function () {
        s_oGame.resetLevel();
        _iLevel++;
        _oInterface.refreshLevel(_iLevel);
        s_oGame.resetTime(TIME_LEVEL[_iLevel]);
        if (s_bMobile === true) {
            s_oGame.createJoypad();
            s_oGame.blockJoypad(true);
        }
        _oCharacter.setPosition(_iCanvasWidthDiv, null);
        s_oGame.createLevel();
        s_oGame.createLevelPlatform();
        _oInterface.showLevelNum(_iLevel);
        $(s_oMain).trigger("start_level", _iLevel);
    };

    this.setPause = function (bVal) {
        _bPause = bVal;
    };

    this.addScore = function (iAdded) {
        _iAccScore += iAdded;
        this.extraLife(iAdded);
    };

    this.extraLife = function (iAdded) {
        if (_iScoreExtraLife < EXTRA_LIFE) {
            _iScoreExtraLife += iAdded;
        }
        else
        {
            _iScoreExtraLife = 0;
            if (_iLife < 9) {
                this.addLife(1);
            }
            else
            {
                this.addLife(null);
                this.addScore(EXTRA_POINT);
            }
        }
    };

    this.unloadBall = function (ID) {
        _aBall[ID].unload();
        _aBall.splice(ID, 1);
        for (var i = 0; i < _aBall.length; i++) {
            _aBall[i].resetTheIndex(i);
        }
        var iCnt = 0;
        for (var i = 0; i < _aBallCached.length; i++) {
            if (_aBallCached === undefined) {
                iCnt = i;
                break;
            }
        }
        _aBallCached.splice(iCnt, 1);
    };

    this.unloadRope = function (ID) {
        _aRope[ID].unload();
        _aRope.splice(ID, 1);
        for (var i = 0; i < _aRope.length; i++) {
            _aRope[i].resetTheIndex(i);
        }
    };

    this.resetLevel = function () {
        s_oStage.removeChild(_oRays, _oNextLevel);
        _oRays = null;
        _oNextLevel = null;

        for (var i = 0; i < _aRope.length; i++) {
            _aRope[i].unload();
        }
        var iCnt = 0;
        for (var i = 0; i < _aPlatform.length; i++) {
            s_oStage.removeChild(_aPlatform[i]);
            iCnt++;
        }

        _aPlatform.splice(0, iCnt);

        iCnt = 0;
        for (var i = 0; i < _aBallCached.length; i++) {
            _aBallCached[i].unload();
            iCnt++;
        }
        _aBallCached.splice(0, iCnt);

        _oDoor.changeState("open", false);
    };

    this.shootMobile = function () {
        if (_aRope.length < MAX_ROPE) {
            _iDir = 0;
            _oCharacter.changeState("shoot");
            s_oGame.createARope(_aRope.length);
            _bPressedKeys = false;
        }
    };

    this.checkController = function (iDirection) {

        if (iDirection === null) {
            if (_iDir !== 0) {
                _iDir = 0; //space
                _oCharacter.changeState("idle");
                _bPressedKeys = false;
            }
        } else {
            if (iDirection >= -_iSegmentOffset && iDirection < _iSegmentOffset) {
                //RIGHT;
                if (_iDir !== 1) {
                    _iDir = 1; //left
                    _oCharacter.changeState("run");
                    _oCharacter.rotate(1);
                    _bPressedKeys = true;
                }
                return;
            } else if (iDirection >= _iSegmentOffset * 7 || iDirection < -_iSegmentOffset * 7) {
                //LEFT;
                if (_iDir !== -1) {
                    _bPressedKeys = true;
                    _iDir = -1; //left
                    _oCharacter.changeState("run");
                    _oCharacter.rotate(-1);
                }
                return;
            } else if (iDirection >= -_iSegmentOffset * 7 && iDirection < -_iSegmentOffset * 5) {
                //LEFTUP;
                if (_iDir !== -1) {
                    _bPressedKeys = true;
                    _iDir = -1; //left
                    _oCharacter.changeState("run");
                    _oCharacter.rotate(-1);
                }
                return;
            } else if (iDirection >= -_iSegmentOffset * 3 && iDirection < -_iSegmentOffset) {
                //UPRIGHT;
                if (_iDir !== 1) {
                    _iDir = 1; //left
                    _oCharacter.changeState("run");
                    _oCharacter.rotate(1);
                    _bPressedKeys = true;
                }
                return;
            } else if (iDirection >= _iSegmentOffset && iDirection < _iSegmentOffset * 3) {
                //DOWNRIGHT;
                if (_iDir !== 1) {
                    _iDir = 1; //left
                    _oCharacter.changeState("run");
                    _oCharacter.rotate(1);
                    _bPressedKeys = true;
                }
                return;
            } else if (iDirection >= _iSegmentOffset * 5 && iDirection < _iSegmentOffset * 7) {
                //DOWNLEFT;
                if (_iDir !== -1) {
                    _bPressedKeys = true;
                    _iDir = -1; //left
                    _oCharacter.changeState("run");
                    _oCharacter.rotate(-1);
                }
                return;
            }
        }
    };

    this.update = function () {
        if (_bPause === false) {
            if (_oJoypad) {
                this.checkController(_oJoypad.update());
            }
            _fPhysicsTime += s_iTimeElaps;
            var iTimePhysicUpdate = parseInt(_fPhysicsTime / _iPhysicsUpdateTime);
            _fPhysicsTime -= (_iPhysicsUpdateTime * iTimePhysicUpdate);
            for (var i = 0; i < iTimePhysicUpdate; i++) {
                for (var k = 0; k < _iPhysicsScaleTime; k++) {
                    this.__updatePhysics();
                }
            }
            if (_iTime > 1) {
                _iTime -= 1 / createjs.Ticker.framerate;
                _oInterface.refreshTime(Math.floor(_iTime));
                if (_iTime > 10) {
                    _oInterface.colorTime("#fff");
                } else {
                    _oInterface.colorTime("#f00");
                }
            } else {
                this.setPause(true);
                _oInterface.showTimeIsUp();
                this.canInput(false);
                _oCharacter.changeState("idle");
            }
        }
        if (_bDead === true) {
            _iTimeRestart -= 1 / createjs.Ticker.framerate;
            if (_iTimeRestart <= 0) {
                s_oGame.restartLevel();
                _iTimeRestart = TIME_RESTART;
                _bDead = false;
            }
        }
    };

    s_oGame = this;
    var _iPhysicsUpdateTime = 16;
    var _iPhysicsScaleTime = 10;
    BALL_SPEED = oData.ball_speed / _iPhysicsScaleTime;
    BALL_DOWN_ACCELLERATION = oData.ball_down_accelleration / _iPhysicsScaleTime;
    BALL_SCORE = oData.ball_score;
    CHARACTER_SPEED = oData.character_speed / _iPhysicsScaleTime;
    ROPE_SPEED = oData.speed_rope / _iPhysicsScaleTime;
    TIME_ROPE = oData.time_rope;
    TIME_LEVEL = oData.time_level;
    COMBO_SCORE = oData.combo_score;
    CHARACTER_LIVES = oData.character_lives;
    EXTRA_LIFE = oData.extra_life_at_point;
    EXTRA_POINT = oData.extra_point;
    NUM_LEVELS_FOR_ADS = oData.num_levels_for_ads;
    this._init();
}

var s_oGame;
