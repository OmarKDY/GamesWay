function CGame(oData) {

    var _oInterface;
    var _oBg;

    var _oScene;
    var _oBall;
    var _oStartBall;
    var _oGoalKeeper = null;
    var _oContainerGame;
    var _oClickPoint;
    var _oReleasePoint;
    var _oHitArea;
    var _oPlayer;
    var _oFieldCollision = null;
    var _oHandSwipeAnim;
    
    var _bGoal = false;
    var _bLaunched = false;
    var _bBallOut = false;
    var _bFieldCollide = false;
    var _bAnimPlayer = false;
    var _bAnimGoalKeeper = false;
    var _bSaved = false;
    var _bMakeGoal = false;
    var _bPoleCollide = false;
    var _iLevel = 1;
    var _iScore;
    var _iArea;
    var _iLaunch = 0;
    var _iCombo = 0;
    var _iTimePressDown = 0;
    var _iCurAnim;
    var _fTimeReset;
    var _fTimePoleReset;
    var _fTimeSwipe;
    var _fMultiplier;
    var _aObjects;
    var _vHitDir;

    var _iGameState = STATE_INIT;
    var _oCamera = null;

    this._init = function () {
        $(s_oMain).trigger("start_session");
        this.pause(true);
        $(s_oMain).trigger("start_level", _iLevel);
        _iScore = 0;

        _fMultiplier = 1;

        _aObjects = new Array();

        _oContainerGame = new createjs.Container();
        s_oStage.addChild(_oContainerGame);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        _oContainerGame.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite("logo_field");
        var oLogo = createBitmap(oSprite);
        oLogo.regX = oSprite.width/2;
        oLogo.regY = oSprite.height/2;
        oLogo.x = CANVAS_WIDTH_HALF;
        oLogo.y = CANVAS_HEIGHT_HALF + 100;
        _oContainerGame.addChild(oLogo);

        _oScene = new CScenario(_iLevel);

        if (SHOW_3D_RENDER) {
            _oCamera = camera;
        } else {
            _oCamera = createOrthoGraphicCamera();
        }

        _oGoalKeeper = new CGoalKeeper(CANVAS_WIDTH_HALF - 100, CANVAS_HEIGHT_HALF - 225, _oContainerGame);
        _aObjects.push(_oGoalKeeper);

        var oSpriteBall = s_oSpriteLibrary.getSprite("disc");
        _oBall = new CBall(0, 0, oSpriteBall, _oScene.ballBody(), _oContainerGame);
        _aObjects.push(_oBall);

        this.ballPosition();

        _oBall.setVisible(false);

        _fTimeSwipe = MS_TIME_SWIPE_START;

        _oStartBall = new CStartBall(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 142, _oContainerGame);

        _oPlayer = new CPlayer(0, 0, _oContainerGame);
        _oPlayer.setVisible(false);

        var szImage = "cursor";
        if (s_bMobile) {
            szImage = "hand_touch";
			TIME_SWIPE = 650;
        }else{
			TIME_SWIPE = 500;
		}
		
        _oHandSwipeAnim = new CHandSwipeAnim(START_HAND_SWIPE_POS, END_HAND_SWIPE_POS, s_oSpriteLibrary.getSprite(szImage), s_oStage);
        _oHandSwipeAnim.animAllSwipe();

        resizeCanvas3D();

        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);

        _oInterface = new CInterface();
        _oInterface.refreshTextScoreBoard(0, 0, 0, false);
        _oInterface.refreshLaunchBoard(_iLaunch, NUM_OF_PENALTY);

        _vHitDir = new CANNON.Vec3(0, 0, 0);

        this.onExitHelp();
    };

    this.createControl = function () {
        if (!SHOW_3D_RENDER) {
            _oHitArea = new createjs.Shape();
            _oHitArea.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            _oContainerGame.addChild(_oHitArea);

            _oHitArea.on('mousedown', this.onMouseDown);
            _oHitArea.on('pressmove', this.onPressMove);
            _oHitArea.on('pressup', this.onPressUp);
        } else {
            window.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('mousemove', this.onPressMove);
            window.addEventListener('mouseup', this.onPressUp);
        }
    };

    this.sortDepth = function (oObj1, oObj2) {
        if (oObj1.getDepthPos() > oObj2.getDepthPos()) {
            if (_oContainerGame.getChildIndex(oObj1.getObject()) > _oContainerGame.getChildIndex(oObj2.getObject())) {
                _oContainerGame.swapChildren(oObj1.getObject(), oObj2.getObject());
            }
        } else if (oObj1.getDepthPos() < oObj2.getDepthPos()) {
            if (_oContainerGame.getChildIndex(oObj2.getObject()) > _oContainerGame.getChildIndex(oObj1.getObject())) {
                _oContainerGame.swapChildren(oObj2.getObject(), oObj1.getObject());
            }
        }
    };

    this.onExitHelp = function () {
        this.createControl();
        this.pause(false);
    };

    this.poleCollide = function () {
        _fTimePoleReset = TIME_POLE_COLLISION_RESET;
        _bPoleCollide = true;
        playSound("pole", 0.4, false);
    };

    this.fieldCollision = function () {
        if (_oFieldCollision === null && _bLaunched) {
            _oFieldCollision = playSound("drop_bounce_grass", 0.3, false);
            if(_oFieldCollision !== null){
                    _oFieldCollision.on('end', function(){
                        _oFieldCollision = null;
                    });
            }
        }
    };

    this.ballPosition = function () {
        var oBallBody = _oScene.ballBody();

        var oPos2DBall = this.convert3dPosTo2dScreen(oBallBody.position, _oCamera);

        var fScaleDistance = oPos2DBall.z * (BALL_SCALE_FACTOR - _oBall.getStartScale()) + _oBall.getStartScale();

        _oBall.setPosition(oPos2DBall.x, oPos2DBall.y);
        _oBall.scale(fScaleDistance);

        this.refreshShadowCast(_oBall, oBallBody, fScaleDistance);
    };

    this.onMouseDown = function (e) {
        if (_bLaunched) {
            return;
        }
        _fTimeSwipe = MS_TIME_SWIPE_START;
        _oHandSwipeAnim.removeTweens();
        _oHandSwipeAnim.setVisible(false);
        _oClickPoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
        _oReleasePoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
        _iTimePressDown = 0;

    };

    this.onPressMove = function () {
        _oReleasePoint = {x: s_oStage.mouseX, y: s_oStage.mouseY};
        _iTimePressDown += s_iTimeElaps;
    };

    this.onPressUp = function () {
        if (_bLaunched) {
            return;
            
        }else if( (_oClickPoint.y - _oReleasePoint.y <= MIN_SWIPE_PIXEL_LENGTH_ACTIVATION) || (_oReleasePoint.x === 0 && _oReleasePoint.y === 0) ){
            return;
        }
        _iTimePressDown += s_iTimeElaps;

        s_oGame.setHitDirection();

        _bAnimPlayer = true;
        _oPlayer.setVisible(true);
        _bMakeGoal = s_oGame.goalProbability();

    };

    this.setHitDirection = function(){
        var vHitDir2D = new CVector2(_oReleasePoint.x - _oClickPoint.x, _oReleasePoint.y - _oClickPoint.y);
        
        if(_oReleasePoint.x - _oClickPoint.x < 0){
            _oPlayer.setStartPos();
        } else {
            _oPlayer.setInversePos();
        }
        
        ////GET Z BY LENGTH
        var iZ = vHitDir2D.length();
        if(iZ < MINIMUM_PIXEL_LENGTH_FOR_Z_CALCULATION){
            iZ = 0;
        }
        vHitDir2D.normalize();
        ////GET X BY NORMALIZED VECTOR
        var iX = vHitDir2D.getX();

        var iX3d = iX*WIDTH3D_REFERENCE_FOR_X_CALCULATION/SWIPE_NORMALIZED_X_FOR_X_CALCULATION * STRENGTH_FOR_Y_CALCULATION;
        var iY3d = STRENGTH_FOR_Y_CALCULATION;
        var iZ3d = iZ*HEIGHT3D_REFERENCE_FOR_Z_CALCULATION/SWIPE_PIXEL_LENGTH_FOR_Z_CALCULATION * STRENGTH_FOR_Y_CALCULATION;

        _vHitDir.set(iX3d, iY3d, iZ3d);
    };

    this.getHitDirection = function(){
        return _vHitDir;
    };
    
    this.goalProbability = function () {
        var iGoalAreaWidth = WIDTH3D_REFERENCE_FOR_X_CALCULATION*2/NUM_AREA_GOAL.w;
        var iGoalAreaHeight = HEIGHT3D_REFERENCE_FOR_Z_CALCULATION/NUM_AREA_GOAL.h;
        
        ////////FIND GOAL AREA SECTOR
        var vNormHitDir = new CANNON.Vec3(_vHitDir.x, _vHitDir.y, _vHitDir.z);
        vNormHitDir.normalize();
        
        var aArea = new Array();
        for(var i=0; i<NUM_AREA_GOAL.h; i++){
            aArea[i] = new Array();
            for(var j=0; j<NUM_AREA_GOAL.w; j++){
                ///INVERTED Y COORDINATE
                aArea[i][j] = new createjs.Rectangle(-WIDTH3D_REFERENCE_FOR_X_CALCULATION+j*iGoalAreaWidth, -HEIGHT3D_REFERENCE_FOR_Z_CALCULATION+i*iGoalAreaHeight, iGoalAreaWidth, iGoalAreaHeight);
            }
        }

        _iArea = -1;
        for(var i=0; i<NUM_AREA_GOAL.h; i++){
            for(var j=0; j<NUM_AREA_GOAL.w; j++){
                ///INVERTED Y COORDINATE
                if(aArea[i][j].contains(vNormHitDir.x, -vNormHitDir.z)){
                    _iArea = parseInt(i*NUM_AREA_GOAL.w + j);
                }
            }
        }

        if (_iArea === -1) {
            return false;
        }

        var aProb = new Array();

        for (var i = 0; i < MAX_PERCENT_PROBABILITY; i++) {
            aProb.push(false);
        }

        for (var i = 0; i < AREAS_INFO[_iArea].probability; i++) {
            aProb[i] = true;
        }

        var iRandResult = Math.floor(Math.random() * aProb.length);
        return aProb[iRandResult];
        
    };
    
   
    this.refreshShadowCast = function (oObject, oBody, fScaleDistance) {
        var oFieldBody = _oScene.getFieldBody();

        if (oBody.position.z < oFieldBody.position.z) {
            oObject.scaleShadow(0);
            return;
        }

        var oPosShadow = {x: oBody.position.x, y: oBody.position.y, z: oFieldBody.position.z};

        var oPos2dShadow = this.convert3dPosTo2dScreen(oPosShadow, _oCamera);

        var fDistance = (oBody.position.z - BALL_RADIUS) * ((oFieldBody.position.z - SHADOWN_FACTOR) - oFieldBody.position.z) + oFieldBody.position.z;

        var fScaleHeight = fDistance * fScaleDistance;

        oObject.scaleShadow(fScaleHeight);

        if (fScaleHeight < 0) {
            return;
        }

        oObject.setAlphaByHeight(fDistance);

        oObject.setPositionShadow(oPos2dShadow.x, oPos2dShadow.y);
    };

    this.addScore = function (iScore, iScoreNoMult) {
        _iScore += iScore;
        _oInterface.refreshTextScoreBoard(_iScore, _fMultiplier.toFixed(1), iScoreNoMult, true);
    };

    this.getLevel = function () {
        return _iLevel;
    };

    this.unload = function () {
        s_oStage.removeAllChildren();
        _oInterface.unload();

        _oHitArea.removeAllEventListeners();

        _oScene.destroyWorld();
        _oScene = null;
    };

    this.resetValues = function () {
        _iScore = 0;
        _oInterface.refreshTextScoreBoard(0, 0, 0, false);
        _iLaunch = 0;
        _fMultiplier = 1;
        _oInterface.refreshLaunchBoard(_iLaunch, NUM_OF_PENALTY);
    };

    this.wallSoundCollision = function () {
        playSound("ball_collision", 1, false);
    };

    this.areaGoal = function () {
        if (!_bGoal && !_bSaved) {
            if (_bMakeGoal) {
                _bGoal = true;
                _fTimeReset = TIME_RESET_AFTER_GOAL;
                this.textGoal();
                this.calculateScore();
                playSound("goal", 1, false);
            } else {
                this.goalKeeperSave();
            }
        }
    };

    this.goalKeeperSave = function () {
        _bSaved = true;
        _fTimeReset = TIME_RESET_AFTER_SAVE;
        _oInterface.createAnimText(TEXT_SAVED, 80, false, TEXT_COLOR_1, TEXT_COLOR_STROKE);
        playSound("ball_saved", 1, false);
        this.rejectBall();
        _fMultiplier = 1;
        _iCombo = 0;
    };

    this.rejectBall = function () {
        var oBallBody = _oScene.ballBody();
        
        oBallBody.force.setZero();
        oBallBody.torque.setZero();
        oBallBody.angularVelocity.setZero();
        oBallBody.velocity.setZero();
        oBallBody.quaternion.set(0,0,0,1);
        oBallBody.inertia.setZero();
        
        _oScene.addImpulse(oBallBody, new CANNON.Vec3(0,BALL_SAVED_BACK_SPEED,0));
        
        if(_iCurAnim === RIGHT){
            _oBall.setVisible(false);
        }
        
    };

    this.calculateScore = function () {
        var iProbability = AREAS_INFO[_iArea].probability;
        var iSub = MAX_PERCENT_PROBABILITY - iProbability;
        var iScoreNoMult = (MAX_PERCENT_PROBABILITY - iSub);
        this.addScore(iScoreNoMult * _fMultiplier, iScoreNoMult);
        _fMultiplier += MULTIPLIER_STEP;
    };

    this.addImpulseToBall = function (oDir) {
        if (_bLaunched || _iGameState !== STATE_PLAY) {
            return;
        }
        var oBall = _oScene.ballBody();
        _oScene.addImpulse(oBall, oDir);

        _bLaunched = true;
        _oBall.setVisible(true);
        _oStartBall.setVisible(false);
        this.chooseDirectionGoalKeeper(oDir);
        playSound("shot", 1, false);
    };

    this.chooseDirectionGoalKeeper = function (oDirBall) {
        if(_iArea < 0){
            var iRandom = Math.round(Math.random()*(GK_SAVE_ANIMATIONS.length-1));
            _iCurAnim = GK_SAVE_ANIMATIONS[iRandom];
        } else{
            if(_bMakeGoal){
                var iRandom = Math.round(Math.random()*(GK_FAIL_ANIMATIONS[_iArea].length-1));
                _iCurAnim = GK_FAIL_ANIMATIONS[_iArea][iRandom];
            }else {
                _iCurAnim = GK_SAVE_ANIMATIONS[_iArea];
            }
        }
        _oGoalKeeper.runAnim(_iCurAnim);

        if((_iCurAnim === CENTER_DOWN || _iCurAnim === CENTER_UP) && _iArea === 12) {
            _oGoalKeeper.shift();
        }

        _bAnimGoalKeeper = true;
    };

    this.chooseWrongDirGK = function (aWrongAnim) {
        var iRandAnim = Math.floor(Math.random() * aWrongAnim.length);
        while (iRandAnim === AREA_GOALS_ANIM[_iArea]) {
            iRandAnim = Math.floor(Math.random() * aWrongAnim.length);
        }
        _oGoalKeeper.runAnim(aWrongAnim[iRandAnim]);
    };

    this.pause = function (bVal) {
        if (bVal) {
            _iGameState = STATE_PAUSE;
        } else {
            _iGameState = STATE_PLAY;
        }
        createjs.Ticker.paused = bVal;
    };

    this.onExit = function () {
        this.unload();

        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu();
    };

    this.restartLevel = function () {
        this.resetValues();
        this.resetScene();

        _iGameState = STATE_PLAY;
        this.startOpponentShot();
        $(s_oMain).trigger("restart_level", _iLevel);
    };

    this.resetBallPosition = function () {
        var oBallBody = _oScene.ballBody();

        oBallBody.force.setZero();
        oBallBody.torque.setZero();
        oBallBody.angularVelocity.setZero();
        oBallBody.velocity.setZero();
        oBallBody.quaternion.set(0,0,0,1);
        oBallBody.inertia.setZero();

        oBallBody.position.set(POSITION_BALL.x, POSITION_BALL.y, POSITION_BALL.z);

        _oBall.fadeAnimation(1, 500, 0);
        _oBall.setVisible(false);

        _oStartBall.setVisible(true);
        _oStartBall.setAlpha(0);
        _oStartBall.fadeAnim(1, 500, 0);
    };

    this.ballFadeForReset = function () {
        if (!_bSaved || !_bGoal || !_bBallOut) {
            return;
        }
        if (!_bFieldCollide) {
            _oBall.fadeAnimation(0, 300, 10);
            _bFieldCollide = true;
        }
    };

    this._updateInit = function () {
        _oScene.update();
        this._updateBall2DPosition();
        _iGameState = STATE_PLAY;
    };

    this.convert2dScreenPosTo3d = function (oPos2d) {
        var iWidth = (s_iCanvasResizeWidth);
        var iHeight = (s_iCanvasResizeHeight);

        var mouse3D = new THREE.Vector3((oPos2d.x / iWidth) * 2 - 1, //x
                -(oPos2d.y / iHeight) * 2 + 1, //y
                -1);                                            //z
        mouse3D.unproject(_oCamera);
        mouse3D.sub(_oCamera.position);
        mouse3D.normalize();

        var fFactor = 0;//object.y

        mouse3D.multiply(new THREE.Vector3(fFactor, 1, fFactor));

        return mouse3D;
    };

    this.convert3dPosTo2dScreen = function (pos, oCamera) {
        var v3 = new THREE.Vector3(pos.x, pos.y, pos.z);
        var vector = v3.project(oCamera);

        var widthHalf = Math.floor(s_iCanvasResizeWidth) * 0.5;
        var heightHalf = Math.floor(s_iCanvasResizeHeight) * 0.5;


        vector.x = ((vector.x * widthHalf) + widthHalf) * s_fInverseScaling;
        vector.y = (-(vector.y * heightHalf) + heightHalf) * s_fInverseScaling;

        return vector;
    };

    this.timeReset = function () {
        if (_fTimeReset > 0) {
            _fTimeReset -= s_iTimeElaps;
        } else {
            this.endTurn();
        }
    };

    this.restartGame = function () {
        this.resetValues();
        this.resetScene();
        _iGameState = STATE_PLAY;
        _bLaunched = false;
    };

    this.endTurn = function () {
        _iLaunch++;
        _oInterface.refreshLaunchBoard(_iLaunch, NUM_OF_PENALTY);
        if (_iLaunch < NUM_OF_PENALTY) {
            this.resetScene();
            _bLaunched = false;
            _fTimeSwipe = MS_TIME_SWIPE_START;
        } else {
            _iGameState = STATE_FINISH;

            if (_iScore > s_iBestScore) {
                s_iBestScore = Math.floor(_iScore);
                saveItem(LOCALSTORAGE_STRING[LOCAL_BEST_SCORE], Math.floor(_iScore));
            }
            _oInterface.createWinPanel(Math.floor(_iScore));
            $(s_oMain).trigger("end_level", _iLevel);
        }
    };

    this.textGoal = function () {
        if (_iCombo < TEXT_CONGRATULATION.length) {
            var bFlashEffect = false;
            if (_iCombo >= TEXT_CONGRATULATION.length - 1) {
                bFlashEffect = true;
            }
            _oInterface.createAnimText(TEXT_CONGRATULATION[_iCombo], TEXT_SIZE[_iCombo], bFlashEffect, TEXT_COLOR, TEXT_COLOR_STROKE);
            _iCombo++;
        } else {
            var bFlashEffect = false;
            var iRand = Math.floor(Math.random() * (TEXT_CONGRATULATION.length - 1)) + 1;
            if (iRand >= TEXT_CONGRATULATION.length - 1) {
                bFlashEffect = true;
            }
            _oInterface.createAnimText(TEXT_CONGRATULATION[iRand], TEXT_SIZE[iRand], bFlashEffect, TEXT_COLOR, TEXT_COLOR_STROKE);
        }
    };

    this.goalAnimation = function (fForce) {
        if (fForce > FORCE_BALL_DISPLAY_SHOCK[0].min && fForce < FORCE_BALL_DISPLAY_SHOCK[0].max) {
            this.displayShock(INTENSITY_DISPLAY_SHOCK[0].time, INTENSITY_DISPLAY_SHOCK[0].x, INTENSITY_DISPLAY_SHOCK[0].y);
        } else if (fForce > FORCE_BALL_DISPLAY_SHOCK[1].min && fForce < FORCE_BALL_DISPLAY_SHOCK[1].max) {
            this.displayShock(INTENSITY_DISPLAY_SHOCK[1].time, INTENSITY_DISPLAY_SHOCK[1].x, INTENSITY_DISPLAY_SHOCK[1].y);
        } else if (fForce > FORCE_BALL_DISPLAY_SHOCK[2].min && fForce < FORCE_BALL_DISPLAY_SHOCK[2].max) {
            this.displayShock(INTENSITY_DISPLAY_SHOCK[2].time, INTENSITY_DISPLAY_SHOCK[2].x, INTENSITY_DISPLAY_SHOCK[2].y);
        } else if (fForce > FORCE_BALL_DISPLAY_SHOCK[3].min) {
            this.displayShock(INTENSITY_DISPLAY_SHOCK[3].time, INTENSITY_DISPLAY_SHOCK[3].x, INTENSITY_DISPLAY_SHOCK[3].y);
        }
    };

    this.displayShock = function (iTime, iXIntensity, iYIntensity) {
        var xShifting = iXIntensity;
        var yShifting = iYIntensity;

        createjs.Tween.get(_oContainerGame).to({x: Math.round(Math.random() * xShifting), y: Math.round(Math.random() * yShifting)}, iTime).call(function () {
            createjs.Tween.get(_oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.8), y: -Math.round(Math.random() * yShifting * 0.8)}, iTime).call(function () {
                createjs.Tween.get(_oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.6), y: Math.round(Math.random() * yShifting * 0.6)}, iTime).call(function () {
                    createjs.Tween.get(_oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.4), y: -Math.round(Math.random() * yShifting * 0.4)}, iTime).call(function () {
                        createjs.Tween.get(_oContainerGame).to({x: Math.round(Math.random() * xShifting * 0.2), y: Math.round(Math.random() * yShifting * 0.2)}, iTime).call(function () {
                            createjs.Tween.get(_oContainerGame).to({y: 0, x: 0}, iTime).call(function () {
                            });
                        });
                    });
                });
            });
        });
    };

    this.resetScene = function () {
        _bGoal = false;
        _bBallOut = false;
        _bSaved = false;
        _bMakeGoal = false;
        _bPoleCollide = false;
        _bFieldCollide = false;
        _oGoalKeeper.setAlpha(0);
        _oGoalKeeper.fadeAnimation(1);
        _oGoalKeeper.runAnim(IDLE);
        this.resetBallPosition();
        this.sortDepth(_oBall, _oGoalKeeper);
    };

    this._onEnd = function () {
        this.onExit();
    };

    this.swapChildrenIndex = function () {
        for (var i = 0; i < _aObjects.length - 1; i++) {
            for (var j = i + 1; j < _aObjects.length; j++) {
                if (_aObjects[i].getObject().visible && _aObjects[j].getObject().visible)
                    this.sortDepth(_aObjects[i], _aObjects[j]);
            }
        }
    };

    this.ballOut = function () {
        if (!_bBallOut && !_bGoal && !_bSaved) {
            var oPos = _oBall.getPhysics().position;
            if (oPos.y > BALL_OUT_Y || oPos.x > BACK_WALL_GOAL_SIZE.width || oPos.x < -BACK_WALL_GOAL_SIZE.width) {
                _bBallOut = true;
                _fTimeReset = TIME_RESET_AFTER_BALL_OUT;
                _oInterface.createAnimText(TEXT_BALL_OUT, 90, false, TEXT_COLOR_1, TEXT_COLOR_STROKE);
                playSound("ball_saved", 1, false);
                _fMultiplier = 1;
                _iCombo = 0;
            }
        }
    };

    this.animPlayer = function () {
        if (!_bAnimPlayer) {
            _oPlayer.setVisible(false);
            return;
        }

        _bAnimPlayer = _oPlayer.animPlayer();

        if (_oPlayer.getFrame() === SHOOT_FRAME) {

            this.addImpulseToBall({x: _vHitDir.x, y: _vHitDir.y, z: _vHitDir.z});

            _iTimePressDown = 0;
            this.goalAnimation(_vHitDir.y);
            _oInterface.unloadHelpText();
        }
    };

    this.animGoalKeeper = function () {
        if (_bLaunched) {
            if (_bAnimGoalKeeper) {
                _bAnimGoalKeeper = _oGoalKeeper.update();
                if (!_bAnimGoalKeeper) {
                    _oGoalKeeper.viewFrame(_oGoalKeeper.getAnimArray(), _oGoalKeeper.getAnimArray().length - 1);
                    _oGoalKeeper.hideFrame(_oGoalKeeper.getAnimArray(), 0);
                    _oGoalKeeper.fadeAnimation(0);
                }
            }
        } else {
            _oGoalKeeper.update();
        }
    };

    this.resetPoleCollision = function () {
        if (_fTimePoleReset > 0) {
            _fTimePoleReset -= s_iTimeElaps;
        } else {
            if (!_bGoal || !_bSaved) {
                _oInterface.createAnimText(TEXT_BALL_OUT, 80, false, TEXT_COLOR_1, TEXT_COLOR_STROKE);
                _fMultiplier = 1;
                _iCombo = 0;
                playSound("ball_saved", 1, false);
                this.endTurn();
                _fTimePoleReset = TIME_POLE_COLLISION_RESET;
            }
        }
    };

    this.handSwipeAnim = function () {
        if (_oHandSwipeAnim.isAnimate() || _bLaunched) {
            return;
        }
        if (_fTimeSwipe > 0) {
            _fTimeSwipe -= s_iTimeElaps;
        } else {
            _oHandSwipeAnim.animAllSwipe();
            _oHandSwipeAnim.setVisible(true);
            _fTimeSwipe = MS_TIME_SWIPE_START;
        }
    };

    this.swapGoal = function () {
        if (_oBall.getPhysics().position.z > GOAL_SPRITE_SWAP_Z) {
            this.sortDepth(_oBall, _oGoalKeeper);
        }
    };

    this._updatePlay = function () {
        for (var i = 0; i < PHYSICS_ACCURACY; i++) {
            _oScene.update();
        }

        this.ballOut();

        if (_bGoal || _bBallOut || _bSaved) {
            this.timeReset();
        } else if (_bPoleCollide) {
            this.resetPoleCollision();
        }

        this.animGoalKeeper();

        this.animPlayer();

        this._updateBall2DPosition();

        this.handSwipeAnim();

        this.swapChildrenIndex();

        this.swapGoal();
    };

    this.update = function () {
        switch (_iGameState) {
            case STATE_INIT:
                this._updateInit();
                break;
            case STATE_PLAY:
                this._updatePlay();
                break;
            case STATE_FINISH:

                break;
            case STATE_PAUSE:

                break;
        }
    };

    this._updateBall2DPosition = function () {

        this.ballPosition();
        _oBall.rolls();


        _oCamera.updateProjectionMatrix();
        _oCamera.updateMatrixWorld();
    };

    s_oGame = this;

    AREAS_INFO = oData.area_goal;
    NUM_OF_PENALTY = oData.num_of_penalty;
    MULTIPLIER_STEP = oData.multiplier_step;
    NUM_LEVEL_FOR_ADS = oData.num_levels_for_ads;
    

    this._init();
}

var s_oGame;