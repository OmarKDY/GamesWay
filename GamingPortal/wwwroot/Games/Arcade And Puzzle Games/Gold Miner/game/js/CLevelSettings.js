function CLevelSettings(){
    
    var _aNuggetPos;
    var _aNuggetInfo;
    var _aMalusPos;
    var _aLevelTarget;
    
    this._init = function(){
        _aNuggetPos = new Array();
        _aNuggetInfo = new Array();
        _aMalusPos = new Array();
        
        //LEVEL 1
        var aNuggets = [{x:388,y:470},{x:638,y:250},{x:738,y:350},{x:838,y:550},{x:1058,y:600},{x:1138,y:460},{x:1238,y:680}];
        _aNuggetPos.push(aNuggets);
        var aInfos = [{type:1,scale:1},{type:2,scale:0.5},{type:2,scale:0.5},{type:2,scale:0.6},{type:3,scale:0.4},{type:3,scale:0.7},{type:4,scale:1}];
        _aNuggetInfo.push(aInfos);
        var aMalus = [{x:938,y:400}];
        _aMalusPos.push(aMalus);
        
        //LEVEL 2
        aNuggets = [{x:1048,y:580},{x:368,y:350},{x:738,y:380},{x:438,y:550},{x:1248,y:600},{x:868,y:680},{x:1168,y:370}];
        _aNuggetPos.push(aNuggets);
        aInfos = [{type:1,scale:0.5},{type:2,scale:0.6},{type:2,scale:0.4},{type:2,scale:0.3},{type:3,scale:1},{type:3,scale:0.7},{type:4,scale:0.8}];
        _aNuggetInfo.push(aInfos);
        aMalus = [{x:608,y:400}];
        _aMalusPos.push(aMalus);
        
        //LEVEL 3
        aNuggets = [{x:948,y:350},{x:768,y:300},{x:538,y:390},{x:338,y:450},{x:488,y:550},{x:1188,y:500},{x:1038,y:650}];
        _aNuggetPos.push(aNuggets);
        aInfos = [{type:1,scale:0.5},{type:2,scale:0.6},{type:2,scale:0.4},{type:2,scale:0.3},{type:3,scale:1},{type:3,scale:0.7},{type:4,scale:0.8}];
        _aNuggetInfo.push(aInfos);
        aMalus = [{x:1138,y:300}];
        _aMalusPos.push(aMalus);
        
        //LEVEL 4
        aNuggets = [{x:748,y:550},{x:568,y:600},{x:938,y:390},{x:1038,y:450},{x:1188,y:550},{x:1238,y:300},{x:1038,y:650}];
        _aNuggetPos.push(aNuggets);
        aInfos = [{type:1,scale:0.5},{type:2,scale:0.6},{type:2,scale:0.4},{type:2,scale:0.3},{type:3,scale:1},{type:3,scale:0.7},{type:4,scale:0.8}];
        _aNuggetInfo.push(aInfos);
        aMalus = [{x:688,y:500}];
        _aMalusPos.push(aMalus);
        
        
        //INIT ALL LEVEL TARGET
        _aLevelTarget = new Array();
        
        //TARGET LEVEL 1
        _aLevelTarget.push(2000);
        //TARGET LEVEL 2
        _aLevelTarget.push(7000);
        //TARGET LEVEL 3
        _aLevelTarget.push(11000);
        //TARGET LEVEL 4
        _aLevelTarget.push(15000);
    };
    
    this.getNuggetPosInLevel = function(iLevel){
        return _aNuggetPos[iLevel-1];
    };
    
    this.getNuggetInfoInLevel = function(iLevel){
        return _aNuggetInfo[iLevel-1];
    };

    this.getMalusPosInLevel = function(iLevel){
        return _aMalusPos[iLevel-1];
    };
    
    this.getLevelTarget = function(iLevel){
        return _aLevelTarget[iLevel-1];
    };
    
    this.getNumLevels = function(){
        return _aLevelTarget.length;
    };

    this._init();
}