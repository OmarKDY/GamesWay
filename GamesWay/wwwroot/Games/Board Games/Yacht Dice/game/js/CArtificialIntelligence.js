function CArtificialIntelligence() {
    var _aDices;
    var _aCombinations;
    
    this.checkForDicesToKeep = function(aDices, aCombinations) {
        _aDices = [];
        _aCombinations = aCombinations;
        
        for (var i = 0; i < aDices.length; i++) {
            _aDices.push(aDices[i]);
        };
        _aDices.sort(this.compareValue);
        
        var bDicesToKeepFound = false;
        
        // CHECK IF THERE ARE DICES TO KEEP OR NOT (AT THE FIRST COMBINATION FOUND, EXIT THIS CHECK
        if (bDicesToKeepFound === false && _aCombinations[ID_YACHT].completed === false) {
            bDicesToKeepFound = this._checkForYacht();
        }
        if (bDicesToKeepFound === false) {
            bDicesToKeepFound = this._checkForStraight();
        }
        if (bDicesToKeepFound === false && _aCombinations[ID_FULL_HOUSE].completed === false) {
            bDicesToKeepFound = this._checkForFullHouse();
        }
        if (bDicesToKeepFound === false) {
            bDicesToKeepFound = this._checkForFourOfAKind();
        }
        if (bDicesToKeepFound === false) {
            bDicesToKeepFound = this._checkForThreeOfAKind();
        }
        if (bDicesToKeepFound === false) {
            bDicesToKeepFound = this._checkForDoublePairs();
        }
        if (bDicesToKeepFound === false) {
            bDicesToKeepFound = this._checkForPairs();
        }
        if (bDicesToKeepFound === false) {
            bDicesToKeepFound = this._checkForBestDices();
        }
        
        return bDicesToKeepFound;
    };
    
    this._lockDice = function(iID) {
        _aDices[iID].setLocked(true);
        _aDices[iID].setHighlightVisible(true);
    };
    
    this._lockAllDices = function(){
        this._lockDice(0);
        this._lockDice(1);
        this._lockDice(2);
        this._lockDice(3);
        this._lockDice(4);
    };
    
    this._lockDices = function(aDicesN) {
        for (var i = 0; i < aDicesN.length; i++) {
            this._lockDice(aDicesN[i]);
        }
    };
    
    this._checkForStraight = function() {
        // LARGE STRAIGHT
        if (_aCombinations[ID_LARGE_STRAIGHT].completed === false) {
            var aCombAnswers = [[0,1,2,3,4],[1,2,3,4,5]];
            for (var i = 0; i < aCombAnswers.length; i++) {
                if (_aDices[0].getValue() === aCombAnswers[i][0] &&
                    _aDices[1].getValue() === aCombAnswers[i][1] &&
                    _aDices[2].getValue() === aCombAnswers[i][2] &&
                    _aDices[3].getValue() === aCombAnswers[i][3] &&
                    _aDices[4].getValue() === aCombAnswers[i][4] ) {
                    this._lockAllDices();
                    return true;
                }
            }; 
        }
        
        // SMALL STRAIGHT
        if (_aCombinations[ID_SMALL_STRAIGHT].completed === false) {
            // FIND FOUR SEQUENTIAL DICES
            var aComb = [[0,1,2,3],[1,2,3,4],[0,2,3,4],[0,1,3,4]];
            var aCombAnswers = [[0,1,2,3],[1,2,3,4],[2,3,4,5]];
            
            for (var i = 0; i < aComb.length; i++) {
                for (var j = 0; j < aCombAnswers.length; j++) {
                    if (_aDices[aComb[i][0]].getValue() === aCombAnswers[j][0] &&
                        _aDices[aComb[i][1]].getValue() === aCombAnswers[j][1] &&
                        _aDices[aComb[i][2]].getValue() === aCombAnswers[j][2] &&
                        _aDices[aComb[i][3]].getValue() === aCombAnswers[j][3] ) {
                        this._lockDices(aComb[i]);
                        return true;
                    }
                }; 
            };              
        }
        
        return false;
    };
    
    this._checkForFullHouse = function() {
        var bFullHouse = false;
        
        if (_aDices[0].getValue() === _aDices[2].getValue() &&
            _aDices[0].getValue() !== _aDices[3].getValue() &&
            _aDices[3].getValue() === _aDices[4].getValue() ) {
            bFullHouse = true;
        } else if (_aDices[0].getValue() === _aDices[1].getValue() &&
            _aDices[0].getValue() !== _aDices[2].getValue() &&
            _aDices[2].getValue() === _aDices[4].getValue() ) {
            bFullHouse = true;            
        };

        if (bFullHouse === true) {
            this._lockAllDices();
        }

        return bFullHouse;
    };
    
    this._checkForBestDices = function() {
        var bBestDices = false;
        
        // CHECK FOR THE HIGHEST VALUED DICES TO KEEP
        for (var i = 0; i < _aDices.length; i++) {
            if (_aDices[i].getValue() === DICE_VALUES[5] || // WE'LL KEEP THE HIGHEST AND THE
                _aDices[i].getValue() === DICE_VALUES[4]) { // SECOND-HIGHEST VALUED DICES
                bBestDices = true;
                this._lockDice(i);
            }
        };
        
        return bBestDices;
    }; 
    
    this._checkForYacht = function() {
        var bYacht = false;
        
        if (_aDices[0].getValue() === _aDices[4].getValue() ) {
            this._lockAllDices();
            bYacht = true;
        };

        return bYacht;
    };
    
    this._checkForFourOfAKind = function() {
        var bFourOfKind = false;
        
        if (_aDices[0].getValue() === _aDices[3].getValue() ) {
            var aDices = [0,1,2,3];
            this._lockDices(aDices);
            bFourOfKind = true;
        } else if (_aDices[1].getValue() === _aDices[4].getValue() ) {
            var aDices = [1,2,3,4];
            this._lockDices(aDices);
            bFourOfKind = true;
        }
        
        return bFourOfKind;
    };
    
    this._checkForDoublePairs = function(){
        var bDoublePairs = false;
        
        if (_aDices[0].getValue() === _aDices[1].getValue() && 
            _aDices[2].getValue() === _aDices[3].getValue() ) {
            var aDices = [0,1,2,3];
            this._lockDices(aDices);
            bDoublePairs = true;
        } else if (_aDices[0].getValue() === _aDices[1].getValue() && 
                   _aDices[3].getValue() === _aDices[4].getValue() ) {
            var aDices = [0,1,3,4];
            this._lockDices(aDices);
            bDoublePairs = true;
        } else if (_aDices[1].getValue() === _aDices[2].getValue() && 
                   _aDices[3].getValue() === _aDices[4].getValue() ) {
            var aDices = [1,2,3,4];
            this._lockDices(aDices);
            bDoublePairs = true;
        }
        
        return bDoublePairs;
    };
    
    this._checkForPairs = function(){
        var bPairs = false;
        
        if (_aDices[0].getValue() === _aDices[1].getValue()) {
            this._lockDice(0);
            this._lockDice(1);
            bPairs = true;
        } else if (_aDices[1].getValue() === _aDices[2].getValue()) {
            this._lockDice(1);
            this._lockDice(2);
            bPairs = true;
        } else if (_aDices[2].getValue() === _aDices[3].getValue()) {
            this._lockDice(2);
            this._lockDice(3);
            bPairs = true;
        } else if (_aDices[3].getValue() === _aDices[4].getValue()) {
            this._lockDice(3);
            this._lockDice(4);
            bPairs = true;
        }
        
        return bPairs;
    };
    
    this._checkForThreeOfAKind = function(){
        var bThreeKind = false;
        
        if (_aDices[0].getValue() === _aDices[2].getValue()) {
            var aDices = [0,1,2];
            this._lockDices(aDices);
            bThreeKind = true;
        } else if (_aDices[1].getValue() === _aDices[3].getValue()) {
            var aDices = [1,2,3];
            this._lockDices(aDices);            
            bThreeKind = true;
        } else if (_aDices[2].getValue() === _aDices[4].getValue()) {
            var aDices = [2,3,4];
            this._lockDices(aDices);
            bThreeKind = true;
        }
        
        return bThreeKind;
    };
    
    this.checkForBestCombination = function(aCombinations, aPlayerCombinations) {
        var iHighestIndex = 0;
        var iMax = aCombinations[0];
        
        // PICK THE BEST BETWEEN THE COMBINATIONS, FROM TOP TO BOTTOM (EXCEPT THE CHANCE)
        for (var i = 1; i < ID_CHANCE; i++) {
            // CHECK IF THE COMBINATION IS NOT COMPLETED YET
            if (aPlayerCombinations[i].completed === false) {
                // FOR TOP SECTION, AVOID USING ONE DICE ONLY
                if (i < COMBINATION_TOP_LIMIT) {
                    if (aPlayerCombinations[i].value === DICE_VALUES[i]) {
                        break;
                    }
                }
                // CHECK IF THE COMBINATION IS HIGHER
                if (aCombinations[i] > iMax && aCombinations[i] !== i+1) {
                    iHighestIndex = i;
                    iMax = aCombinations[i];
                }
            }
        };
        
        if (iMax > 0) {
            if (aPlayerCombinations[iHighestIndex].completed === false) {
                return iHighestIndex;
            }
        }
        
        // IF NO COMBINATION IS USABLE, GO FOR THE CHANCE OR THE FIRST AVAILABLE
        if (aPlayerCombinations[ID_CHANCE].completed === false) {
            iHighestIndex = ID_CHANCE;
            iMax = aCombinations[ID_CHANCE];
        } else {
            for (var i = 0; i < ID_CHANCE; i++) {
                // CHECK IF THE COMBINATION IS NOT COMPLETED YET
                if (aPlayerCombinations[i].completed === false) {
                    iHighestIndex = i;
                    iMax = aCombinations[i];
                }
            }
        }
        
        return iHighestIndex;
    };
    
    this.compareValue = function(a,b) {
        if (a.getValue() < b.getValue())
           return -1;
        if (a.getValue() > b.getValue())
            return 1;
        return 0;
    };
};