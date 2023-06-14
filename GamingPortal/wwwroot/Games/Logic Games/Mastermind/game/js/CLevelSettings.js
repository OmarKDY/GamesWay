function CLevelSettings (){
    var _oData;
    var _iCurrentLevel;
    var _iSavedLevel;
    
    this.init = function(){
        _iCurrentLevel = 0;
        _oData = [{"num_pieces":4,
                    "num_rows": 10,
                    "num_cols": 4},

                   {"num_pieces":5,
                    "num_rows": 10,
                    "num_cols": 4},

                   {
                  "num_pieces":5,
                  "num_rows": 9,
                  "num_cols": 5},

                  {"num_pieces":6,
                  "num_rows": 11,
                  "num_cols": 5},

                  {"num_pieces":6,
                  "num_rows": 9,
                  "num_cols": 6},

                  {
                  "num_pieces":6,
                  "num_rows": 7,
                  "num_cols": 6},

                  {"num_pieces":8,
                  "num_rows": 13,
                  "num_cols": 6},

                  {"num_pieces":7,
                  "num_rows": 9,
                  "num_cols": 7},

                  {"num_pieces":8,
                  "num_rows": 15,
                  "num_cols": 5},

                  {"num_pieces":8,
                  "num_rows": 11,
                  "num_cols": 7},

                  {
                  "num_pieces":8,
                  "num_rows": 9,
                  "num_cols": 7},

                  {"num_pieces":8,
                  "num_rows": 9,
                  "num_cols": 7},

                  {"num_pieces":8,
                  "num_rows": 11,
                  "num_cols": 5},

                  {"num_pieces":8,
                  "num_rows": 12,
                  "num_cols": 4},

                  {"num_pieces":8,
                  "num_rows": 14,
                  "num_cols": 3}];
        s_oLevelSettings = this;
        if (getItem("level_mastermind")===null||getItem("level_mastermind")==="undefined"){
            _iSavedLevel = 0;
        }else{
            _iSavedLevel = getItem("level_mastermind");
        }
    };
    
    this.loadLevel = function(iLevel){
        _iCurrentLevel = iLevel;
        NUM_PIECES = _oData[iLevel].num_pieces;
        NUM_ROWS = _oData[iLevel].num_rows;
        NUM_COLS = _oData[iLevel].num_cols;
    };
    
    this.nextLevel = function(){
       if (_iCurrentLevel<_oData.length){
           _iCurrentLevel++;
           this.loadLevel(_iCurrentLevel);
       } 
    };
    
    this.saveLevel = function(){
        if (_iSavedLevel<_iCurrentLevel+1){
                saveItem("level_mastermind",_iCurrentLevel+1);
            }
    };
    
    this.getNextLevel = function(){
       if (_iCurrentLevel<_oData.length){
            return _iCurrentLevel+2;
       }else{
           return _iCurrentLevel+1;
       }
    };
    
    this.getCurrentLevel = function(){
       return _iCurrentLevel; 
    };
    
    this.getNumLevel = function(){
       return _oData.length; 
    };
    
    this.init();
}

s_oLevelSettings = null;