function CPhysicObjectsCreator(oWorld){
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

    var _oWorld;

    this.init = function(){
        _oWorld = oWorld;
    };
    
    this.addFloor = function(){
        var iFloorWidth = CANVAS_WIDTH;
        var iFloorHeight = 22;
        var oFloorBody = this.addRectangle(STATIC_BODY,CANVAS_WIDTH_HALF,CANVAS_HEIGHT-20,iFloorWidth,iFloorHeight,0,FLOOR_DENSITY,FLOOR_FRICTION,FLOOR_RESTITUTION,FLOOR_FIXTURE);
        return oFloorBody;
    };
    
    this.addPlayer = function(iLevel, oContainer) {
        var oPlayerBody = this.addCircle(STATIC_BODY,PLAYER_RADIUS,PLAYER_POSITION[iLevel].x,PLAYER_POSITION[iLevel].y,1,1,1,PLAYER_FIXTURE,99,true);
        var oPlayer = new CPlayer(iLevel, oContainer);
        return oPlayer;
    };
    
    this.addCoin = function(oPos, iID, oContainer){
        // ADD A NEW PHYSIC COIN
        var oCoinBody = this.addCircle(STATIC_BODY,COIN_RADIUS,oPos.x,oPos.y,COIN_DENSITY,COIN_FRICTION,COIN_RESTITUTION,COIN_FIXTURE,iID,true);
        var oCoin = new CCoin(oCoinBody, iID, oContainer);
        return oCoin;
    };

    this.addStone = function(oPos, oContainer){
        // ADD A NEW PHYSIC COIN
        var oStoneBody = this.addCircle(DYNAMIC_BODY,STONE_RADIUS,oPos.x,oPos.y,STONE_DENSITY,STONE_FRICTION,STONE_RESTITUTION,STONE_FIXTURE,0,false);
        var oStone = new CStone(oStoneBody, oContainer);
        return oStone;
    };

    this.addBall = function(oPos, oContainer){
        var oBallBody = this.addCircle(DYNAMIC_BODY,BALL_RADIUS,oPos.x,oPos.y,BALL_DENSITY,BALL_FRICTION,BALL_RESTITUTION,BALL_FIXTURE,0,false);
        var oBall = new CBall(oBallBody, oContainer);
        return oBall;
    };
    
    this.addBlock = function(oData, oContainer){
        var oBlockBody;
        if (oData.wood === true) {
            // WOOD BLOCKS
            oBlockBody = this.addRectangle(oData.type,oData.x,oData.y,WOOD_BLOCK_WIDTH,WOOD_BLOCK_HEIGHT,oData.angle,WOOD_DENSITY,WOOD_FRICTION,WOOD_RESTITUTION,WOOD_FIXTURE);
        } else {
            // STONE BLOCKS
            var iWidth;
            var iHeight;
            if (oData.breakable) {
                iWidth = STONE_BLOCK_WIDTH;
                iHeight = STONE_BLOCK_HEIGHT;
            } else {
                iWidth = STONE_UNBREAKABLE_BLOCK_WIDTH;
                iHeight = STONE_UNBREAKABLE_BLOCK_HEIGHT;
            }
            
            oBlockBody = this.addRectangle(oData.type,oData.x,oData.y,iWidth,iHeight,oData.angle,BLOCK_DENSITY,BLOCK_FRICTION,BLOCK_RESTITUTION,BLOCK_FIXTURE);
        };
        
        var oBlock = new CBlock(oBlockBody, oData, oContainer);
        return oBlock;
    };
    /*
    this.addPolygon = function(aPoints,iX,iY,iAngle,density,friction,restitution,iType,filter,id) {
        var oBodyDef = new b2BodyDef;        
        oBodyDef.type = b2Body.b2_dynamicBody;
        if (iType === STATIC_BODY) {
            oBodyDef.type = b2Body.b2_staticBody;            
        }
        oBodyDef.allowSleep = false;
        oBodyDef.bullet = true;
        
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.filter.groupIndex = filter;
        oFixDef.userData = {id:id};
        
        var points = [];
        for (var i = 0; i < aPoints.length; i++) {
            var vec = new b2Vec2();            
            vec.Set(aPoints[i].x/WORLD_SCALE, aPoints[i].y/WORLD_SCALE);
            points.push(vec);
        }
        oFixDef.shape.SetAsArray(points, points.length);
        
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;
        
        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        //oCrateFixture.GetBody().SetActive(false);
        return oCrateFixture;
    };
    */
    this.addRectangle = function(iType,iX,iY,iWidth,iHeight,iAngle,density,friction,restitution,idFixture) {
        var oBodyDef = new b2BodyDef;
        oBodyDef.type = b2Body.b2_dynamicBody;
        if (iType === STATIC_BODY) {
            oBodyDef.type = b2Body.b2_staticBody;
        }

        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
        oFixDef.shape = new b2PolygonShape;
        oFixDef.shape.SetAsBox(iWidth/WORLD_SCALE, iHeight/WORLD_SCALE);
        oFixDef.userData = {id:idFixture};
        
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        oBodyDef.angle = iAngle*Math.PI/180;
        
        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        //oCrateFixture.GetBody().SetActive(false);
        return oBody;
    };
    
    this.addCircle = function(iType,iRadius,iX,iY,density,friction,restitution,fixture,id,bSensor) {
        var oBodyDef = new b2BodyDef;
        oBodyDef.type = b2Body.b2_dynamicBody;
        if (iType === STATIC_BODY) {
            oBodyDef.type = b2Body.b2_staticBody;
        }
        oBodyDef.bullet = true;
        
        var oFixDef = new b2FixtureDef;
        oFixDef.density = density;
        oFixDef.friction = friction;
        oFixDef.restitution = restitution;
	//oFixDef.filter.groupIndex = -1; // NOT COLLIDING!
        oFixDef.isSensor = bSensor;
        oFixDef.shape = new b2CircleShape(iRadius/WORLD_SCALE);        
        oFixDef.userData = {fixture:fixture,id:id};
        
        oBodyDef.position.Set(iX/WORLD_SCALE, iY/WORLD_SCALE);
        
        var oBody = _oWorld.CreateBody(oBodyDef);
        var oCrateFixture = oBody.CreateFixture(oFixDef);
        //oBody.SetActive(false);
        return oBody;
   };
   
    this.init();
}
