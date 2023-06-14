function CBlock(oPhysic, oData, oParentContainer) {
    var _oPhysic;
    var _oParentContainer;
    var _oData;
    var _oBlockSprite;
    var _oHitArea;
    
    var _bActive;
    
    this._init = function () {
        _bActive = false;
        
        var oSprite;
        var iWidth;
        var iHeight
        var iHitAreaWidth;
        var iHitAreaHeight;
        // IF THE BLOCK IS WOOD
        if (_oData.wood) {
            iHitAreaWidth = WOOD_BLOCK_WIDTH;
            iHitAreaHeight = WOOD_BLOCK_HEIGHT;
            // BREAKABLE WOOD
            if (_oData.breakable) {
                iWidth = 160;
                iHeight = 30;
                var data = {                    
                    images: [s_oSpriteLibrary.getSprite('wood_2'),
                             s_oSpriteLibrary.getSprite('wood_2_broken')],
                    frames: {width: iWidth, height: iHeight, regX: 0, regY: 0}, 
                    animations: {idle: [0,0,false],
                                 explode: [1,1,false]},
                    framerate: 0
                };        
                var oSpriteSheet = new createjs.SpriteSheet(data);        
                _oBlockSprite = createSprite(oSpriteSheet, 'idle', 0, 0, iWidth, iHeight);
                _oBlockSprite.regX = iWidth * 0.5;
                _oBlockSprite.regY = iHeight * 0.5;
            // UNBREAKABLE WOOD
            } else {
                oSprite = s_oSpriteLibrary.getSprite('wood_1');
                iWidth = oSprite.width;
                iHeight = oSprite.height;
                _oBlockSprite = createBitmap(oSprite);
                _oBlockSprite.regX = oSprite.width * 0.5;
                _oBlockSprite.regY = oSprite.height * 0.5;
            }
        // IF THE BLOCK IS STONE
        } else {
            // BREAKABLE STONE
            if (_oData.breakable) {
                iHitAreaWidth = STONE_BLOCK_WIDTH;
                iHitAreaHeight = STONE_BLOCK_HEIGHT;
                iWidth = 244;
                iHeight = 182;
                var data = {                    
                    images: [s_oSpriteLibrary.getSprite('block_1')],
                    frames: {width: iWidth, height: iHeight, regX: -22, regY: 10}, 
                    animations: {idle: [0,0,false],
                                 explode: [1,6,false]},
                    framerate: 30
                };        
                var oSpriteSheet = new createjs.SpriteSheet(data);        
                _oBlockSprite = createSprite(oSpriteSheet, 'idle', -22, 10, iWidth, iHeight);
                _oBlockSprite.regX = iWidth * 0.5;
                _oBlockSprite.regY = iHeight * 0.5;
            // UNBREAKABLE STONE
            } else {
                iHitAreaWidth = STONE_UNBREAKABLE_BLOCK_WIDTH;
                iHitAreaHeight = STONE_UNBREAKABLE_BLOCK_HEIGHT;
                oSprite = s_oSpriteLibrary.getSprite('block_2');
                iWidth = oSprite.width;
                iHeight = oSprite.height;
                _oBlockSprite = createBitmap(oSprite);
                _oBlockSprite.regX = 46;
                _oBlockSprite.regY = 90;
            }
        }
        _oParentContainer.addChild(_oBlockSprite);
        
        // ADD HIT AREA
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("red").drawRect(0,0,iHitAreaWidth*2,iHitAreaHeight*2);
        _oHitArea.regX = iHitAreaWidth;
        _oHitArea.regY = iHitAreaHeight;
        _oHitArea.x = _oBlockSprite.x;
        _oHitArea.y = _oBlockSprite.y;
        _oHitArea.alpha = 0.01;
        
        var oParent = this;
        _oHitArea.on("click", function(){ oParent.onClickedBlock(oParent); });
        _oParentContainer.addChild(_oHitArea);
        
        if (_oData.breakable && !s_bMobile) {
            _oHitArea.cursor = "pointer";
        }
        
        _bActive = true;
    };
    
    this.onClickedBlock = function(oParent) {
        s_oGame.onClick();
        
        if (_oData === null) {
            return;
        }
        if (!_oData.breakable) {
            return;
        }
        
        s_oGame.onBlockClicked();
        
        if (_oData.wood) {
            playSound("wood_explosion",1,false);            
            _oBlockSprite.gotoAndPlay("explode");
            oParent.unloadPhysic();
            createjs.Tween.get(_oBlockSprite)
                .to({alpha:0},500,createjs.Ease.cercIn)
                .call(function(){ 
                    createjs.Tween.removeTweens(_oBlockSprite);
                    _oParentContainer.removeChild(_oBlockSprite); 
                });
        } else {
            playSound("block_explosion",1,false);
            _oBlockSprite.gotoAndPlay("explode");
            oParent.unloadPhysic();
        }           
    };
    
    this.getPhysic = function(){
        return _oPhysic;
    };
    
    this.unloadPhysic = function(){
        _bActive = false;        
        s_oPhysicsController.destroyBodyVector(_oPhysic);        
        _oData = null;
    };
    
    this.unload = function(){
        _bActive = false;        
        s_oPhysicsController.destroyBodyVector(_oPhysic);
        createjs.Tween.removeTweens(_oBlockSprite);
        _oData = null;
        _oParentContainer.removeChild(_oBlockSprite);
    };
    
    this._moveSpritePosOnPhysicPos = function(){
        var oInfos = s_oPhysicsController.getBodyPosition(_oPhysic);
        _oHitArea.x = _oBlockSprite.x = oInfos.x;
        _oHitArea.y = _oBlockSprite.y = oInfos.y;
        _oHitArea.rotation = _oBlockSprite.rotation = oInfos.angle;
    };
    
    this.isBreakable = function(){
        if (!_oData) {
            return false;
        }
        return _oData.breakable;
    };

    this.update = function () {
        if (!_bActive) {
            return;
        }
        this._moveSpritePosOnPhysicPos();
    };
    
    _oPhysic = oPhysic;
    _oData = oData;
    _oParentContainer = oParentContainer;
    
    this._init();
}