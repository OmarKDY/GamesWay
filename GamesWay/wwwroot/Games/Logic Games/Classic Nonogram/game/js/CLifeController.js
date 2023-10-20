function CLifeController(oParentContainer, iX, iY,szLevel){

    var _oParentContainer = oParentContainer;
    var _oContainer;

    var _aHearts;
    var _oLevelText;

    this._init = function(iX, iY, szLevel){
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oSprite = s_oSpriteLibrary.getSprite("heart");
        var oData = {   
            images: [oSprite], 
            // width, height & registration point of each sprite
            frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
            animations: {state_true:0,state_false:1}
       };
       
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _aHearts = new Array();
        
        for(var i=0; i<NUM_LIVES; i++){
            var oHeart = createSprite(oSpriteSheet, "state_true",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
            oHeart.stop();
            oHeart.x = oHeart.getBounds().width/2+(oHeart.getBounds().width*i);
            oHeart.y = oHeart.getBounds().height/2+50;
            _aHearts.push(oHeart);
            _oContainer.addChild(_aHearts[i]);
        }

        _oLevelText = new CTLText(_oContainer, 
            0,0, _oContainer.getBounds().width, 50, 
            40, "center", COLOR_1, FONT, 1,
            0, 0,
            szLevel,
            true, true, false,
            false);

        _oContainer.regX = _oContainer.getBounds().width/2;
        _oContainer.regY = 0;
        _oContainer.x = iX;
        _oContainer.y = iY;
    }

    this.decrease = function(iLives){
        createjs.Tween.get(_aHearts[iLives])
        .to({scale:0.1}, 300, createjs.Ease.bounceOut)
        .call(function(){
            _aHearts[iLives].gotoAndStop("state_false");
            createjs.Tween.get(_aHearts[iLives])
            .to({scale:1}, 300, createjs.Ease.bounceOut)
        })
    }

    this.increase = function(iLives){
        _aHearts[iLives].gotoAndStop("state_true");
    }

    this.refreshScale = function(){
        _oContainer.scale = CUR_INTERFACE_SCALE;
    }

    this.reset = function(){
        _aHearts.forEach(element => {
            element.gotoAndStop("state_true");
        });
    }
    
    this.setX = function(iNewX){
        _oContainer.x = iNewX;
    }

    this.setY = function(iNewY){
        _oContainer.y = iNewY;
    }

    this.getHeight = function(){
        return _oContainer.getBounds().height;
    };

    this.refreshText = function(szText){
        _oLevelText.refreshText(szText);
    }

    this._init(iX, iY,szLevel);
}