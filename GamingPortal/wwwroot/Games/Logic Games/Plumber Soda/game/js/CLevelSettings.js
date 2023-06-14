function CLevelSettings (oData){
    var _oData;
    var _iCurrentLevel;
    
    this.init = function(oData){
        _iCurrentLevel = 0;
        _oData = oData;
        NUM_LEVELS = Object.keys(_oData).length;
        s_oLevelSettings = this;
    };
    
    this.loadLevel = function(iLevel){
        _iCurrentLevel = iLevel;
        MOVES_INFO = _oData[iLevel].moves;
        PIECES_SOLUTION = _oData[iLevel].pieces_solution;
        EXTRA_PIECES = _oData[iLevel].extra_pieces;
    };
    
    this.nextLevel = function(){
        if (_iCurrentLevel < _oData.length){
            _iCurrentLevel++;
            this.loadLevel(_iCurrentLevel);
        } 
    };
    
    this.getNextLevel = function(){
        if (_iCurrentLevel < _oData.length){
             return _iCurrentLevel+2;
        } else {
            return _iCurrentLevel+1;
        }
    };
    
    this.getCurrentLevel = function(){
        return _iCurrentLevel; 
    };
    
    this.getNumLevel = function(){
        return _oData.length; 
    };

    
    this.init(oData);
}

s_oLevelSettings = null;