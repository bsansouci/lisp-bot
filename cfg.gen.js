var uuid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
})();

// module.exports = {
//   "src": "",
//   "value": [{
//     "src": "",
//     "value": "define",
//     "type": "identifier",
//     "charPos": 1,
//     "uuid": "ea419347-f2f4-455c-385f-45e742c45b73"
//   }, {
//     "src": "",
//     "value": "bla",
//     "type": "identifier",
//     "charPos": 7,
//     "uuid": "cfc81118-217a-c320-a0f5-5cf4d5206d52"
//   }, {
//     "src": "",
//     "value": [{
//       "src": "",
//       "value": "lambda",
//       "type": "identifier",
//       "charPos": 12,
//       "uuid": "ec8eb485-303a-c696-65b8-3bb26e7857fc"
//     }, {
//       "src": "",
//       "value": [],
//       "type": "list",
//       "charPos": 18,
//       "uuid": "d4ac821c-ca8a-e717-cd9a-b3bfaea2870f"
//     }, {
//       "src": "",
//       "value": [{
//         "src": "",
//         "value": "quote",
//         "type": "identifier",
//         "charPos": 21,
//         "uuid": "527dc4de-6215-192f-c72e-30b188da7711"
//       }, {
//         "src": "",
//         "value": [{
//           "src": "",
//           "value": [{
//             "src": "",
//             "value": "start-token",
//             "type": "identifier",
//             "charPos": 24,
//             "uuid": "3b3928ac-9233-cf1a-4164-a9f243f979bf"
//           }, {
//             "src": "",
//             "value": [{
//               "src": "",
//               "value": "A",
//               "type": "identifier",
//               "charPos": 36,
//               "uuid": "a4ad3467-db90-c64a-ac33-267740824e71"
//             }],
//             "type": "list",
//             "charPos": 35,
//             "uuid": "9cc55c24-9a99-5d17-746a-1b28bb37831a"
//           }, {
//             "src": "",
//             "value": [],
//             "type": "list",
//             "charPos": 39,
//             "uuid": "ac4d2caa-dc73-37b3-1d90-23331a0c82d7"
//           }],
//           "type": "list",
//           "charPos": 23,
//           "uuid": "73f4ad3f-caf8-3639-1a55-9d7193cc74f8"
//         }, {
//           "src": "",
//           "value": [{
//             "src": "",
//             "value": "A",
//             "type": "identifier",
//             "charPos": 44,
//             "uuid": "7c8778ca-450e-a13f-9611-4daa04552fe4"
//           }, {
//             "src": "",
//             "value": [{
//               "src": "",
//               "value": "A",
//               "type": "identifier",
//               "charPos": 46,
//               "uuid": "851238e0-d4dc-ae2d-5fe5-02513f304743"
//             }, {
//               "src": "",
//               "value": "\\+",
//               "type": "string",
//               "charPos": 47,
//               "uuid": "022c0a83-56e3-6a6e-e72b-33c142878e3f"
//             }, {
//               "src": "",
//               "value": "B",
//               "type": "identifier",
//               "charPos": 51,
//               "uuid": "6b5f43f4-0862-78ce-3ed2-8b78ced8172e"
//             }],
//             "type": "list",
//             "charPos": 45,
//             "uuid": "ed292aca-e00b-527f-6a35-3778c2c87132"
//           }, {
//             "src": "",
//             "value": [],
//             "type": "list",
//             "charPos": 55,
//             "uuid": "c2acb448-5c7e-63bd-a2a8-efa0e37fbc7e"
//           }],
//           "type": "list",
//           "charPos": 43,
//           "uuid": "098c8627-5162-e904-4e1b-31b5ef432e76"
//         }, {
//           "src": "",
//           "value": [{
//             "src": "",
//             "value": "A",
//             "type": "identifier",
//             "charPos": 61,
//             "uuid": "cbe00102-32f3-56b1-b412-6395b9903745"
//           }, {
//             "src": "",
//             "value": [{
//               "src": "",
//               "value": "a",
//               "type": "string",
//               "charPos": 63,
//               "uuid": "8b4e34a9-fcf1-a40a-7de2-103dcad83d47"
//             }],
//             "type": "list",
//             "charPos": 62,
//             "uuid": "d0b3ae1e-3e4e-496b-df1e-27160cd612b5"
//           }, {
//             "src": "",
//             "value": [],
//             "type": "list",
//             "charPos": 68,
//             "uuid": "f650c73b-011d-9f46-9462-b9eddaa81756"
//           }],
//           "type": "list",
//           "charPos": 60,
//           "uuid": "b0baffc7-8220-f01e-84b0-65afafb38ce3"
//         }, {
//           "src": "",
//           "value": [{
//             "src": "",
//             "value": "B",
//             "type": "identifier",
//             "charPos": 74,
//             "uuid": "6e7e2a77-e788-b81e-9096-571bf761e9a4"
//           }, {
//             "src": "",
//             "value": [{
//               "src": "",
//               "value": "b",
//               "type": "string",
//               "charPos": 76,
//               "uuid": "e9b0c1c3-d414-cde6-972c-358dba2d5c11"
//             }],
//             "type": "list",
//             "charPos": 75,
//             "uuid": "80861ddb-d976-bcea-645f-4ecb78d7cc0f"
//           }, {
//             "src": "",
//             "value": [],
//             "type": "list",
//             "charPos": 81,
//             "uuid": "6886a6e8-4471-7c79-a4d2-607afdc4bcc2"
//           }],
//           "type": "list",
//           "charPos": 73,
//           "uuid": "c71c3c73-a231-27af-13d1-b4b942f1db46"
//         }],
//         "type": "list",
//         "charPos": 22,
//         "uuid": "f4f41999-1922-1fa7-4aac-269d9a017d0d"
//       }],
//       "type": "list",
//       "charPos": 21,
//       "uuid": "6d2c24d6-75fd-ead8-1945-fa429b4f9acb"
//     }],
//     "type": "list",
//     "charPos": 11,
//     "uuid": "9fde8377-331d-08a1-c93e-6f03bca7d84c"
//   }],
//   "type": "list",
//   "charPos": 0,
//   "uuid": "96f36b57-12e9-f3a6-1a87-930af19887c3"
// }

module.exports = {
  "src": "",
  "value": [{
    "src": "",
    "value": "define",
    "type": "identifier",
    "charPos": 1,
    "uuid": "25979d14-00ef-ebe9-145f-fbb9c5188590"
  }, {
    "src": "",
    "value": "core",
    "type": "identifier",
    "charPos": 7,
    "uuid": "fa19717c-f016-4cac-3bf5-d65ee0e2a815"
  }, {
    "src": "",
    "value": [{
      "src": "",
      "value": "lambda",
      "type": "identifier",
      "charPos": 13,
      "uuid": "7c60b29b-42d1-0cf1-87f0-0caf7298d0cd"
    }, {
      "src": "",
      "value": [],
      "type": "list",
      "charPos": 19,
      "uuid": "e59c8a79-d529-f3b6-b6d8-e3dc42d53436"
    }, {
      "src": "",
      "value": [{
        "src": "",
        "value": "quote",
        "type": "identifier",
        "charPos": 22,
        "uuid": "45973f3f-7a37-9f08-a70f-0e32f372cae3"
      }, {
        "src": "",
        "value": [{
          "src": "",
          "value": [{
            "src": "",
            "value": "start-token",
            "type": "identifier",
            "charPos": 25,
            "uuid": "12921864-d814-574d-cc88-2a742e1dca24"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 37,
              "uuid": "ba68ab48-7c38-df2f-e25e-35ca97132af6"
            }],
            "type": "list",
            "charPos": 36,
            "uuid": "c027725e-0d41-9765-af0b-6260b5687dc0"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 44,
              "uuid": "0cae0b7d-2133-3913-c14c-e65b124783e2"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 51,
                "uuid": "ddf0221c-8d17-f344-4608-8a5df53a60fc"
              }],
              "type": "list",
              "charPos": 50,
              "uuid": "7c230d52-4763-c234-bdfb-7947bac68671"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 54,
              "uuid": "d7bf08c0-7ddb-f882-767b-cf387aa8dd32"
            }],
            "type": "list",
            "charPos": 43,
            "uuid": "e3444b09-f264-939c-57b7-e33eb0c5112a"
          }],
          "type": "list",
          "charPos": 24,
          "uuid": "8dd7d123-960f-cdfb-4d22-a9473bbab47e"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr",
            "type": "identifier",
            "charPos": 60,
            "uuid": "8f16b411-2cab-2504-0c02-bf0b1c072991"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "list-token",
              "type": "identifier",
              "charPos": 65,
              "uuid": "674992a1-2398-03a7-458d-71972c0420f8"
            }],
            "type": "list",
            "charPos": 64,
            "uuid": "8a047127-6eba-8f0d-240c-ec837c34d769"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 78,
              "uuid": "659ae060-c533-eba4-4eb8-63e459a05e3b"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 85,
                "uuid": "12e8b88c-995b-f9df-8202-ad9ad7f098e2"
              }],
              "type": "list",
              "charPos": 84,
              "uuid": "b802b6c8-6c8f-f1bb-1e37-4823995a9484"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 88,
              "uuid": "b8848ac7-3e45-c5d4-0a39-30eb49cafe41"
            }],
            "type": "list",
            "charPos": 77,
            "uuid": "06aceefa-0d41-b9ad-19fb-feefebd76684"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "atom-token",
              "type": "identifier",
              "charPos": 93,
              "uuid": "a6ef221a-f119-781f-59a6-0a60cdea7966"
            }],
            "type": "list",
            "charPos": 92,
            "uuid": "1a3a66df-3509-5c2b-6b11-c0a91c1230bd"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 106,
              "uuid": "b8480711-e201-645f-58ff-132f30ae840b"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 113,
                "uuid": "ca3c6e86-5937-7e0a-fcd7-910e6d936f12"
              }],
              "type": "list",
              "charPos": 112,
              "uuid": "cc1e0d37-efca-486e-753c-dbb506067706"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 116,
              "uuid": "c3e1cf3c-a9ab-e27d-ae63-3ed987387b5a"
            }],
            "type": "list",
            "charPos": 105,
            "uuid": "467ac5d2-7f9f-86be-fcc0-3f913bd791df"
          }],
          "type": "list",
          "charPos": 59,
          "uuid": "d93a6fc6-66d7-1922-34e7-ec2c9175bf3f"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "list-token",
            "type": "identifier",
            "charPos": 123,
            "uuid": "7e2723c3-d27f-3668-0a99-72b6111eae73"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 134,
              "uuid": "3688dd94-bc98-d645-2388-af637850c2a0"
            }, {
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 144,
              "uuid": "81d956c9-6417-63c2-04e5-d3d818288b78"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 154,
              "uuid": "c435f324-8772-a1e0-f383-a0d2c93a7f2a"
            }],
            "type": "list",
            "charPos": 133,
            "uuid": "6c1f1f50-721f-8bef-9a17-a6612e12e582"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 168,
              "uuid": "ba2bdc99-d2f5-dff6-b9bd-bad32bc35330"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 175,
                "uuid": "0649ba9d-1f30-b9f7-7ab6-b15dc5b875db"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 176,
                "uuid": "bc7fd8fe-e4ff-5b44-0e38-852c44d1dc71"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 178,
                "uuid": "b17c67ed-a6aa-35a3-cbe4-02b9f9964333"
              }],
              "type": "list",
              "charPos": 174,
              "uuid": "eaaa67ee-fcd3-7141-b57c-0270de0e3eaf"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "reverse-hack",
                "type": "identifier",
                "charPos": 182,
                "uuid": "16943e15-713c-20dc-65af-943c35c107b6"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 182,
                "uuid": "16943e15-713c-20dc-65af-943c35c107b6"
              }],
              "type": "list",
              "charPos": 182,
              "uuid": "16943e15-713c-20dc-64af-943c35c107b6"
            }],
            "type": "list",
            "charPos": 167,
            "uuid": "576821ac-97f4-0c1b-bf68-b204ca606639"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 187,
              "uuid": "ee323c9c-f490-868c-5b70-0f2472a004ea"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 197,
              "uuid": "3815d860-48ad-c3dd-aaf4-62ba76f4f001"
            }],
            "type": "list",
            "charPos": 186,
            "uuid": "22fe7f43-0a6a-988f-aa4f-f1ea1d66c862"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 211,
              "uuid": "1cb09557-fd46-2129-bb4c-4bc72d09e4b7"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 218,
                "uuid": "5d06a1d4-9aaf-7db7-3930-d53670ef1b5a"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 219,
                "uuid": "7bbe272a-7217-5aa8-0393-d41b8695cc60"
              }],
              "type": "list",
              "charPos": 217,
              "uuid": "5d059512-1353-28ad-cda7-12f288901316"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "quote",
                "type": "identifier",
                "charPos": 223,
                "uuid": "3646ae4e-4872-7cf0-630e-8663ebcab1c4"
              }, {
                "src": "",
                "value": [],
                "type": "list",
                "charPos": 224,
                "uuid": "3b16985c-afc9-a848-2f4c-48f41ddbca2c"
              }],
              "type": "list",
              "charPos": 223,
              "uuid": "ef1e2a82-11a5-be98-7a2a-2e7bbc764b7d"
            }],
            "type": "list",
            "charPos": 210,
            "uuid": "8727fec9-958c-d040-24a4-cfc3a1de7a8c"
          }],
          "type": "list",
          "charPos": 122,
          "uuid": "c1df69c1-6c44-3a50-0c29-7fa913f6fad3"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "atom-token",
            "type": "identifier",
            "charPos": 232,
            "uuid": "188230a6-5212-3d1e-8d78-aa609c2b0b59"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\-?\\d*\\.?\\d*e?\\-?\\d+",
              "type": "string",
              "charPos": 243,
              "uuid": "17aed148-a373-e6fd-9bad-71e2e5f08c74"
            }],
            "type": "list",
            "charPos": 242,
            "uuid": "613545e5-c124-e8b2-dd9e-ade866a83c08"
          }, {
            "src": "",
            "value": "parse-int",
            "type": "identifier",
            "charPos": 256,
            "uuid": "511a1bd0-e9b0-9146-d05e-645b3a6d0472"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "[^ ()0-9]+[^ ()]*",
              "type": "string",
              "charPos": 267,
              "uuid": "6f9a35a9-6352-27ff-04e5-c367219ac1ee"
            }],
            "type": "list",
            "charPos": 266,
            "uuid": "250f07ab-17ac-3604-543b-62360e608845"
          }, {
            "src": "",
            "value": "parse-identifier",
            "type": "identifier",
            "charPos": 283,
            "uuid": "71828736-fc6e-b076-5c26-2ce0a19a9884"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\\"([^\\\"\\\\\\n]|(\\\\\\\\)*\\\\\\\"|\\\\[^\\\"\\n])*\\\"",
              "type": "string",
              "charPos": 301,
              "uuid": "a07801a8-d256-e568-3c8d-d1b31d92da6d"
            }],
            "type": "list",
            "charPos": 300,
            "uuid": "cd2da14b-08ac-ee48-1552-d6ca8ca9e1b5"
          }, {
            "src": "",
            "value": "parse-string",
            "type": "identifier",
            "charPos": 313,
            "uuid": "b0f816a7-9672-d737-ad05-f15bc6b39550"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "true|false",
              "type": "string",
              "charPos": 327,
              "uuid": "60d35bb7-8d45-aae1-198b-2abd123d8ff8"
            }],
            "type": "list",
            "charPos": 326,
            "uuid": "3f0afb60-5497-e80a-8791-262460c436b6"
          }, {
            "src": "",
            "value": "parse-boolean",
            "type": "identifier",
            "charPos": 343,
            "uuid": "b194ed33-0ec4-317a-a27c-c6e4faabae31"
          }],
          "type": "list",
          "charPos": 231,
          "uuid": "d18f3a36-00db-501e-a120-11ca0d2068a5"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr-list",
            "type": "identifier",
            "charPos": 360,
            "uuid": "91364735-3eb9-9d15-4e47-37b99d077256"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 370,
              "uuid": "c7d67f32-8a76-e5b2-8493-685bdd9383df"
            }, {
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 379,
              "uuid": "e0c723c9-9435-369e-d4aa-ec12963d7d28"
            }],
            "type": "list",
            "charPos": 369,
            "uuid": "d0273a36-0078-1394-e1b9-98e02e596a4d"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 387,
              "uuid": "28137765-f66c-8b40-994b-86896f0a974f"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 394,
                "uuid": "07a57e5e-027e-a8e8-045f-094a3b005c8e"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 398,
                "uuid": "a93f0c88-c100-f172-2014-8305b2f92109"
              }],
              "type": "list",
              "charPos": 393,
              "uuid": "bc7e9bc4-ba13-5104-1ae9-5c682c17554e"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "cons",
                "type": "identifier",
                "charPos": 403,
                "uuid": "bb09e6ad-9fca-2442-cc52-4135bafc5238"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 407,
                "uuid": "d781f60c-3c71-223f-01b3-b656dd6b9823"
              }, {
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 409,
                "uuid": "2df4a0b3-0b8e-f73a-1a19-50c2c68a2183"
              }],
              "type": "list",
              "charPos": 402,
              "uuid": "d91bb4b0-ff5a-8661-89ee-7d3c5dba4460"
            }],
            "type": "list",
            "charPos": 386,
            "uuid": "e085f994-f35c-fe31-e201-a85cbdb53017"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 419,
              "uuid": "255acee9-a864-ebe4-e24b-ff1f5793195a"
            }],
            "type": "list",
            "charPos": 418,
            "uuid": "6ee96756-0977-b790-427a-1eece3b28afd"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 426,
              "uuid": "5bf9d5ea-ffd9-8017-9a45-4ae369fb4074"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "args",
                "type": "identifier",
                "charPos": 433,
                "uuid": "9462bf4f-f6c4-d4d9-0f21-c0bd835fa1d8"
              }, {
                "src": "",
                "value": "...",
                "type": "identifier",
                "charPos": 437,
                "uuid": "bef4f15e-9eec-13cf-48ab-00ed47d4d559"
              }],
              "type": "list",
              "charPos": 432,
              "uuid": "870013bb-c17e-9d91-8f89-4e37cd1fb2d6"
            }, {
              "src": "",
              "value": "args",
              "type": "identifier",
              "charPos": 443,
              "uuid": "1600aeb2-c289-3ced-315b-27dd9c8a0a43"
            }],
            "type": "list",
            "charPos": 425,
            "uuid": "98c44331-6f15-8b82-9c6b-9e5b1822d62d"
          }],
          "type": "list",
          "charPos": 359,
          "uuid": "840401a4-b0ca-333f-6fb5-8bdf328d6d11"
        }],
        "type": "list",
        "charPos": 23,
        "uuid": "82831e1b-7582-1224-c3cc-eea5dec34b71"
      }],
      "type": "list",
      "charPos": 22,
      "uuid": "e5dba8ec-5ca4-d4f1-7f0a-8ce131a17ff0"
    }],
    "type": "list",
    "charPos": 12,
    "uuid": "34e44036-69c1-4898-de68-14a80d6004ef"
  }],
  "type": "list",
  "charPos": 0,
  "uuid": "53419ece-a76b-5daa-e91b-a55e0285a0a5"
}
