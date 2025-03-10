function CMain(oData){
	var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        
		if(navigator.userAgent.match(/Windows Phone/i)){
			DISABLE_SOUND_MOBILE = true;
		}
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
    
    this.preloaderReady = function(){
        this._loadImages();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'survivor_scream',loop:false,volume:1, ingamename: 'survivor_scream'});
        s_aSoundsInfo.push({path: './sounds/',filename:'tap_zombie',loop:false,volume:1, ingamename: 'tap_zombie'});
        s_aSoundsInfo.push({path: './sounds/',filename:'zombie_crowd',loop:false,volume:1, ingamename: 'zombie_crowd'});


        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }

    };

    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg"); 
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("pause_icon","./sprites/pause_icon.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        
        s_oSpriteLibrary.addSprite("bridge","./sprites/bridge.png");
        s_oSpriteLibrary.addSprite("energy_bar_bg","./sprites/energy_bar_bg.png");
        s_oSpriteLibrary.addSprite("energy_bar_fill","./sprites/energy_bar_fill.png");
        s_oSpriteLibrary.addSprite("enemy_bar_bg","./sprites/enemy_bar_bg.png");
        s_oSpriteLibrary.addSprite("enemy_bar_fill","./sprites/enemy_bar_fill.png");
        s_oSpriteLibrary.addSprite("blood_floor","./sprites/blood_floor.png");
		s_oSpriteLibrary.addSprite("game_over_bg","./sprites/game_over_bg.png");
        

        ////Load Zombie
        //Zombie Zero
        for(var i=0; i<=57; i++){
            s_oSpriteLibrary.addSprite("zombie0_death"+i,"./sprites/zombie_00/death/zombiedeath0_"+i+".png");
        }
        for(var i=0; i<=28; i++){
            s_oSpriteLibrary.addSprite("zombie0_run"+i,"./sprites/zombie_00/run/zombierun0_"+i+".png");
        }
       
        //Zombie One
        for(var i=0; i<=53; i++){
            s_oSpriteLibrary.addSprite("zombie1_death"+i,"./sprites/zombie_01/death/zombiedeath1_"+i+".png");
        }
        for(var i=0; i<=28; i++){
            s_oSpriteLibrary.addSprite("zombie1_run"+i,"./sprites/zombie_01/run/zombierun1_"+i+".png");
        }
        
        //Zombie Two
        for(var i=0; i<=57; i++){
            s_oSpriteLibrary.addSprite("zombie2_death"+i,"./sprites/zombie_02/death/zombiedeath2_"+i+".png");
        }
        for(var i=0; i<=19; i++){
            s_oSpriteLibrary.addSprite("zombie2_run"+i,"./sprites/zombie_02/run/zombierun2_"+i+".png");
        }
        
        //Zombie Three
        for(var i=0; i<=57; i++){
            s_oSpriteLibrary.addSprite("zombie3_death"+i,"./sprites/zombie_03/death/zombiedeath3_"+i+".png");
        }
        for(var i=0; i<=20; i++){
            s_oSpriteLibrary.addSprite("zombie3_run"+i,"./sprites/zombie_03/run/zombierun3_"+i+".png");
        }
        
        //Survivor
        for(var i=0; i<=57; i++){
            s_oSpriteLibrary.addSprite("survivor_death"+i,"./sprites/survivor/death/survivordeath_"+i+".png");
        }
        for(var i=0; i<=16; i++){
            s_oSpriteLibrary.addSprite("survivor_run"+i,"./sprites/survivor/run/survivorrun_"+i+".png");
        }
        
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();

        s_oSoundTrack = playSound('soundtrack', 1, true);

        this.gotoMenu();
    };

    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function(){
        _oGame = new CGame(_oData);   
							
        _iState = STATE_GAME;

    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        Howler.mute(true);
     };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = !s_bPlayActive;
        $("#block_game").css("display","none");

        if(s_bAudioActive){
                Howler.mute(false);
        }
    };

    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    
    s_bAudioActive = _oData.audio_enable_on_startup;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = false;
var s_bPlayActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_aSounds;
var s_aSoundsInfo;
var s_oCanvas;
var s_bFullscreen = false;