var OBJ_TYPE_PLAYER = "car_player";
var OBJ_VERTICAL_2 = "vertical_2";
var OBJ_VERTICAL_3 = "vertical_3";
var OBJ_HORIZONTAL_2 = "horizontal_2";
var OBJ_HORIZONTAL_3 = "horizontal_3";

function CLevelSettings(){
    var _aLevel = new Array();

    var _aCellLabel;
    var _aGoal;
    var _aMoves = new Array();
    
    this._init = function(){
        //level 1
        var aBlock = new Array();
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 5 );
        
        //level 2
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 5 );
        
        //level 3
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 12 );
        
        //level 4
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 5 );
        
        //level 5
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 11 );
        
        //level 6
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 8 );
        
        //level 7
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 9 );
        
        //level 8
        var aBlock = new Array();
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 10 );
        
        //level 9
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 11 );
        
        //level 10
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 8 );

        //level 11.1b
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 17 );
        
        //level 12.2b
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 13.3b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 19 );
        
        //level 14.4b
        var aBlock = new Array();
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 15.5b
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 18 );
        
        //level 16.6b
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 17.7b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 15 );
        
        //level 18.9b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 19.31b
        var aBlock = new Array();
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 20.40b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 19 );
        
        //level 21.42b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 22.44b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 23.45b
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 17 );
        
        //level 24.47b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 25.50b
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 26.91b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 15 );
        
        //level 27.94b
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 19 );
        
        //level 28.95b
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 20 );
        
        //level 29.98b
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 19 );
        
        //level 30.100b
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 16 );
        
        //level 31.2i
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 32.4i
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 33.1i
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 34.7i
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 35.10i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 36.21i
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 37.26i
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 38.31i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 39.39i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 40.41i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 41.45i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 42.50i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 43.53i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 44.57i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        //level 45.60i
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 30 );
        
        
        //level 46.1a
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 47.3a
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 48.8a
        var aBlock = new Array();
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        
        //level 49.21a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 50.22a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 51.25a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 52.29a
        var aBlock = new Array();
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        
        //level 53.33a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 54.35a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 1, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 55.36a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 5, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 56.41a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 4, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 57.44a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 58.46a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 2, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 1, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 1, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 59.48a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_3});
        aBlock.push({obj_x: 0, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 0, obj_y: 3, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 3, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 1, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 3, obj_y: 5, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        //level 60.50a
        var aBlock = new Array();
        aBlock.push({obj_x: 0, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 2, obj_y: 0, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 4, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 5, obj_y: 0, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 1, obj_y: 1, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 2, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 2, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 3, obj_y: 4, obj_type: OBJ_VERTICAL_2});
        aBlock.push({obj_x: 4, obj_y: 4, obj_type: OBJ_HORIZONTAL_2});
        aBlock.push({obj_x: 0, obj_y: 5, obj_type: OBJ_HORIZONTAL_3});
        aBlock.push({obj_x: 0, obj_y: 2, obj_type: OBJ_TYPE_PLAYER});
        _aLevel.push(aBlock);
        _aMoves.push( 40 );
        
        NUM_LEVELS = _aLevel.length;
    };
    
    this.getLevel = function(iLevel){
        return(_aLevel[iLevel]);
    };
    
    this.getLevels = function(){
        return _aLevel;
    };
    
    this.getCellValueInLevel = function(iLevel,iCellIndex){
        return _aCellLabel[parseInt(_aLevel[iLevel].charAt(iCellIndex))];
    };
    
    this.getGoalInLevel = function(iLevel){
        return _aMoves[iLevel];
    };
    
    this.getGoalNumberInLevel = function(iLevel){
        return _aGoal[iLevel].length;
    };
    
    this._init();
}