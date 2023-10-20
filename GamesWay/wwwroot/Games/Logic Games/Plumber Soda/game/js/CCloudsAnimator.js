function CCloudsAnimator(oParentContainer){
    
    // VARIABLES FOR CLOUDS' TWEEN MOVEMENTS
    var _bCloud0Update;
    var _bCloud1Update;
    var _bCloud2Update;
    var _iCntTimeCloud0;
    var _iCntTimeCloud1;
    var _iCntTimeCloud2;
    var _iCurStartCloud0;
    var _iCurStartCloud1;
    var _iCurStartCloud2;
    var _iFinishCloud0;
    var _iFinishCloud1;    
    var _iFinishCloud2; 
    
    var _oCloud0;
    var _oCloud1;
    var _oCloud2;
    
    this._init = function(oParentContainer){
        // INIT CLOUDS AND THEIR MOVEMENT
        this._initClouds();
        this._resetMovementCloud0();
        this._resetMovementCloud1();
        this._resetMovementCloud2();
    };
    
    this._initClouds = function(){
        var oSprite = s_oSpriteLibrary.getSprite("cloud_0");
        _oCloud0 = createBitmap(oSprite);
        _oCloud0.x = -100;
        _oCloud0.y = 50;
                
        var oSprite = s_oSpriteLibrary.getSprite("cloud_1");
        _oCloud1 = createBitmap(oSprite);
        _oCloud1.x = -200;
        _oCloud1.y = 180;
        
        var oSprite = s_oSpriteLibrary.getSprite("cloud_1");
        _oCloud2 = createBitmap(oSprite);
        _oCloud2.scaleX = -1;
        _oCloud2.x = 800;
        _oCloud2.y = 150;
        
        oParentContainer.addChild(_oCloud0, _oCloud1, _oCloud2);
        
        // START CLOUDS MOVEMENT
        _bCloud0Update = true;
        _bCloud1Update = true;
        _bCloud2Update = true;
    };
    
    this._resetMovementCloud0 = function(){
        _iCntTimeCloud0 = 0;
        _iCurStartCloud0 = _oCloud0.x;
        _iFinishCloud0 = CLOUDS_MOVEMENT_DESTINATION;
    };
    
    this._resetMovementCloud1 = function(){
        _iCntTimeCloud1 = 0;
        _iCurStartCloud1 = _oCloud1.x;
        _iFinishCloud1 = CLOUDS_MOVEMENT_DESTINATION;        
    };

    this._resetMovementCloud2 = function(){
        _iCntTimeCloud2 = 0;
        _iCurStartCloud2 = _oCloud2.x;
        _iFinishCloud2 = CLOUDS_MOVEMENT_DESTINATION;        
    };

    this._updateCloud0Movement = function(){
        if (!_bCloud0Update) {
            return;
        };
        
        _iCntTimeCloud0 += s_iTimeElaps;
        
        if (_iCntTimeCloud0 >= CLOUD_0_MOVEMENT_SPEED){
            _oCloud0.x = CLOUDS_MOVEMENT_RESET_START;
            this._resetMovementCloud0();
        } else {
            var fLerpCloud0 = s_oTweenController.easeLinear(_iCntTimeCloud0, 0, 1, CLOUD_0_MOVEMENT_SPEED);
            var iValue = s_oTweenController.tweenValue(_iCurStartCloud0, _iFinishCloud0, fLerpCloud0);
            _oCloud0.x = iValue;
        }
    };
    
    this._updateCloud1Movement = function(){
        if (!_bCloud1Update) {
            return;
        };
        
        _iCntTimeCloud1 += s_iTimeElaps;
        
        if (_iCntTimeCloud1 >= CLOUD_1_MOVEMENT_SPEED){
            _oCloud1.x = CLOUDS_MOVEMENT_RESET_START;
            this._resetMovementCloud1();
        } else {
            var fLerpCloud1 = s_oTweenController.easeLinear(_iCntTimeCloud1, 0, 1, CLOUD_1_MOVEMENT_SPEED);
            var iValue = s_oTweenController.tweenValue(_iCurStartCloud1, _iFinishCloud1, fLerpCloud1);
            _oCloud1.x = iValue;
        }
    };
    
    this._updateCloud2Movement = function(){
        if (!_bCloud2Update) {
            return;
        };
        
        _iCntTimeCloud2 += s_iTimeElaps;
        
        if (_iCntTimeCloud2 >= CLOUD_2_MOVEMENT_SPEED){
            _oCloud2.x = CLOUDS_MOVEMENT_RESET_START;
            this._resetMovementCloud2();
        } else {
            var fLerpCloud2 = s_oTweenController.easeLinear(_iCntTimeCloud2, 0, 1, CLOUD_2_MOVEMENT_SPEED);
            var iValue = s_oTweenController.tweenValue(_iCurStartCloud2, _iFinishCloud2, fLerpCloud2);
            _oCloud2.x = iValue;
        }
    };
    
    this.update = function(){
        this._updateCloud0Movement();
        this._updateCloud1Movement();
        this._updateCloud2Movement();
    };
    
    this._init(oParentContainer);
}


