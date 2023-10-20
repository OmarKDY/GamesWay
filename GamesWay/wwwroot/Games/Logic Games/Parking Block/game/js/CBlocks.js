function CBlocks(iX, iY, szType, i, oParentContainer){
    
    var _szType = szType;
    var _iIndex = i;
    var _oContainerForm;
    var _oListenerDown;
    var _oListenerUp;
    var _oListenerMove;
    var _aShortCarList;
    var _aLongCarList;
    var _oCarHighlight;
    
    var _oPosToStay = {x: 0, y: 0};
    
    this._init = function(iX, iY, szType, i, oParentContainer){
        _oContainerForm = new createjs.Container();
        
        _aShortCarList = ["car_0", "car_1", "car_2", "car_3", "car_4"];
        _aLongCarList = ["car_5", "car_6", "car_7"];
        
        this._setCar();

        
        oParentContainer.addChild(_oContainerForm);
        
        _oListenerDown = _oContainerForm.on("mousedown", this._onFormContainerClick, this);
        _oListenerUp = _oContainerForm.on("pressup", this._releaseForm, this );
        _oListenerMove = _oContainerForm.on("pressmove", this._dragForm, this );
    };
    
    this._setCar = function(){
        
        var szImage;
        if(szType === OBJ_VERTICAL_2 || szType === OBJ_HORIZONTAL_2){
            szImage = _aShortCarList[ Math.floor( Math.random()*_aShortCarList.length ) ];
        }else if(szType === OBJ_VERTICAL_3 || szType === OBJ_HORIZONTAL_3){
            szImage = _aLongCarList[ Math.floor( Math.random()*_aLongCarList.length ) ];
        } else if(szType === OBJ_TYPE_PLAYER){
            szImage = "car_player";
        }

        var oSprite = s_oSpriteLibrary.getSprite(szImage);
        
        var oRotation = 0;
        var oRegY = 0;
        if(szType === OBJ_VERTICAL_2 || szType === OBJ_VERTICAL_3){
            _oPosToStay = {x: START_X_GRID+(CELL_WIDTH*iX)-12, y: START_Y_GRID+(CELL_HEIGHT*iY)-5};
            oRotation = 90;
            oRegY = oSprite.height;
        }else{
            _oPosToStay = {x: START_X_GRID+(CELL_WIDTH*iX)-5, y: START_Y_GRID+(CELL_HEIGHT*iY)-5};
        }
        
        if(szType === OBJ_TYPE_PLAYER){
            this._setCarHighlight(_oPosToStay.x, _oPosToStay.y);
        }
        
        
        var _oSourceImage = createBitmap(oSprite);
        _oContainerForm.x = _oPosToStay.x;
        _oContainerForm.y = _oPosToStay.y;
        _oSourceImage.regY = oRegY;
        _oSourceImage.rotation = oRotation;
        _oContainerForm.addChild(_oSourceImage);
    };
    
    this._onFormContainerClick = function(event){
        s_oGame.onFormContainerClick(event, _oContainerForm, _iIndex);
    };
    
    this._dragForm = function(event){
        s_oGame.dragForm(event, _szType, _iIndex);  
    };
    
    this._releaseForm = function(event){
        s_oGame.releaseForm(event, _oPosToStay, _szType, _iIndex); 
    }; 
    
    this.placeInGrid = function(iX, iY){
        createjs.Tween.get( _oContainerForm, {override: true} ).to({x: iX, y: iY }, (500), createjs.Ease.cubicOut).call(function() {});
        _oPosToStay = {x: iX, y: iY};
    };
    
    this.goBack = function(iX, iY){
        createjs.Tween.get( _oContainerForm ).to({x: iX, y: iY }, (200), createjs.Ease.cubicOut).call(function() {});
    };
    
    this.moveOut = function(){
        createjs.Tween.get( _oContainerForm, {override: true} ).to({x: CANVAS_WIDTH }, (500), createjs.Ease.cubicIn).call(function() {
            s_oGame.gameOver();
        });
    };
    
    this.setPos = function(iX, iY){
        _oContainerForm.x = iX;
        _oContainerForm.y = iY;
    };
    
    this.getPosX = function(){
        return _oContainerForm.x;
    };
    
    this.getPosY = function(){
        return _oContainerForm.y;
    };
    
    this.getOldX = function(){
        return _oPosToStay.x;
    };
    
    this.getOldY = function(){
        return _oPosToStay.y;
    };
    
    this.getType = function(){
        return _szType;
    };
    
    this.deleteForm = function(){
        _oContainerForm.off("mousedown", _oListenerDown);
        _oContainerForm.off("pressmove", _oListenerUp);
        _oContainerForm.off("pressup", _oListenerMove);
        oParentContainer.removeChild(_oContainerForm);
    };
    
    this._setCarHighlight = function(iX, iY){
        var oSprite = s_oSpriteLibrary.getSprite("car_highlight");
        var iWidth = oSprite.width/7;
        var iHeight = oSprite.height/3;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth, regY: 0}, 
                        animations: {idle:[0,19]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCarHighlight = createSprite(oSpriteSheet, "idle",iWidth,0,iWidth,iHeight);
        _oCarHighlight.rotation = -90;
        _oCarHighlight.x = iX;
        _oCarHighlight.y = iY;
        _oCarHighlight.regX = -8;
        oParentContainer.addChild(_oCarHighlight);
        
    };
    
    this.showHighlight = function(bVal){
        _oCarHighlight.visible = bVal;
    };
    
    this._init(iX, iY, szType, i, oParentContainer);
    
}