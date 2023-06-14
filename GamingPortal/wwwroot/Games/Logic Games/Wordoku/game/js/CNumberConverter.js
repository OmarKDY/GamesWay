function CNumberConverter(){
    
    var _oWord;
    
    this._init = function(){
        _oWord = WORD_LIST[Math.floor((Math.random()*WORD_LIST.length))];
    };
    
    this.toText = function(iNum){
        
        return _oWord[iNum-1].toUpperCase();
    };
    
    s_oNumberConverter = this;
    this._init();
}

var s_oNumberConverter;
