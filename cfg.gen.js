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
    "uuid": "73b3e2d0-7534-d2be-a1e2-95163ffdd5ba"
  }, {
    "src": "",
    "value": "core",
    "type": "identifier",
    "charPos": 7,
    "uuid": "c386e260-bb0a-5893-749f-aeb04fb5edd5"
  }, {
    "src": "",
    "value": [{
      "src": "",
      "value": "lambda",
      "type": "identifier",
      "charPos": 13,
      "uuid": "2996fee1-161e-fb03-b35f-51e09f998044"
    }, {
      "src": "",
      "value": [],
      "type": "list",
      "charPos": 19,
      "uuid": "e1209f09-09cd-6fd7-db14-b95c09cd7715"
    }, {
      "src": "",
      "value": [{
        "src": "",
        "value": "quote",
        "type": "identifier",
        "charPos": 23,
        "uuid": "034ed2bf-c8fa-f166-d51e-094d47b8239f"
      }, {
        "src": "",
        "value": [{
          "src": "",
          "value": [{
            "src": "",
            "value": "start-token",
            "type": "identifier",
            "charPos": 30,
            "uuid": "c6f02853-3c65-9c7e-c2c1-9ffb956e7547"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 42,
              "uuid": "89c0ea67-0827-6b3f-5150-ede1d30c3899"
            }],
            "type": "list",
            "charPos": 41,
            "uuid": "f79eba27-eae1-a5e4-e096-b2170dabd279"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 49,
              "uuid": "b9143182-04c7-8521-3b7e-28c42c9637ab"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 56,
                "uuid": "1c1b89c0-b83b-713f-15c1-3e16b7708334"
              }],
              "type": "list",
              "charPos": 55,
              "uuid": "b9bed2f4-8ff1-f997-b07b-bb84db45493c"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 59,
              "uuid": "cacfe30a-8217-6e58-9d9a-f2874b5d12af"
            }],
            "type": "list",
            "charPos": 48,
            "uuid": "61ce6a16-b45c-c4b7-c240-2d9e0355b913"
          }],
          "type": "list",
          "charPos": 29,
          "uuid": "4e9894f1-fb2d-644f-f90c-66c0eb042ffc"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr",
            "type": "identifier",
            "charPos": 65,
            "uuid": "c757a245-ce7d-145a-937b-06735ffd6e7c"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "list-token",
              "type": "identifier",
              "charPos": 70,
              "uuid": "bba0a29b-7438-6ccc-a7a1-2b1c5c260830"
            }],
            "type": "list",
            "charPos": 69,
            "uuid": "7bb06405-7a2d-e8da-cb48-48ff4f7ff6a7"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 83,
              "uuid": "ab064364-7c05-bab0-79be-7700437e94e1"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 90,
                "uuid": "4109a01d-cc5a-96b8-4b48-3267e6f81c6d"
              }],
              "type": "list",
              "charPos": 89,
              "uuid": "913fcc07-bcf7-f443-7ac6-2847da49cc72"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 93,
              "uuid": "4461ef80-fbcf-0ed5-e2cd-862a60717b77"
            }],
            "type": "list",
            "charPos": 82,
            "uuid": "bdfaffac-182b-6ad1-1274-c33b0a6d7e8c"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "atom-token",
              "type": "identifier",
              "charPos": 98,
              "uuid": "ab615359-5564-1fe6-b052-3802cd5e01cc"
            }],
            "type": "list",
            "charPos": 97,
            "uuid": "b1aaf503-4a2a-9d74-743f-58632c859777"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 111,
              "uuid": "ad1d6588-0010-82cf-cef6-55b02a90c173"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 118,
                "uuid": "a3cdac2c-2ff8-9bee-2176-cf9a5960e05d"
              }],
              "type": "list",
              "charPos": 117,
              "uuid": "9d1f328a-9e86-cf7b-f476-87c84b31da69"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 121,
              "uuid": "ee8c05e1-4e4f-4190-a16b-b0039fb27ae8"
            }],
            "type": "list",
            "charPos": 110,
            "uuid": "c62815ae-1b48-6ee7-d8c3-944cbc4a4c98"
          }],
          "type": "list",
          "charPos": 64,
          "uuid": "f5eec567-3fea-a8db-81af-c1a6bd01b1b4"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "list-token",
            "type": "identifier",
            "charPos": 128,
            "uuid": "98ce32ac-f7f2-c3ec-fb9e-87cada053181"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 139,
              "uuid": "17faefd0-f1f8-0a89-3f70-e5061e071004"
            }, {
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 147,
              "uuid": "01fb8042-28e7-e08b-88fa-75322d2b4ab8"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 157,
              "uuid": "777d9a44-0217-5a53-823d-bd0f7a46e217"
            }],
            "type": "list",
            "charPos": 138,
            "uuid": "c76972bc-eba4-3808-8444-7ca2fdffffdb"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 169,
              "uuid": "ca21faaa-68a7-e6b8-8fda-ab25cf796b13"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 176,
                "uuid": "766ca7e4-9c8c-ba58-4ce1-c1f2972271f7"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 177,
                "uuid": "abb6ab8e-ba41-fd20-b6fd-145946965e0d"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 179,
                "uuid": "0b011a4e-a48b-bcf6-a2f8-0a8cfcfe2c0a"
              }],
              "type": "list",
              "charPos": 175,
              "uuid": "6d3e0219-dacc-cc3b-1f8b-c7eaeb39df7d"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "reverse-hack",
                "type": "identifier",
                "charPos": 184,
                "uuid": "ba212c8f-72a7-fa04-a542-5324beef7b91"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 196,
                "uuid": "f2d5b784-3586-d611-b007-c7e6f94116ec"
              }],
              "type": "list",
              "charPos": 183,
              "uuid": "ede628f1-bf01-63b1-709a-9999f4b8a151"
            }],
            "type": "list",
            "charPos": 168,
            "uuid": "91852359-ae47-563b-5f4c-d26105e56047"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 203,
              "uuid": "6c29d321-dbef-14c7-9404-b76f546a7403"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 211,
              "uuid": "c2838634-17db-4706-2f24-2d02efd41179"
            }],
            "type": "list",
            "charPos": 202,
            "uuid": "a5fbfa28-9ad9-2410-097a-7858c86b8115"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 223,
              "uuid": "6be0cd6f-bd5f-9156-2b0d-3592fc940e54"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 230,
                "uuid": "9dc2e917-9d48-8510-b825-6281cc1716fb"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 231,
                "uuid": "ba00f252-be67-3cec-e9ca-c18e3f55a9c6"
              }],
              "type": "list",
              "charPos": 229,
              "uuid": "659567f7-5214-d932-1610-16a1c54047b9"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "quote",
                "type": "identifier",
                "charPos": 236,
                "uuid": "7a590974-e981-9e07-113f-ce8c0ce6a7a7"
              }, {
                "src": "",
                "value": [],
                "type": "list",
                "charPos": 241,
                "uuid": "b74e45a3-b078-b6b8-039c-674d72149903"
              }],
              "type": "list",
              "charPos": 235,
              "uuid": "288095b5-dcea-11bb-fd21-cf0e11a778b9"
            }],
            "type": "list",
            "charPos": 222,
            "uuid": "d9f9c3cc-259f-da30-eaf9-4904b85dba0c"
          }],
          "type": "list",
          "charPos": 127,
          "uuid": "6b9fda22-2437-d5a5-f4dc-994e76e1c4db"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "atom-token",
            "type": "identifier",
            "charPos": 263,
            "uuid": "6bd87c5b-6ec5-98dc-f501-b67b4e419822"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\"(\\\\.|[^\\\\\"])*\"",
              "type": "string",
              "charPos": 281,
              "uuid": "171f9b42-c8b8-b9c6-2e4c-dfc4caf42a67"
            }],
            "type": "list",
            "charPos": 273,
            "uuid": "c0234ae4-bad4-53b2-d5e2-ca2261738906"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 301,
              "uuid": "b4bec98e-a0bd-f6a9-5ed6-87d05577687f"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 309,
                "uuid": "b7a4f286-0c19-4b77-fa76-f776dd9bdeae"
              }],
              "type": "list",
              "charPos": 307,
              "uuid": "b815f3c5-cf4a-90dc-9f8f-d14ce28d202a"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "parse-string",
                "type": "identifier",
                "charPos": 316,
                "uuid": "07978dc9-e474-08d9-6218-b8bfb70eaed7"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 328,
                "uuid": "1cbe7dbe-038c-f0c0-f379-f639a57973bb"
              }],
              "type": "list",
              "charPos": 315,
              "uuid": "d91fe547-2a3d-134a-916b-c348c0f10347"
            }],
            "type": "list",
            "charPos": 300,
            "uuid": "d9a3560a-f02c-5293-ef3d-90ed55a79fa1"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\-?\\d+\\.?\\d*(?:e\\-?\\d+)?",
              "type": "string",
              "charPos": 335,
              "uuid": "5ad41185-fe23-c9db-e404-4940383b5f81"
            }],
            "type": "list",
            "charPos": 334,
            "uuid": "09e09e17-3a99-2f3c-c3e7-6440c96542fa"
          }, {
            "src": "",
            "value": "parse-int",
            "type": "identifier",
            "charPos": 346,
            "uuid": "5ee6c51a-e747-00bb-b1fb-1c0dcc8d7a4d"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "true|false",
              "type": "string",
              "charPos": 391,
              "uuid": "5ddb6232-f74e-b287-e40b-2fd7971f767b"
            }],
            "type": "list",
            "charPos": 390,
            "uuid": "d35c1b2d-357c-eac2-fa12-a0514d9aa047"
          }, {
            "src": "",
            "value": "parse-boolean",
            "type": "identifier",
            "charPos": 405,
            "uuid": "b46d756e-bae7-9990-8f4b-3e79156a40bc"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "atom-token2",
              "type": "identifier",
              "charPos": 470,
              "uuid": "3b60cdc8-2c45-1c43-82f8-1e56b0fcfca0"
            }],
            "type": "list",
            "charPos": 469,
            "uuid": "3eac07b7-6be0-9c5f-487f-0b9758d42648"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 484,
              "uuid": "d47282f3-f0dc-ca8e-1f47-123c4663558e"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 491,
                "uuid": "c2d641f4-4472-a721-e902-d8d6f00e35ab"
              }],
              "type": "list",
              "charPos": 490,
              "uuid": "aa61d337-fa81-2389-ffc9-e824ddd615d1"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 494,
              "uuid": "1385cfea-57ea-fbbf-7e41-4b30915cb237"
            }],
            "type": "list",
            "charPos": 483,
            "uuid": "7d70cba0-6142-0e61-ce70-5814896332c5"
          }],
          "type": "list",
          "charPos": 262,
          "uuid": "b0ac1c00-389b-bc4e-4d16-57429f914e4f"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "atom-token2",
            "type": "identifier",
            "charPos": 552,
            "uuid": "4a3dc338-467c-66fd-821a-1f81f3392128"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "(?!true|false|\\-?\\d+\\.?\\d*(?:e\\-?\\d+)?)[^ \"()0-9~'`]+[^ \"()]*",
              "type": "string",
              "charPos": 564,
              "uuid": "c4e7fc2b-52a5-e646-2cd0-60ba7840461c"
            }],
            "type": "list",
            "charPos": 563,
            "uuid": "721a2c4b-a99e-2213-04d4-14789ce4c799"
          }, {
            "src": "",
            "value": "parse-identifier",
            "type": "identifier",
            "charPos": 578,
            "uuid": "e91d2bbf-4634-6e61-06fe-9382efc8e084"
          }],
          "type": "list",
          "charPos": 551,
          "uuid": "c59f9559-b89c-241e-ebae-e2b39bc0aade"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr-list",
            "type": "identifier",
            "charPos": 598,
            "uuid": "87c56f71-ede8-c858-6743-e7e83218561d"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 608,
              "uuid": "fab994a6-884e-0e69-0c9e-a3db4d926dd0"
            }, {
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 617,
              "uuid": "24b7eed8-bae9-47d3-c216-7d36c6994e30"
            }],
            "type": "list",
            "charPos": 607,
            "uuid": "fc3e6e54-a57d-6810-4467-aae3925bf41d"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 625,
              "uuid": "7f233d1f-e04c-3978-bf45-1d75dae5b480"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 632,
                "uuid": "8ab9702e-edee-6f20-c135-a15898f77085"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 636,
                "uuid": "e13b084e-237b-e323-34cc-b625706c0884"
              }],
              "type": "list",
              "charPos": 631,
              "uuid": "cb38d3b8-80f8-74cf-ee6d-60f8bc28e3dd"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "cons",
                "type": "identifier",
                "charPos": 641,
                "uuid": "536dcb50-5353-b799-d0aa-578eac6cb67e"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 645,
                "uuid": "0d93395f-a48e-98cc-9ced-65dfeafe892a"
              }, {
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 647,
                "uuid": "acb20638-2b93-ece0-143c-5af38bfbe0df"
              }],
              "type": "list",
              "charPos": 640,
              "uuid": "dfa67fab-db01-838d-50d6-64253c238497"
            }],
            "type": "list",
            "charPos": 624,
            "uuid": "ef43364c-5e7b-49ca-0aca-f3194db524a7"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 657,
              "uuid": "1719f57e-f67e-a1ad-0a26-eccf5dbcefee"
            }],
            "type": "list",
            "charPos": 656,
            "uuid": "c054d9f5-da2f-d628-3136-241f0cdcb878"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 664,
              "uuid": "35d99f50-6330-ea74-9121-a2aea2b17acf"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "args",
                "type": "identifier",
                "charPos": 671,
                "uuid": "31545c87-b994-4f0c-7236-ecf361d588b6"
              }, {
                "src": "",
                "value": "...",
                "type": "identifier",
                "charPos": 675,
                "uuid": "9d1edc80-ea39-7727-1d32-58448d4049c8"
              }],
              "type": "list",
              "charPos": 670,
              "uuid": "8bb46121-e89d-fc2e-2fc2-d6bd0059b752"
            }, {
              "src": "",
              "value": "args",
              "type": "identifier",
              "charPos": 681,
              "uuid": "8acc7ff4-d907-4e35-547b-045eaba20ccf"
            }],
            "type": "list",
            "charPos": 663,
            "uuid": "460de998-0295-1a4a-8882-3b17d3708a61"
          }],
          "type": "list",
          "charPos": 597,
          "uuid": "d2af9ef6-cbaa-2ac7-038a-4d11c447d5b5"
        }],
        "type": "list",
        "charPos": 28,
        "uuid": "dc0d2562-18a6-059d-5e3e-742fe01fe748"
      }],
      "type": "list",
      "charPos": 22,
      "uuid": "ebb8b9d2-8515-2025-1283-cf2251b345e6"
    }],
    "type": "list",
    "charPos": 12,
    "uuid": "85730ad8-dd87-1cfd-dfa8-122941266753"
  }],
  "type": "list",
  "charPos": 0,
  "uuid": "931b9bb9-a7f6-9a8b-97ef-cd361b00d275"
}
