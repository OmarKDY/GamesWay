function CPlayer(iPlayerN, iScore) {
    var _iPlayerN;
    var _iScore;
    var _iOffsetX;
    var _iOffsetY;
    
    var _aPlayersTiles;
    
    var _oPlayer;
    var _oPlayerText;
    var _oPlayerScoreText;
    var _oPlayerLock;
    
    var _bLocked;
    var _bArrangingTiles;

    this._init = function () {
        _iScore = iScore;
        _iPlayerN = iPlayerN;
        _iOffsetX = TILE_WIDTH * 0.55;
        _iOffsetY = TILE_HEIGHT * 0.35;
        _aPlayersTiles = new Array();
        _bLocked = false;
        _bArrangingTiles = false;

        // CREATE THE CONTAINER FOR THE PLAYER
        _oPlayer = new createjs.Container;
        s_oStage.addChild(_oPlayer);

        // CREATE TEXTS FOR THE PLAYER AND FOR THE SCORE
        this._initPlayerText();
        this._initScoreText();
        
        // CREATE A "LOCKED" SYMBOL
        this._initLock();
    };

    this._initPlayerText = function() {
        _oPlayerText = new CTLText(s_oStage, 
                    PLAYER_TEXT_COORDINATES[_iPlayerN][0], PLAYER_TEXT_COORDINATES[_iPlayerN][1], 120, 20, 
                    20, "center", THIRD_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " " + (1+_iPlayerN),
                    true, true, true,
                    false );
                    

        _oPlayerText.setRotation(PLAYER_ROTATION[_iPlayerN]);

    };

    this._initScoreText = function() {
        _oPlayerScoreText = new CTLText(s_oStage, 
                    PLAYER_SCORE_COORDINATES[_iPlayerN][0], PLAYER_SCORE_COORDINATES[_iPlayerN][1], 120, 20, 
                    20, "center", THIRD_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    _iScore + " " + TEXT_PTS,
                    true, true, true,
                    false );
                    
       
        _oPlayerScoreText.setRotation(PLAYER_ROTATION[_iPlayerN]);
    };

    this._initLock = function() {
        _oPlayerLock = createBitmap(s_oSpriteLibrary.getSprite("lock"));
        
        _oPlayerLock.x = PLAYER_LOCK_POSITIONS[_iPlayerN][0];
        _oPlayerLock.y = PLAYER_LOCK_POSITIONS[_iPlayerN][1];
        
        _oPlayerLock.visible = false;
        s_oStage.addChild(_oPlayerLock);
    };

    this.getX = function() {
        return _oPlayer.x;
    };
    
    this.getY = function() {
        return _oPlayer.y;
    };

    this.setTurn = function(value) {
        var iAlphaMin = 0.2;
        
        if(value === true) {
            _oPlayerText.setAlpha(1);
            _oPlayerScoreText.setAlpha(1);
        }else {
            _oPlayerText.setAlpha(iAlphaMin);
            _oPlayerScoreText.setAlpha(iAlphaMin);
        };
    };

    this.updateScoreText = function(value) {
        _oPlayerScoreText.refreshText(value + " " + TEXT_PTS);
    };
    
    this.getTilesArray = function() {
        return _aPlayersTiles;
    };

    this.getContainer = function() {
        return _oPlayer;
    };
    
    this.setTileVisible = function(i, value) {
        _aPlayersTiles[i].setVisible(value);
        _aPlayersTiles[i].addHitArea();
    };
    
    this.removeTile = function(oTile) {
        var iTile = _aPlayersTiles.indexOf(oTile);
        
        if (iTile > -1) {
           _aPlayersTiles.splice(iTile, 1);
        };
    };
    
    this.setLocked = function(value) {
        _bLocked = value;
        _oPlayerLock.visible = value;
    };
    
    this.getLocked = function() {
        return _bLocked;
    };
    
    this.isArrangementActive = function(){
        return _bArrangingTiles;
    };
    
    this.addTile = function(oOldTile) {
        var aStartPoint = [170,600,270,0];
        var iOffsetX = 50;
        var iOffsetY = -60;
        var iValue = oOldTile.getValue();
        var oNewTile = new CTile(_oPlayer, iValue, _iPlayerN, 0, 0);
        
        _aPlayersTiles.push(oNewTile);
        _bArrangingTiles = true;

        // ARRANGE THE TILES FOR BETTER VIEW
        switch (_iPlayerN) {
            case 0:
                oNewTile.setX( aStartPoint[_iPlayerN] + iOffsetX + (_iOffsetX * _aPlayersTiles.length));
                break;
            case 1:
                oNewTile.setX( aStartPoint[_iPlayerN] - iOffsetX - (_iOffsetX * _aPlayersTiles.length));
                break;
            case 2:
                oNewTile.setY( aStartPoint[_iPlayerN] - iOffsetY - (_iOffsetY * _aPlayersTiles.length) );
                break;
            case 3:
                oNewTile.setY( aStartPoint[_iPlayerN] + iOffsetY + (_iOffsetY * _aPlayersTiles.length) );
                break;
        };
        
        this.arrangeTiles();
    };

    this.arrangeContainer = function(iDivisionVar) {
        // CHECK IF THE CONTAINER IS NOT EMPTY
        if (_aPlayersTiles.length > 0) {
            var bounds = _oPlayer.getBounds();
            
            switch (_iPlayerN) {
                case 0:
                    _oPlayer.y = PLAYER_HANDS_COORDS[_iPlayerN][1] - (bounds.height/iDivisionVar);
                    break;
                case 1:
                    _oPlayer.y = PLAYER_HANDS_COORDS[_iPlayerN][1] - (bounds.height/iDivisionVar);
                    break;
                case 2:
                    _oPlayer.x = PLAYER_HANDS_COORDS[_iPlayerN][0];
                    _oPlayer.y = PLAYER_HANDS_COORDS[_iPlayerN][1] - (bounds.width/iDivisionVar);
                    break;
                case 3:
                    _oPlayer.x = PLAYER_HANDS_COORDS[_iPlayerN][0];
                    _oPlayer.y = PLAYER_HANDS_COORDS[_iPlayerN][1] - (bounds.width/iDivisionVar);
                    break;
            };
        } else {
            return;
        };
        
        _bArrangingTiles = false;
    };

    this.arrangeTiles = function() {
        _bArrangingTiles = true;
        var aOffsets = [260,500,285,-12];
        
        for (var i = 0; i < _aPlayersTiles.length; i++) {
            switch (_iPlayerN) {
                case 0:
                    _aPlayersTiles[i].setX(aOffsets[_iPlayerN] + (_iOffsetX*i));
                    break;
                case 1:
                    _aPlayersTiles[i].setX(aOffsets[_iPlayerN] - (_iOffsetX*i));
                    break;
                case 2:
                    _aPlayersTiles[i].setY(aOffsets[_iPlayerN] - (_iOffsetY*i));
                    break;
                case 3:
                    _aPlayersTiles[i].setY(aOffsets[_iPlayerN] + (_iOffsetY*i));
                    break;
            };
        };
        
        var iContainerParam = 2.5;
        this.arrangeContainer(iContainerParam);
    };

    s_oPlayer = this;
    
    this._init();
}

var s_oPlayer;