var LEVEL_TURNS = [1,2,3,4,5,6,7,8,9,10,11,12];

var BOTTOM_TRAMPOLINE_OFFSETS = {x: 120, y: -260};
var MIDDLE_TRAMPOLINE_OFFSETS = {x: 85, y: -250};
var TOP_TRAMPOLINE_OFFSETS = {x: 45, y: -250};

// BODY PARTS CREATION DATA
var INFOS_HEAD = {type: DYNAMIC_BODY, x: -0.07,y: -2.18, 
                angle: 0, radius: 0.2171392125802467, issensor: false, 
                category: 1, maskbits: 65535, userdata: FIXTURE_HEAD};
var INFOS_LEFTTOPLEG = {type: DYNAMIC_BODY, x: -0.07,y: -0.77, 
                        angle: 0, issensor: false, category: 2,
                        vertices:[{x: -0.12376921880114142, y: -0.3270568335524789},
                                  {x: 0.12376921880114142, y: -0.3270568335524789},
                                  {x: 0.12376921880114142, y: 0.3270568335524789},
                                  {x: -0.12376921880114142, y: 0.3270568335524789}],
                        maskbits: 65532, userdata: FIXTURE_LEFTTOPLEG};
var INFOS_LEFTBOTTOMLEG = {type: DYNAMIC_BODY, x: -0.04,y: -0.24,
                        angle: 0, issensor: false, category: 2,
                        vertices:[{x: -0.09903755590449762, y: -0.32783316377793414},
                                  {x: 0.09903755590449762, y: -0.32783316377793414},
                                  {x: 0.09903755590449762, y: 0.32783316377793414},
                                  {x: -0.09903755590449762, y: 0.32783316377793414}],
                        maskbits: 65532, userdata: FIXTURE_LEFTBOTTOMLEG};
var INFOS_LEFTARM = {type: DYNAMIC_BODY, x: 0.01,y: -1.42,
                    angle: 1.31966518272325, issensor: false, category: 2,
                    vertices:[{x: -0.5305662569396605, y: -0.1317543296915377},
                              {x: 0.5305662569396605, y: -0.1317543296915377},
                              {x: 0.5305662569396605, y: 0.1317543296915377},
                              {x: -0.5305662569396605, y: 0.1317543296915377}],
                    maskbits: 65532, userdata: FIXTURE_LEFTARM};
var INFOS_TORSO = {type: DYNAMIC_BODY, x: -0.07,y: -1.50,
                angle: 0, issensor: false, category: 2,
                vertices:[{x: -0.1866519670630118, y: -0.5045037422279507},
                          {x: 0.1866519670630118, y: -0.5045037422279507},
                          {x: 0.1866519670630118, y: 0.5045037422279507},
                          {x: -0.1866519670630118, y: 0.5045037422279507}],
                maskbits: 65535, userdata: FIXTURE_TORSO};
var INFOS_RIGHTARM = {type: DYNAMIC_BODY, x: 0,y: -1.39,
                angle: 1.3755806810294156, issensor: false, category: 2,
                vertices:[{x: -0.5305662569396605, y: -0.1317543296915377},
                          {x: 0.5305662569396605, y: -0.1317543296915377},
                          {x: 0.5305662569396605, y: 0.1317543296915377},
                          {x: -0.5305662569396605, y: 0.1317543296915377}],
                maskbits: 65532, userdata: FIXTURE_RIGHTARM};
var INFOS_RIGHTTOPLEG = {type: DYNAMIC_BODY, x: -0.018,y: -0.79,
                angle: -0.04667548270906963, issensor: false, category: 2,
                vertices:[{x: -0.12376921880114142, y: -0.3270568335524789},
                          {x: 0.12376921880114142, y: -0.3270568335524789},
                          {x: 0.12376921880114142, y: 0.3270568335524789},
                          {x: -0.12376921880114142, y: 0.3270568335524789}],
                maskbits: 65532, userdata: FIXTURE_RIGHTTOPLEG};
var INFOS_RIGHTBOTTOMLEG = {type: DYNAMIC_BODY, x: 0.013,y: -0.24,
                angle: -0.04667548270906963, issensor: false, category: 2,
                vertices:[{x: -0.09903755590449762, y: -0.32783316377793414},
                          {x: 0.09903755590449762, y: -0.32783316377793414},
                          {x: 0.09903755590449762, y: 0.32783316377793414},
                          {x: -0.09903755590449762, y: 0.32783316377793414}],
                maskbits: 65532, userdata: FIXTURE_RIGHTBOTTOMLEG};
var INFOS_RIGHTFOOT = {type: DYNAMIC_BODY, x: 0.154,y: 0.039,
                angle: 0, issensor: false, category: 2,
                vertices:[{x: -0.26, y: -0.09},
                          {x: 0.26, y: -0.09},
                          {x: 0.26, y: 0.09},
                          {x: -0.26, y: 0.09}],
                maskbits: 65535, userdata: FIXTURE_RIGHTFOOT};
var INFOS_LEFTFOOT = {type: DYNAMIC_BODY, x: 0.15,y: 0.078,
                angle: 0, issensor: false, category: 2,
                vertices:[{x: -0.26, y: -0.09},
                          {x: 0.26, y: -0.09},
                          {x: 0.26, y: 0.09},
                          {x: -0.26, y: 0.09}],
                maskbits: 65535, userdata: FIXTURE_LEFTFOOT};
            
// JOINT CREATION DATA
var INFOS_LEFTSHOULDER = {bodyAX: -0.021818125126024324, bodyAY: -0.2972569519582997, 
                    bodyBX: -0.3901191380953495, bodyBY: 0.011428736567944492, 
                    angle: 1.0877738585480112, enablelimit: false, lowerangle: 0, upperangle: 0};
var INFOS_RIGHTSHOULDER = {bodyAX: -0.012262777094335764, bodyAY: -0.32381192571155637, 
                    bodyBX: -0.4213315726730712, bodyBY: 0.006350948887133168, 
                    angle: 1.0877738585480112, enablelimit: false, lowerangle: 0, upperangle: 0};
var INFOS_LEFTPELVIS = {bodyAX: 0.0013814552390929435, bodyAY: 0.4456054190468741, 
                    bodyBX: 0.003710445915458216, bodyBY: -0.2763816906264509, 
                    angle: 0, enablelimit: true, lowerangle: -2, upperangle: 1};
var INFOS_RIGHTPELVIS = {bodyAX: 0.04524332569397238, bodyAY: 0.4357214958038327, 
                    bodyBX: 0.004657981352730797, bodyBY: -0.2662812673311288, 
                    angle: -0.04667548270906963, enablelimit: true, lowerangle: -2, upperangle: 1};
var INFOS_NECK = {bodyAX: 0.004325268398964521, bodyAY: -0.4903079895339122, 
                    bodyBX: -0.00022180863584431165, bodyBY: 0.19607883408639637, 
                    angle: 0, enablelimit: true, lowerangle: 0, upperangle: 0};
var INFOS_RIGHTKNEE = {bodyAX: 0.010180229153708122, bodyAY: 0.28647357355402003, 
                    bodyBX: 0.004325268398964481, bodyBY: -0.2661703630132082, 
                    angle: 0, enablelimit: true, lowerangle: 0, upperangle: 10};
var INFOS_LEFTKNEE = {bodyAX: 0.034710445915458354, bodyAY: 0.2521183093735484, 
                    bodyBX: 0.007388899793894232, bodyBY: -0.2790365182196286, 
                    angle: 0, enablelimit: true, lowerangle: 0, upperangle: 10};                
var INFOS_RIGHTANKLE = {bodyAX: -0.129, bodyAY: -0.0225, 
                    bodyBX: 0.07138889979389407, bodyBY: 0.25996348178037326, 
                    angle: 0, enablelimit: true, lowerangle: 0, upperangle: 0};
var INFOS_LEFTANKLE = {bodyAX: -0.123, bodyAY: -0.03999999999999996, 
                    bodyBX: -0.0013868603683696058, bodyBY: 0.2811479523056318, 
                    angle: 0, enablelimit: true, lowerangle: 0, upperangle: 0};
                
// WORLD CREATION DATA
var INFOS_WATER = {type: STATIC_BODY, x: 4.910499999999998, y: 13.510249999999996, 
                angle: 0, issensor: true, category: 4,
                vertices:[{x: -5.180547949355308, y: -1.5190772592254775},
                          {x: 5.180547949355308, y: -1.5190772592254775},
                          {x: 5.180547949355308, y: 1.5190772592254775},
                          {x: -5.180547949355308, y: 1.5190772592254775}],
                maskbits: 65535, userdata: FIXTURE_WATER};
            
var INFOS_TOPTRAMPOLINE = {type: STATIC_BODY, 
                x: [1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2],
                y: [2.03,2.03,2.33,2.78,2.78,2.78,2.7,2.7,2.7,2.5,2.5,2.5],
                angle: 0, issensor: false, category: 4,
                vertices:[{x: -0.9019460970148836, y: -0.17756877576113322},
                          {x: 0.9019460970148836, y: -0.17756877576113322},
                          {x: 0.9019460970148836, y: 0.17756877576113322},
                          {x: -0.9019460970148836, y: 0.17756877576113322}],
                maskbits: 65535, userdata: FIXTURE_TRAMPOLINE[0]};
var INFOS_MIDDLETRAMPOLINE = {type: STATIC_BODY, 
                x: [1.0,1.0,1.0,1.0,1.0,1.0,1.2,1.2,1.2,1.0,1.0,1.0],
                y: [5.09,6.09,6.09,6.29,6.29,6.29,5.99,5.99,5.99,5.69,5.69,5.69], 
                angle: 0, issensor: false, category: 4,
                vertices:[{x: -1.13525, y: -0.22349999999999995},
                          {x: 1.13525, y: -0.22349999999999995},
                          {x: 1.13525, y: 0.22349999999999995},
                          {x: -1.13525, y: 0.22349999999999995}],
                maskbits: 65535, userdata: FIXTURE_TRAMPOLINE[1]};
var INFOS_BOTTOMTRAMPOLINE = {type: STATIC_BODY, 
                x: [1.52,1.52,1.52,1.52,1.52,1.52,1.6,1.6,1.6,1.22,1.22,1.22], 
                y: [9.71,9.71,9.71,9.71,9.71,9.71,9,9,9,9,9,9], 
                angle: 0, issensor: false, category: 4,
                vertices:[{x: -1.5604995941607498, y: -0.30722013591273073},
                          {x: 1.5604995941607498, y: -0.30722013591273073},
                          {x: 1.5604995941607498, y: 0.30722013591273073},
                          {x: -1.5604995941607498, y: 0.30722013591273073}],
                maskbits: 65535, userdata: FIXTURE_TRAMPOLINE[2]};
            
var HEAD_OFFSET = {x:0,y:0};
var TORSO_OFFSET = {x: INFOS_TORSO.x - INFOS_HEAD.x, y: INFOS_TORSO.y - INFOS_HEAD.y};
var LEFTBOTTOMLEG_OFFSET = {x: INFOS_LEFTBOTTOMLEG.x - INFOS_HEAD.x, y: INFOS_LEFTBOTTOMLEG.y - INFOS_HEAD.y};
var LEFTTOPLEG_OFFSET = {x: INFOS_LEFTTOPLEG.x - INFOS_HEAD.x, y: INFOS_LEFTTOPLEG.y - INFOS_HEAD.y};
var RIGHTBOTTOMLEG_OFFSET = {x: INFOS_RIGHTBOTTOMLEG.x - INFOS_HEAD.x, y: INFOS_RIGHTBOTTOMLEG.y - INFOS_HEAD.y};
var RIGHTTOPLEG_OFFSET = {x: INFOS_RIGHTTOPLEG.x - INFOS_HEAD.x, y: INFOS_RIGHTTOPLEG.y - INFOS_HEAD.y};
var LEFTARM_OFFSET = {x: INFOS_LEFTARM.x - INFOS_HEAD.x, y: INFOS_LEFTARM.y - INFOS_HEAD.y};
var RIGHTARM_OFFSET = {x: INFOS_RIGHTARM.x - INFOS_HEAD.x, y: INFOS_RIGHTARM.y - INFOS_HEAD.y};
var LEFTFOOT_OFFSET = {x: INFOS_LEFTFOOT.x - INFOS_HEAD.x, y: INFOS_LEFTFOOT.y - INFOS_HEAD.y};
var RIGHTFOOT_OFFSET = {x: INFOS_RIGHTFOOT.x - INFOS_HEAD.x, y: INFOS_RIGHTFOOT.y - INFOS_HEAD.y};
