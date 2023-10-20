TEXT_LOSE         = "GAME OVER";
TEXT_WIN          = "CONGRATULATIONS!!!";
TEXT_SCORE        = "SCORE";
TEXT_PLAY         = "PLAY";
TEXT_EXIT         = "EXIT";
TEXT_CHOOSE_LANG  = "CHOOSE A LANGUAGE";
TEXT_TOT_SCORE    = "TOTAL SCORE";
TEXT_WORD_FOUND   = "WORDS FOUND";
TEXT_LONGEST_WORD = "LONGEST WORD";
TEXT_BEST_WORD    = "BEST WORD";
TEXT_HELP         = "COMPOSE AS MANY WORDS AS POSSIBLE DRAWING A LINE!";

var TEXT_CREDITS_DEVELOPED = "DEVELOPED BY";
var TEXT_LINK1 = "WWW.CODETHISLAB.COM";

TEXT_SHARE_IMAGE = "200x200.jpg";
TEXT_SHARE_TITLE = "Congratulations!";
TEXT_SHARE_MSG1 = "You collected <strong>";
TEXT_SHARE_MSG2 = " points</strong>!<br><br>Share your score with your friends!";
TEXT_SHARE_SHARE1 = "My score is ";
TEXT_SHARE_SHARE2 = " points! Can you do better?";
   
function changeLanguage(){
    switch(s_iLangSelected){
            case LABEL_LANG_0:{
                TEXT_LOSE         = "GAME OVER";
                TEXT_WIN          = "CONGRATULATIONS!!!";
                TEXT_SCORE        = "SCORE";
                TEXT_PLAY         = "PLAY";
                TEXT_EXIT         = "EXIT";
                TEXT_CHOOSE_LANG  = "CHOOSE A LANGUAGE";
                TEXT_TOT_SCORE    = "TOTAL SCORE";
                TEXT_WORD_FOUND   = "WORDS FOUND";
                TEXT_LONGEST_WORD = "LONGEST WORD";
                TEXT_BEST_WORD    = "BEST WORD";
                TEXT_HELP         = "COMPOSE AS MANY WORDS AS POSSIBLE DRAWING A LINE!";
                break;
            }
            
            case LABEL_LANG_1:{
                TEXT_LOSE         = "GAME OVER";
                TEXT_WIN          = "GLÜCKWÜNSCHE!!!";
                TEXT_SCORE        = "ERGEBNIS";
                TEXT_PLAY         = "SPIELEN";
                TEXT_EXIT         = "EXIT";
                TEXT_CHOOSE_LANG  = "SPRACHE AUSWÄHLEN";
                TEXT_TOT_SCORE    = "GESAMTPUNKTZAHL";
                TEXT_WORD_FOUND   = "WÖRTER GEFUNDEN";
                TEXT_LONGEST_WORD = "LÄNGSTE WORT";
                TEXT_BEST_WORD    = "BESTE WORT";
                TEXT_HELP         = "KOMPIEREN SO VIELE WÖRTER WIE MÖGLICH!";
                break;
            }
            
            case LABEL_LANG_2:{
                TEXT_LOSE         = "FIN DEL JUEGO";
                TEXT_WIN          = "¡FELICIDADES!";
                TEXT_SCORE        = "PUNTOS";
                TEXT_PLAY         = "JUGAR";
                TEXT_EXIT         = "SALIR";
                TEXT_CHOOSE_LANG  = "SELECCIONA UN IDIOMA";
                TEXT_TOT_SCORE    = "PUNTUACIÓN TOTAL";
                TEXT_WORD_FOUND   = "PALABRAS HALLADAS";
                TEXT_LONGEST_WORD = "PALABRA MÁS LARGA";
                TEXT_BEST_WORD    = "MEJOR PALABRA";
                TEXT_HELP         = "¡COMPONGAS TODAS LAS PALABRAS POSIBLES!";
                break;
            }

            case LABEL_LANG_3:{
                TEXT_LOSE         = "FIN DU JEU ";
                TEXT_WIN          = "FÉLICITATIONS!!!";
                TEXT_SCORE        = "SCORE";
                TEXT_PLAY         = "JOUER";
                TEXT_EXIT         = "SORTIR";
                TEXT_CHOOSE_LANG  = "CHOISISSEZ LA LANGUE";
                TEXT_TOT_SCORE    = "SCORE TOTAL";
                TEXT_WORD_FOUND   = "MOTS TROUVÉS";
                TEXT_LONGEST_WORD = "MOT LE PLUS LONG";
                TEXT_BEST_WORD    = "MEILLEUR MOT";
                TEXT_HELP         = "COMPOSER AUTANT DE MOTS QUE POSSIBLE!";
                break;
            }
            case LABEL_LANG_4:{
                TEXT_LOSE         = "GAME OVER";
                TEXT_WIN          = "COMPLIMENTI!!!";
                TEXT_SCORE        = "PUNTI";
                TEXT_PLAY         = "GIOCA";
                TEXT_EXIT         = "ESCI";
                TEXT_CHOOSE_LANG  = "SCEGLI UNA LINGUA";
                TEXT_TOT_SCORE    = "PUNTI TOTALI";
                TEXT_WORD_FOUND   = "PAROLE TROVATE";
                TEXT_LONGEST_WORD = "PAROLA PIÙ LUNGA";
                TEXT_BEST_WORD    = "MIGLIOR PAROLA";
                TEXT_HELP         = "COMPONI PIÙ PAROLE CHE PUOI!";
                break;
            }

            case LABEL_LANG_5:{
                TEXT_LOSE         = "FIM DE JOGO";
                TEXT_WIN          = "PARABÉNS!!!!";
                TEXT_SCORE        = "ESCORE";
                TEXT_PLAY         = "JOGAR";
                TEXT_EXIT         = "SAIR";
                TEXT_CHOOSE_LANG  = "ESCOLHE UMA LÍNGUA";
                TEXT_TOT_SCORE    = "PONTUAÇÃO TOTAL";
                TEXT_WORD_FOUND   = "PALAVRAS ENCONTRADAS";
                TEXT_LONGEST_WORD = "PALAVRA MAIS LONGA";
                TEXT_BEST_WORD    = "MELHOR PALAVRA";
                TEXT_HELP         = "COMPONHA TANTAS PALAVRAS QUANTO POSSÍVEL!";
                break;
            }  
        }
}