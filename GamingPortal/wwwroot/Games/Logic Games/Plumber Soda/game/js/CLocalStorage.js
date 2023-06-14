var LOCALSTORAGE_STARS = "stars";
var LOCALSTORAGE_SCORES = "scores";
var LOCALSTORAGE_LASTLEVEL = "lastlevel";

var s_aScores = new Array();
var s_aStars = new Array();
var s_iLastLevel = 1;

function CLocalStorage(szName){
    var _bLocalStorage = true;

    this._init = function(szName){
        try{
            var bFlag = window.localStorage.getItem(szName);
            this.resetData();
            if(bFlag !== null && bFlag !== undefined){ 
                this.loadData();
            }
        }catch(e){
            this.resetData();
        }        
        
    };

    this.isDirty = function(){
        for (var i = 0; i <s_aScores.length; i++) {
            if(s_aScores[i] > 0){
                return true;
            }
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

    this.resetData = function(){

        s_aStars = new Array();
        for(var i=0; i<NUM_LEVELS; i++){
            s_aStars[i] = 0;
        }

        s_aScores = new Array();
        for(var i=0; i<NUM_LEVELS; i++){
            s_aScores[i] = 0;
        }
        
        s_iLastLevel = 1;

    };

    this.deleteData = function(){
        window.localStorage.removeItem(szName);
    };

    this.saveData = function(){
        var oJSONData = {};
        oJSONData[LOCALSTORAGE_STARS] = s_aStars;
        oJSONData[LOCALSTORAGE_SCORES] = s_aScores;
        oJSONData[LOCALSTORAGE_LASTLEVEL] = s_iLastLevel;

        /*ADD MORE JSON THIS WAY
        var randB = "randomboolean";
        oJSONData[randB] = true;
        oJSONData["anothernestedjson"] = {pippo: 3, ciccio: 10};
        */

        window.localStorage.setItem(szName, JSON.stringify(oJSONData));
        
    };

    this.loadData = function(){
        var szData = JSON.parse(window.localStorage.getItem(szName));
        
        var aLoadedScore = szData[LOCALSTORAGE_STARS];
        for(var i=0; i<aLoadedScore.length; i++){
            s_aStars[i] = parseInt(aLoadedScore[i]);
        }
        
        var aLoadedScore = szData[LOCALSTORAGE_SCORES];
        for(var i=0; i<aLoadedScore.length; i++){
            s_aScores[i] = parseInt(aLoadedScore[i]);
        }
        
        var iLoadedScore = szData[LOCALSTORAGE_LASTLEVEL];
        s_iLastLevel = parseInt(iLoadedScore);
        
    };

    this._init(szName);
    
}