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
        createjs.Touch.enable(s_oStage,true);
        
        s_bMobile = isMobile();

        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = 30;
        
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
        
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'death',loop:false,volume:1, ingamename: 'death'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'money',loop:false,volume:1, ingamename: 'money'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'platform_2_broken',loop:false,volume:1, ingamename: 'platform_2_broken'});
        s_aSoundsInfo.push({path: './sounds/',filename:'platform_3_wind',loop:false,volume:1, ingamename: 'platform_3_wind'});
        s_aSoundsInfo.push({path: './sounds/',filename:'power_up',loop:false,volume:1, ingamename: 'power_up'});
        s_aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'press_button'});
        s_aSoundsInfo.push({path: './sounds/',filename:'spring',loop:false,volume:1, ingamename: 'spring'});
        s_aSoundsInfo.push({path: './sounds/',filename:'voice_falling',loop:false,volume:1, ingamename: 'voice_falling'});
        s_aSoundsInfo.push({path: './sounds/',filename:'voice_jump_1',loop:false,volume:1, ingamename: 'voice_jump_1'});
        s_aSoundsInfo.push({path: './sounds/',filename:'voice_jump_2',loop:false,volume:1, ingamename: 'voice_jump_2'});
        s_aSoundsInfo.push({path: './sounds/',filename:'wings',loop:false,volume:1, ingamename: 'wings'});
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        
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
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_scroll_1","./sprites/bg_scroll_1.jpg");
        s_oSpriteLibrary.addSprite("bg_scroll_2","./sprites/bg_scroll_2.jpg");
        s_oSpriteLibrary.addSprite("bg_scroll_3","./sprites/bg_scroll_3.jpg");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        
        s_oSpriteLibrary.addSprite("player","./sprites/player.png");
        s_oSpriteLibrary.addSprite("god","./sprites/player_god_power.png");
        s_oSpriteLibrary.addSprite("falling","./sprites/player_falling.png");
        s_oSpriteLibrary.addSprite("stunned","./sprites/player_stunned.png");
        
        s_oSpriteLibrary.addSprite("platform_0","./sprites/platform_0.png");
        s_oSpriteLibrary.addSprite("platform_1","./sprites/platform_1.png")
        s_oSpriteLibrary.addSprite("platform_2","./sprites/platform_2.png");
        s_oSpriteLibrary.addSprite("platform_3","./sprites/platform_3.png");
        
        s_oSpriteLibrary.addSprite("god_cloud_0","./sprites/cloud_cupido.png")
        s_oSpriteLibrary.addSprite("god_cloud_1","./sprites/cloud_mars.png");
        s_oSpriteLibrary.addSprite("god_cloud_2","./sprites/cloud_poseidon.png");
        s_oSpriteLibrary.addSprite("clouds_in_overlay","./sprites/clouds.png");
        
        s_oSpriteLibrary.addSprite("spring","./sprites/spring.png");
        s_oSpriteLibrary.addSprite("wings","./sprites/wings.png");
        s_oSpriteLibrary.addSprite("coin","./sprites/coin.png");
        
        s_oSpriteLibrary.addSprite("help_monitor","./sprites/help_monitor.png");
        s_oSpriteLibrary.addSprite("help_mouse","./sprites/help_mouse.png");
        s_oSpriteLibrary.addSprite("help_smartphone","./sprites/help_smartphone.png");
        s_oSpriteLibrary.addSprite("help_touch","./sprites/help_touch.png");
        s_oSpriteLibrary.addSprite("smartphone_rotation","./sprites/smartphone_rotation.png");
        s_oSpriteLibrary.addSprite("dividing_line","./sprites/dividing_line.png");
        s_oSpriteLibrary.addSprite("but_skip","./sprites/but_skip.png");
        s_oSpriteLibrary.addSprite("but_next","./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        

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

        s_oSoundTrack = playSound("soundtrack", 1,true);

        this.gotoMenu();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };    

    this.gotoGame = function(iLevel){        
        _oGame = new CGame(_oData, iLevel);   						
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
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
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
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    s_bAudioActive = oData.audio_enable_on_startup;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_bCanOrientate = false;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_bFullscreen = false;
var s_aSounds;
var s_aSoundsInfo;