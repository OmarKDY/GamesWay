<!DOCTYPE html>
<html>
    <head>
        <title>MASTERMIND</title>
        <link rel="stylesheet" href="css/reset.css" type="text/css">
        <link rel="stylesheet" href="css/main.css" type="text/css">
        <link rel="stylesheet" href="css/orientation_utils.css" type="text/css">
        <link rel='shortcut icon' type='image/x-icon' href='./favicon.ico' />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" />
	<meta name="msapplication-tap-highlight" content="no"/>

        <script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="js/easeljs-NEXT.min.js"></script>
        <script type="text/javascript" src="js/howler.min.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        
    </head>
    <body ondragstart="return false;" ondrop="return false;" >
	<div style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%"></div>
          <script>
            $(document).ready(function(){
                     var oMain = new CMain({
                                            
                                            points_for_attempts: 1000, //Points for any row
                                            audio_enable_on_startup:false, //ENABLE/DISABLE AUDIO WHEN GAME STARTS 
                                            check_orientation: true,
                                            enable_fullscreen: true,
                                            level_menu_rows: 6,
                                            level_menu_cols: 5
                                           });
                                           
                                           
                    $(oMain).on("start_session", function(evt) {
                            if(getParamValue('ctl-arcade') === "true"){
                                parent.__ctlArcadeStartSession();
                            }
                            //...ADD YOUR CODE HERE EVENTUALLY
                    });
                     
                    $(oMain).on("end_session", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndSession();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("restart_level", function(evt, iLevel) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeRestartLevel({level:iLevel});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("save_score", function(evt,iScore, szMode) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeSaveScore({score:iScore, mode: szMode});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("start_level", function(evt, iLevel) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeStartLevel({level:iLevel});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("end_level", function(evt,iLevel) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndLevel({level:iLevel});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("show_interlevel_ad", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShowInterlevelAD();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });
                    
                    $(oMain).on("share_event", function(evt, iScore) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShareEvent({   img: TEXT_SHARE_IMAGE,
                                                                title: TEXT_SHARE_TITLE,
                                                                msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
                                                                msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });
					 
                    if(isIOS()){ 
                        setTimeout(function(){sizeHandler();},200); 
                    }else{ sizeHandler(); } 
                                         
           });

        </script>
        <div class="check-fonts">
            <p class="check-font-1">1</p>
        </div> 
        
        <canvas id="canvas" class='ani_hack' width="768" height="1400"> </canvas>
        <div data-orientation="portrait" class="orientation-msg-container"><p class="orientation-msg-text">Please rotate your device</p></div>
        <div id="block_game" style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%; display:none"></div>

    </body>
</html>
