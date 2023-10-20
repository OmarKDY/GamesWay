function CLevelSettings(){
    
    var _aEnemiesToSpawn;
    var _aEnemySpawnTime;
    var _aEnemySpawnNumber;
    
    
    this._init = function(){
        _aEnemiesToSpawn = new Array();
        _aEnemiesToSpawn[0] = 20;
        _aEnemiesToSpawn[1] = 30;
        _aEnemiesToSpawn[2] = 40;
        _aEnemiesToSpawn[3] = 50;
        _aEnemiesToSpawn[4] = 60;   
        _aEnemiesToSpawn[5] = 70;
        _aEnemiesToSpawn[6] = 80;
        _aEnemiesToSpawn[7] = 80;
        _aEnemiesToSpawn[8] = 90;
        _aEnemiesToSpawn[9] = 90;
        _aEnemiesToSpawn[10] = 100;
        _aEnemiesToSpawn[11] = 100;
        
        
        _aEnemySpawnTime = new Array();
        _aEnemySpawnTime[0] = 1300;
        _aEnemySpawnTime[1] = 1100;
        _aEnemySpawnTime[2] = 900;
        _aEnemySpawnTime[3] = 800;
        _aEnemySpawnTime[4] = 800;
        _aEnemySpawnTime[5] = 700;
        _aEnemySpawnTime[6] = 700;
        _aEnemySpawnTime[7] = 600;
        _aEnemySpawnTime[8] = 600;
        _aEnemySpawnTime[9] = 500;
        _aEnemySpawnTime[10] = 500;        
        _aEnemySpawnTime[11] = 400;
        
        
        _aEnemySpawnNumber = new Array();
        _aEnemySpawnNumber[0] = 1;
        _aEnemySpawnNumber[1] = 1;
        _aEnemySpawnNumber[2] = 1;
        _aEnemySpawnNumber[3] = 2;
        _aEnemySpawnNumber[4] = 2;
        _aEnemySpawnNumber[5] = 2;
        _aEnemySpawnNumber[6] = 2;
        _aEnemySpawnNumber[7] = 3;
        _aEnemySpawnNumber[8] = 3;
        _aEnemySpawnNumber[9] = 2;
        _aEnemySpawnNumber[10] = 2;
        _aEnemySpawnNumber[11] = 2;
        
        
        NUM_LEVELS = _aEnemiesToSpawn.length;
    };
    
    this.getEnemiesSpawn = function(iLevel){
        return _aEnemiesToSpawn[iLevel-1];
    };
    
    this.getStartingEnemySpawn = function(iLevel){
        return _aEnemySpawnTime[iLevel-1];
    };
    
    this.getEnemySpawnNumber = function(iLevel){
        return _aEnemySpawnNumber[iLevel-1];
    };
    
    this._init();
}