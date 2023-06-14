function CPlayer (iX, iY, iMode) {
    var _oSprite;
    var _bLeft  = false;
    var _bRight = false;
    var _bUp    = false;
    var _bDown  = false;
    var _iXMove;
    var _iYMove;
    var _iMode = iMode;
    var _bNoCollision = true;
    var _bDrag = false;
    var _oDragStroke;
    var _oSpriteArea;
    
    this._init = function(iX, iY) {
        _oDragStroke = s_oGame.getDragStroke;

        var sprite = ( s_oSpriteLibrary.getSprite('player') );
        _oSprite = createBitmap(sprite);
        _oSprite.name = 'player';
        var iSpriteSize = 25;
        _oSprite.regX = iSpriteSize/2;
        _oSprite.regY = iSpriteSize/2;
        _oSprite.x = iX;
        _oSprite.y = iY;
        s_oStage.addChild(_oSprite);

        // Create an invisible "touch area" for the player, bigger than itself
        _oSpriteArea = new createjs.Shape();
        _oSpriteArea.graphics.beginFill("rgba(255,255,0,0.01)");
        _oSpriteArea.graphics.drawCircle(0, 0, 50);
        _oSpriteArea.on("mousedown", this.startDrag);
        _oSpriteArea.on("pressmove", this.dragPlayer);
        _oSpriteArea.on("pressup", this.resetAllDirection);
        s_oStage.addChild(_oSpriteArea);

        if (!s_bMobile)
        _oSpriteArea.cursor = "pointer";

        _iXMove = 0;
        _iYMove = 0;
    };
    
    this.startDrag = function() {
        _bDrag = true; 
        s_oGame.designStroke();     // Start drawing a trace line and move it to the coordinates we have here
    };

    this.dragPlayer = function(evt) {
        if (_bDrag === true) {
            if (_bNoCollision === true) {
                var PlayerX = _oSprite.x;
                var PlayerY = _oSprite.y;
                var PlayerPrevX = _oSprite.x;
                var PlayerPrevY = _oSprite.y;

                // check if the movement is possible, to be sure there won't be any issues
                if ( s_oPlayer.isMovementPossible(evt, PlayerX, PlayerY) === true ) {
                    _oSprite.x = evt.stageX/s_iScaleFactor;
                    _oSprite.y = evt.stageY/s_iScaleFactor;
                    s_oGame.drawTrace ( _oSprite.x, _oSprite.y );

                } else {
                    _oSprite.x = PlayerPrevX;
                    _oSprite.y = PlayerPrevY;
                    s_oPlayer.resetAllDirection();
                    return;
                };
            } else {
                this.resetAllDirection();
                return;
            };
        };
    };
    
    this.isMovementPossible = function(evt, PlayerX, PlayerY) {
        var a = PlayerX - (evt.stageX/s_iScaleFactor);
        var b = PlayerY - (evt.stageY/s_iScaleFactor);
        var iDistance = Math.sqrt( a*a + b*b );

        if (iDistance < 7) {
            return (true);
        } else {
            return (false);
        };
    };

    this._getPlayerRow = function() {           // The row where the player is at the moment
        var iPlayerRow = Math.floor( ( _oSprite.x - s_oMaze._returnOffsetH() ) / CELL_WIDTH[_iMode]);

        if ( iPlayerRow < 0 ) {
            return 0;
        } else if ( iPlayerRow > NUM_ROWS[_iMode]-1 ) {
            return NUM_ROWS[_iMode]-1;
        } else { return iPlayerRow; };
    };

    this._getPlayerColumn = function() {        // The column where the player is at the moment
        var iPlayerCol = Math.floor( ( _oSprite.y - s_oMaze._returnOffsetV() ) / CELL_WIDTH[_iMode]);

        if ( iPlayerCol < 0 ) {
            return 0;
        } else if ( iPlayerCol > NUM_COLS[_iMode]-1 ) {
            return NUM_COLS[_iMode]-1;
        } else { return iPlayerCol; };
    };

    this._getPlayerX = function() {
        return _oSprite.x; };

    this._getPlayerY = function() {
        return _oSprite.y; };

    this.resetAllDirection = function() {
        _bDrag  = false;
        _bLeft  = false;
        _bRight = false;
        _bUp    = false;
        _bDown  = false;
    };

    this.startDragKeyboard = function() {
        if (_bDrag === false) {
            this.startDrag();
        } else { return; }
    };

    this.upStop = function() {
        _bUp=false; };

    this.downStop = function() {
        _bDown=false; };

    this.leftStop = function() {
        _bLeft=false; };

    this.rightStop = function() {
        _bRight=false; };

    this.moveLeft = function() {
        _bRight=false;
        _bLeft=true;
        _bUp=false;
        _bDown=false;
        this.startDragKeyboard(); };

    this.moveRight = function() {
        _bLeft=false;
        _bRight=true;
        _bUp=false;
        _bDown=false;
        this.startDragKeyboard(); };

    this.moveUp = function() {
        _bDown=false;
        _bUp=true;
        _bLeft=false;
        _bRight=false;
        this.startDragKeyboard(); };

    this.moveDown = function() {
        _bUp=false;
        _bDown=true;
        _bLeft=false;
        _bRight=false;
        this.startDragKeyboard(); };

    this.checkObstacles = function() {    
        var iPlayerRow = this._getPlayerRow();     // The row of the player, in the coordinates array
        var iPlayerCol = this._getPlayerColumn();  // The column of the player, in the coordinates array

        // Each of these variables will return true if there is a wall in that position
        var bWallUp    = s_oMaze._returnWall(iPlayerRow, iPlayerCol, oWallUp);
        var bWallDown  = s_oMaze._returnWall(iPlayerRow, iPlayerCol, oWallDown);
        var bWallLeft  = s_oMaze._returnWall(iPlayerRow, iPlayerCol, oWallLeft);
        var bWallRight = s_oMaze._returnWall(iPlayerRow, iPlayerCol, oWallRight);

        // External borders are walls too!
               if (iPlayerCol === 0) {
            bWallUp = true;
        } else if (iPlayerRow === 0) {
            bWallLeft = true;
        } else if (iPlayerCol === NUM_COLS[_iMode] - 1) {
            bWallDown = true;
        } else if (iPlayerRow === NUM_ROWS[_iMode] - 1) {
            bWallRight = true;
        };

        // These will return the coordinates X & Y of the current cell
        var iCellX = s_oMaze._returnOffsetH() + (CELL_WIDTH[_iMode] * iPlayerRow);
        var iCellY = s_oMaze._returnOffsetV() + (CELL_WIDTH[_iMode] * iPlayerCol);

        // the distance between our player and the walls
        var iDistanceUp;
        var iDistanceDown;
        var iDistanceRight;
        var iDistanceLeft;

        this.checkDistance = function (object) {
            if ( bWallLeft ) { iDistanceLeft = distanceToLineSegment (
                iCellX, iCellY,                       // First point of the line coordinates
                iCellX, iCellY + CELL_WIDTH[_iMode],  // Second point of the line coordinates
                object.x, object.y );                 // Player's coordinates
            } else { iDistanceLeft = CELL_WIDTH[_iMode] };

            if ( bWallRight ) { iDistanceRight = distanceToLineSegment (
                iCellX + CELL_WIDTH[_iMode], iCellY, 
                iCellX + CELL_WIDTH[_iMode], iCellY + CELL_WIDTH[_iMode],
                object.x, object.y );
            } else { iDistanceRight = CELL_WIDTH[_iMode] };

            if ( bWallUp ) { iDistanceUp = distanceToLineSegment (
                iCellX, iCellY, 
                iCellX + CELL_WIDTH[_iMode], iCellY, 
                object.x, object.y );
            } else { iDistanceUp = CELL_WIDTH[_iMode] };

            if ( bWallDown ) { iDistanceDown = distanceToLineSegment (
                iCellX, iCellY + CELL_WIDTH[_iMode], 
                iCellX + CELL_WIDTH[_iMode], iCellY + CELL_WIDTH[_iMode], 
                object.x, object.y );
            } else { iDistanceDown = CELL_WIDTH[_iMode] };

            var iDistanceLimit = 15;
            var iBouncePx = 3;

            // check if the player is in collision in any walls
                if (iDistanceUp <= iDistanceLimit) {
                    _bNoCollision = false;
                    this.upStop();
                    _iYMove += iBouncePx;   // when stopped, the player will be bounced back from the wall
            } else if (iDistanceDown <= iDistanceLimit) {
                    _bNoCollision = false;
                    this.downStop();
                    _iYMove -= iBouncePx;
            } else if (iDistanceRight <= iDistanceLimit) {
                    _bNoCollision = false;  
                    this.rightStop();
                    _iXMove -= iBouncePx;
            } else if (iDistanceLeft <= iDistanceLimit) {
                    _bNoCollision = false;
                    this.leftStop();
                    _iXMove += iBouncePx;
            } else {
                _bNoCollision = true;
            };

            // If there is any collision, stop the player and play a sound, otherwise move the player
            if (_bNoCollision === true) {
                //trace(_iYMove)
                _oSprite.x += _iXMove;
                _oSprite.y += _iYMove;
                _iXMove *= PLAYER_FRICTION;
                _iYMove *= PLAYER_FRICTION;

                ////THIS PREVENT FALLING PLAYER BUG ON WINDOWS EDGE
                MAX_PLAYER_SPEED = 10;
                //////////////////////////////////////////////////

                if (_iXMove >  MAX_PLAYER_SPEED ) { 
                    _iXMove =  MAX_PLAYER_SPEED; 
                };
                if (_iXMove < -MAX_PLAYER_SPEED ) { 
                    _iXMove = -MAX_PLAYER_SPEED; 
                };

                if (_iYMove >  MAX_PLAYER_SPEED ) { 
                    _iYMove =  MAX_PLAYER_SPEED; 
                };
                if (_iYMove < -MAX_PLAYER_SPEED ) { 
                    _iYMove = -MAX_PLAYER_SPEED; 
                };

                var aSpeedLimit = [0.1, 0.5, 1];
                if ( Math.abs(_iXMove) < aSpeedLimit[_iMode] ) { 
                    _iXMove = 0; 
                };

                if ( Math.abs(_iYMove) < aSpeedLimit[_iMode] ) {
                    _iYMove = 0; 
                };
            } else {
                playSound("player_collision",1,false);
                s_oPlayer.resetAllDirection(); 
                _bDrag = false;
            };
        };
        
        this.checkDistance(_oSpriteArea);            // checks for collisions of the walls with the player
        if (_oDragStroke !== undefined) {
            this.checkDistance(_oDragStroke);        // checks for collisions of the walls with the lines
        };
    };

    this.update = function() { 
        
        
        // If the player's moving, draw the trace
        if ( _bLeft || _bRight || _bUp || _bDown ) {
            s_oGame.drawTrace ( _oSprite.x, _oSprite.y );
        };

        // Set player movements (keyboard only)
        if (_bLeft) {
            _iXMove -= PLAYER_ACCELERATION;            
        } else if (_bRight) {
            _iXMove += PLAYER_ACCELERATION;
        } else if (_bUp) {
            _iYMove -= PLAYER_ACCELERATION;     
        } else if (_bDown) {
            
            _iYMove += PLAYER_ACCELERATION;            
        };

        _oSpriteArea.x = _oSprite.x;
        _oSpriteArea.y = _oSprite.y;

        for (var i = 0; i < 2; i++) {
            this.checkObstacles();          // Check for obstacles
        };
    };

    s_oPlayer = this;
    
    this._init(iX, iY);
};

var s_oPlayer;