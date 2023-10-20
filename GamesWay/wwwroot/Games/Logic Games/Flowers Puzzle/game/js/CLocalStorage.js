var LOCALSTORAGE_LAST_LEVEL = "last_level";
var LOCALSTORAGE_SCORE = "scores";

var s_iLastLevel = 1;
var s_aScore = new Array();

function CLocalStorage(szName){
    var _bLocalStorage = true;

    this._init = function(szName){   
        var bFlag = window.localStorage.getItem(szName);

        this.resetAllData();
        if(bFlag !== null && bFlag !== undefined){  
            this.loadData();
        }
        
    };

    this.isDirty = function(){
        if(s_iLastLevel > 1){
            return true;
        }

        return false;
    };

    this.isUsed = function(){
        try{
            window.localStorage.setItem("ls_available","ok");
        }catch(evt){
            _bLocalStorage = false;
        }
        
        return _bLocalStorage;
    };

    this.resetAllData = function(){
        s_iLastLevel = 1;

        s_aScore = new Array();
        for(var i=0; i<NUM_LEVELS; i++){
            s_aScore[i] = 0;
        }

    };

    this.deleteData = function(){
        window.localStorage.removeItem(szName);
        s_oLocalStorage.resetAllData();
    };

    this.saveData = function(){
        var oJSONData = {};
        oJSONData[LOCALSTORAGE_LAST_LEVEL] = s_iLastLevel;
        oJSONData[LOCALSTORAGE_SCORE] = s_aScore;

        /*ADD MORE JSON THIS WAY
        var randB = "randomboolean";
        oJSONData[randB] = true;
        oJSONData["anothernestedjson"] = {pippo: 3, foo: 10};
        */

        window.localStorage.setItem(szName, JSON.stringify(oJSONData));
        
    };

    this.loadData = function(){
        var szData = JSON.parse(window.localStorage.getItem(szName));
        
        var iLoadedScore = szData[LOCALSTORAGE_LAST_LEVEL];
        s_iLastLevel = parseInt(iLoadedScore);
        
        var aLoadedScore = szData[LOCALSTORAGE_SCORE];
        s_aScore = new Array();
        for(var i=0; i<aLoadedScore.length; i++){
            s_aScore[i] = parseInt(aLoadedScore[i]);
        }
        
    };

    this.getTotalScore = function(){
        var iTotalScore = 0;
        for(var i=0; i<NUM_LEVELS; i++){
            iTotalScore += s_aScore[i];
        }
        return iTotalScore;
    };
    
    this.getPartialScore = function(iLevel){
        var iPartialScore = 0;
        for(var i=0; i<iLevel; i++){
            iPartialScore += s_aScore[i];
        }
        return iPartialScore;
    };

    this._init(szName);
    s_oLocalStorage = this;
}

var s_oLocalStorage;