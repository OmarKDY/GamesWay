function CBoxAnimation(iPlayer, aPlayers) {
    var _aBoxTiles;
    var _aPlayers = aPlayers;
    
    var _oBoxContainer;
    var _oBoxCover;
    var _oBoxFrame;
    var _oBoxBottom;
    var _oBoxTile;
    var _oButSkip;
    var _oMask;
    
    var _iTileX;
    var _iTileY;
    var _iOffsetX;
    var _iPlayers = iPlayer;
    var _iTweenTileN;               // TILE NUMBER
    var _iTweenPlayerN;             // PLAYER NUMBER
    var _iTweenTileDestinationN;    // TILE POSITION NUMBER
    var _iTweenSpeed;
    var _iTweenBoxOpenSpeed;
    var _iTweenBoxCloseSpeed;
    var _iTweenExitBoxSpeed;
        
    this._init = function() {
        _aBoxTiles = new Array();
        
        _iTweenTileN = 0;
        _iTweenPlayerN = 0;
        _iTweenTileDestinationN = 0;
        _iTweenSpeed = 350;
        _iTweenBoxOpenSpeed = 1500;
        _iTweenBoxCloseSpeed = 1500;
        _iTweenExitBoxSpeed = 1000;

        _iOffsetX = TILE_WIDTH * 0.72;
        
        _oBoxContainer = new createjs.Container();
        s_oStage.addChild(_oBoxContainer);
        
        // CREATE A BOX FOR THE TILES
        _oBoxBottom = createBitmap(s_oSpriteLibrary.getSprite("box"));
        _oBoxBottom.x = CANVAS_WIDTH_HALF + 18;
        _oBoxBottom.y = CANVAS_HEIGHT_HALF + 60;
        _oBoxBottom.regX = 510/2;
        _oBoxBottom.regY = 221/2;
        
        _iTileX = _oBoxBottom.x - 192;
        _iTileY = _oBoxBottom.y - 45;
        
        // CREATE A COVER AND FRAME FOR THE BOX
        _oBoxCover = createBitmap(s_oSpriteLibrary.getSprite("cover"));
        _oBoxCover.x = _oBoxBottom.x - 18;
        _oBoxCover.y = _oBoxBottom.y - 47;
        _oBoxCover.regX = 461/2;
        _oBoxCover.regY = 122/2;
        
        _oBoxFrame = createBitmap(s_oSpriteLibrary.getSprite("frame"));
        _oBoxFrame.x = _oBoxCover.x;
        _oBoxFrame.y = _oBoxCover.y;
        _oBoxFrame.regX = 461/2;
        _oBoxFrame.regY = 136/2;
        
        _oBoxContainer.addChild(_oBoxBottom, _oBoxCover,_oBoxFrame);
        
        // ADD A "SKIP" BUTTON TO SKIP THE ANIMATION
        _oButSkip = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT - 450, s_oSpriteLibrary.getSprite('but_continue'), _oBoxContainer);
        _oButSkip.addEventListener(ON_MOUSE_UP, this._onSkip, this);
        
        var iZindex = _oBoxContainer.getChildIndex(_oBoxCover);
        var iOffsetTileX = 0;
        var iOffsetTileY = 0;
        
        // ADD THE TILES TO THE BOX
        for (var i = 0; i < TILES_NUMBER*2; i++) {
            var oData = {   
                images: [s_oSpriteLibrary.getSprite("tiles")], 
                framerate: 0,
                // width, height & registration point of each sprite
                frames: {width: TILE_WIDTH, height: TILE_HEIGHT, regX: TILE_WIDTH/2, regY: TILE_HEIGHT/2}
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oBoxTile = createSprite(oSpriteSheet, 0, TILE_WIDTH/2, TILE_HEIGHT/2, TILE_WIDTH, TILE_HEIGHT);
            _oBoxTile.gotoAndStop( TILE_BACK );
            // ADD THE TILE BELOW THE COVER
            _oBoxContainer.addChildAt(_oBoxTile, iZindex);
            _oBoxTile.x = _iTileX + iOffsetTileX;
            _oBoxTile.y = _iTileY + iOffsetTileY;
             _oBoxTile.scaleY = 0.9;
            _aBoxTiles.push(_oBoxTile);
            _iTileX += _iOffsetX;
            
            if (_iTileX > _oBoxBottom.x + 195) {
                _iTileX = _oBoxBottom.x - 195;
                iOffsetTileX -= 3;
                iOffsetTileY += 0.2;
            };
        };

        // CREATE A MASK
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("#ff0000").drawRect(115, 300, 540, 900);
        _oMask.alpha = 0.0001;
        _oBoxContainer.addChild(_oMask);
        _oBoxContainer.mask = _oMask;
    };
    
    this._onSkip = function() {
        if (_oButSkip.alpha < 1) {
            return;
        };
        
        s_oBox.removeSkipButton();
        
        _iTweenBoxOpenSpeed = 100;
        _iTweenBoxCloseSpeed = 100;
        _iTweenSpeed = 100;
        _iTweenExitBoxSpeed = 200;
    };
    
    this.openTileBox = function() {
        new createjs.Tween.get(_oBoxCover)
            .wait(500)
            .to({x: CANVAS_WIDTH*1.3}, _iTweenBoxOpenSpeed, createjs.Ease.quadInOut)
            .call( this.boxTilesDistribution );
        playSound("box_open",1,0);
    };
    
    this.boxTilesDistribution = function() {
        _oMask.scaleX = 1.7;
        _oMask.regX = 70 * 1.7;

        var oStartTile = _aBoxTiles[_iTweenTileN];
        var oPlayer = _aPlayers[_iTweenPlayerN];        
        var aDestArray = oPlayer.getTilesArray();
        var oDestTile = aDestArray[_iTweenTileDestinationN];
        var iX = oPlayer.getX() + oDestTile.getX();
        var iY = oPlayer.getY() + oDestTile.getY();
        
        var iZindex = _oBoxContainer.getChildIndex(_oBoxFrame);
        _oBoxContainer.setChildIndex(oStartTile, iZindex+1);
        
        // MOVE THE TILE
        new createjs.Tween.get( oStartTile )
            .to( {scaleX: 0.7, scaleY: 0.7}, 200, createjs.Ease.linear);
    
        new createjs.Tween.get( oStartTile )
            .to( {rotation: PLAYER_ROTATION[_iTweenPlayerN]}, 500, createjs.Ease.quadOut)

        new createjs.Tween.get( oStartTile )
            .to( {x: iX, y: iY}, _iTweenSpeed, createjs.Ease.quadOut)
            .call( function(){
                s_oBox.boxTilesArrived(oDestTile);
            });
    };
    
    this.boxTilesArrived = function(oDestTile){
        playSound("tile",0.2,0);
        s_oBox.setTileInvisible(_iTweenTileN);
        
        // IF IT'S A TILE OF THE HUMAN PLAYER, TURN THE TILE VISIBLE
        if (_iTweenPlayerN === 0) {
            oDestTile.turnTile();
        };
        
        _aPlayers[_iTweenPlayerN].setTileVisible(_iTweenTileDestinationN, true);
        oDestTile.visible = true;
        s_oBox.distributionOver();
    };
    
    this.distributionOver = function() {
        _oMask.scaleX = 1;
        _oMask.regX = 0;
        
        _iTweenPlayerN++;       // CHANGE PLAYER
        _iTweenTileN++;         // CHANGE TILE
        
        if (_iTweenPlayerN >= _iPlayers) {
            _iTweenPlayerN = 0;
            _iTweenTileDestinationN++;
        };

        if (_iTweenTileN < INITIAL_TILES*_iPlayers ) {
            s_oBox.boxTilesDistribution();
        } else {
            // IF THE TILES ARE ALL DISTRIBUTED, CLOSE THE BOX
            s_oBox.closeTileBox();
        };
    };
    
    this.closeTileBox = function() {
        new createjs.Tween.get(_oBoxCover)
            .to({x: _oBoxBottom.x - 16 }, _iTweenBoxCloseSpeed, createjs.Ease.quadInOut)
            .call( this.removeTilesBox );
        playSound("box_open",1,0);
    };
    
    this.removeSkipButton = function() {
        if (_oButSkip.alpha < 1) {
            return;
        };
        
        new createjs.Tween.get( _oButSkip.getSprite() )
            .to({alpha: 0}, 250, createjs.Ease.quadIn)
            .call(function(){
                if (_oButSkip === null) {
                    return;
                };

                _oButSkip.unload(); 
                _oButSkip = null;
            });
    };
    
    this.removeTilesBox = function() {
        var iX = -500;

        if (_oButSkip !== null) {
            s_oBox.removeSkipButton();
        };
        
        for (var i = 0; i < _aBoxTiles.length; i++) {
            new createjs.Tween.get(_aBoxTiles[i])
                .to({x: iX }, _iTweenExitBoxSpeed, createjs.Ease.quadInOut);
        };
        
        new createjs.Tween.get(_oBoxBottom)
            .to({x: iX }, _iTweenExitBoxSpeed, createjs.Ease.quadInOut);
        new createjs.Tween.get(_oBoxFrame)
            .to({x: iX }, _iTweenExitBoxSpeed, createjs.Ease.quadInOut);
        new createjs.Tween.get(_oBoxCover)
            .to({x: iX }, _iTweenExitBoxSpeed, createjs.Ease.quadInOut)
            .call( function() {
                s_oBox.unload();
                // START THE GAME
                s_oGame.checkFirstTile(); 
            } );
        playSound("box_move",0.3,0);
    };
    
    this.setTileInvisible = function(i){
        _aBoxTiles[i].visible = false;
        
        // REMOVE THE TILE FROM THE ARRAY
        var iTile = _aBoxTiles.indexOf(i);
        if (iTile > -1) {
           _aBoxTiles.splice(iTile, 1);
        };
    };

    this.unload = function(){
        if (_oButSkip !== null) {
            _oButSkip.unload(); 
            _oButSkip = null;
        };

        s_oStage.removeChild(_oBoxContainer);
        _oBoxContainer = null;
        s_oBox = null;
    };
     
    s_oBox = this;
    
    this._init();
}

var s_oBox = null;