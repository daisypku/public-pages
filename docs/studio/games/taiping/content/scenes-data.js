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
    }
  ],
  "branchEvents": {}
};
