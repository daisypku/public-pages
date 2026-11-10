globalThis.WUYUE_CONTENT = {
  "events": [
    {
      "year": "公元930年",
      "title": "钱塘新政",
      "text": "旧臣请修仓廪，新贵请扩亲军。百姓只盼今年不再加役。",
      "choices": [
        {
          "label": "先整仓廪",
          "desc": "修补府仓，稳住最初的粮食余量。",
          "delta": {
            "food": 35,
            "money": -18,
            "stability": 3
          }
        },
        {
          "label": "裁省杂役",
          "desc": "减轻州县负担，换取民心。",
          "delta": {
            "morale": 4,
            "fiscal": 4,
            "money": -12
          }
        },
        {
          "label": "扩充亲军",
          "desc": "让钱塘先有自保之力。",
          "delta": {
            "army": 35,
            "money": -28,
            "morale": -3,
            "fiscal": 8,
            "people": -3,
            "stability": -2
          }
        }
      ]
    },
    {
      "year": "公元931年",
      "title": "春汛修渠",
      "text": "苕溪水涨，低田受淹。乡老称若能趁势修渠，三年内可少忧旱涝。",
      "choices": [
        {
          "label": "趁汛开渠",
          "desc": "趁水势重修渠堰，立刻耗费钱帛。",
          "delta": {
            "food": 45,
            "money": -35,
            "morale": 4,
            "stability": 3
          }
        },
        {
          "label": "迁民避水",
          "desc": "先保百姓性命，农事会受耽搁。",
          "delta": {
            "morale": 4,
            "food": -20,
            "stability": 3,
            "people": -2
          }
        },
        {
          "label": "征夫筑堤",
          "desc": "堤防见效更快，但徭役伤民。",
          "delta": {
            "stability": 3,
            "food": 20,
            "morale": -6,
            "fiscal": 5,
            "people": -4
          }
        }
      ]
    },
    {
      "year": "公元932年",
      "title": "越州盐利",
      "text": "越州盐场报称可增岁入，但盐价一动，市井怨声也会随之而起。",
      "choices": [
        {
          "label": "平价官盐",
          "desc": "压住盐价，少赚钱但稳民心。",
          "delta": {
            "money": 35,
            "morale": 4,
            "fiscal": 2
          }
        },
        {
          "label": "增设盐课",
          "desc": "府库充实，市井怨气也会起来。",
          "delta": {
            "money": 70,
            "morale": -8,
            "fiscal": -2
          }
        },
        {
          "label": "缉私归官",
          "desc": "打击私盐，州县更听令。",
          "delta": {
            "money": 55,
            "stability": 3,
            "prestige": 2,
            "fiscal": 3
          }
        }
      ]
    },
    {
      "year": "公元933年",
      "title": "山越未靖",
      "text": "山地部曲不服州县调令，边吏请兵，民曹则怕再扰农时。",
      "choices": [
        {
          "label": "招抚山寨",
          "desc": "以粮帛安抚山民，换取边地安静。",
          "delta": {
            "food": -25,
            "money": -18,
            "morale": 4,
            "stability": 3
          }
        },
        {
          "label": "遣将入山",
          "desc": "用兵见效快，也会牵动军费。",
          "delta": {
            "army": 35,
            "threat": -4,
            "money": -25,
            "fiscal": 6,
            "people": -3,
            "stability": -2
          }
        },
        {
          "label": "设寨互市",
          "desc": "以市易化解敌意，收益较慢，也要派吏驻守。",
          "delta": {
            "money": 30,
            "food": 18,
            "stability": 3,
            "threat": -2,
            "fiscal": 3
          }
        }
      ]
    },
    {
      "year": "公元934年",
      "title": "明州商船",
      "text": "海商自明州来，愿以船税换取官府护航。港市若开，钱帛会更快流动。",
      "choices": [
        {
          "label": "准其护航",
          "desc": "给商船官府背书，港税随之增加。",
          "delta": {
            "money": 70,
            "army": 10,
            "fiscal": 5
          }
        },
        {
          "label": "减税引船",
          "desc": "先养港市人气，国威和民心更稳，但短期税基变薄。",
          "delta": {
            "money": 40,
            "prestige": 5,
            "morale": 3,
            "fiscal": 3
          }
        },
        {
          "label": "严查海货",
          "desc": "把港市管住，但商旅会嫌束手。",
          "delta": {
            "stability": 3,
            "money": 28,
            "prestige": -2
          }
        }
      ]
    },
    {
      "year": "公元935年",
      "title": "仓米霉坏",
      "text": "连雨入仓，旧米霉坏。追责会伤官心，不追责会伤民心。",
      "choices": [
        {
          "label": "汰换仓吏",
          "desc": "清理失职小吏，州县一时震动。",
          "delta": {
            "stability": 3,
            "morale": 3,
            "money": -12
          }
        },
        {
          "label": "晒米济贫",
          "desc": "把可用旧米发给贫户。",
          "delta": {
            "food": -35,
            "morale": 4,
            "stability": 2,
            "people": 3
          }
        },
        {
          "label": "隐而不发",
          "desc": "保住官面，却埋下民怨。",
          "delta": {
            "money": 20,
            "stability": -5,
            "morale": -6
          }
        }
      ]
    },
    {
      "year": "公元936年",
      "title": "南唐遣书",
      "text": "南唐国书至，言辞温和，却问吴越边军几何。朝中无人敢说这只是寒暄。",
      "choices": [
        {
          "label": "厚礼回书",
          "desc": "以礼压住边衅，府库略伤。",
          "delta": {
            "money": -45,
            "threat": -10,
            "submit": 5
          }
        },
        {
          "label": "陈兵边市",
          "desc": "让南唐看到吴越尚有兵威。",
          "delta": {
            "army": 28,
            "prestige": 5,
            "threat": 6,
            "independent": 5,
            "people": -2,
            "stability": -2
          }
        },
        {
          "label": "只叙旧盟",
          "desc": "不软不硬，维持表面和气，也要备礼周旋。",
          "delta": {
            "stability": 3,
            "prestige": 3,
            "threat": -2,
            "money": -12
          }
        }
      ]
    },
    {
      "year": "公元937年",
      "title": "钱塘筑城",
      "text": "工匠请修城垣，商人嫌其妨市，武臣却称城墙就是国祚。",
      "choices": [
        {
          "label": "修内城门",
          "desc": "先护王府和仓廪，花费较小。",
          "delta": {
            "stability": 3,
            "threat": -4,
            "money": -28
          }
        },
        {
          "label": "拓外郭城",
          "desc": "大修外城，威势显著。",
          "delta": {
            "prestige": 5,
            "threat": -8,
            "money": -60,
            "fiscal": 8,
            "people": -3,
            "stability": -2
          }
        },
        {
          "label": "缓修通市",
          "desc": "先让商路不受阻，财政较稳。",
          "delta": {
            "money": 45,
            "morale": 2,
            "threat": 3
          }
        }
      ]
    },
    {
      "year": "公元938年",
      "title": "贡赋争议",
      "text": "岁贡该送往何处，朝堂争执不下。多送可免兵祸，少送可存府库。",
      "choices": [
        {
          "label": "厚贡中原",
          "desc": "换取北方暂缓目光。",
          "delta": {
            "money": -55,
            "submit": 9,
            "threat": -9,
            "prestige": -3
          }
        },
        {
          "label": "薄礼两边",
          "desc": "两面维持，不求有功。",
          "delta": {
            "money": -25,
            "threat": -3,
            "stability": 3
          }
        },
        {
          "label": "扣贡备荒",
          "desc": "把贡赋留给州县，风险也留给边境。",
          "delta": {
            "food": 35,
            "money": 25,
            "threat": 8,
            "independent": 5
          }
        }
      ]
    },
    {
      "year": "公元939年",
      "title": "乡兵轮戍",
      "text": "边境缺兵，州县建议轮调乡兵。此法省钱，却会误农时。",
      "choices": [
        {
          "label": "短期轮戍",
          "desc": "补边防但尽量不误农。",
          "delta": {
            "army": 25,
            "threat": -4,
            "food": -12,
            "morale": -2,
            "people": -4,
            "stability": -2
          }
        },
        {
          "label": "雇募壮丁",
          "desc": "用钱帛代替强征，民怨较少。",
          "delta": {
            "army": 35,
            "money": -35,
            "morale": 2,
            "fiscal": 3
          }
        },
        {
          "label": "免戍劝农",
          "desc": "保住农时，边境压力会回升。",
          "delta": {
            "food": 40,
            "morale": 4,
            "threat": 7,
            "people": 4
          }
        }
      ]
    },
    {
      "year": "公元940年",
      "title": "两浙丰年",
      "text": "今年稻熟，仓廪渐实。是趁势减赋收心，还是积谷备战？",
      "choices": [
        {
          "label": "平粜新米",
          "desc": "以官仓压低米价，民心上升。",
          "delta": {
            "food": -20,
            "morale": 4,
            "stability": 3,
            "people": 3
          }
        },
        {
          "label": "积谷入仓",
          "desc": "优先扩充储备，应对后年不测。",
          "delta": {
            "food": 70,
            "money": -15,
            "morale": -2
          }
        },
        {
          "label": "折粮为钱",
          "desc": "把丰收转化为府库收入。",
          "delta": {
            "money": 65,
            "food": -25,
            "fiscal": -2
          }
        }
      ]
    },
    {
      "year": "公元941年",
      "title": "港市夜税",
      "text": "港市繁盛，夜船不绝。税吏称可加征夜税，商人则暗中怨望。",
      "choices": [
        {
          "label": "夜税减半",
          "desc": "留住商旅，少取一时之利，财政压力会留到后面。",
          "delta": {
            "money": 35,
            "morale": 4,
            "prestige": 3,
            "fiscal": 3
          }
        },
        {
          "label": "照章加征",
          "desc": "港税立刻见效，但市井不悦。",
          "delta": {
            "money": 70,
            "morale": -6,
            "stability": -3,
            "people": -3
          }
        },
        {
          "label": "设灯巡港",
          "desc": "以巡防换税收，兼顾秩序。",
          "delta": {
            "money": 55,
            "stability": 3,
            "fiscal": 4
          }
        }
      ]
    },
    {
      "year": "公元942年",
      "title": "湖州水患",
      "text": "湖州堤岸忽决，流民入钱塘。救灾耗费极大，但若不救，安定必失。",
      "choices": [
        {
          "label": "开仓赈湖",
          "desc": "大开官仓并设棚安民，粮食和钱帛都要重耗。",
          "delta": {
            "food": -120,
            "money": -55,
            "morale": 4,
            "stability": 3,
            "fiscal": 4,
            "people": 5
          }
        },
        {
          "label": "拨钱修堤",
          "desc": "以钱帛抢修堤岸，同时征买木石。",
          "delta": {
            "money": -85,
            "food": -20,
            "stability": 3,
            "morale": 4,
            "fiscal": 6
          }
        },
        {
          "label": "分流安置",
          "desc": "把流民分散到各州县，短期省府库，长期添负担。",
          "delta": {
            "people": 8,
            "morale": 4,
            "stability": -5,
            "fiscal": 8,
            "food": -20
          }
        }
      ]
    },
    {
      "year": "公元943年",
      "title": "书院请田",
      "text": "钱塘士人请设书院田，称可养士修文。武臣讥其不能守城。",
      "choices": [
        {
          "label": "拨田养士",
          "desc": "文脉增长，短期少了些田赋。",
          "delta": {
            "prestige": 5,
            "morale": 3,
            "money": -20
          }
        },
        {
          "label": "令其自筹",
          "desc": "不伤府库，但士人失望。",
          "delta": {
            "money": 15,
            "prestige": -2,
            "stability": 2
          }
        },
        {
          "label": "兼训吏员",
          "desc": "书院也为州县培养吏才。",
          "delta": {
            "stability": 3,
            "prestige": 4,
            "money": -25
          }
        }
      ]
    },
    {
      "year": "公元944年",
      "title": "海盗犯境",
      "text": "海盗劫掠明州外海，商船停泊不出。港市若冷，府库亦冷。",
      "choices": [
        {
          "label": "急造巡船",
          "desc": "用船防海，花费明显。",
          "delta": {
            "army": 30,
            "threat": -8,
            "money": -45,
            "fiscal": 5
          }
        },
        {
          "label": "悬赏捕盗",
          "desc": "以钱招募海上熟手。",
          "delta": {
            "threat": -6,
            "money": -30,
            "prestige": 4
          }
        },
        {
          "label": "暂闭外港",
          "desc": "先保安全，港税会受损。",
          "delta": {
            "stability": 3,
            "threat": -3,
            "money": -25
          }
        }
      ]
    },
    {
      "year": "公元945年",
      "title": "南唐边将",
      "text": "南唐边将私下索礼，称可代为缓颊。此事若传开，朝中必有非议。",
      "choices": [
        {
          "label": "暗给边礼",
          "desc": "便宜行事，能换一时安宁。",
          "delta": {
            "money": -30,
            "threat": -8,
            "prestige": -3
          }
        },
        {
          "label": "告诸金陵",
          "desc": "走正式外交，显得堂正。",
          "delta": {
            "prestige": 5,
            "threat": 2,
            "submit": 3
          }
        },
        {
          "label": "拒礼整边",
          "desc": "不受讹诈，边境更紧。",
          "delta": {
            "army": 25,
            "independent": 7,
            "threat": 8
          }
        }
      ]
    },
    {
      "year": "公元946年",
      "title": "豪右兼并",
      "text": "地方豪右借债吞田，贫民卖身求活。官府若下手，必触动州县根基。",
      "choices": [
        {
          "label": "清丈隐田",
          "desc": "查田能增收，也会得罪豪右。",
          "delta": {
            "money": 55,
            "stability": -4,
            "morale": 4
          }
        },
        {
          "label": "赎还贫户",
          "desc": "以官府出面救急。",
          "delta": {
            "money": -40,
            "morale": 4,
            "stability": 3,
            "people": 4
          }
        },
        {
          "label": "借豪右粮",
          "desc": "让豪右出粮赈民，欠下政治人情。",
          "delta": {
            "food": 55,
            "morale": 4,
            "prestige": -3
          }
        }
      ]
    },
    {
      "year": "公元947年",
      "title": "新铸钱法",
      "text": "财政官请新铸轻钱，以解府库之急。商人担忧物价，百姓担忧手中钱贱。",
      "choices": [
        {
          "label": "缓铸足钱",
          "desc": "少赚但稳住市价，朝堂会嫌见效太慢。",
          "delta": {
            "money": 35,
            "morale": 4,
            "fiscal": -2,
            "prestige": -1
          }
        },
        {
          "label": "急铸轻钱",
          "desc": "府库立刻宽裕，信用受损。",
          "delta": {
            "money": 70,
            "morale": -9,
            "stability": -5,
            "people": -3
          }
        },
        {
          "label": "限额试行",
          "desc": "小规模试铸，风险较低，但市井仍有疑虑。",
          "delta": {
            "money": 55,
            "prestige": 2,
            "fiscal": -1,
            "morale": -2
          }
        }
      ]
    },
    {
      "year": "公元948年",
      "title": "军府索饷",
      "text": "亲军称多年戍守，应补旧饷。府库不足，若拖欠，军心难测。",
      "choices": [
        {
          "label": "补发半饷",
          "desc": "先稳军心，府库承压。",
          "delta": {
            "army": 20,
            "money": -45,
            "fiscal": 6
          }
        },
        {
          "label": "以粮抵饷",
          "desc": "用仓粮解燃眉之急。",
          "delta": {
            "army": 15,
            "food": -45,
            "morale": -2
          }
        },
        {
          "label": "裁汰老弱",
          "desc": "减少军费，兵力也会下降。",
          "delta": {
            "army": -18,
            "fiscal": -8,
            "money": 20,
            "threat": 4
          }
        }
      ]
    },
    {
      "year": "公元949年",
      "title": "佛寺施粥",
      "text": "寺院愿开粥棚济民，却请求免除若干田税。朝臣争论善政与财源。",
      "choices": [
        {
          "label": "许寺施粥",
          "desc": "借寺院救民，财政少收。",
          "delta": {
            "morale": 4,
            "food": 15,
            "money": -18,
            "people": 3
          }
        },
        {
          "label": "官寺合赈",
          "desc": "官府与寺院共同出力。",
          "delta": {
            "morale": 4,
            "stability": 3,
            "food": -25,
            "money": -20,
            "people": 4
          }
        },
        {
          "label": "照征寺税",
          "desc": "守住税源，但民间议论。",
          "delta": {
            "money": 45,
            "prestige": -2,
            "morale": -4
          }
        }
      ]
    },
    {
      "year": "公元950年",
      "title": "中原易主",
      "text": "北方又换旗号。使者、商人、逃兵带来不同消息，谁也说不清谁会南下。",
      "choices": [
        {
          "label": "收留流人",
          "desc": "吸纳北来人口，也要养活他们。",
          "delta": {
            "people": 8,
            "morale": 3,
            "food": -25
          }
        },
        {
          "label": "遣使探问",
          "desc": "弄清北方新局势。",
          "delta": {
            "submit": 5,
            "threat": -4,
            "money": -25
          }
        },
        {
          "label": "闭关备变",
          "desc": "少听消息，先守住本境。",
          "delta": {
            "stability": 3,
            "army": 18,
            "prestige": -2
          }
        }
      ]
    },
    {
      "year": "公元951年",
      "title": "边寨告急",
      "text": "苏州边境传来急报，小股兵马越界试探。守将请增兵。",
      "choices": [
        {
          "label": "驰援边寨",
          "desc": "迅速增兵，军费随之上升。",
          "delta": {
            "army": 35,
            "threat": -8,
            "money": -32,
            "fiscal": 6,
            "people": -3,
            "stability": -2
          }
        },
        {
          "label": "修栅固守",
          "desc": "以工事减轻兵力压力。",
          "delta": {
            "stability": 3,
            "threat": -6,
            "money": -28
          }
        },
        {
          "label": "遣吏议界",
          "desc": "用文书争边，短期不稳。",
          "delta": {
            "prestige": 5,
            "threat": 3,
            "submit": 3
          }
        }
      ]
    },
    {
      "year": "公元952年",
      "title": "米价腾贵",
      "text": "米价三日三涨。商人称是运输受阻，百姓只知买不起粮。",
      "choices": [
        {
          "label": "官仓平粜",
          "desc": "压低米价，动用存粮。",
          "delta": {
            "food": -55,
            "morale": 4,
            "stability": 3,
            "people": 4
          }
        },
        {
          "label": "查禁囤米",
          "desc": "打击囤积，可能激怒商人。",
          "delta": {
            "stability": 3,
            "morale": 4,
            "money": -15
          }
        },
        {
          "label": "准价自调",
          "desc": "少干预市场，民怨会上来。",
          "delta": {
            "money": 35,
            "morale": -9,
            "fiscal": -2,
            "people": -2
          }
        }
      ]
    },
    {
      "year": "公元953年",
      "title": "贡船北上",
      "text": "一队贡船准备北上。有人说这是屈辱，有人说这是免战之价。",
      "choices": [
        {
          "label": "增礼求安",
          "desc": "多送一分，少一分兵祸。",
          "delta": {
            "money": -60,
            "submit": 10,
            "threat": -8,
            "prestige": -4
          }
        },
        {
          "label": "按例成行",
          "desc": "不增不减，维持旧礼。",
          "delta": {
            "money": -35,
            "submit": 4,
            "stability": 2
          }
        },
        {
          "label": "减礼试探",
          "desc": "试探北方底线。",
          "delta": {
            "money": -12,
            "independent": 6,
            "threat": 7,
            "prestige": 3
          }
        }
      ]
    },
    {
      "year": "公元954年",
      "title": "驿道修缮",
      "text": "驿道年久失修，文书传递迟缓。修路耗钱，却能让州县更听命。",
      "choices": [
        {
          "label": "修主干驿道",
          "desc": "先恢复钱塘到诸州的政令通路。",
          "delta": {
            "stability": 3,
            "money": -35,
            "fiscal": 3
          }
        },
        {
          "label": "役民补路",
          "desc": "少花钱，多扰民。",
          "delta": {
            "stability": 2,
            "morale": -6,
            "fiscal": 2,
            "people": -4
          }
        },
        {
          "label": "商旅助修",
          "desc": "让商人出资，换取通行便利。",
          "delta": {
            "money": -10,
            "stability": 3,
            "prestige": 3
          }
        }
      ]
    },
    {
      "year": "公元955年",
      "title": "船坞新制",
      "text": "工匠献新船图，可用于护航，也可用于载兵。用途不同，朝中意味也不同。",
      "choices": [
        {
          "label": "造护商快船",
          "desc": "优先保护海贸。",
          "delta": {
            "money": 55,
            "threat": -4,
            "fiscal": 4
          }
        },
        {
          "label": "造运兵大船",
          "desc": "为军事调动做准备。",
          "delta": {
            "army": 35,
            "independent": 6,
            "money": -40,
            "fiscal": 6,
            "people": -2,
            "stability": -2
          }
        },
        {
          "label": "赏工匠留图",
          "desc": "先保技术，不急扩造。",
          "delta": {
            "prestige": 5,
            "stability": 3,
            "money": -15
          }
        }
      ]
    },
    {
      "year": "公元956年",
      "title": "南唐求援",
      "text": "南唐被北方逼迫，暗中请吴越牵制。若应之，或可得名，亦可能惹祸。",
      "choices": [
        {
          "label": "密送军资",
          "desc": "帮南唐续命，但容易惹北方疑心。",
          "delta": {
            "money": -40,
            "prestige": 5,
            "threat": 6,
            "stability": -2
          }
        },
        {
          "label": "婉拒求援",
          "desc": "保住吴越自身余裕。",
          "delta": {
            "stability": 3,
            "submit": 4,
            "prestige": -2
          }
        },
        {
          "label": "趁机索地",
          "desc": "以援助换利益，风险很高。",
          "delta": {
            "prestige": 5,
            "independent": 8,
            "threat": 10,
            "army": 15
          }
        }
      ]
    },
    {
      "year": "公元957年",
      "title": "边军骄纵",
      "text": "边军自恃有功，在州县市井生事。严惩会损军心，不惩会失民心。",
      "choices": [
        {
          "label": "斩首示众",
          "desc": "严法立威，军中不满。",
          "delta": {
            "stability": 3,
            "morale": 4,
            "army": -12,
            "people": -2
          }
        },
        {
          "label": "罚饷整队",
          "desc": "折中处理，军民都能接受一些。",
          "delta": {
            "stability": 3,
            "money": 15,
            "army": -4
          }
        },
        {
          "label": "压下民告",
          "desc": "保军心，失民心。",
          "delta": {
            "army": 18,
            "morale": -10,
            "stability": -6
          }
        }
      ]
    },
    {
      "year": "公元958年",
      "title": "秋税入库",
      "text": "秋税入库，府库短暂充盈。该补军饷、修堤岸，还是厚礼四方？",
      "choices": [
        {
          "label": "补发军饷",
          "desc": "军心稳，府库又紧。",
          "delta": {
            "army": 25,
            "money": -45,
            "fiscal": -3,
            "stability": -1
          }
        },
        {
          "label": "修堤备荒",
          "desc": "为后年水旱打底。",
          "delta": {
            "food": 45,
            "stability": 3,
            "money": -35,
            "people": 3
          }
        },
        {
          "label": "厚礼四方",
          "desc": "把钱花在外交上。",
          "delta": {
            "submit": 8,
            "threat": -6,
            "money": -40,
            "prestige": -2
          }
        }
      ]
    },
    {
      "year": "公元959年",
      "title": "市舶争权",
      "text": "市舶官与州县争夺港税。若不裁断，钱帛会在层层手续中消失。",
      "choices": [
        {
          "label": "港税归府",
          "desc": "钱塘直接掌税，地方不悦。",
          "delta": {
            "money": 70,
            "stability": -5,
            "fiscal": -2
          }
        },
        {
          "label": "州府分成",
          "desc": "让地方有利可图，朝廷直接收入少一些。",
          "delta": {
            "money": 42,
            "stability": 3,
            "fiscal": 3
          }
        },
        {
          "label": "设账公开",
          "desc": "整顿账目，短期收益不高，还要增加文吏成本。",
          "delta": {
            "stability": 3,
            "prestige": 3,
            "money": 25,
            "fiscal": 2
          }
        }
      ]
    },
    {
      "year": "公元960年",
      "title": "宋号初立",
      "text": "赵氏立国，中原气象一新。宋使虽未至，朝堂已开始议论归心与自保。",
      "choices": [
        {
          "label": "遣贺新朝",
          "desc": "主动承认新局，求得缓冲。",
          "delta": {
            "submit": 10,
            "threat": -8,
            "money": -30,
            "prestige": -2
          }
        },
        {
          "label": "观望不贺",
          "desc": "保持距离，避免太早表态。",
          "delta": {
            "independent": 5,
            "stability": 3,
            "threat": 3
          }
        },
        {
          "label": "整备边防",
          "desc": "不问名号，先准备兵事。",
          "delta": {
            "army": 35,
            "threat": -3,
            "money": -38,
            "fiscal": 6,
            "stability": -2
          }
        }
      ]
    },
    {
      "year": "公元961年",
      "title": "钱塘朝议",
      "text": "老臣言保民为上，武臣言坐守必亡，年轻士人则称天下终归一统。",
      "choices": [
        {
          "label": "定保民策",
          "desc": "把国策转向民生守成。",
          "delta": {
            "morale": 4,
            "stability": 3,
            "independent": -5
          }
        },
        {
          "label": "立强兵议",
          "desc": "以军备维持独立余地。",
          "delta": {
            "army": 35,
            "prestige": 5,
            "money": -45,
            "fiscal": 8,
            "stability": -3
          }
        },
        {
          "label": "开归一论",
          "desc": "允许朝中公开讨论归一。",
          "delta": {
            "submit": 12,
            "morale": 4,
            "prestige": -4
          }
        }
      ]
    },
    {
      "year": "公元962年",
      "title": "南唐衰势",
      "text": "南唐国力日衰，边境商人说金陵已无当年气象。吴越该趁势，还是收手？",
      "choices": [
        {
          "label": "取边市利",
          "desc": "趁南唐衰弱扩大贸易。",
          "delta": {
            "money": 65,
            "prestige": 4,
            "threat": 4
          }
        },
        {
          "label": "守界不侵",
          "desc": "不趁火打劫，换取名声，但错失扩张机会。",
          "delta": {
            "prestige": 5,
            "submit": 4,
            "threat": -3,
            "independent": -4
          }
        },
        {
          "label": "练兵观变",
          "desc": "不出兵，但为变局准备。",
          "delta": {
            "army": 32,
            "independent": 5,
            "money": -28,
            "stability": -2
          }
        }
      ]
    },
    {
      "year": "公元963年",
      "title": "贡礼加码",
      "text": "宋廷礼数渐重，也渐渐试探吴越底线。礼物越厚，国体越轻。",
      "choices": [
        {
          "label": "从厚备礼",
          "desc": "忍辱换安全。",
          "delta": {
            "money": -65,
            "submit": 12,
            "threat": -10,
            "prestige": -5
          }
        },
        {
          "label": "改送土产",
          "desc": "礼数周到但少花钱。",
          "delta": {
            "money": -30,
            "submit": 6,
            "prestige": 2
          }
        },
        {
          "label": "称疾缓贡",
          "desc": "拖延贡期，观察宋廷反应。",
          "delta": {
            "independent": 7,
            "threat": 8,
            "stability": -2
          }
        }
      ]
    },
    {
      "year": "公元964年",
      "title": "江潮毁堤",
      "text": "钱塘江潮毁堤，百姓奔走。此时修堤，既是民生，也是国力展示。",
      "choices": [
        {
          "label": "倾府修堤",
          "desc": "大修堤岸，钱帛压力很重。",
          "delta": {
            "stability": 3,
            "morale": 4,
            "money": -70,
            "food": 20,
            "people": 4
          }
        },
        {
          "label": "分段抢修",
          "desc": "先保最险之处。",
          "delta": {
            "stability": 3,
            "morale": 4,
            "money": -38,
            "people": 2
          }
        },
        {
          "label": "迁户避潮",
          "desc": "少修堤，多迁民。",
          "delta": {
            "morale": 4,
            "people": -3,
            "stability": -3,
            "food": -18
          }
        }
      ]
    },
    {
      "year": "公元965年",
      "title": "边将请战",
      "text": "边将上表请取南唐一州，称可振国威。民曹提醒，战事一起，春耕必误。",
      "choices": [
        {
          "label": "许其试攻",
          "desc": "给边将机会，风险不小。",
          "delta": {
            "army": 35,
            "prestige": 5,
            "food": -40,
            "threat": 10,
            "independent": 8,
            "people": -6,
            "stability": -5
          }
        },
        {
          "label": "只许练兵",
          "desc": "练而不战，保留威慑。",
          "delta": {
            "army": 30,
            "prestige": 4,
            "money": -25,
            "fiscal": 4,
            "people": -2,
            "stability": -2
          }
        },
        {
          "label": "严禁启衅",
          "desc": "压住军中求战之心。",
          "delta": {
            "threat": -5,
            "submit": 5,
            "army": -8,
            "prestige": -2
          }
        }
      ]
    },
    {
      "year": "公元966年",
      "title": "海贸大利",
      "text": "海外船队带来香药与铜钱。商税可厚，港市也会更难管。",
      "choices": [
        {
          "label": "厚收商税",
          "desc": "把海贸转成府库收入。",
          "delta": {
            "money": 70,
            "stability": -4,
            "morale": -3,
            "people": -3
          }
        },
        {
          "label": "设市舶规",
          "desc": "立规矩，少赚但长久，也要养一批市舶吏。",
          "delta": {
            "money": 55,
            "stability": 3,
            "prestige": 3,
            "fiscal": 4
          }
        },
        {
          "label": "购粮入仓",
          "desc": "把海贸所得换成存粮。",
          "delta": {
            "food": 80,
            "money": -25,
            "morale": 2,
            "people": 2
          }
        }
      ]
    },
    {
      "year": "公元967年",
      "title": "归一之论",
      "text": "士人上书称天下久乱，归一未必是亡国，也可能是保民。武臣斥其软弱。",
      "choices": [
        {
          "label": "召士人入对",
          "desc": "让归一之论进入朝堂。",
          "delta": {
            "submit": 12,
            "morale": 4,
            "prestige": -3
          }
        },
        {
          "label": "命武臣辩论",
          "desc": "让两派公开争辩。",
          "delta": {
            "prestige": 5,
            "independent": 5,
            "stability": -2
          }
        },
        {
          "label": "暂禁此议",
          "desc": "维持朝堂一致，但压不住人心。",
          "delta": {
            "stability": 3,
            "morale": -4,
            "submit": -3
          }
        }
      ]
    },
    {
      "year": "公元968年",
      "title": "亲军换帅",
      "text": "亲军主帅年老，继任者牵动各方。用亲信可稳朝堂，用名将可稳边境。",
      "choices": [
        {
          "label": "任用亲信",
          "desc": "朝堂稳，边军未必服。",
          "delta": {
            "stability": 3,
            "army": -6,
            "prestige": -2
          }
        },
        {
          "label": "拔擢名将",
          "desc": "军心振奋，亲贵不满。",
          "delta": {
            "army": 35,
            "prestige": 5,
            "stability": -4
          }
        },
        {
          "label": "分权两府",
          "desc": "避免一将独大，效率降低。",
          "delta": {
            "stability": 3,
            "fiscal": 5,
            "threat": -3
          }
        }
      ]
    },
    {
      "year": "公元969年",
      "title": "州县疲弊",
      "text": "多年修堤、贡赋、备战，州县疲弊渐显。百姓还能忍多久，没人敢问。",
      "choices": [
        {
          "label": "停役一年",
          "desc": "让州县喘息。",
          "delta": {
            "morale": 4,
            "stability": 3,
            "money": -25,
            "people": 5
          }
        },
        {
          "label": "减军省费",
          "desc": "减轻财政，边防会弱。",
          "delta": {
            "fiscal": -8,
            "army": -20,
            "threat": 5,
            "morale": 3
          }
        },
        {
          "label": "催科补库",
          "desc": "强行补府库，民心受损。",
          "delta": {
            "money": 70,
            "morale": -12,
            "stability": -5,
            "people": -5
          }
        }
      ]
    },
    {
      "year": "公元970年",
      "title": "宋使入朝",
      "text": "宋使正式入钱塘，问吴越归心。群臣皆知，此问不可轻答。",
      "choices": [
        {
          "label": "礼迎宋使",
          "desc": "给足体面，换取缓和。",
          "delta": {
            "submit": 12,
            "threat": -9,
            "money": -35,
            "prestige": -3
          }
        },
        {
          "label": "答以守土",
          "desc": "表示吴越仍要自守。",
          "delta": {
            "independent": 9,
            "prestige": 5,
            "threat": 8
          }
        },
        {
          "label": "请议来年",
          "desc": "拖延决断，争取时间。",
          "delta": {
            "stability": 3,
            "threat": 3,
            "submit": 3
          }
        }
      ]
    },
    {
      "year": "公元971年",
      "title": "国号与民命",
      "text": "朝堂争论激烈：国号可贵，民命亦可贵。若天下将定，吴越该如何自处？",
      "choices": [
        {
          "label": "以民命为先",
          "desc": "把少战作为最高原则。",
          "delta": {
            "morale": 4,
            "submit": 10,
            "prestige": -4,
            "people": 3
          }
        },
        {
          "label": "以国号为重",
          "desc": "强调吴越独立名分。",
          "delta": {
            "prestige": 5,
            "independent": 12,
            "threat": 8
          }
        },
        {
          "label": "两策并行",
          "desc": "一边谈判，一边备守。",
          "delta": {
            "stability": 3,
            "army": 18,
            "submit": 4,
            "money": -25
          }
        }
      ]
    },
    {
      "year": "公元972年",
      "title": "南唐将亡",
      "text": "南唐颓势已成。若吴越不再有西南屏障，宋军压力将直抵边境。",
      "choices": [
        {
          "label": "修西境戍堡",
          "desc": "为屏障消失做准备。",
          "delta": {
            "threat": -7,
            "stability": 3,
            "money": -38
          }
        },
        {
          "label": "接纳南唐流民",
          "desc": "收人也要养人。",
          "delta": {
            "people": 10,
            "morale": 4,
            "food": -35
          }
        },
        {
          "label": "向宋表忠",
          "desc": "提前表态，求免兵锋。",
          "delta": {
            "submit": 12,
            "threat": -10,
            "prestige": -5
          }
        }
      ]
    },
    {
      "year": "公元973年",
      "title": "府库见底",
      "text": "连年礼贡、修防、赈济之后，府库渐空。再有大事，恐怕难以周转。",
      "choices": [
        {
          "label": "清查冗费",
          "desc": "从官府自身省钱。",
          "delta": {
            "fiscal": -8,
            "stability": 3,
            "prestige": -2
          }
        },
        {
          "label": "借商人钱",
          "desc": "周转府库，欠下商债。",
          "delta": {
            "money": 70,
            "fiscal": 7,
            "morale": -2
          }
        },
        {
          "label": "卖官筹资",
          "desc": "最快来钱，最伤安定。",
          "delta": {
            "money": 70,
            "stability": -12,
            "prestige": -6,
            "people": -3
          }
        }
      ]
    },
    {
      "year": "公元974年",
      "title": "士民请愿",
      "text": "钱塘士民联名请愿，愿少战多安。武臣认为这是被太平二字磨软了骨头。",
      "choices": [
        {
          "label": "收其请愿",
          "desc": "承认民意，压低战意。",
          "delta": {
            "morale": 4,
            "submit": 8,
            "independent": -6,
            "people": 2
          }
        },
        {
          "label": "令军民共议",
          "desc": "让军府也进入讨论，朝议变慢。",
          "delta": {
            "stability": 3,
            "prestige": 4,
            "morale": 3,
            "fiscal": 3
          }
        },
        {
          "label": "斥为怯言",
          "desc": "保住军心，伤及民意。",
          "delta": {
            "army": 20,
            "independent": 8,
            "morale": -8
          }
        }
      ]
    },
    {
      "year": "公元975年",
      "title": "金陵既下",
      "text": "南唐已亡，江南大势骤变。吴越从夹缝小国，变成宋廷眼前最后的选择题。",
      "choices": [
        {
          "label": "遣使称贺",
          "desc": "承认大势，求得体面余地。",
          "delta": {
            "submit": 12,
            "threat": -10,
            "money": -35,
            "prestige": -3
          }
        },
        {
          "label": "闭门修备",
          "desc": "不表态，只加强防务。",
          "delta": {
            "army": 35,
            "threat": 5,
            "money": -40,
            "fiscal": 6,
            "people": -2
          }
        },
        {
          "label": "安抚江南商旅",
          "desc": "让动荡中的商旅流向吴越。",
          "delta": {
            "money": 60,
            "people": 4,
            "stability": -2
          }
        }
      ]
    },
    {
      "year": "公元976年",
      "title": "王府夜议",
      "text": "夜深之后，王府仍灯火不熄。亲族、老臣、武将、使节各有所求。",
      "choices": [
        {
          "label": "问计老臣",
          "desc": "老臣多主张保民，但会压低武臣声势。",
          "delta": {
            "stability": 3,
            "morale": 4,
            "submit": 4,
            "independent": -5
          }
        },
        {
          "label": "听武将陈兵",
          "desc": "武将陈述最后一战的可能。",
          "delta": {
            "army": 35,
            "prestige": 5,
            "independent": 8,
            "money": -25,
            "people": -2,
            "stability": -2
          }
        },
        {
          "label": "密询宋使",
          "desc": "试探纳土后的条件。",
          "delta": {
            "submit": 12,
            "threat": -8,
            "prestige": -4
          }
        }
      ]
    },
    {
      "year": "公元977年",
      "title": "无血之价",
      "text": "宋廷开出体面条件。纳土可保宗族与百姓，拒绝则需独自面对天下兵锋。",
      "choices": [
        {
          "label": "议定纳土",
          "desc": "为和平归一铺路。",
          "delta": {
            "submit": 20,
            "morale": 6,
            "stability": 5,
            "prestige": -6
          }
        },
        {
          "label": "索更厚礼",
          "desc": "争取宗族与官吏退路。",
          "delta": {
            "submit": 12,
            "money": 35,
            "threat": 4,
            "prestige": -3
          }
        },
        {
          "label": "拒其条件",
          "desc": "保住国号，也抬高风险。",
          "delta": {
            "independent": 18,
            "prestige": 8,
            "threat": 16,
            "stability": -4
          }
        }
      ]
    },
    {
      "year": "公元978年",
      "title": "钱塘终议",
      "text": "最后的国议开始。是奉表归一，割据续命，还是起兵争衡？这一刻将写入后世。",
      "choices": [
        {
          "label": "奉表归一",
          "desc": "主动结束国号，换取无血太平。",
          "delta": {
            "submit": 20,
            "morale": 6,
            "stability": 5,
            "prestige": -8
          }
        },
        {
          "label": "据土续命",
          "desc": "继续保留吴越自主。",
          "delta": {
            "independent": 18,
            "prestige": 8,
            "threat": 12,
            "army": 15,
            "stability": -3
          }
        },
        {
          "label": "孤注一战",
          "desc": "以最后兵力争一线可能。",
          "delta": {
            "army": 55,
            "independent": 20,
            "threat": 18,
            "fiscal": 14,
            "morale": -10,
            "people": -8,
            "stability": -8
          }
        }
      ]
    },
    {
      "year": "公元979年",
      "title": "太平门前",
      "text": "百姓不知朝堂细节，只知城门外兵少一日，田里就多一分生机。",
      "choices": [
        {
          "label": "开城受命",
          "desc": "让交接尽量平稳，但国号就此退场。",
          "delta": {
            "submit": 20,
            "morale": 6,
            "stability": 5,
            "threat": -8,
            "prestige": -10,
            "people": 3
          }
        },
        {
          "label": "封存府库",
          "desc": "保住钱塘最后的秩序和账册，也要停发一批旧赏。",
          "delta": {
            "stability": 5,
            "money": 25,
            "submit": 8,
            "morale": -4
          }
        },
        {
          "label": "整军待诏",
          "desc": "保留军队尊严，避免溃散。",
          "delta": {
            "army": 25,
            "prestige": 5,
            "threat": 5,
            "independent": 6,
            "people": -2,
            "stability": -2
          }
        }
      ]
    }
  ],
  "branchEvents": {
    "中原": [
      {
        "year": "公元950年",
        "title": "中原观察：新朝整军",
        "text": "密使北上，见新朝整顿禁军，诸将不再各自为战。吴越朝堂第一次意识到，北方不只是又换了旗号。",
        "choices": [
          {
            "label": "记宋军整编",
            "desc": "记录军制变化，回报钱塘早做边防预案。",
            "delta": {
              "threat": -4,
              "money": -18,
              "submit": 3
            }
          },
          {
            "label": "访汴梁商旅",
            "desc": "从商旅口中判断北方财力。",
            "delta": {
              "submit": 5,
              "prestige": -2,
              "money": -12
            }
          },
          {
            "label": "探诸将口风",
            "desc": "打探诸将是否仍有割据之心。",
            "delta": {
              "independent": 4,
              "threat": -2,
              "money": -20
            }
          }
        ]
      },
      {
        "year": "公元951年",
        "title": "中原观察：财赋归一",
        "text": "密使续报，宋廷把军粮、漕运、赋税渐渐拢到一处。北方正在变成能持续南下的国家机器。",
        "choices": [
          {
            "label": "回报其势难挡",
            "desc": "使朝堂更倾向以和平换时间。",
            "delta": {
              "submit": 8,
              "independent": -4,
              "prestige": -2
            }
          },
          {
            "label": "绘制粮道图",
            "desc": "掌握宋军南下补给路径。",
            "delta": {
              "threat": -5,
              "money": -22,
              "stability": 2
            }
          },
          {
            "label": "结交北商",
            "desc": "借商路获取消息。",
            "delta": {
              "money": -18,
              "submit": 4,
              "fiscal": 2
            }
          }
        ]
      }
    ],
    "南唐": [
      {
        "year": "公元956年",
        "title": "南唐观察：金陵求援",
        "text": "吴越密使抵达金陵。南唐朝堂仍谈礼乐文章，但边报一日数至，求援之声已压过诗声。",
        "choices": [
          {
            "label": "记录金陵疲态",
            "desc": "判断南唐难久支。",
            "delta": {
              "submit": 6,
              "independent": -3,
              "prestige": -1
            }
          },
          {
            "label": "结交南唐边臣",
            "desc": "在边境留下人情和消息线。",
            "delta": {
              "threat": -4,
              "prestige": 2,
              "money": -25
            }
          },
          {
            "label": "回报可趁之机",
            "desc": "朝中强硬派得到理由。",
            "delta": {
              "independent": 6,
              "prestige": 3,
              "threat": 4
            }
          }
        ]
      },
      {
        "year": "公元957年",
        "title": "南唐观察：江南失据",
        "text": "再报至钱塘，南唐军心已乱，地方各谋退路。吴越必须判断：南唐是屏障，还是将倾之墙。",
        "choices": [
          {
            "label": "评估屏障将失",
            "desc": "提前准备宋军压力直抵边境。",
            "delta": {
              "threat": -3,
              "money": -18,
              "stability": 3
            }
          },
          {
            "label": "劝其守江",
            "desc": "试图让南唐多撑几年。",
            "delta": {
              "threat": -5,
              "money": -35,
              "prestige": 2
            }
          },
          {
            "label": "撤回密使",
            "desc": "不再押注南唐。",
            "delta": {
              "submit": 5,
              "independent": -2,
              "prestige": -2
            }
          }
        ]
      }
    ]
  }
};
