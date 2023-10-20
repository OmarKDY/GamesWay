function CLevelSettings(){
    var _aLevelsTime;           // HOW MANY SECONDS WILL THE LEVEL START WITH
    var _aLevelsMinimumGoal;    // HOW MANY SQUARES THE WATER WILL HAVE TO PASS
    var _aLevelNum;             // HOW MANY LEVELS THE GAME HAVE

    this._init = function(){
        _aLevelsTime = START_TIME;
        _aLevelsMinimumGoal = LEVEL_GOAL;
        _aLevelNum = [];
        _aLevelNum.length = _aLevelsTime.length;
    };

    this.getLevelGoal = function(iLevel){
        return _aLevelsMinimumGoal[iLevel];
    };
    
    this.getStartTime = function(iLevel){
        return _aLevelsTime[iLevel];
    };

    this.getNumLevels = function(){
        return _aLevelNum.length;
    };

    this._init();
    
    s_oLevelSettings = this;
};

var s_oLevelSettings;