function CGame(iDiff,iLevel){
    var _bUpdate;
    var _bGameEnd;

    var _oCurLevel;
    var _iDiff;
    var _iLevel;

    var _iTimeGame;
    var _iLives = NUM_LIVES;

    var _oGrid;
    var _oInterface;
    var _oGridContainer;
    
    var _oGameOverPanel;
    var _oVictoryPanel;

    var _oPinchController;
    var _oPanController;
    
    this._init = function(iDiff,iLevel){
        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME );

        _bGameEnd = false;
        _iTimeGame = 0;
        _iDiff = iDiff;
        _iLevel = iLevel;
        _oCurLevel = LEVELS[_iDiff][_iLevel];
        

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); 

        _oGridContainer = new createjs.Container();
        s_oStage.addChild(_oGridContainer);

        _oGrid = new CGrid(_oGridContainer, _oCurLevel);

        _oInterface = new CInterface(_iLevel+1);
        
        _oGameOverPanel = new CGameOver();
        _oVictoryPanel = new CVictory();

        if(s_bMobile && _oCurLevel.iRows >= 10){
            _oPinchController = new CPinchController();
            _oPinchController.addEventListener(ON_PINCH_MOVE, this._onPinchMove, this);

            _oPanController = new CPanController();
            _oPanController.addEventListener(ON_PAN_MOVE, this._onPanMove, this);
        }
        
        this.refreshButtonPos();

        _bUpdate = true;

        $(s_oMain).trigger("start_level",_iLevel+1);
    };

    this._onPinchMove = function(oInfo){
        _oGrid.pinchGrid(oInfo);
    };
    
    this._onPanMove = function(oPanVelocity, evt){  
        _oGrid.move(oPanVelocity);  
    };

    this.unload = function(){
        _oInterface.unload();
        _oGrid.unload();
        _oGameOverPanel.unload();
        _oVictoryPanel.unload();

        if(s_bMobile && _oCurLevel.iRows >= 10){
            _oPinchController.unload();
            _oPanController.unload();
        }
        
        s_oGame = null;
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren(); 
    };
    
    this.refreshButtonPos = function(){
        
        this.refreshGridScale();
        
        _oInterface.refreshButtonPos();
        
    };
    
    this.refreshGridScale = function(){ 
        if(s_bLandscape){
            var iGUIHeight = 350;

            var iMaxGridSizeHeight = (CANVAS_HEIGHT - (s_iOffsetY*2))  - iGUIHeight;
            
            CUR_GRID_SCALE = iMaxGridSizeHeight/(MAX_TABLE_HEIGHT + (_oCurLevel.iRows > 12?(_oCurLevel.iRows-12)*CELL_HEIGHT : (_oCurLevel.iRows < 6?-((_oCurLevel.iRows+4*CELL_HEIGHT)):0)));
        } else {
            var iGUIHeight = 400;
            
            var iMaxGridSizeHeight = (CANVAS_HEIGHT - (s_iOffsetY*2))  - iGUIHeight;
            var iMaxGridSizeWidth = (CANVAS_WIDTH - (s_iOffsetX*2));
            
            var iMinDim = Math.min(iMaxGridSizeHeight, iMaxGridSizeWidth);

            CUR_GRID_SCALE = iMinDim/(MAX_TABLE_HEIGHT + (_oCurLevel.iRows > 12?(_oCurLevel.iRows-12)*CELL_WIDTH : (_oCurLevel.iRows < 6?-((_oCurLevel.iRows+4)*CELL_WIDTH):0)));
        }
        
        if(CUR_GRID_SCALE <= 1){
            CUR_GRID_SCALE = parseFloat(CUR_GRID_SCALE.toFixed(2));
        }

        _oGrid.refreshGridScale();
    };
    
    this.restart = function(){
        _oGrid.reset();
        
        _iLives = NUM_LIVES;
        _oInterface.reset(_iLevel+1);
        _iTimeGame = 0;

        _bUpdate = true;

        if(_bGameEnd == false){
            $(s_oMain).trigger("end_level",_iLevel+1);
        }
        $(s_oMain).trigger("start_level",_iLevel+1);
        
        _bGameEnd = false;
    };

    this.restartNullify = function(){
        _oGrid.show();
        this.resumeUpdate();
    }

    this.gridCompleted = function(){
        if(_iLives == 0){
            this.gameOver();
        }else{
            this.victory();
        }
    }

    this.victory = function(){
        _bGameEnd = true;
        $(s_oMain).trigger("end_level",_iLevel+1);

        _bUpdate = false;

        _oGrid.hide(true);

        var iMaxTimeBase = (_oCurLevel.iRows*10*100+_iLevel*100);
        var iCurTime = (parseInt(_iTimeGame/100));
        var iScore = parseInt((iMaxTimeBase-iCurTime)*(_iLives/NUM_LIVES));
        if(iScore < 0){
            iScore = 0;
        }
        iScore = Math.round(iScore/5)*5;

        setLocalStorageLevel(_iDiff,_iLevel);
        setLocalStorageScore(iScore,_iDiff,_iLevel);

        s_iTotalScore = getScoreTillLevel(_oCurLevel.iRows,getSavedLevel(_oCurLevel.iRows));

        $(s_oMain).trigger("save_score",[s_iTotalScore,_iDiff]);

        _oVictoryPanel.show(iScore, (_iLevel+1 >= LEVELS[_iDiff].length?false:true),s_iTotalScore);
    };

    this.nextLevel = function(){
        _iLevel++;
        _oCurLevel = LEVELS[_iDiff][_iLevel];
        _oGrid.unload();
        _oGrid = new CGrid(_oGridContainer, _oCurLevel);
        this.refreshGridScale();

        _iLives = NUM_LIVES;
        _oInterface.reset(_iLevel+1);

        _iTimeGame = 0;
        
        _bUpdate = true;

        $(s_oMain).trigger("start_level",_iLevel+1);
    }
    
    this.gameOver = function(){
        _bGameEnd = true
        $(s_oMain).trigger("end_level",_iLevel+1);

        _bUpdate = false;
        _oGrid.hide();
        _oGameOverPanel.show();
    };

    this.onExit = function(){
        this.unload();
        
        $(s_oMain).trigger("end_level",_iLevel+1);
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        
        s_oMain.gotoMenu();
    };

    this.onExitNullify = function(){
        this.showGrid();
        this.resumeUpdate();
    };

    this.decreaseLives = function(){
        _iLives--;
        _oInterface.decreaseLives(_iLives);

        if(_iLives == 0){
            this.gameOver();
        }
    }
    
    this.showGrid = function(){
        _oGrid.show();
    }

    this.hideGrid = function(){
        _oGrid.hide();
    }

    this.stopUpdate = function(){
        _bUpdate = false;
    }

    this.resumeUpdate = function(){
        _bUpdate = true;
    }
    
    this.update = function(){
        if(_bUpdate){
            _iTimeGame += s_iTimeElaps;
        }
    };
    
    s_oGame = this;
    
    this._init(iDiff,iLevel);

}

var s_oGame = null;
var s_oHandEvaluator;