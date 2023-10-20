function CMascotte() {
    var _iWidth = 247;
    var _iHeight = 315;
    var _iRandomCounter;    // HOW MANY IDLE ANIMATIONS HAS BEEN PLAYED FOR LOOP
    var _iRandomN;          // HOW MANY TIMES THE IDLE ANIMATION WILL BE PLAYED BEFORE GOING TO THE DRINK ANIMATION
    
    var _oMascottePos = {x: 260, y: 640};
    var _oThis;
    
    this._init = function () {
        _iRandomCounter = 0;
        _iRandomN = Math.floor((Math.random() * 10) + 5);
        
        var data = {
            images: [s_oSpriteLibrary.getSprite("mascotte_01"),
                     s_oSpriteLibrary.getSprite("mascotte_02"),
                     s_oSpriteLibrary.getSprite("mascotte_03"),
                     s_oSpriteLibrary.getSprite("mascotte_04"),
                     s_oSpriteLibrary.getSprite("mascotte_05"),
                     s_oSpriteLibrary.getSprite("mascotte_06"),
                     s_oSpriteLibrary.getSprite("mascotte_07"),
                     s_oSpriteLibrary.getSprite("mascotte_08"),
                     s_oSpriteLibrary.getSprite("mascotte_09"),
                     s_oSpriteLibrary.getSprite("mascotte_10"),
                     s_oSpriteLibrary.getSprite("mascotte_11"),
                     s_oSpriteLibrary.getSprite("mascotte_12"),
                     s_oSpriteLibrary.getSprite("mascotte_13"),
                     s_oSpriteLibrary.getSprite("mascotte_14"),
                     s_oSpriteLibrary.getSprite("mascotte_15"),
                     s_oSpriteLibrary.getSprite("mascotte_16"),
                     s_oSpriteLibrary.getSprite("mascotte_17"),
                     s_oSpriteLibrary.getSprite("mascotte_18"),
                     s_oSpriteLibrary.getSprite("mascotte_19"),
                     s_oSpriteLibrary.getSprite("mascotte_20"),
                     s_oSpriteLibrary.getSprite("mascotte_21"),
                     s_oSpriteLibrary.getSprite("mascotte_22"),
                     s_oSpriteLibrary.getSprite("mascotte_23"),
                     s_oSpriteLibrary.getSprite("mascotte_24"),
                     s_oSpriteLibrary.getSprite("mascotte_25"),
                     s_oSpriteLibrary.getSprite("mascotte_26"),
                     s_oSpriteLibrary.getSprite("mascotte_27"),
                     s_oSpriteLibrary.getSprite("mascotte_28"),
                     s_oSpriteLibrary.getSprite("mascotte_29"),
                     s_oSpriteLibrary.getSprite("mascotte_30"),
                     s_oSpriteLibrary.getSprite("mascotte_31"),
                     s_oSpriteLibrary.getSprite("mascotte_32"),
                     s_oSpriteLibrary.getSprite("mascotte_33"),
                     s_oSpriteLibrary.getSprite("mascotte_34"),
                     s_oSpriteLibrary.getSprite("mascotte_35"),
                     s_oSpriteLibrary.getSprite("mascotte_36"),
                     s_oSpriteLibrary.getSprite("mascotte_37"),
                     s_oSpriteLibrary.getSprite("mascotte_38"),
                     s_oSpriteLibrary.getSprite("mascotte_39"),
                     s_oSpriteLibrary.getSprite("mascotte_40"),
                     s_oSpriteLibrary.getSprite("mascotte_41"),
                     s_oSpriteLibrary.getSprite("mascotte_42"),
                     s_oSpriteLibrary.getSprite("mascotte_43"),
                     s_oSpriteLibrary.getSprite("mascotte_44"),
                     s_oSpriteLibrary.getSprite("mascotte_45"),
                     s_oSpriteLibrary.getSprite("mascotte_46"),
                     s_oSpriteLibrary.getSprite("mascotte_47"),
                     s_oSpriteLibrary.getSprite("mascotte_48"),
                     s_oSpriteLibrary.getSprite("mascotte_49"),
                     s_oSpriteLibrary.getSprite("mascotte_50"),
                     s_oSpriteLibrary.getSprite("mascotte_51"),
                     s_oSpriteLibrary.getSprite("mascotte_52"),
                     s_oSpriteLibrary.getSprite("mascotte_53"),
                     s_oSpriteLibrary.getSprite("mascotte_54"),
                     s_oSpriteLibrary.getSprite("mascotte_55"),
                     s_oSpriteLibrary.getSprite("mascotte_56"),
                     s_oSpriteLibrary.getSprite("mascotte_57"),
                     s_oSpriteLibrary.getSprite("mascotte_58"),
                     s_oSpriteLibrary.getSprite("mascotte_59"),
                     s_oSpriteLibrary.getSprite("mascotte_60"),
                     s_oSpriteLibrary.getSprite("mascotte_61"),
                     s_oSpriteLibrary.getSprite("mascotte_62"),
                     s_oSpriteLibrary.getSprite("mascotte_63"),
                     s_oSpriteLibrary.getSprite("mascotte_64"),
                     s_oSpriteLibrary.getSprite("mascotte_65"),
                     s_oSpriteLibrary.getSprite("mascotte_66"),
                     s_oSpriteLibrary.getSprite("mascotte_67"),
                     s_oSpriteLibrary.getSprite("mascotte_68"),
                     s_oSpriteLibrary.getSprite("mascotte_69"),
                     s_oSpriteLibrary.getSprite("mascotte_70"),
                     s_oSpriteLibrary.getSprite("mascotte_71"),
                     s_oSpriteLibrary.getSprite("mascotte_72"),
                     s_oSpriteLibrary.getSprite("mascotte_73"),
                     s_oSpriteLibrary.getSprite("mascotte_74"),
                     s_oSpriteLibrary.getSprite("mascotte_75"),
                     s_oSpriteLibrary.getSprite("mascotte_76"),
                     s_oSpriteLibrary.getSprite("mascotte_77"),
                     s_oSpriteLibrary.getSprite("mascotte_78"),
                     s_oSpriteLibrary.getSprite("mascotte_79"),
                     s_oSpriteLibrary.getSprite("mascotte_80"),
                     s_oSpriteLibrary.getSprite("mascotte_81"),
                     s_oSpriteLibrary.getSprite("mascotte_82"),
                     s_oSpriteLibrary.getSprite("mascotte_83"),
                     s_oSpriteLibrary.getSprite("mascotte_84"),
                     s_oSpriteLibrary.getSprite("mascotte_85"),
                     s_oSpriteLibrary.getSprite("mascotte_86"),
                     s_oSpriteLibrary.getSprite("mascotte_87"),
                     s_oSpriteLibrary.getSprite("mascotte_88"),
                     s_oSpriteLibrary.getSprite("mascotte_89"),
                     s_oSpriteLibrary.getSprite("mascotte_90"),
                     s_oSpriteLibrary.getSprite("mascotte_91"),
                     s_oSpriteLibrary.getSprite("mascotte_92"),
                     s_oSpriteLibrary.getSprite("mascotte_93"),
                     s_oSpriteLibrary.getSprite("mascotte_94"),
                     s_oSpriteLibrary.getSprite("mascotte_95"),
                     s_oSpriteLibrary.getSprite("mascotte_96"),
                     s_oSpriteLibrary.getSprite("mascotte_97"),
                     s_oSpriteLibrary.getSprite("mascotte_98"),
                     s_oSpriteLibrary.getSprite("mascotte_99"),
                     s_oSpriteLibrary.getSprite("mascotte_100"),
                     s_oSpriteLibrary.getSprite("mascotte_101"),
                     s_oSpriteLibrary.getSprite("mascotte_102"),
                     s_oSpriteLibrary.getSprite("mascotte_103"),
                     s_oSpriteLibrary.getSprite("mascotte_104"),
                     s_oSpriteLibrary.getSprite("mascotte_105"),
                     s_oSpriteLibrary.getSprite("mascotte_106"),
                     s_oSpriteLibrary.getSprite("mascotte_107"),
                     s_oSpriteLibrary.getSprite("mascotte_108"),
                     s_oSpriteLibrary.getSprite("mascotte_109"),
                     s_oSpriteLibrary.getSprite("mascotte_110"),
                     s_oSpriteLibrary.getSprite("mascotte_111"),
                     s_oSpriteLibrary.getSprite("mascotte_112"),
                     s_oSpriteLibrary.getSprite("mascotte_113"),
                     s_oSpriteLibrary.getSprite("mascotte_114"),
                     s_oSpriteLibrary.getSprite("mascotte_115"),
                     s_oSpriteLibrary.getSprite("mascotte_116"),
                     s_oSpriteLibrary.getSprite("mascotte_117"),
                     s_oSpriteLibrary.getSprite("mascotte_118"),
                     s_oSpriteLibrary.getSprite("mascotte_119"),
                     s_oSpriteLibrary.getSprite("mascotte_120"),
                     s_oSpriteLibrary.getSprite("mascotte_121"),
                     s_oSpriteLibrary.getSprite("mascotte_122"),
                     s_oSpriteLibrary.getSprite("mascotte_123")],
            frames: {width: _iWidth, height: _iHeight, regX: _iWidth/2, regY: _iHeight}, 
            animations: { idle: [0, 29, false],
                          drink: [30, 76, 'idle'],
                          win: [77, 92, 'win'],
                          lose: [94, 121, 'lose']},
            framerate: 20
        };        
        var oSpriteSheet = new createjs.SpriteSheet(data);
        
        _oThis = createSprite(oSpriteSheet, 'idle', 0, 0, _iWidth, _iHeight);
        _oThis.x = _oMascottePos.x;
        _oThis.y = _oMascottePos.y;
        _oThis.addEventListener("animationend", this.changeAnimation);
        s_oStage.addChild(_oThis);
    };
    
    this.changeAnimation = function(){
        if (_oThis.currentAnimation === "win") {            // FOR WIN ANIMATION ONLY
            _oThis.gotoAndPlay("win");
        } else if (_oThis.currentAnimation === "lose") {    // FOR LOSE ANIMATION ONLY
            _oThis.gotoAndPlay("lose");
        } else {                                            // FOR IDLE ONLY
            _iRandomCounter++;

            if (_iRandomCounter > _iRandomN) {
                _iRandomCounter = 0;        
                playSound("gulp",1,false);
                _oThis.gotoAndPlay("drink");
            } else {
                _oThis.gotoAndPlay("idle");
            };
        };
    };
    
    this.animationWin = function(){
        _oThis.gotoAndPlay("win");
    };
    
    this.animationLose = function(){
        _oThis.gotoAndPlay("lose");
    };
    
    this.animationIdle = function(){
        _oThis.gotoAndPlay("idle");
    };
    
    this.changeContainer = function(oContainer){
        oContainer.addChild(_oThis);
        
        _oThis.alpha = 1;
    };
    
    _oThis = this;

    this._init();
}