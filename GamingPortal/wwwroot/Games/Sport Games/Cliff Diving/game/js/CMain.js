function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oHelp;
    var _oMenu;
    var _oGame;
    var _oLevelSelection;
    
    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
	s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);

        s_bMobile = jQuery.browser.mobile;              // This will check if we are on mobile 
        
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

    };

    this.preloaderReady = function () {
        this._loadImages();
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            //s_oMain._onRemovePreloader();
        }
    };

    this._initSounds = function () {
        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: './sounds/',filename:'collision',loop:false,volume:1, ingamename: 'collision'});        
        aSoundsInfo.push({path: './sounds/',filename:'bonus',loop:false,volume:1, ingamename: 'bonus'});
        aSoundsInfo.push({path: './sounds/',filename:'coin',loop:false,volume:1, ingamename: 'coin'});
        aSoundsInfo.push({path: './sounds/',filename:'water',loop:false,volume:1, ingamename: 'water'});
        aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        aSoundsInfo.push({path: './sounds/',filename:'game_win',loop:false,volume:1, ingamename: 'game_win'});        
        aSoundsInfo.push({path: './sounds/',filename:'jump',loop:false,volume:1, ingamename: 'jump'});
        
        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3', aSoundsInfo[i].path+aSoundsInfo[i].filename+'.ogg'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded
                                                        });
        }
    };

    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        for (var i = 0; i < 4; i++) {
            s_oSpriteLibrary.addSprite("bg_game"+i,"./sprites/bg_game"+i+".jpg");
            s_oSpriteLibrary.addSprite("rock_"+i,"./sprites/rock_"+i+".png");
            s_oSpriteLibrary.addSprite("but_level"+i,"./sprites/but_level"+i+".png");
            s_oSpriteLibrary.addSprite("trampoline"+i,"./sprites/trampoline"+i+".png");
        };
        
        for (var i = 0; i < 3; i++) {
            s_oSpriteLibrary.addSprite("player"+i+"_head","./sprites/player"+i+"/head.png");
            s_oSpriteLibrary.addSprite("player"+i+"_leftarm","./sprites/player"+i+"/leftarm.png");
            s_oSpriteLibrary.addSprite("player"+i+"_leftbottomleg","./sprites/player"+i+"/leftbottomleg.png");
            s_oSpriteLibrary.addSprite("player"+i+"_lefttopleg","./sprites/player"+i+"/lefttopleg.png");        
            s_oSpriteLibrary.addSprite("player"+i+"_rightarm","./sprites/player"+i+"/rightarm.png");
            s_oSpriteLibrary.addSprite("player"+i+"_rightbottomleg","./sprites/player"+i+"/rightbottomleg.png");
            s_oSpriteLibrary.addSprite("player"+i+"_righttopleg","./sprites/player"+i+"/righttopleg.png");
            s_oSpriteLibrary.addSprite("player"+i+"_torso","./sprites/player"+i+"/torso.png");
            s_oSpriteLibrary.addSprite("watersplash"+i,"./sprites/watersplash"+i+".png");
        }
        
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_next", "./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("msg_box_small", "./sprites/msg_box_small.png");
        s_oSpriteLibrary.addSprite("msg_box_big", "./sprites/msg_box_big.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");        
        s_oSpriteLibrary.addSprite("bg", "./sprites/bg.jpg");
        s_oSpriteLibrary.addSprite("collision", "./sprites/collision.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");        
        s_oSpriteLibrary.addSprite("logo_menu","./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("menu_diver","./sprites/menu_diver.png");
        s_oSpriteLibrary.addSprite("plane","./sprites/plane.png");
        s_oSpriteLibrary.addSprite("coin","./sprites/coin.png");
        s_oSpriteLibrary.addSprite("arrow","./sprites/arrow.png");
        s_oSpriteLibrary.addSprite("star","./sprites/star.png");
        s_oSpriteLibrary.addSprite("starbox","./sprites/starbox.png");        
        s_oSpriteLibrary.addSprite("help_preparation","./sprites/help_preparation.png");
        s_oSpriteLibrary.addSprite("help_jump","./sprites/help_jump.png");
        s_oSpriteLibrary.addSprite("help_flip","./sprites/help_flip.png");
        s_oSpriteLibrary.addSprite("help_release","./sprites/help_release.png");        
        s_oSpriteLibrary.addSprite("help_dive_best","./sprites/help_dive_best.png");
        s_oSpriteLibrary.addSprite("help_dive_good","./sprites/help_dive_good.png");
        s_oSpriteLibrary.addSprite("help_dive_poor","./sprites/help_dive_poor.png");
        s_oSpriteLibrary.addSprite("help_hand", "./sprites/help_hand.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
        
        if (_iCurResource === RESOURCE_TO_LOAD) {
            //this._onRemovePreloader();
        }
    };

    this._onAllImagesLoaded = function () {
        
    };

    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };
    
    this._onRemovePreloader = function(){
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }
        
        _oPreloader.unload();
            
        if (!isIOS()) {
            s_oSoundtrack = playSound('soundtrack', 1, true);
        }
        
        this.gotoMenu();
    };
    
    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function () {
        $("#canvas").trigger("start_session");
        _oGame = new CGame(_oData);
        _iState = STATE_GAME;
    };
    
    this.gotoLevelSelection = function(iRandomN){
        _oLevelSelection = new CLevel(iRandomN);
        _iState = STATE_LEVELSELECTION;
    };

    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdate = function () {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
        if(s_bAudioActive){
            Howler.mute(true);
        }
    };

    this.startUpdate = function () {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");
        
        if(s_bAudioActive){
            Howler.mute(false);
        }
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_MENU) {
            _oMenu.update();
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);
    };

    s_oMain = this;

    _oData = oData;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;    
    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_iTotalScore = 0;
var s_oPhysicsController;

var s_bStorageAvailable = true;
var s_bFirstTimePlaying;
var s_iLevel = 0;
var s_iLastLevel = 0;
var s_aStars;