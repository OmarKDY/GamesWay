function CPlayer(oPlayerPhysic, oParentContainer) {
    var b2Vec2 = Box2D.Common.Math.b2Vec2;

    var _iResetTimer;
    var _iTurn;
    var _iLevelIndex;
    
    var _bActive;
    var _bTest;
    var _bResetTimerStart;
    
    var _oPlayerPhysic;    
    var _oParentContainer;
    
    var _oHeadBody;
    var _oTorsoBody;
    var _oLeftBottomLegBody;
    var _oRightBottomLegBody;
    var _oLeftTopLegBody;
    var _oRightTopLegBody;
    var _oLeftArmBody;
    var _oRightArmBody;
    var _oLeftFootBody;
    var _oRightFootBody;

    var _oHeadSprite;
    var _oTorsoSprite;
    var _oLeftBottomLegSprite;
    var _oRightBottomLegSprite;
    var _oLeftTopLegSprite;
    var _oRightTopLegSprite;
    var _oLeftArmSprite;
    var _oRightArmSprite;

    var _oStartHeadPosition;

    this._init = function(){
        _bActive = true;
        _bResetTimerStart = false;        
        _iResetTimer = 0;        
        _iTurn = 0;
        
        _iLevelIndex = 0;
        if (s_iLevel > 2 && s_iLevel < 6) {
            _iLevelIndex = 1;
        } else if (s_iLevel > 5 && s_iLevel < 9) {
            _iLevelIndex = 2;
        }
        
        _oHeadBody = _oPlayerPhysic.head.body;
        _oTorsoBody = _oPlayerPhysic.torso.body;
        _oLeftBottomLegBody = _oPlayerPhysic.leftBottomLeg.body;
        _oRightBottomLegBody = _oPlayerPhysic.rightBottomLeg.body;
        _oLeftTopLegBody = _oPlayerPhysic.leftTopLeg.body;
        _oRightTopLegBody = _oPlayerPhysic.rightTopLeg.body;
        _oLeftArmBody = _oPlayerPhysic.leftArm.body;
        _oRightArmBody = _oPlayerPhysic.rightArm.body;
        _oLeftFootBody = _oPlayerPhysic.leftFoot.body;
        _oRightFootBody = _oPlayerPhysic.rightFoot.body;
        
        this.setActive(false);
        
        this.addPlayerSprites();
        this.movePlayerOnTrampoline();
    };
    
    this.movePlayerOnTrampoline = function(){
        this.setVisible(true);
        
        var aInfos = [INFOS_BOTTOMTRAMPOLINE,INFOS_MIDDLETRAMPOLINE,INFOS_TOPTRAMPOLINE];
        var aOffsets = [BOTTOM_TRAMPOLINE_OFFSETS,MIDDLE_TRAMPOLINE_OFFSETS,TOP_TRAMPOLINE_OFFSETS];
        var iPosX = aInfos[_iTurn].x[s_iLevel] * WORLD_SCALE + aOffsets[_iTurn].x;
        var iPosY = aInfos[_iTurn].y[s_iLevel] * WORLD_SCALE + aOffsets[_iTurn].y;
        
        this.movePlayerToPosition(iPosX,iPosY);
        
        // SAVE ORIGINAL POSITION OF THE HEAD
        _oStartHeadPosition = {x:_oHeadBody.GetPosition().x, y: _oHeadBody.GetPosition().y};
        
        _bTest = true;
    };
    
    this.addPlayerSprites = function(){
        var oSprite = s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_leftarm');
        _oLeftArmSprite = createBitmap(oSprite);
        _oLeftArmSprite.regX = oSprite.width * 0.5;
        _oLeftArmSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oLeftArmSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_leftbottomleg');
        _oLeftBottomLegSprite = createBitmap(oSprite);
        _oLeftBottomLegSprite.regX = oSprite.width * 0.5;
        _oLeftBottomLegSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oLeftBottomLegSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_lefttopleg');
        _oLeftTopLegSprite = createBitmap(oSprite);
        _oLeftTopLegSprite.regX = oSprite.width * 0.5;
        _oLeftTopLegSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oLeftTopLegSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_torso');
        _oTorsoSprite = createBitmap(oSprite);
        _oTorsoSprite.regX = oSprite.width * 0.5 - 5;
        _oTorsoSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oTorsoSprite);
        
        var oData = {
            images: [s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_head')], 
            framerate: 0,
            frames: {width: 49, height: 57, regX: 0, regY: 0}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oHeadSprite = createSprite(oSpriteSheet, 0, 0, 0, 49, 57);
        _oHeadSprite.regX = 49 * 0.5 - 5;
        _oHeadSprite.regY = 57 * 0.5;
        _oHeadSprite.gotoAndStop(HEAD_STANDING);
        _oParentContainer.addChild(_oHeadSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_rightbottomleg');
        _oRightBottomLegSprite = createBitmap(oSprite);
        _oRightBottomLegSprite.regX = oSprite.width * 0.5;
        _oRightBottomLegSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oRightBottomLegSprite);
        
        var oSprite = s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_righttopleg');
        _oRightTopLegSprite = createBitmap(oSprite);
        _oRightTopLegSprite.regX = oSprite.width * 0.5;
        _oRightTopLegSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oRightTopLegSprite);
       
        var oSprite = s_oSpriteLibrary.getSprite('player'+_iLevelIndex+'_rightarm');
        _oRightArmSprite = createBitmap(oSprite);
        _oRightArmSprite.regX = oSprite.width * 0.5;
        _oRightArmSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oRightArmSprite);
    };
    
    this.resetPosition = function(iTurn){        
        _iTurn = iTurn;        
        _bResetTimerStart = true;
        this.setActive(false);
    };
    
    this.resetBodiesVelocities = function(){
        _oHeadBody.SetLinearVelocity({x:0,y:0});
        _oTorsoBody.SetLinearVelocity({x:0,y:0});
        _oLeftBottomLegBody.SetLinearVelocity({x:0,y:0});        
        _oRightBottomLegBody.SetLinearVelocity({x:0,y:0});        
        _oLeftTopLegBody.SetLinearVelocity({x:0,y:0});        
        _oRightTopLegBody.SetLinearVelocity({x:0,y:0});        
        _oLeftArmBody.SetLinearVelocity({x:0,y:0});
        _oRightArmBody.SetLinearVelocity({x:0,y:0});
        _oLeftFootBody.SetLinearVelocity({x:0,y:0});
        _oRightFootBody.SetLinearVelocity({x:0,y:0});
        
        _oHeadBody.SetAngularVelocity(0);
        _oTorsoBody.SetAngularVelocity(0);
        _oLeftBottomLegBody.SetAngularVelocity(0);
        _oRightBottomLegBody.SetAngularVelocity(0);
        _oLeftTopLegBody.SetAngularVelocity(0);
        _oRightTopLegBody.SetAngularVelocity(0);
        _oLeftArmBody.SetAngularVelocity(0);
        _oRightArmBody.SetAngularVelocity(0);
        _oLeftFootBody.SetAngularVelocity(0);
        _oRightFootBody.SetAngularVelocity(0);
        
        _oHeadBody.SetLinearDamping(0);
        _oTorsoBody.SetLinearDamping(0);
        _oLeftBottomLegBody.SetLinearDamping(0);
        _oRightBottomLegBody.SetLinearDamping(0);
        _oLeftTopLegBody.SetLinearDamping(0);
        _oRightTopLegBody.SetLinearDamping(0);
        _oLeftArmBody.SetLinearDamping(0);
        _oRightArmBody.SetLinearDamping(0);
        _oLeftFootBody.SetLinearDamping(0);
        _oRightFootBody.SetLinearDamping(0);
        
        _oHeadBody.SetAngularDamping(0);
        _oTorsoBody.SetAngularDamping(0);
        _oLeftBottomLegBody.SetAngularDamping(0);
        _oRightBottomLegBody.SetAngularDamping(0);
        _oLeftTopLegBody.SetAngularDamping(0);
        _oRightTopLegBody.SetAngularDamping(0);
        _oLeftArmBody.SetAngularDamping(0);
        _oRightArmBody.SetAngularDamping(0);
        _oLeftFootBody.SetAngularDamping(0);
        _oRightFootBody.SetAngularDamping(0);
    };
    
    this.resetBodiesPosition = function(){
        _oHeadBody.SetAngle(INFOS_HEAD.angle);
        _oTorsoBody.SetAngle(INFOS_TORSO.angle);
        _oLeftBottomLegBody.SetAngle(INFOS_LEFTBOTTOMLEG.angle);
        _oRightBottomLegBody.SetAngle(INFOS_RIGHTBOTTOMLEG.angle);
        _oLeftTopLegBody.SetAngle(INFOS_LEFTTOPLEG.angle);
        _oRightTopLegBody.SetAngle(INFOS_RIGHTTOPLEG.angle);
        _oLeftArmBody.SetAngle(INFOS_LEFTARM.angle);
        _oRightArmBody.SetAngle(INFOS_RIGHTARM.angle);
        _oLeftFootBody.SetAngle(INFOS_LEFTFOOT.angle);
        _oRightFootBody.SetAngle(INFOS_RIGHTFOOT.angle);
        
        this.movePlayerOnTrampoline();
        this.resetBodiesVelocities();                
        this.resetJointLimits();
        this.setJointsMotorSpeed(0);
        this.changeHeadAnimation(HEAD_STANDING);
        this._moveSpritePosOnPhysicPos();                
    };
    
    this.changeHeadAnimation = function(iAnimation){
        _oHeadSprite.gotoAndStop(iAnimation);
    };
    
    this.movePlayerToPosition = function(iX,iY){
        s_oPhysicsController.setElementBodyPosition(_oHeadBody, {x: iX + HEAD_OFFSET.x*WORLD_SCALE, y: iY + HEAD_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oTorsoBody, {x: iX + TORSO_OFFSET.x*WORLD_SCALE, y: iY + TORSO_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oLeftBottomLegBody, {x: iX + LEFTBOTTOMLEG_OFFSET.x*WORLD_SCALE, y: iY + LEFTBOTTOMLEG_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oRightBottomLegBody, {x: iX + RIGHTBOTTOMLEG_OFFSET.x*WORLD_SCALE, y: iY + RIGHTBOTTOMLEG_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oLeftTopLegBody, {x: iX + LEFTTOPLEG_OFFSET.x*WORLD_SCALE, y: iY + LEFTTOPLEG_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oRightTopLegBody, {x: iX + RIGHTTOPLEG_OFFSET.x*WORLD_SCALE, y: iY + RIGHTTOPLEG_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oLeftArmBody, {x: iX + LEFTARM_OFFSET.x*WORLD_SCALE, y: iY + LEFTARM_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oRightArmBody, {x: iX + RIGHTARM_OFFSET.x*WORLD_SCALE, y: iY + RIGHTARM_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oLeftFootBody, {x: iX + LEFTFOOT_OFFSET.x*WORLD_SCALE, y: iY + LEFTFOOT_OFFSET.y*WORLD_SCALE});
        s_oPhysicsController.setElementBodyPosition(_oRightFootBody, {x: iX + RIGHTFOOT_OFFSET.x*WORLD_SCALE, y: iY + RIGHTFOOT_OFFSET.y*WORLD_SCALE});
        this._moveSpritePosOnPhysicPos();
    };

    // BEND KNEES, ARMS DOWN, DANDLING
    this.onPreparation = function(fMultiplier){
        if (!_bActive) {
            return;
        }
        this.changeHeadAnimation(HEAD_PREPARATION);
        
        // BEND KNEES
        this.setPlayerLimits(0.8*fMultiplier,-1.2*fMultiplier,-2.2*fMultiplier); // KNEES, PELVIS, SHOULDERS
        
        // ADD LIMITS TO THE ANKLES TO ADD OSCILLATION
        var iAnklesLimitMin = degreesToRadians(-90);
        var iAnklesLimitMax = degreesToRadians(180);
        _oPlayerPhysic.rightAnkle.SetLimits(iAnklesLimitMin,iAnklesLimitMax);
        _oPlayerPhysic.leftAnkle.SetLimits(iAnklesLimitMin,iAnklesLimitMax);
        
        // LOCK THE FEET DOWN
        _oLeftFootBody.SetType(STATIC_BODY);
        _oRightFootBody.SetType(STATIC_BODY);
        
        // KEEP THE PLAYER IN POSITION        
        if (_oHeadBody.GetPosition().y > _oStartHeadPosition.y) {
            var vForceDirection = new b2Vec2(0,VERTICAL_FORCE_UP_PREPARATION);
            _oHeadBody.ApplyForce(vForceDirection, _oHeadBody.GetWorldCenter());
        }

        var iHeadPositionMinRange = _oStartHeadPosition.x + 0.05;
        var iHeadPositionMaxRange = _oStartHeadPosition.x + 1;
        var iHeadPositionMin = _oStartHeadPosition.x + 0.05;

        if ( _oHeadBody.GetPosition().x > iHeadPositionMinRange && _oHeadBody.GetPosition().x < iHeadPositionMaxRange && _bTest === true){
            var vForceDirection = new b2Vec2(HORIZONTAL_FORCE_PREPARATION,0);
            _oHeadBody.ApplyForce(vForceDirection, _oHeadBody.GetWorldCenter());
            _bTest = false;
        };
        
        if ( _oHeadBody.GetPosition().x < iHeadPositionMin){
            var vForceDirection = new b2Vec2(HORIZONTAL_FORCE_PREPARATION_BACK,0);
            _oHeadBody.ApplyForce(vForceDirection, _oHeadBody.GetWorldCenter());
        };
    };
        
    this.onJump = function(){        
        if (!_bActive) {
            return;
        }        
        this.changeHeadAnimation(HEAD_DIVING);
        this.setPlayerLimits(0.5,0.5,-2); // KNEES, PELVIS, SHOULDERS
        
        // UNLOCK THE FEET
        _oLeftFootBody.SetType(DYNAMIC_BODY);
        _oRightFootBody.SetType(DYNAMIC_BODY);

        // RESET ANKLES LIMITS
        _oPlayerPhysic.rightAnkle.SetLimits(0,0);
        _oPlayerPhysic.leftAnkle.SetLimits(0,0);

        var vForceDirection = new b2Vec2(VERTICAL_FORCE_RIGHT_JUMP,VERTICAL_FORCE_UP_JUMP);        
        _oHeadBody.ApplyForce(vForceDirection, _oHeadBody.GetWorldCenter());
        _oTorsoBody.ApplyForce(vForceDirection, _oTorsoBody.GetWorldCenter());
        
        _oLeftFootBody.ApplyForce(vForceDirection, _oLeftFootBody.GetWorldCenter());
        _oRightFootBody.ApplyForce(vForceDirection, _oRightFootBody.GetWorldCenter());
    };
    
    this.addTrampolinePush = function(){
        // REMOVE JOINTS LIMITS
        _oPlayerPhysic.rightKnee.EnableLimit(false);
        _oPlayerPhysic.leftKnee.EnableLimit(false);
        _oPlayerPhysic.rightPelvis.EnableLimit(false);
        _oPlayerPhysic.leftPelvis.EnableLimit(false);
        _oPlayerPhysic.rightShoulder.EnableLimit(false);
        _oPlayerPhysic.leftShoulder.EnableLimit(false);

        var vForceDirection = new b2Vec2(VERTICAL_FORCE_RIGHT_TRAMPOLINE,VERTICAL_FORCE_UP_TRAMPOLINE);        
        _oTorsoBody.ApplyForce(vForceDirection, _oTorsoBody.GetWorldCenter());
    };
    
    this.setJointsMotorSpeed = function(iValue){
        _oPlayerPhysic.rightKnee.SetMotorSpeed(iValue);
        _oPlayerPhysic.leftKnee.SetMotorSpeed(iValue);
        _oPlayerPhysic.rightPelvis.SetMotorSpeed(iValue);
        _oPlayerPhysic.leftPelvis.SetMotorSpeed(iValue);
        _oPlayerPhysic.rightShoulder.SetMotorSpeed(iValue);
        _oPlayerPhysic.leftShoulder.SetMotorSpeed(iValue);
        _oPlayerPhysic.rightAnkle.SetMotorSpeed(iValue);
        _oPlayerPhysic.leftAnkle.SetMotorSpeed(iValue);
    };
    
    this.setPlayerLimits = function(iKneesLimit,iPelvisLimit,iShouldersLimit){
        _oPlayerPhysic.rightKnee.SetLimits(iKneesLimit,iKneesLimit);
        _oPlayerPhysic.leftKnee.SetLimits(iKneesLimit,iKneesLimit);
        _oPlayerPhysic.rightPelvis.SetLimits(iPelvisLimit,iPelvisLimit);
        _oPlayerPhysic.leftPelvis.SetLimits(iPelvisLimit,iPelvisLimit);
        _oPlayerPhysic.rightShoulder.SetLimits(iShouldersLimit,iShouldersLimit);
        _oPlayerPhysic.leftShoulder.SetLimits(iShouldersLimit,iShouldersLimit);
        _oPlayerPhysic.rightShoulder.EnableLimit(true);
        _oPlayerPhysic.leftShoulder.EnableLimit(true);
    };
    
    // BEND KNEES, ARMS ON LEGS, ROTATE
    this.onJumpingPressDown = function(fMultiplier){
        if (!_bActive) {
            return;
        }
        
        this.setPlayerLimits(1*fMultiplier,-2.5*fMultiplier,-0.5*fMultiplier); // KNEES, PELVIS, SHOULDERS
        _oHeadBody.ApplyTorque(BODY_ROTATION_TORQUE*fMultiplier);
    };
    
    // RELEASE KNEES, ARMS UP, STOP ROTATION (GRAVITY AFFECTING ROTATION)
    this.onJumpingPressReleased = function(){
        if (!_bActive) {
            return;
        }
        
        this.setPlayerLimits(0.5,0.5,-2); // KNEES, PELVIS, SHOULDERS
    };
    
    this.setActive = function(bValue) {
        _oTorsoBody.SetActive(bValue);
        _oHeadBody.SetActive(bValue);
        _oLeftArmBody.SetActive(bValue);
        _oRightArmBody.SetActive(bValue);
        _oLeftTopLegBody.SetActive(bValue);
        _oLeftBottomLegBody.SetActive(bValue);
        _oRightTopLegBody.SetActive(bValue);        
        _oRightBottomLegBody.SetActive(bValue);        
        _oLeftFootBody.SetActive(bValue);
        _oRightFootBody.SetActive(bValue);
        
        _bActive = bValue;
    };
    
    this.resetJointLimits = function(){
        _oPlayerPhysic.rightKnee.SetLimits(INFOS_RIGHTKNEE.lowerangle,INFOS_RIGHTKNEE.upperangle);
        _oPlayerPhysic.leftKnee.SetLimits(INFOS_LEFTKNEE.lowerangle,INFOS_LEFTKNEE.upperangle);
        _oPlayerPhysic.rightPelvis.SetLimits(INFOS_RIGHTPELVIS.lowerangle,INFOS_RIGHTPELVIS.upperangle);
        _oPlayerPhysic.leftPelvis.SetLimits(INFOS_LEFTPELVIS.lowerangle,INFOS_LEFTPELVIS.upperangle);
        _oPlayerPhysic.rightShoulder.SetLimits(INFOS_LEFTSHOULDER.lowerangle,INFOS_LEFTSHOULDER.upperangle);
        _oPlayerPhysic.leftShoulder.SetLimits(INFOS_RIGHTSHOULDER.lowerangle,INFOS_RIGHTSHOULDER.upperangle);
        _oPlayerPhysic.rightShoulder.EnableLimit(false);
        _oPlayerPhysic.leftShoulder.EnableLimit(false);
        _oPlayerPhysic.rightAnkle.SetLimits(INFOS_RIGHTANKLE.lowerangle,INFOS_RIGHTANKLE.upperangle);
        _oPlayerPhysic.leftAnkle.SetLimits(INFOS_LEFTANKLE.lowerangle,INFOS_LEFTANKLE.upperangle);
    };
    
    this.addWaterResistance = function(){
        /*
        var vForceDirection = new b2Vec2(0,VERTICAL_FORCE_WATER);
        _oTorsoBody.ApplyForce(vForceDirection, _oTorsoBody.GetWorldCenter());
        */
       
        var oParent = this;
        setTimeout(function() { oParent.setVisible(false); }, 100);        
    };
    
    this.setVisible = function(bValue){
        var _aSprites = this.getSpriteArray();
        for (var i = 0; i < _aSprites.length; i++) {
            _aSprites[i].visible = bValue;
        };
    };
    
    this.unload = function () {
        this.setActive(false);
        _oParentContainer.removeChild(_oHeadSprite);
        _oParentContainer.removeChild(_oTorsoSprite);
        _oParentContainer.removeChild(_oLeftBottomLegSprite);
        _oParentContainer.removeChild(_oRightBottomLegSprite);
        _oParentContainer.removeChild(_oLeftTopLegSprite);
        _oParentContainer.removeChild(_oRightTopLegSprite);
        _oParentContainer.removeChild(_oLeftArmSprite);
        _oParentContainer.removeChild(_oRightArmSprite);
    };

    this.getSpriteArray = function(){
        var aSprites = [];
        
        aSprites.push(_oHeadSprite);
        aSprites.push(_oTorsoSprite);
        aSprites.push(_oLeftBottomLegSprite);
        aSprites.push(_oRightBottomLegSprite);
        aSprites.push(_oLeftTopLegSprite);
        aSprites.push(_oRightTopLegSprite);
        aSprites.push(_oLeftArmSprite);
        aSprites.push(_oRightArmSprite);
        
        return aSprites;
    };
    
    this.getBodyAngle = function(){
        // RETURN THE BODY ANGLE ON A 360° LIMIT, EVEN AFTER SOME COMPLETE FLIPS
        var iAngle = s_oPhysicsController.getBodyPosition(_oTorsoBody).angle;
        while (iAngle > 360) {
            iAngle -= 360;
            s_oGame.onFlipCompleted();
        };
        return iAngle;
    };
    
    this.getTorsoX = function(){
        var iX = s_oPhysicsController.getBodyPosition(_oTorsoBody).x;
        return iX;
    };
    
    this.getTorsoY = function(){
        var iY = s_oPhysicsController.getBodyPosition(_oTorsoBody).y;
        return iY;
    };
    
    this.getBody = function(){
        return _oPlayerPhysic;
    };
    
    this.updateSpritePos = function(oBody, oSprite){
        var oInfos = s_oPhysicsController.getBodyPosition(oBody);
        oSprite.x = oInfos.x;
        oSprite.y = oInfos.y;
        oSprite.rotation = oInfos.angle;
    };
    
    this._moveSpritePosOnPhysicPos = function(){
        this.updateSpritePos(_oHeadBody, _oHeadSprite);
        this.updateSpritePos(_oTorsoBody, _oTorsoSprite);
        this.updateSpritePos(_oLeftArmBody, _oLeftArmSprite);
        this.updateSpritePos(_oRightArmBody, _oRightArmSprite);
        this.updateSpritePos(_oLeftTopLegBody, _oLeftTopLegSprite);
        this.updateSpritePos(_oRightTopLegBody, _oRightTopLegSprite);
        this.updateSpritePos(_oLeftBottomLegBody, _oLeftBottomLegSprite);
        this.updateSpritePos(_oRightBottomLegBody, _oRightBottomLegSprite);  
    };
    
    this.update = function(){
        if (_bResetTimerStart) {
            _iResetTimer += s_iTimeElaps;
            if (_iResetTimer > PLAYER_RESET_TIMER) {
                this.resetBodiesPosition();                
                _iResetTimer = 0;
                _bResetTimerStart = false;                
            };
        };     
        
        if (!_bActive) {
            return;
        }
        this._moveSpritePosOnPhysicPos();
    };
    
    _oParentContainer = oParentContainer;
    _oPlayerPhysic = oPlayerPhysic;

    this._init();
};