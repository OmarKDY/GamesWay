function CTile(oContainer, iTileValue, iPlayer, iX, iY) {
    var _oGlow;
    var _oTile;
    var _oContainer;
    var _oHitArea;
    var _oThis;
    var _oListenerMouseDown;
    var _oListenerMouseOver;

    var _iTileValue;    // THE "ID" OF THE TILE (IN THE IMAGESHEET)
    
    var _aDotsValues;   // THE VALUE (NUMBER OF DOTS) ON BOTH FACES OF THIS TILE
    
    var _bPlayerTile;   // IS THIS A PLAYER'S TILE (TRUE) OR A CPU TILE (FALSE)
    var _bDouble;       // IF THIS TILE IS A DOUBLE
    var _bDrawn;        // IF IT HAS BEEN ALREADY DRAWN
    var _bTurned;       // IF IT HAS BEEN TURNED
    var _bTremble;
    
    this._init = function () {
        _bTremble = false;
        
        _oContainer = oContainer;
        _iTileValue = iTileValue;
        _aDotsValues = TILE_VALUES[iTileValue];
        _bDrawn = false;
        
        if (_aDotsValues[0] === _aDotsValues[1]) {
            _bDouble = true;
        } else {
            _bDouble = false;
        };
        
        // CREATE A GLOWING EFFECT
        var oSprite = s_oSpriteLibrary.getSprite("glow");
        _oGlow = createBitmap(oSprite);
        _oGlow.scaleX = _oGlow.scaleY = TILE_INIT_SCALE;
        _oGlow.x = iX;
        _oGlow.y = iY;
        _oGlow.regX = oSprite.width/2;
        _oGlow.regY = oSprite.height/2;
        _oGlow.visible = false;
        
        new createjs.Tween.get(_oGlow, {loop: true})
            .to({alpha: 0}, 500, createjs.Ease.quadOut)
            .wait(500)
            .to({alpha: 1}, 500, createjs.Ease.quadIn)
            .wait(500);

        var oData = {   
                images: [s_oSpriteLibrary.getSprite("tiles")], 
                framerate: 0,
                // width, height & registration point of each sprite
                frames: {width: TILE_WIDTH, height: TILE_HEIGHT, regX: TILE_WIDTH/2, regY: TILE_HEIGHT/2}
            };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oTile = createSprite(oSpriteSheet, 0, TILE_WIDTH/2, TILE_HEIGHT/2, TILE_WIDTH, TILE_HEIGHT);
        _oTile.rotation = PLAYER_ROTATION[iPlayer];
        
        _oTile.x = iX;
        _oTile.y = iY;
        _oTile.scaleX = _oTile.scaleY = TILE_INIT_SCALE;
        
        _oHitArea = new createjs.Shape();
        var iHitWidth = 38;
        var iHitHeight = 76;
        _oHitArea.graphics.beginFill("#f00").drawRect(0, 0, iHitWidth, iHitHeight);
        _oHitArea.regX = iHitWidth/2;
        _oHitArea.regY = iHitHeight/2;
        _oHitArea.x = _oTile.x;
        _oHitArea.y = _oTile.y;
        _oHitArea.alpha = 0.01;
        
        _bTurned = false;
        _oTile.gotoAndStop( TILE_BACK );
        
        _oListenerMouseOver = _oHitArea.on("mouseover", this._mouseOver);
        _oListenerMouseDown = _oHitArea.on("mousedown", this._mouseDown);
        _oContainer.addChild(_oTile);
        _oContainer.addChild(_oGlow);
        

        if (iPlayer === 0) {
            _bPlayerTile = true;
        } else { 
            _bPlayerTile = false; 
        };
    };

    this._mouseOver = function(evt){
        if (_oThis.isClickable() === false) {
            return;
        };
        
        evt.target.cursor = "pointer";
    };

    this._mouseDown = function(){
        if (_oThis.isClickable() === false) {
            return;
        };
        
        // CHECK IF IT'S POSSIBLE TO ATTACH THIS TILE
        s_oGame.checkClickedTile(_oThis);
    };
    
    this.isClickable = function() {
        if (s_oGame.checkDrawned() ||       // IF A TILE HAS ALREADY BEEN DRAWN
            s_oGame.getTurn() > 0 ||        // IF IT'S NOT THE HUMAN PLAYER'S TURN
            _oTile === null ||              // IF THE TILE IS NOT AVAILABLE
            _oThis.getDrawn() ||            // IF THIS TILE HAS ALREADY BEEN DRAWN
            !s_oGame.gameReady() ||         // IF THE GAME IS NOT READY
            !_bPlayerTile ||                // IF IT'S NOT A HUMAN PLAYER'S TILE
            s_oPlayer.isArrangementActive()) { // IF A TILE ANIMATION IS ACTIVE
            return false;
        } else {
            return true;
        };
    };
    
    this.isPlayerTile = function(){
        return _bPlayerTile;
    };
    
    this.setGlowVisible = function(value){
        _oGlow.visible = value;
    };
    
    this.setDrawn = function(){
        _bDrawn = true;
    };
    
    this.getDrawn = function(){
        return _bDrawn;
    };
    
    this.isDouble = function() {
        return _bDouble;
    };
    
    this.setX = function(iX){
        new createjs.Tween.get(_oTile)
            .to({x: iX}, 150);
        new createjs.Tween.get(_oGlow)
            .to({x: iX}, 150);
        new createjs.Tween.get(_oHitArea).to({x: iX}, 150);
    };

    this.setY = function(iY){
        new createjs.Tween.get(_oTile)
            .to({y: iY}, 150);
        new createjs.Tween.get(_oGlow)
            .to({y: iY}, 150);
        new createjs.Tween.get(_oHitArea).to({y: iY}, 150);
    };

    this.getX = function(){
        return _oTile.x; };

    this.getY = function(){
        return _oTile.y; };

    this.getValue = function(){
        return _iTileValue; };
    
    this.setVisible = function(value){
        if (value) {
            _oTile.alpha = 1;
        } else {
            _oTile.alpha = 1/1000;
        };
    };
    
    this.getTile = function(){
        return _oTile; };

    this.getGlow = function() {
        return _oGlow; };

    this.getDotsValue = function(iFace){
        return _aDotsValues[iFace]; };
    
    this.isTurned = function() {
        return _bTurned; };
    
    this.turnTile = function(){
        _bTurned = true;

        new createjs.Tween.get(_oTile)
            .to({scaleX: 0},300, createjs.Ease.cubicIn)
            .call(function() {
                _oTile.gotoAndStop(_iTileValue);
                new createjs.Tween.get(_oTile)
                    .to({scaleX: TILE_INIT_SCALE},300, createjs.Ease.cubicOut);
            });
    };
    
    this.turnTileInvisible = function(){
        _bTurned = true;
        _oTile.gotoAndStop(_iTileValue);
    };
    
    this.setPlayerTile = function(value){
        _bPlayerTile = value;
    };

    this.addHitArea = function(){
        _oContainer.addChild(_oHitArea);
    };

    this.removeHitArea = function(){
        _oHitArea.removeAllEventListeners();
        _oContainer.removeChild(_oHitArea);
        _oHitArea.visible = false;
    };

    this.unload = function(){
        _oHitArea.removeAllEventListeners();

        _oGlow.visible = false;
        _oTile.visible = false;
        _oTile = null;
        _oGlow = null;
    };
     
    this._init();
    
    _oThis = this;
}