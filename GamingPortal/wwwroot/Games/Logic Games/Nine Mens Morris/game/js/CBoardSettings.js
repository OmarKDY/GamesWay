function CBoardSettings(){
    
    var _aPosPoints;
    var _aMillsList;
    var _aMillInfo;
    var _aAdjacentPoints;
    var _aMillsPerPoint;
    
    this._init = function(){
        _aPosPoints = new Array();
        _aPosPoints[0] = {x:93,y:94};
        _aPosPoints[1] = {x:298,y:94};
        _aPosPoints[2] = {x:503,y:94};
        _aPosPoints[3] = {x:161,y:162};
        _aPosPoints[4] = {x:298,y:162};
        _aPosPoints[5] = {x:435,y:162};
        _aPosPoints[6] = {x:230,y:231};
        _aPosPoints[7] = {x:298,y:231};
        _aPosPoints[8] = {x:366,y:231};
        _aPosPoints[9] = {x:93,y:299};
        _aPosPoints[10] = {x:161,y:299};
        _aPosPoints[11] = {x:230,y:299};
        _aPosPoints[12] = {x:366,y:299};
        _aPosPoints[13] = {x:435,y:299};
        _aPosPoints[14] = {x:503,y:299};
        _aPosPoints[15] = {x:230,y:367};
        _aPosPoints[16] = {x:298,y:367};
        _aPosPoints[17] = {x:366,y:367};
        _aPosPoints[18] = {x:161,y:435};
        _aPosPoints[19] = {x:298,y:435};
        _aPosPoints[20] = {x:435,y:435};
        _aPosPoints[21] = {x:93,y:503};
        _aPosPoints[22] = {x:298,y:503};
        _aPosPoints[23] = {x:503,y:503};
        
        
        _aMillsList = new Array();
        _aMillsList[0] = [0,1,2];
        _aMillsList[1] = [0,9,21];
        _aMillsList[2] = [1,4,7];
        _aMillsList[3] = [2,14,23];
        _aMillsList[4] = [3,4,5];
        _aMillsList[5] = [3,10,18];
        _aMillsList[6] = [5,13,20];
        _aMillsList[7] = [6,7,8];
        _aMillsList[8] = [6,11,15];
        _aMillsList[9] = [8,12,17];
        _aMillsList[10] = [9,10,11];
        _aMillsList[11] = [12,13,14];
        _aMillsList[12] = [15,16,17];
        _aMillsList[13] = [16,19,22];
        _aMillsList[14] = [18,19,20];
        _aMillsList[15] = [21,22,23];
        
        _aMillInfo = new Array();
        _aMillInfo[0] = {x:82,y:82,type:0,rot:0}
        _aMillInfo[1] = {x:105,y:82,type:0,rot:90};
        _aMillInfo[2] = {x:310,y:82,type:2,rot:90};
        _aMillInfo[3] = {x:514,y:82,type:0,rot:90};
        _aMillInfo[4] = {x:146,y:151,type:1,rot:0};
        _aMillInfo[5] = {x:173,y:150,type:1,rot:90};
        _aMillInfo[6] = {x:447,y:150,type:1,rot:90};
        _aMillInfo[7] = {x:221,y:220,type:2,rot:0};
        _aMillInfo[8] = {x:241,y:220,type:2,rot:90};
        _aMillInfo[9] = {x:378,y:220,type:2,rot:90};
        _aMillInfo[10] = {x:82,y:287,type:2,rot:0};
        _aMillInfo[11] = {x:354,y:287,type:2,rot:0};
        _aMillInfo[12] = {x:221,y:355,type:2,rot:0};
        _aMillInfo[13] = {x:309,y:355,type:2,rot:90};
        _aMillInfo[14] = {x:146,y:425,type:1,rot:0};
        _aMillInfo[15] = {x:82,y:492,type:0,rot:0};
        
        
        _aAdjacentPoints = new Array();
        _aAdjacentPoints[0] = [1,9];
        _aAdjacentPoints[1] = [0,2,4];
        _aAdjacentPoints[2] = [1,14];
        _aAdjacentPoints[3] = [4,10];
        _aAdjacentPoints[4] = [1,3,5,7];
        _aAdjacentPoints[5] = [4,13];
        _aAdjacentPoints[6] = [7,11];
        _aAdjacentPoints[7] = [4,6,8];
        _aAdjacentPoints[8] = [7,12];
        _aAdjacentPoints[9] = [0,10,21];
        _aAdjacentPoints[10] = [3,9,11,18];
        _aAdjacentPoints[11] = [6,10,15];
        _aAdjacentPoints[12] = [8,13,17];
        _aAdjacentPoints[13] = [5,12,14,20];
        _aAdjacentPoints[14] = [2,13,23];
        _aAdjacentPoints[15] = [11,16];
        _aAdjacentPoints[16] = [15,17,19];
        _aAdjacentPoints[17] = [12,16];
        _aAdjacentPoints[18] = [10,19];
        _aAdjacentPoints[19] = [16,18,20,22];
        _aAdjacentPoints[20] = [13,19];
        _aAdjacentPoints[21] = [9,22];
        _aAdjacentPoints[22] = [19,21,23];
        _aAdjacentPoints[23] = [14,22];
        
        
        _aMillsPerPoint = new Array();
        _aMillsPerPoint[0] = [0,1];
        _aMillsPerPoint[1] = [0,2];
        _aMillsPerPoint[2] = [0,3];
        _aMillsPerPoint[3] = [4,5];
        _aMillsPerPoint[4] = [2,4];
        _aMillsPerPoint[5] = [4,6];
        _aMillsPerPoint[6] = [7,8];
        _aMillsPerPoint[7] = [2,7];
        _aMillsPerPoint[8] = [7,9];
        _aMillsPerPoint[9] = [1,10];
        _aMillsPerPoint[10] = [5,10];
        _aMillsPerPoint[11] = [8,10];
        _aMillsPerPoint[12] = [9,11];
        _aMillsPerPoint[13] = [6,11];
        _aMillsPerPoint[14] = [3,11];
        _aMillsPerPoint[15] = [8,12];
        _aMillsPerPoint[16] = [12,13];
        _aMillsPerPoint[17] = [9,12];
        _aMillsPerPoint[18] = [5,14];
        _aMillsPerPoint[19] = [13,14];
        _aMillsPerPoint[20] = [6,14];
        _aMillsPerPoint[21] = [1,15];
        _aMillsPerPoint[22] = [13,15];
        _aMillsPerPoint[23] = [3,15];
    };
    
    this.getAllPointPos = function(){
        return _aPosPoints;
    };
    
    this.getPointPos = function(iIndex){
        return _aPosPoints[iIndex];
    };
    
    this.getMillList = function(){
        return _aMillsList;
    };
    
    this.getMillListPerIndex = function(iIndex){
        return _aMillsList[iIndex];
    };
    
    this.getMillInfos = function(){
        return _aMillInfo;
    };
    
    this.getAdjacentsPerPoint = function(iIndex){
        return _aAdjacentPoints[iIndex];
    };
    
    this.getPossibleMillsPerPoint = function(iIndex){
        return _aMillsPerPoint[iIndex];
    };
    
    this._init();
}

var s_oBoardSettings;
