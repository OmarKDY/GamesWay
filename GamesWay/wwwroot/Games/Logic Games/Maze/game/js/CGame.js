function CGame(oData, iMode) {
    var _bStartGame;
    var _oMaze;
    var _bDisableEvents;
    var _bWin;
    var _iScore;
    var _oInterface;
    var _oEndPanel;
    var _bTouchActive;
    var _oHelpPanel;  
    var _oPlayer;
    var _iMode = iMode;
    var _iTimer;
    var _oStroke;
    var _oContainerStroke;
    var _oDragStroke;
    var _oJoypad = null;
    var _iSegmentOffset;
    var _bTimesUp = true;       // used to run the "timesUp" function only once
    var _oHurryUpBack;
    var _oHurryUp;
    
    var _iOldX;
    var _iOldY;

    this._init = function(){
        _oEndPanel = null;
        _bDisableEvents = false;
        _bWin = false;
        _iScore = 0;
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        _iSegmentOffset = Math.PI / 8;
        _bTouchActive = false;
        _iTimer = TIME[_iMode];
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(oBg);
        _oDragStroke = new createjs.Shape();
        

        this._initStroke();
        this._initGrid();
        this._initPlayer();
/*
        // Cache the lines to improve performances
        _oDragStroke.cache(
            s_oMaze._returnOffsetH(),                       // Maze starting X point
            s_oMaze._returnOffsetV(),                       // Maze starting X point
            CELL_WIDTH[_iMode] * (NUM_ROWS[_iMode] + 2),    // Maze width (with an excess for tollerability)
            CELL_WIDTH[_iMode] * (NUM_COLS[_iMode] + 2)     // Maze height (with an excess for tollerability)
        );
*/
        _oInterface = new CInterface(_iMode);
        _oHelpPanel = CHelpPanel();
        
        _oContainerStroke.addChild(_oDragStroke);
    };

    this._initGrid = function(){
        _oMaze = new CMaze(_iMode);  };

    this._initPlayer = function(){
        _oPlayer = new CPlayer( s_aCellList[0][0]._getCellX(), s_aCellList[0][0]._getCellY(), _iMode) ;  };

    this.designStroke = function(){
        var _iCurStroke = 12;           // width of the trace
        var _szCurColor = "#ffc500";    // color of the trace

        // Draw a line between the old and new coordinates, for graphic improvement
        
        _oDragStroke.graphics.setStrokeStyle(_iCurStroke, "round", "round");
        _oDragStroke.graphics.beginStroke(_szCurColor);

        
        //_oContainerStroke.addChild(_oDragStroke);
        _oDragStroke.graphics.moveTo( _oPlayer.x + 5*_oPlayer.regX, _oPlayer.y + 5*_oPlayer.regY );
    };

    this.drawTrace = function(destX, destY){
        
        //if(_iOldX){
            _oDragStroke.graphics.moveTo( _iOldX, _iOldY );
        //}
        

        _oDragStroke.graphics.lineTo( destX, destY );

        _iOldX = destX;
        _iOldY = destY;

        // Close the path
        _oDragStroke.graphics.closePath();

        // Store the line
        //_oDragStroke.updateCache();
        //_oDragStroke.store;
    };

    this.getDragStroke = function(){
        return _oDragStroke; };

    this._initStroke = function(){
        _oContainerStroke = new createjs.Container();
        s_oStage.addChild(_oContainerStroke);
        
        _oStroke = new createjs.Shape();
        _oContainerStroke.addChild(_oStroke);
    };

    this.unload = function(){
        stopSound("timer");
        _oInterface.unload();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        s_oGame = null;
    };

    this._checkWin = function(){
        if(_bWin){
            _iScore = Math.floor(_iTimer / 10) * (iMode+1);
         
            if(_iScore > s_aBestScore[_iMode]){
                s_aBestScore[_iMode] = _iScore;
                saveItem("maze_best_score",JSON.stringify(s_aBestScore));
                _oInterface.refreshBestScore();
            };
            
            _oInterface.showWin();
            $(s_oMain).trigger("share_event", _iScore);
            $(s_oMain).trigger("save_score", _iScore);
        };
    };

    this.onExit = function(){
        setVolume("soundtrack", 1);

        s_oGame.unload();
        s_oMain.gotoMenu();

        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };

    this.restart = function(){
        this.unload();
        s_oMain.gotoGame(_iMode);
        $(s_oMain).trigger("restart_level",1);
        
        s_oStage.update();
        
        _bDisableEvents = false;
        _bWin = false;
        _iScore = 0;
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
    };

    this._onExitHelp = function(){
        if(!s_bMobile) {
            document.onkeydown = onKeyDown; 
            document.onkeyup   = onKeyUp; 
        } else {
            var oJoypadSprite = s_oSpriteLibrary.getSprite('joypad');
            _oJoypad = new CJoypad(oJoypadSprite, 100, 700, s_oStage, false);
        };
        
        _bStartGame = true;
    };

    this.checkForExit = function(){
        if (_bStartGame) {
            // at the end of the maze, the player wins
            if ( _oPlayer._getPlayerRow() === s_oMaze._returnStartingX() && _oPlayer._getPlayerColumn() === s_oMaze._returnStartingY() ) {
                if (_bWin === false) {
                    setTimeout(function() {               
                        _bWin = true;
                        stopSound("timer");
                        setVolume("soundtrack", 0);
                        playSound("game_win",1,false);
                        _bStartGame = false;
                        s_oGame._checkWin(); 
                    }, 5);    // How many milliseconds to wait before starting the "win" functions
                };
            };
        };
    };

    this.gameOver = function(){
        _bStartGame = false;
        var iScore = 0;
        
        if(_oEndPanel === null){
            playSound("game_over",1,false);
            
            _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
            _bDisableEvents = true;
            
            $(s_oMain).trigger("share_event", iScore);
            $(s_oMain).trigger("save_score", iScore);
        }
    }; 
    
    function onKeyUp(evt){ 
        if (_bStartGame) {
            evt.preventDefault();
            switch(evt.keyCode) {
                case 37: {  // left  
                        _oPlayer.resetAllDirection(); 
                        break; }
                case 38: {  // up  
                        _oPlayer.resetAllDirection(); 
                        break; }              
                case 39: {  // right  
                        _oPlayer.resetAllDirection(); 
                        break; }
                case 40: {  // down
                        _oPlayer.resetAllDirection(); 
                        break; }
            };
        };
    };

    function onKeyDown(evt){
        if (_bStartGame) {
            if(!evt){ 
                evt = window.event; 
            } 
                evt.preventDefault();
            switch(evt.keyCode) {    
                case 37: {      // left
                    _oPlayer.moveLeft();
                    break;
                };
                case 38: {      // up
                    _oPlayer.moveUp();
                    break;
                };      
                case 39: {      // right
                    _oPlayer.moveRight();
                    break;
                };
                case 40: {      // down
                    _oPlayer.moveDown();
                    break;
                }
            }
        };
    };

    this.checkController = function(iDirection){
        
        if(iDirection === null){
            _oPlayer.resetAllDirection();
        } else {
            if(iDirection >= -_iSegmentOffset && iDirection < _iSegmentOffset ){
                //RIGHT;
                _oPlayer.moveRight();

                _oPlayer.downStop();
                _oPlayer.upStop();
                _oPlayer.leftStop();
                return;
            } else if(iDirection >= _iSegmentOffset && iDirection < _iSegmentOffset*3){
                //DOWNRIGHT;
                _oPlayer.moveDown();
                _oPlayer.moveRight();

                _oPlayer.upStop();
                _oPlayer.leftStop();
                return;
            } else if(iDirection >= _iSegmentOffset*3 && iDirection < _iSegmentOffset*5){
                //DOWN;
                _oPlayer.moveDown();

                _oPlayer.upStop();
                _oPlayer.rightStop();
                _oPlayer.leftStop();
                return;
            } else if(iDirection >= _iSegmentOffset*5 && iDirection < _iSegmentOffset*7){
                //DOWNLEFT;
                _oPlayer.moveDown();
                _oPlayer.moveLeft();

                _oPlayer.upStop();
                _oPlayer.rightStop();
                return;
            } else if(iDirection >= _iSegmentOffset*7 || iDirection < -_iSegmentOffset*7){
                //LEFT;
                _oPlayer.moveLeft();

                _oPlayer.downStop();
                _oPlayer.rightStop();
                _oPlayer.upStop();
                return;
            } else if(iDirection >= -_iSegmentOffset*7 && iDirection < -_iSegmentOffset*5){
                //LEFTUP;
                _oPlayer.moveUp();
                _oPlayer.moveLeft();

                _oPlayer.downStop();
                _oPlayer.rightStop();
                return;
            } else if(iDirection >= -_iSegmentOffset*5 && iDirection < -_iSegmentOffset*3){
                //UP;
                _oPlayer.moveUp();

                _oPlayer.downStop();
                _oPlayer.rightStop();
                _oPlayer.leftStop();
                return;
            } else if(iDirection >= -_iSegmentOffset*3 && iDirection < -_iSegmentOffset){
                //UPRIGHT;
                _oPlayer.moveUp();
                _oPlayer.moveRight();

                _oPlayer.downStop();
                _oPlayer.leftStop();
                return;
            }
        }
    };

    this.updateTimer = function(){
        if (_iTimer > 0) {
            if(_bStartGame) {
                if (!this._bDisableEvents) {
                    _iTimer -= s_iTimeElaps;
                    _oInterface.refreshTimer( Math.floor(_iTimer / 1000) );
                };
            };
        };
    };

    this.timesUp = function(){
        // A "Hurry up" reminder when the time is almost over
        _oHurryUpBack = new createjs.Text("","70px "+PRIMARY_FONT, "#000000");
        _oHurryUpBack.textAlign = "center";
        _oHurryUpBack.lineWidth = 500;
        _oHurryUpBack.textBaseline = "middle";
        _oHurryUpBack.x = CANVAS_WIDTH / 2 + 2;
        _oHurryUpBack.y = CANVAS_HEIGHT / 2 - 2;
        _oHurryUpBack.text = TEXT_HURRYUP;
        s_oStage.addChild(_oHurryUpBack);

        _oHurryUp = new createjs.Text("","70px "+PRIMARY_FONT, "#ffffff");
        _oHurryUp.textAlign = "center";
        _oHurryUp.lineWidth = 500;
        _oHurryUp.textBaseline = "middle";
        _oHurryUp.x = CANVAS_WIDTH / 2;
        _oHurryUp.y = CANVAS_HEIGHT / 2;
        _oHurryUp.text = TEXT_HURRYUP;
        s_oStage.addChild(_oHurryUp);
    };

    this.getScore = function(){
        return _iScore; };

    this.update = function(){
        if(_oJoypad){
            this.checkController(_oJoypad.update());
        };

        if (_iTimer > 0) {
            this.updateTimer();
            
            if(_bStartGame) {
                if (_iTimer < 10000) {   // when the timer is under those milliseconds, a reminder will appear
                    if (_bTimesUp === true) {
                        playSound("timer",1,true);
                        this.timesUp();
                        _bTimesUp = false;
                    };
                };
            };
        } else {
            _iTimer = 0;
            _iScore = 0;
            stopSound("timer");
            this.gameOver();
        };
        
        // FadeOut effect on the "Hurry up!" writing
        if (_oHurryUpBack != undefined && _oHurryUp != undefined) {
            var iAlphaVar = 0.02;
            
            if (_oHurryUpBack.alpha > 0) {
                _oHurryUpBack.alpha -= iAlphaVar };

            if (_oHurryUp.alpha > 0) {
                _oHurryUp.alpha -= iAlphaVar };
        };
        
        _oPlayer.update();
        this.checkForExit();
    };

    s_oGame = this;

    this._init();
}

var s_oGame;