function CPhysicObjectsCreator(oWorld){
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

    var _oWorld;

    this.init = function(){
        _oWorld = oWorld;
    };
    
    this.addPlayer = function(oContainer){
        var oRightBottomLeg = this.addNewObject(INFOS_RIGHTBOTTOMLEG.type,INFOS_RIGHTBOTTOMLEG.x,INFOS_RIGHTBOTTOMLEG.y,INFOS_RIGHTBOTTOMLEG.angle,INFOS_RIGHTBOTTOMLEG.issensor,INFOS_RIGHTBOTTOMLEG.category,INFOS_RIGHTBOTTOMLEG.vertices,INFOS_RIGHTBOTTOMLEG.maskbits,INFOS_RIGHTBOTTOMLEG.userdata);       
        var oRightTopLeg = this.addNewObject(INFOS_RIGHTTOPLEG.type,INFOS_RIGHTTOPLEG.x,INFOS_RIGHTTOPLEG.y,INFOS_RIGHTTOPLEG.angle,INFOS_RIGHTTOPLEG.issensor,INFOS_RIGHTTOPLEG.category,INFOS_RIGHTTOPLEG.vertices,INFOS_RIGHTTOPLEG.maskbits,INFOS_RIGHTTOPLEG.userdata);
        var oRightArm = this.addNewObject(INFOS_RIGHTARM.type,INFOS_RIGHTARM.x,INFOS_RIGHTARM.y,INFOS_RIGHTARM.angle,INFOS_RIGHTARM.issensor,INFOS_RIGHTARM.category,INFOS_RIGHTARM.vertices,INFOS_RIGHTARM.maskbits,INFOS_RIGHTARM.userdata);
        var oTorso = this.addNewObject(INFOS_TORSO.type,INFOS_TORSO.x,INFOS_TORSO.y,INFOS_TORSO.angle,INFOS_TORSO.issensor,INFOS_TORSO.category,INFOS_TORSO.vertices,INFOS_TORSO.maskbits,INFOS_TORSO.userdata);        
        var oLeftArm = this.addNewObject(INFOS_LEFTARM.type,INFOS_LEFTARM.x,INFOS_LEFTARM.y,INFOS_LEFTARM.angle,INFOS_LEFTARM.issensor,INFOS_LEFTARM.category,INFOS_LEFTARM.vertices,INFOS_LEFTARM.maskbits,INFOS_LEFTARM.userdata);
        var oLeftBottomLeg = this.addNewObject(INFOS_LEFTBOTTOMLEG.type,INFOS_LEFTBOTTOMLEG.x,INFOS_LEFTBOTTOMLEG.y,INFOS_LEFTBOTTOMLEG.angle,INFOS_LEFTBOTTOMLEG.issensor,INFOS_LEFTBOTTOMLEG.category,INFOS_LEFTBOTTOMLEG.vertices,INFOS_LEFTBOTTOMLEG.maskbits,INFOS_LEFTBOTTOMLEG.userdata);
        var oLeftTopLeg = this.addNewObject(INFOS_LEFTTOPLEG.type,INFOS_LEFTTOPLEG.x,INFOS_LEFTTOPLEG.y,INFOS_LEFTTOPLEG.angle,INFOS_LEFTTOPLEG.issensor,INFOS_LEFTTOPLEG.category,INFOS_LEFTTOPLEG.vertices,INFOS_LEFTTOPLEG.maskbits,INFOS_LEFTTOPLEG.userdata);
        var oHead = this.addNewCircle(INFOS_HEAD.type,INFOS_HEAD.x,INFOS_HEAD.y,INFOS_HEAD.angle,INFOS_HEAD.radius,INFOS_HEAD.issensor,INFOS_HEAD.category,INFOS_HEAD.maskbits,INFOS_HEAD.userdata);
        var oRightFoot = this.addNewObject(INFOS_RIGHTFOOT.type,INFOS_RIGHTFOOT.x,INFOS_RIGHTFOOT.y,INFOS_RIGHTFOOT.angle,INFOS_RIGHTFOOT.issensor,INFOS_RIGHTFOOT.category,INFOS_RIGHTFOOT.vertices,INFOS_RIGHTFOOT.maskbits,INFOS_RIGHTFOOT.userdata);
        var oLeftFoot = this.addNewObject(INFOS_LEFTFOOT.type,INFOS_LEFTFOOT.x,INFOS_LEFTFOOT.y,INFOS_LEFTFOOT.angle,INFOS_LEFTFOOT.issensor,INFOS_LEFTFOOT.category,INFOS_LEFTFOOT.vertices,INFOS_LEFTFOOT.maskbits,INFOS_LEFTFOOT.userdata);
        
        // ADD JOINTS
        var oLeftShoulder = this.addRevoluteJoint(oTorso.body, oLeftArm.body, INFOS_LEFTSHOULDER.bodyAX, INFOS_LEFTSHOULDER.bodyAY, INFOS_LEFTSHOULDER.bodyBX, INFOS_LEFTSHOULDER.bodyBY, INFOS_LEFTSHOULDER.angle, INFOS_LEFTSHOULDER.enablelimit, INFOS_LEFTSHOULDER.lowerangle, INFOS_LEFTSHOULDER.upperangle);
        var oRightShoulder = this.addRevoluteJoint(oTorso.body,oRightArm.body, INFOS_RIGHTSHOULDER.bodyAX, INFOS_RIGHTSHOULDER.bodyAY, INFOS_RIGHTSHOULDER.bodyBX, INFOS_RIGHTSHOULDER.bodyBY, INFOS_RIGHTSHOULDER.angle, INFOS_RIGHTSHOULDER.enablelimit, INFOS_RIGHTSHOULDER.lowerangle, INFOS_RIGHTSHOULDER.upperangle);
        var oLeftPelvis = this.addRevoluteJoint(oTorso.body,oLeftTopLeg.body, INFOS_LEFTPELVIS.bodyAX, INFOS_LEFTPELVIS.bodyAY, INFOS_LEFTPELVIS.bodyBX, INFOS_LEFTPELVIS.bodyBY, INFOS_LEFTPELVIS.angle, INFOS_LEFTPELVIS.enablelimit, INFOS_LEFTPELVIS.lowerangle, INFOS_LEFTPELVIS.upperangle);
        var oRightPelvis = this.addRevoluteJoint(oTorso.body,oRightTopLeg.body, INFOS_RIGHTPELVIS.bodyAX, INFOS_RIGHTPELVIS.bodyAY, INFOS_RIGHTPELVIS.bodyBX, INFOS_RIGHTPELVIS.bodyBY, INFOS_RIGHTPELVIS.angle, INFOS_RIGHTPELVIS.enablelimit, INFOS_RIGHTPELVIS.lowerangle, INFOS_RIGHTPELVIS.upperangle);
        var oNeck = this.addRevoluteJoint(oTorso.body,oHead.body, INFOS_NECK.bodyAX, INFOS_NECK.bodyAY, INFOS_NECK.bodyBX, INFOS_NECK.bodyBY, INFOS_NECK.angle, INFOS_NECK.enablelimit, INFOS_NECK.lowerangle, INFOS_NECK.upperangle);
        var oRightKnee = this.addRevoluteJoint(oRightTopLeg.body,oRightBottomLeg.body,INFOS_RIGHTKNEE.bodyAX, INFOS_RIGHTKNEE.bodyAY, INFOS_RIGHTKNEE.bodyBX, INFOS_RIGHTKNEE.bodyBY, INFOS_RIGHTKNEE.angle, INFOS_RIGHTKNEE.enablelimit, INFOS_RIGHTKNEE.lowerangle, INFOS_RIGHTKNEE.upperangle);
        var oLeftKnee = this.addRevoluteJoint(oLeftTopLeg.body,oLeftBottomLeg.body,INFOS_LEFTKNEE.bodyAX, INFOS_LEFTKNEE.bodyAY, INFOS_LEFTKNEE.bodyBX, INFOS_LEFTKNEE.bodyBY, INFOS_LEFTKNEE.angle, INFOS_LEFTKNEE.enablelimit, INFOS_LEFTKNEE.lowerangle, INFOS_LEFTKNEE.upperangle);
        var oRightAnkle = this.addRevoluteJoint(oRightFoot.body,oRightBottomLeg.body,INFOS_RIGHTANKLE.bodyAX, INFOS_RIGHTANKLE.bodyAY, INFOS_RIGHTANKLE.bodyBX, INFOS_RIGHTANKLE.bodyBY, INFOS_RIGHTANKLE.angle, INFOS_RIGHTANKLE.enablelimit, INFOS_RIGHTANKLE.lowerangle, INFOS_RIGHTANKLE.upperangle);
        var oLeftAnkle = this.addRevoluteJoint(oLeftFoot.body,oLeftBottomLeg.body,INFOS_LEFTANKLE.bodyAX, INFOS_LEFTANKLE.bodyAY, INFOS_LEFTANKLE.bodyBX, INFOS_LEFTANKLE.bodyBY, INFOS_LEFTANKLE.angle, INFOS_LEFTANKLE.enablelimit, INFOS_LEFTANKLE.lowerangle, INFOS_LEFTANKLE.upperangle);
        
        // ADD PLAYER CLASS
        var oPlayerPhysic = {torso: oTorso, head: oHead, leftArm: oLeftArm, rightArm: oRightArm,
                             leftTopLeg: oLeftTopLeg, leftBottomLeg: oLeftBottomLeg, 
                             rightTopLeg: oRightTopLeg, rightBottomLeg: oRightBottomLeg,
                             rightFoot: oRightFoot, leftFoot: oLeftFoot,
                             leftShoulder: oLeftShoulder, rightShoulder: oRightShoulder,
                             leftPelvis: oLeftPelvis, rightPelvis: oRightPelvis,
                             neck: oNeck, rightKnee: oRightKnee, leftKnee: oLeftKnee,
                             rightAnkle: oRightAnkle, leftAnkle: oLeftAnkle };
        var oPlayer = new CPlayer(oPlayerPhysic, oContainer);        
        return oPlayer;
    };
    
    this.addTrampolinePhysics = function(){
        var aPhysics = [];
        // ADD TRAMPOLINES
        var oTopTrampoline = this.addNewObject(INFOS_TOPTRAMPOLINE.type,INFOS_TOPTRAMPOLINE.x[s_iLevel],INFOS_TOPTRAMPOLINE.y[s_iLevel],
            INFOS_TOPTRAMPOLINE.angle,INFOS_TOPTRAMPOLINE.issensor,INFOS_TOPTRAMPOLINE.category,
            INFOS_TOPTRAMPOLINE.vertices,INFOS_TOPTRAMPOLINE.maskbits,INFOS_TOPTRAMPOLINE.userdata);
        aPhysics.push(oTopTrampoline);
        var oMiddleTrampoline = this.addNewObject(INFOS_MIDDLETRAMPOLINE.type,INFOS_MIDDLETRAMPOLINE.x[s_iLevel],INFOS_MIDDLETRAMPOLINE.y[s_iLevel],
            INFOS_MIDDLETRAMPOLINE.angle,INFOS_MIDDLETRAMPOLINE.issensor,INFOS_MIDDLETRAMPOLINE.category,
            INFOS_MIDDLETRAMPOLINE.vertices,INFOS_MIDDLETRAMPOLINE.maskbits,INFOS_MIDDLETRAMPOLINE.userdata);
        aPhysics.push(oMiddleTrampoline);
        var oBottomTrampoline = this.addNewObject(INFOS_BOTTOMTRAMPOLINE.type,INFOS_BOTTOMTRAMPOLINE.x[s_iLevel],INFOS_BOTTOMTRAMPOLINE.y[s_iLevel],
            INFOS_BOTTOMTRAMPOLINE.angle,INFOS_BOTTOMTRAMPOLINE.issensor,INFOS_BOTTOMTRAMPOLINE.category,
            INFOS_BOTTOMTRAMPOLINE.vertices,INFOS_BOTTOMTRAMPOLINE.maskbits,INFOS_BOTTOMTRAMPOLINE.userdata);
        aPhysics.push(oBottomTrampoline);
        
        return aPhysics;
    };

    this.addFloor = function(){
        // ADD WATER
        var oWaterFloorPhysic = this.addNewObject(INFOS_WATER.type,INFOS_WATER.x,INFOS_WATER.y,INFOS_WATER.angle,
            INFOS_WATER.issensor,INFOS_WATER.category,INFOS_WATER.vertices,INFOS_WATER.maskbits,INFOS_WATER.userdata);
    };
    
    this.addNewCircle = function(iType,iX,iY,iAngle,iRadius,bSensor,iCategory,iMaskBits,iUserData){
        //Body Creation
	var oBodyDef = new b2BodyDef;
        if (iType === STATIC_BODY) {
            oBodyDef.type = b2Body.b2_staticBody;
        } else {
            oBodyDef.type = b2Body.b2_dynamicBody;
        }
	oBodyDef.position.Set(iX,iY);
	oBodyDef.angle = iAngle;
	oBodyDef.linearVelocity.Set(0,0);
	oBodyDef.angularVelocity = 0;
	oBodyDef.linearDamping = 0;
	oBodyDef.angularDamping = 0;
	oBodyDef.allowSleep = true;
	oBodyDef.fixedRotation = false;
	oBodyDef.bullet = false;
	oBodyDef.active = true;
	var oBody = _oWorld.CreateBody(oBodyDef);

        //Fixture Creation
        var oFixtureDef = new b2FixtureDef;
	oFixtureDef.friction = 0.2;
	oFixtureDef.restitution = 0.5;
	oFixtureDef.density = 1;
	oFixtureDef.isSensor = bSensor;
	oFixtureDef.filter.categoryBits = iCategory;
	oFixtureDef.filter.maskBits = iMaskBits;
	oFixtureDef.filter.groupIndex = 0;
        oFixtureDef.userData = iUserData;
                
        //Polygon Shape Creation
	oFixtureDef.shape = new b2CircleShape;
        oFixtureDef.shape.m_p.Set(0, 0);
        oFixtureDef.shape.m_radius = iRadius;
	var oFixture = oBody.CreateFixture(oFixtureDef);
        
        return {body: oBody, fixture: oFixture};
    };
    
    this.addNewObject = function(iType,iX,iY,iAngle,bSensor,iCategory,aVertices,iMaskBits,iUserData){
        //Body Creation
	var oBodyDef = new b2BodyDef;
        if (iType === STATIC_BODY) {
            oBodyDef.type = b2Body.b2_staticBody;
        } else {
            oBodyDef.type = b2Body.b2_dynamicBody;
        }
	oBodyDef.position.Set(iX,iY);
	oBodyDef.angle = iAngle;
	oBodyDef.linearVelocity.Set(0,0);
	oBodyDef.angularVelocity = 0;
	oBodyDef.linearDamping = 0;
	oBodyDef.angularDamping = 0;
	oBodyDef.allowSleep = true;
	oBodyDef.fixedRotation = false;
	oBodyDef.bullet = false;
	oBodyDef.active = true;
	var oBody = _oWorld.CreateBody(oBodyDef);

        //Fixture Creation
        var oFixtureDef = new b2FixtureDef;
	oFixtureDef.friction = 0.2;
	oFixtureDef.restitution = 0.5;
	oFixtureDef.density = 1;
	oFixtureDef.isSensor = bSensor;
	oFixtureDef.filter.categoryBits = iCategory;
	oFixtureDef.filter.maskBits = iMaskBits;
	oFixtureDef.filter.groupIndex = 0;
        oFixtureDef.userData = iUserData;

        //Polygon Shape Creation
	oFixtureDef.shape = new b2PolygonShape;
        oFixtureDef.shape.SetAsArray(aVertices, 4);
	var oFixture = oBody.CreateFixture(oFixtureDef);
        
        return {body: oBody, fixture: oFixture};
    };
    
    this.addRectangle = function(iWidth,iHeight,iX,iY,iAngle,density,friction,restitution,iType,iFixtureID) {
        var oBodyDef = new b2BodyDef;
        switch(iType){
            case DYNAMIC_BODY: {
                oBodyDef.type = b2Body.b2_dynamicBody;
                break;
            }
            case STATIC_BODY: {
                oBodyDef.type = b2Body.b2_staticBody;
                break;
            }
            case KINEMATIC_BODY: {
                oBodyDef.type = b2Body.b2_kinematicBody;
                break;
            }
        };

        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.shape.SetAsBox(iWidth/WORLD_SCALE, iHeight/WORLD_SCALE);
        oFixDef.userData = {id:iFixtureID};
        
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;
        var oBody = _oWorld.CreateBody(oBodyDef);
        oBody.CreateFixture(oFixDef);        
        return oBody;
    };
    
    this.addRevoluteJoint = function(oBodyA,oBodyB,iBodyAPosX,iBodyAPosY,iBodyBPosX,iBodyBPosY,iRefAngle,bEnableLimit,iLowerAngle,iUpperAngle){
        var oRevolJoint = new b2RevoluteJointDef;
        oRevolJoint.localAnchorA.x = iBodyAPosX;
        oRevolJoint.localAnchorA.y = iBodyAPosY;
        oRevolJoint.localAnchorB.x = iBodyBPosX;
        oRevolJoint.localAnchorB.y = iBodyBPosY;
        oRevolJoint.referenceAngle = iRefAngle;
        oRevolJoint.enableLimit = bEnableLimit;
        oRevolJoint.lowerAngle = iLowerAngle;
        oRevolJoint.upperAngle = iUpperAngle;
        oRevolJoint.enableMotor = false;
        oRevolJoint.motorSpeed = 0;
        oRevolJoint.maxMotorTorque = 0;
        oRevolJoint.bodyA = oBodyA;
        oRevolJoint.bodyB = oBodyB;
        oRevolJoint.collideConnected = false;
        oRevolJoint = _oWorld.CreateJoint(oRevolJoint);
        return oRevolJoint;
    };
    
    this.addMouseJoint = function(oBodyB,oTargetPos,bCollideConnected,iMaxForceVar,iDampingRatio){
        var oBodyDef = new b2BodyDef();
        var oGround = _oWorld.CreateBody(oBodyDef);
        
        var oJointDef = new b2MouseJointDef();
        oJointDef.bodyA = oGround;
        oJointDef.bodyB = oBodyB;
        oJointDef.target = oTargetPos;
        oJointDef.collideConnected = bCollideConnected;
        oJointDef.maxForce = iMaxForceVar * oBodyB.GetMass();
        oJointDef.dampingRatio = iDampingRatio;

        var oMouseJoint = _oWorld.CreateJoint(oJointDef);
        oBodyB.SetAwake(true);        
        
        return oMouseJoint;
    };
    
    this.init();
}
