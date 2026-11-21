window.RESEARCH_DATA = {
  "version": "strict-single / 32502 · 32717 · 32801",
  "cases": [
    {
      "id": "PHYS-11",
      "action": 0,
      "probabilities": [
        0.662109375,
        2.384185791015625e-07,
        2.384185791015625e-07,
        3.5762786865234375e-07,
        3.5762786865234375e-07,
        0.01512908935546875,
        0.0016775131225585938,
        0.0005941390991210938,
        7.534027099609375e-05,
        2.7418136596679688e-06,
        0.044891357421875,
        0.0038585662841796875,
        0.004566192626953125,
        0.002593994140625,
        0.0006823539733886719,
        0.072509765625,
        0.0094451904296875,
        0.00829315185546875,
        0.0098114013671875,
        0.01194000244140625,
        0.05694580078125,
        0.012847900390625,
        0.0110931396484375,
        0.018463134765625,
        0.052337646484375
      ],
      "support": [
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true
      ],
      "typical": "typical",
      "signal": "signal_present",
      "history": [
        {
          "hour": -20,
          "map": null,
          "lactate": null,
          "urine": null,
          "fluid": 0.0
        },
        {
          "hour": -16,
          "map": 71.0,
          "lactate": 11.6,
          "urine": 250.0,
          "fluid": 0.0
        },
        {
          "hour": -12,
          "map": 69.0,
          "lactate": 11.6,
          "urine": 280.0,
          "fluid": 0.0
        },
        {
          "hour": -8,
          "map": 79.0,
          "lactate": 11.6,
          "urine": 65.0,
          "fluid": 0.0
        },
        {
          "hour": -4,
          "map": 62.0,
          "lactate": 11.6,
          "urine": 65.0,
          "fluid": 0.0
        },
        {
          "hour": 0,
          "map": 65.0,
          "lactate": 11.6,
          "urine": 30.0,
          "fluid": 0.0
        }
      ],
      "rules": {
        "MR1": {
          "actions": {
            "full": [
              5,
              10
            ],
            "direct_core": [
              5,
              10
            ],
            "direct_hull": [
              5,
              10
            ]
          },
          "levels": {
            "full": [
              1,
              2
            ],
            "direct_core": [
              1,
              2
            ],
            "direct_hull": [
              1,
              2
            ]
          },
          "factors": [
            0.6846758127212524,
            0.5351565480232239
          ],
          "canonicalComparator": 5,
          "canonicalPair": true,
          "comparators": [
            5,
            10
          ],
          "priority": true,
          "tier": "A_priority",
          "identifiable": true
        },
        "MR2": {
          "actions": {
            "full": [],
            "direct_core": [],
            "direct_hull": []
          },
          "levels": {
            "full": [],
            "direct_core": [],
            "direct_hull": []
          },
          "factors": [
            0.7531471848487854,
            0.24481329321861267
          ],
          "canonicalComparator": null,
          "canonicalPair": false,
          "comparators": [],
          "priority": false,
          "tier": "C_broad",
          "identifiable": true
        }
      },
      "predictions": {
        "0": {
          "MAP": [
            72.61885070800781,
            72.952392578125,
            72.94696044921875,
            73.34208679199219
          ],
          "lactate": [
            11.097502708435059,
            9.353401184082031,
            7.735138893127441,
            5.032603740692139
          ],
          "creatinine": [
            1.7205047607421875,
            1.7082903385162354,
            1.6785417795181274,
            1.607991337776184
          ],
          "urine": [
            0.06489946693181992,
            0.06616634875535965,
            0.058587707579135895,
            0.06110788509249687
          ],
          "pf": [
            136.41067504882812,
            147.52996826171875,
            157.43475341796875,
            181.1847686767578
          ]
        },
        "5": {
          "MAP": [
            74.6860122680664,
            73.55547332763672,
            74.08757019042969,
            76.0865478515625
          ],
          "lactate": [
            10.70114517211914,
            8.899113655090332,
            7.111241817474365,
            3.708529472351074
          ],
          "creatinine": [
            1.792670488357544,
            1.8480483293533325,
            1.922102928161621,
            2.18097186088562
          ],
          "urine": [
            0.1214243471622467,
            0.12911716103553772,
            0.13821525871753693,
            0.16872747242450714
          ],
          "pf": [
            138.32469177246094,
            148.24510192871094,
            155.769287109375,
            174.14857482910156
          ]
        },
        "10": {
          "MAP": [
            74.80152130126953,
            73.78601837158203,
            74.18283081054688,
            76.26432800292969
          ],
          "lactate": [
            10.613967895507812,
            8.818682670593262,
            7.089214324951172,
            3.7293825149536133
          ],
          "creatinine": [
            1.7966718673706055,
            1.8843954801559448,
            1.9657573699951172,
            2.229484796524048
          ],
          "urine": [
            0.12376006692647934,
            0.13449980318546295,
            0.1433013677597046,
            0.17674478888511658
          ],
          "pf": [
            137.68374633789062,
            146.61956787109375,
            154.41978454589844,
            175.07647705078125
          ]
        }
      }
    },
    {
      "id": "PHYS-02",
      "action": 11,
      "probabilities": [
        0.085205078125,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0299835205078125,
        5.9485435485839844e-05,
        1.2814998626708984e-05,
        1.430511474609375e-06,
        1.1920928955078125e-07,
        0.0699462890625,
        0.0001596212387084961,
        0.0001825094223022461,
        7.528066635131836e-05,
        3.6954879760742188e-06,
        0.68408203125,
        0.00238800048828125,
        0.0012569427490234375,
        0.0009965896606445312,
        0.00022327899932861328,
        0.1202392578125,
        0.0017375946044921875,
        0.0009655952453613281,
        0.0012989044189453125,
        0.0010166168212890625
      ],
      "support": [
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false
      ],
      "typical": "atypical",
      "signal": "no_detected_signal",
      "history": [
        {
          "hour": -4,
          "map": null,
          "lactate": null,
          "urine": null,
          "fluid": 0.0
        },
        {
          "hour": 0,
          "map": 90.5,
          "lactate": 2.4,
          "urine": 360.0,
          "fluid": 374.99998569488525
        }
      ],
      "rules": {
        "MR2": {
          "actions": {
            "full": [],
            "direct_core": [],
            "direct_hull": []
          },
          "levels": {
            "full": [],
            "direct_core": [],
            "direct_hull": []
          },
          "factors": [
            0.447558730840683,
            0.43814384937286377
          ],
          "canonicalComparator": null,
          "canonicalPair": false,
          "comparators": [],
          "priority": false,
          "tier": "N_no_clinical_trigger",
          "identifiable": true
        },
        "MR3": {
          "actions": {
            "full": [
              10,
              15
            ],
            "direct_core": [
              15
            ],
            "direct_hull": [
              15
            ]
          },
          "levels": {
            "full": [
              2,
              3
            ],
            "direct_core": [
              3
            ],
            "direct_hull": [
              3
            ]
          },
          "factors": [
            0.5153740644454956,
            0.2053798884153366
          ],
          "canonicalComparator": null,
          "canonicalPair": false,
          "comparators": [],
          "priority": false,
          "tier": "N_no_clinical_trigger",
          "identifiable": true
        }
      },
      "predictions": {}
    },
    {
      "id": "PHYS-14",
      "action": 24,
      "probabilities": [
        0.0168304443359375,
        6.794929504394531e-06,
        7.927417755126953e-06,
        1.1801719665527344e-05,
        1.233816146850586e-05,
        0.0199432373046875,
        0.01617431640625,
        0.01299285888671875,
        0.003734588623046875,
        5.316734313964844e-05,
        0.029693603515625,
        0.0295867919921875,
        0.048919677734375,
        0.057220458984375,
        0.039093017578125,
        0.027313232421875,
        0.0299224853515625,
        0.0447998046875,
        0.0732421875,
        0.157958984375,
        0.022491455078125,
        0.0260772705078125,
        0.036041259765625,
        0.06884765625,
        0.239013671875
      ],
      "support": [
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
      ],
      "typical": "typical",
      "signal": "signal_present",
      "history": [
        {
          "hour": -16,
          "map": null,
          "lactate": null,
          "urine": null,
          "fluid": 0.0
        },
        {
          "hour": -12,
          "map": 82.0,
          "lactate": null,
          "urine": 150.0,
          "fluid": 111.00780248641968
        },
        {
          "hour": -8,
          "map": 62.0,
          "lactate": 3.2,
          "urine": 35.0,
          "fluid": 546.0077834129333
        },
        {
          "hour": -4,
          "map": 56.0,
          "lactate": 3.7,
          "urine": 45.0,
          "fluid": 570.3931658267975
        },
        {
          "hour": 0,
          "map": 64.0,
          "lactate": 6.5,
          "urine": 35.0,
          "fluid": 300.4154396764934
        }
      ],
      "rules": {
        "MR3": {
          "actions": {
            "full": [
              10,
              11,
              12,
              13,
              14
            ],
            "direct_core": [
              10,
              11,
              12,
              13,
              14
            ],
            "direct_hull": [
              10,
              11,
              12,
              13,
              14
            ]
          },
          "levels": {
            "full": [
              2
            ],
            "direct_core": [
              2
            ],
            "direct_hull": [
              2
            ]
          },
          "factors": [
            0.5711843371391296,
            0.5549116730690002
          ],
          "canonicalComparator": 14,
          "canonicalPair": true,
          "comparators": [
            14
          ],
          "priority": true,
          "tier": "A_priority",
          "identifiable": true
        },
        "MR4": {
          "actions": {
            "full": [
              11,
              12,
              13,
              16,
              17,
              18,
              21,
              22,
              23
            ],
            "direct_core": [
              5,
              10,
              11,
              13,
              15,
              16,
              18,
              20,
              21,
              23
            ],
            "direct_hull": [
              5,
              10,
              11,
              12,
              13,
              15,
              16,
              17,
              18,
              20,
              21,
              22,
              23
            ]
          },
          "levels": {
            "full": [
              1,
              2,
              3
            ],
            "direct_core": [
              0,
              1,
              3
            ],
            "direct_hull": [
              0,
              1,
              2,
              3
            ]
          },
          "factors": [
            0.5049191117286682,
            0.5130431652069092
          ],
          "canonicalComparator": 23,
          "canonicalPair": true,
          "comparators": [
            21,
            22,
            23
          ],
          "priority": false,
          "tier": "C_broad",
          "identifiable": true
        }
      },
      "predictions": {
        "14": {
          "MAP": [
            78.37812042236328,
            78.21930694580078,
            76.82120513916016,
            74.75837707519531
          ],
          "lactate": [
            6.996262550354004,
            7.094714641571045,
            7.050808429718018,
            4.59221887588501
          ],
          "creatinine": [
            4.613583087921143,
            4.959068775177002,
            5.248661041259766,
            5.600750923156738
          ],
          "urine": [
            0.12476258724927902,
            0.09702730178833008,
            0.0914979949593544,
            0.08761173486709595
          ],
          "pf": [
            209.99154663085938,
            205.3492889404297,
            199.58355712890625,
            206.33035278320312
          ]
        },
        "21": {
          "MAP": [
            79.2655258178711,
            77.92724609375,
            78.41605377197266,
            80.89539337158203
          ],
          "lactate": [
            6.640206336975098,
            6.7237653732299805,
            6.619457721710205,
            3.0379245281219482
          ],
          "creatinine": [
            4.379768371582031,
            4.536046504974365,
            4.6550703048706055,
            4.678251266479492
          ],
          "urine": [
            0.14841021597385406,
            0.17464804649353027,
            0.18130062520503998,
            0.2864970564842224
          ],
          "pf": [
            230.02894592285156,
            223.1963653564453,
            217.41404724121094,
            214.79144287109375
          ]
        },
        "22": {
          "MAP": [
            79.09901428222656,
            76.24295806884766,
            75.72785186767578,
            74.95699310302734
          ],
          "lactate": [
            6.915133953094482,
            7.267123222351074,
            7.357540607452393,
            4.846867084503174
          ],
          "creatinine": [
            4.446197032928467,
            4.687550067901611,
            4.944460868835449,
            5.310311317443848
          ],
          "urine": [
            0.15594452619552612,
            0.11743153631687164,
            0.07284211367368698,
            0.05544586852192879
          ],
          "pf": [
            227.6223907470703,
            215.95545959472656,
            203.5974578857422,
            205.89511108398438
          ]
        },
        "23": {
          "MAP": [
            77.9141845703125,
            76.569580078125,
            76.15472412109375,
            74.57342529296875
          ],
          "lactate": [
            6.899005889892578,
            7.278371334075928,
            7.272746562957764,
            5.111032962799072
          ],
          "creatinine": [
            4.515701770782471,
            4.786113739013672,
            5.032651424407959,
            5.32581901550293
          ],
          "urine": [
            0.12075789272785187,
            0.09767967462539673,
            0.06458297371864319,
            0.044212255626916885
          ],
          "pf": [
            225.58897399902344,
            215.40382385253906,
            205.7808074951172,
            205.33688354492188
          ]
        },
        "24": {
          "MAP": [
            76.87447357177734,
            77.70130157470703,
            76.62145233154297,
            74.73189544677734
          ],
          "lactate": [
            7.523946762084961,
            7.699580192565918,
            7.634765148162842,
            5.560976982116699
          ],
          "creatinine": [
            4.604405403137207,
            4.838421821594238,
            5.062337875366211,
            5.351748943328857
          ],
          "urine": [
            0.07029403746128082,
            0.09020104259252548,
            0.07795648276805878,
            0.06395033746957779
          ],
          "pf": [
            211.70681762695312,
            208.1488494873047,
            201.9774932861328,
            205.4508514404297
          ]
        }
      }
    },
    {
      "id": "PHYS-07",
      "action": 6,
      "probabilities": [
        0.0021953582763671875,
        0.0,
        0.0,
        5.960464477539063e-08,
        5.960464477539063e-08,
        0.002201080322265625,
        0.002044677734375,
        0.001323699951171875,
        0.0003135204315185547,
        5.960464477539062e-07,
        0.0034046173095703125,
        0.006103515625,
        0.0133819580078125,
        0.0259857177734375,
        0.0146942138671875,
        0.0038852691650390625,
        0.00856781005859375,
        0.02032470703125,
        0.05792236328125,
        0.1912841796875,
        0.002079010009765625,
        0.0055084228515625,
        0.009796142578125,
        0.033782958984375,
        0.59521484375
      ],
      "support": [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        false,
        false,
        true,
        true,
        true,
        false,
        false,
        false,
        true,
        true
      ],
      "typical": "atypical",
      "signal": "signal_present",
      "history": [
        {
          "hour": -12,
          "map": null,
          "lactate": null,
          "urine": null,
          "fluid": 0.0
        },
        {
          "hour": -8,
          "map": 43.0,
          "lactate": 13.2,
          "urine": null,
          "fluid": 1057.8104705084115
        },
        {
          "hour": -4,
          "map": 56.0,
          "lactate": 13.2,
          "urine": 130.0,
          "fluid": 4022.677717207931
        },
        {
          "hour": 0,
          "map": 18.0,
          "lactate": 13.2,
          "urine": 370.0,
          "fluid": 2345.0216518631205
        }
      ],
      "rules": {
        "MR3": {
          "actions": {
            "full": [
              17,
              18,
              19,
              23,
              24
            ],
            "direct_core": [
              17,
              18,
              19
            ],
            "direct_hull": [
              17,
              18,
              19
            ]
          },
          "levels": {
            "full": [
              3,
              4
            ],
            "direct_core": [
              3
            ],
            "direct_hull": [
              3
            ]
          },
          "factors": [
            0.6420525908470154,
            0.5798959732055664
          ],
          "canonicalComparator": null,
          "canonicalPair": false,
          "comparators": [],
          "priority": false,
          "tier": "B_standard",
          "identifiable": true
        },
        "MR4": {
          "actions": {
            "full": [
              13,
              14,
              18,
              19,
              23,
              24
            ],
            "direct_core": [
              12,
              14,
              17,
              19,
              24
            ],
            "direct_hull": [
              12,
              13,
              14,
              17,
              18,
              19,
              23,
              24
            ]
          },
          "levels": {
            "full": [
              3,
              4
            ],
            "direct_core": [
              2,
              4
            ],
            "direct_hull": [
              2,
              3,
              4
            ]
          },
          "factors": [
            0.8001713752746582,
            0.25882840156555176
          ],
          "canonicalComparator": null,
          "canonicalPair": false,
          "comparators": [],
          "priority": false,
          "tier": "B_standard",
          "identifiable": true
        }
      },
      "predictions": {}
    },
    {
      "id": "PHYS-05",
      "action": 22,
      "probabilities": [
        0.004566192626953125,
        2.86102294921875e-06,
        4.231929779052734e-06,
        6.9141387939453125e-06,
        7.271766662597656e-06,
        0.027984619140625,
        0.03955078125,
        0.03973388671875,
        0.0038890838623046875,
        2.4497509002685547e-05,
        0.0238494873046875,
        0.033447265625,
        0.1260986328125,
        0.14501953125,
        0.049957275390625,
        0.017364501953125,
        0.025909423828125,
        0.05255126953125,
        0.09222412109375,
        0.10382080078125,
        0.0123291015625,
        0.018035888671875,
        0.026275634765625,
        0.05487060546875,
        0.1025390625
      ],
      "support": [
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        true,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true
      ],
      "typical": "typical",
      "signal": "signal_present",
      "history": [
        {
          "hour": -4,
          "map": null,
          "lactate": null,
          "urine": null,
          "fluid": 0.0
        },
        {
          "hour": 0,
          "map": 51.0,
          "lactate": 1.5,
          "urine": 0.0,
          "fluid": 574.1901303082705
        }
      ],
      "rules": {
        "MR3": {
          "actions": {
            "full": [
              10,
              11,
              12,
              13,
              14
            ],
            "direct_core": [
              21,
              22,
              23,
              24
            ],
            "direct_hull": [
              21,
              22,
              23,
              24
            ]
          },
          "levels": {
            "full": [
              2
            ],
            "direct_core": [
              4
            ],
            "direct_hull": [
              4
            ]
          },
          "factors": [
            0.4321533739566803,
            0.7474319934844971
          ],
          "canonicalComparator": 12,
          "canonicalPair": true,
          "comparators": [
            12
          ],
          "priority": true,
          "tier": "A_priority",
          "identifiable": true
        },
        "MR4": {
          "actions": {
            "full": [
              7,
              12,
              17,
              22
            ],
            "direct_core": [
              6,
              7,
              11,
              12,
              16,
              17,
              21,
              22
            ],
            "direct_hull": [
              6,
              7,
              11,
              12,
              16,
              17,
              21,
              22
            ]
          },
          "levels": {
            "full": [
              2
            ],
            "direct_core": [
              1,
              2
            ],
            "direct_hull": [
              1,
              2
            ]
          },
          "factors": [
            0.743810772895813,
            0.4404580593109131
          ],
          "canonicalComparator": 22,
          "canonicalPair": false,
          "comparators": [],
          "priority": false,
          "tier": "C_broad",
          "identifiable": true
        }
      },
      "predictions": {
        "12": {
          "MAP": [
            64.44349670410156,
            65.04269409179688,
            66.17855834960938,
            68.86776733398438
          ],
          "lactate": [
            1.483856201171875,
            1.4578198194503784,
            1.4370216131210327,
            1.5063316822052002
          ],
          "creatinine": [
            4.944460868835449,
            4.954196453094482,
            4.929888725280762,
            4.767208576202393
          ],
          "urine": [
            0.6860211491584778,
            0.6230189800262451,
            0.5996705293655396,
            0.590425431728363
          ],
          "pf": [
            83.25178527832031,
            88.31929779052734,
            95.08440399169922,
            117.46874237060547
          ]
        },
        "22": {
          "MAP": [
            63.93560791015625,
            65.74542999267578,
            66.93330383300781,
            68.82670593261719
          ],
          "lactate": [
            1.6075761318206787,
            1.5710499286651611,
            1.513583779335022,
            1.3789094686508179
          ],
          "creatinine": [
            4.867152214050293,
            4.795588970184326,
            4.696864128112793,
            4.322851657867432
          ],
          "urine": [
            0.6368263959884644,
            0.6742230653762817,
            0.6777725219726562,
            0.7023558020591736
          ],
          "pf": [
            86.41779327392578,
            96.68523406982422,
            104.36702728271484,
            123.10711669921875
          ]
        }
      }
    }
  ],
  "matrix": [
    {
      "clinical_axis_standard": "no_detected_signal",
      "practice_axis": "atypical",
      "windows": 1991
    },
    {
      "clinical_axis_standard": "no_detected_signal",
      "practice_axis": "typical",
      "windows": 60239
    },
    {
      "clinical_axis_standard": "out_of_scope",
      "practice_axis": "atypical",
      "windows": 697
    },
    {
      "clinical_axis_standard": "out_of_scope",
      "practice_axis": "typical",
      "windows": 7587
    },
    {
      "clinical_axis_standard": "signal_present",
      "practice_axis": "atypical",
      "windows": 1057
    },
    {
      "clinical_axis_standard": "signal_present",
      "practice_axis": "typical",
      "windows": 16515
    },
    {
      "clinical_axis_standard": "unassessable",
      "practice_axis": "atypical",
      "windows": 608
    },
    {
      "clinical_axis_standard": "unassessable",
      "practice_axis": "typical",
      "windows": 15378
    }
  ],
  "geometry": [
    {
      "arm": "full",
      "rule": "MR3",
      "n": 70214,
      "nonempty_n": 70174,
      "fragmentation_pct": 0.0,
      "mean_coordinate_size": 1.569516050930014
    },
    {
      "arm": "full",
      "rule": "MR4",
      "n": 22712,
      "nonempty_n": 22711,
      "fragmentation_pct": 0.0528355054596688,
      "mean_coordinate_size": 2.4155072208524127
    },
    {
      "arm": "direct_core",
      "rule": "MR3",
      "n": 70214,
      "nonempty_n": 70214,
      "fragmentation_pct": 5.897684222519725,
      "mean_coordinate_size": 1.6869712592930184
    },
    {
      "arm": "direct_core",
      "rule": "MR4",
      "n": 22712,
      "nonempty_n": 22712,
      "fragmentation_pct": 39.44170482564283,
      "mean_coordinate_size": 2.388957379358929
    },
    {
      "arm": "direct_hull",
      "rule": "MR3",
      "n": 70214,
      "nonempty_n": 70214,
      "fragmentation_pct": 0.0612413478793403,
      "mean_coordinate_size": 1.7633662802290142
    },
    {
      "arm": "direct_hull",
      "rule": "MR4",
      "n": 22712,
      "nonempty_n": 22712,
      "fragmentation_pct": 0.1673124339556181,
      "mean_coordinate_size": 2.987803804156393
    }
  ],
  "hours": [
    4,
    8,
    12,
    24
  ],
  "cutoff": 0.008278274536132814
};
