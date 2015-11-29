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
    "uuid": "1a320ad5-ecbb-dd54-5338-4ef4bbbd6eee"
  }, {
    "src": "",
    "value": "core",
    "type": "identifier",
    "charPos": 7,
    "uuid": "f1ea0d10-3f6e-58dc-67fb-684cb543517b"
  }, {
    "src": "",
    "value": [{
      "src": "",
      "value": "lambda",
      "type": "identifier",
      "charPos": 13,
      "uuid": "c1f2bf40-e2db-90b7-770b-508a780cf350"
    }, {
      "src": "",
      "value": [],
      "type": "list",
      "charPos": 19,
      "uuid": "8d66e8c4-c31e-4aed-3584-2b55eb3f5afd"
    }, {
      "src": "",
      "value": [{
        "src": "",
        "value": "quote",
        "type": "identifier",
        "charPos": 22,
        "uuid": "876e5e4c-71ea-087d-f30d-ffeb7bd746ca"
      }, {
        "src": "",
        "value": [{
          "src": "",
          "value": [{
            "src": "",
            "value": "start-token",
            "type": "identifier",
            "charPos": 25,
            "uuid": "fab3e698-ea48-9a60-d5b4-35d03a2bcf48"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 37,
              "uuid": "c5bc7172-2162-4352-626b-9e7fefa54280"
            }],
            "type": "list",
            "charPos": 36,
            "uuid": "d0f0a026-6dcf-f501-aaa3-2771078043da"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 44,
              "uuid": "a70d6c7d-f9ab-2752-95ec-fe39fbbcd8b8"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 51,
                "uuid": "97105386-b123-c604-5e73-3de409f40fdf"
              }],
              "type": "list",
              "charPos": 50,
              "uuid": "b451dc6d-b671-8732-f5ad-0387b19926b6"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 54,
              "uuid": "ce8fdfcf-fdc5-2638-01e1-5f329400b230"
            }],
            "type": "list",
            "charPos": 43,
            "uuid": "d4eea48f-0a06-1fda-4e6e-d00762955341"
          }],
          "type": "list",
          "charPos": 24,
          "uuid": "585819a3-ae58-00dd-fced-7c128151d8f0"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr",
            "type": "identifier",
            "charPos": 60,
            "uuid": "563b54bc-e881-44bd-772d-963fe9db876f"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "list-token",
              "type": "identifier",
              "charPos": 65,
              "uuid": "7dfc300d-563f-564a-6786-375107492696"
            }],
            "type": "list",
            "charPos": 64,
            "uuid": "cc0800b2-309e-1815-2466-8e74f7db894a"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 78,
              "uuid": "6a95a63d-3988-162c-9ebc-a2e1ae596d0d"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 85,
                "uuid": "2fd923b6-295e-8437-e503-5da9b39fc216"
              }],
              "type": "list",
              "charPos": 84,
              "uuid": "998da696-c2b2-8250-13f0-54fae4e8e310"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 88,
              "uuid": "9ade74c9-4ef9-251f-830c-a15e2e7106f3"
            }],
            "type": "list",
            "charPos": 77,
            "uuid": "9a7566e3-7208-4bbe-9f03-3a20e57f668f"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "atom-token",
              "type": "identifier",
              "charPos": 93,
              "uuid": "6f1dc16c-c2f9-1234-3ffc-6b4a67666f58"
            }],
            "type": "list",
            "charPos": 92,
            "uuid": "7b3156f7-0a06-0a81-cc30-df8314764c32"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 106,
              "uuid": "64123091-9fd6-3f50-4059-0da92652e6fe"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 113,
                "uuid": "6d436d67-4a51-32e7-1db4-0959626a481e"
              }],
              "type": "list",
              "charPos": 112,
              "uuid": "bfae3050-d71c-2352-d46a-4b43e33a93a0"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 116,
              "uuid": "4bf741f9-83e4-161e-d92d-a56b91b96100"
            }],
            "type": "list",
            "charPos": 105,
            "uuid": "0442fefe-064f-9619-567a-adb7c66cfa32"
          }],
          "type": "list",
          "charPos": 59,
          "uuid": "d9575e67-f60d-618e-02b5-c29d8e3487e2"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "list-token",
            "type": "identifier",
            "charPos": 123,
            "uuid": "9b684e21-c2ef-3230-e641-c3bcc2205f99"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 134,
              "uuid": "9a08a52e-b824-24e9-c4c7-01a922c1b563"
            }, {
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 142,
              "uuid": "0c193aa5-543a-1d0e-6730-7e9eb847bb57"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 152,
              "uuid": "7c14fc22-c4be-c301-468e-5aaa84750137"
            }],
            "type": "list",
            "charPos": 133,
            "uuid": "1f26e0a1-93bf-f3de-a609-10f574f4fd82"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 164,
              "uuid": "2225016a-a0f1-0df1-0fd5-0f5cc5e31dc3"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 171,
                "uuid": "e814484e-a55d-8fda-992a-739f52758c15"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 172,
                "uuid": "05b51850-53f2-44ac-a100-40e4664354a4"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 174,
                "uuid": "529ab175-54ff-7064-ba5a-cd97d426c4e3"
              }],
              "type": "list",
              "charPos": 170,
              "uuid": "523b7f8a-9feb-1c10-9adf-8d8ab7e75632"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 178,
              "uuid": "e5e7296c-93a8-6d95-fca5-cb0b863b0736"
            }],
            "type": "list",
            "charPos": 163,
            "uuid": "b413927f-de1c-4055-1fa1-aee1b361c9ca"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 183,
              "uuid": "e098259f-e21c-da61-99e2-273020f6787c"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 191,
              "uuid": "b659d163-3cb4-86f3-7f1d-b196756c2d43"
            }],
            "type": "list",
            "charPos": 182,
            "uuid": "02223898-e1e6-0465-bf8c-975daca849d4"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 203,
              "uuid": "81903533-f18f-f414-9b0c-2a4eac2c0e8b"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 210,
                "uuid": "7f537779-8f05-f304-ab10-23bbab6aad60"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 211,
                "uuid": "ee681062-17b3-256c-a2ed-da21ed001202"
              }],
              "type": "list",
              "charPos": 209,
              "uuid": "71182c50-097d-4de7-a5de-0ed2f7de3977"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "quote",
                "type": "identifier",
                "charPos": 215,
                "uuid": "8a10b7d4-1b13-06bd-9aa9-ac78161c577b"
              }, {
                "src": "",
                "value": [],
                "type": "list",
                "charPos": 216,
                "uuid": "3eef7cc3-ff1a-db7e-0a52-179fa329581d"
              }],
              "type": "list",
              "charPos": 215,
              "uuid": "f759b67b-4ee6-fd08-ff24-bf14d8c950ef"
            }],
            "type": "list",
            "charPos": 202,
            "uuid": "e5180cc3-0cd1-ab51-c654-5f39b70e9636"
          }],
          "type": "list",
          "charPos": 122,
          "uuid": "d6176291-3b34-c376-50fd-307cd3905536"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "atom-token",
            "type": "identifier",
            "charPos": 224,
            "uuid": "0a7b2fd8-a1b2-33a5-7b62-de51cebf4d3b"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\-?\\d*\\.?\\d*e?\\-?\\d+",
              "type": "string",
              "charPos": 235,
              "uuid": "31495adf-1361-f2ae-e018-1d13edd15dcd"
            }],
            "type": "list",
            "charPos": 234,
            "uuid": "8a3b9c99-45c5-03bb-cf8c-772e02ddc9c0"
          }, {
            "src": "",
            "value": "parse-int",
            "type": "identifier",
            "charPos": 246,
            "uuid": "9d839a18-f1a5-1d4a-1447-289119e2f645"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "[^ ()0-9]+[^ ()]*",
              "type": "string",
              "charPos": 257,
              "uuid": "42aa486e-459b-5e87-9b28-b5316bbd2b0f"
            }],
            "type": "list",
            "charPos": 256,
            "uuid": "b6c463f8-f6d8-3c50-0e49-29f64fa28f27"
          }, {
            "src": "",
            "value": "parse-identifier",
            "type": "identifier",
            "charPos": 271,
            "uuid": "b816294c-b94d-b872-9ff6-327204fea705"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\\"([^\\\"\\\\\\n]|(\\\\\\\\)*\\\\\\\"|\\\\[^\\\"\\n])*\\\"",
              "type": "string",
              "charPos": 289,
              "uuid": "7ded0291-e2f3-f71e-a153-47a659b663ea"
            }],
            "type": "list",
            "charPos": 288,
            "uuid": "2385cf19-dc83-cb43-e574-87c3e6ea59e5"
          }, {
            "src": "",
            "value": "parse-string",
            "type": "identifier",
            "charPos": 299,
            "uuid": "033a5a69-9001-3f4d-68b4-46c2902a8183"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "true|false",
              "type": "string",
              "charPos": 313,
              "uuid": "328528b6-501a-925f-f4db-405e9fc17ca3"
            }],
            "type": "list",
            "charPos": 312,
            "uuid": "9ff3500b-92bb-445f-8330-916ffbc94e60"
          }, {
            "src": "",
            "value": "parse-boolean",
            "type": "identifier",
            "charPos": 324,
            "uuid": "4bfdf700-36e7-0536-104f-9d612a2ac558"
          }],
          "type": "list",
          "charPos": 223,
          "uuid": "5c564738-0377-1aba-58e0-779a989f2f39"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr-list",
            "type": "identifier",
            "charPos": 341,
            "uuid": "2be606db-e02e-e9a6-0700-42482cddc732"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 351,
              "uuid": "c71583df-da97-5b29-9dc1-a802e8420694"
            }, {
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 360,
              "uuid": "8b7e65f3-66ca-82d8-6517-dde1f87d30c0"
            }],
            "type": "list",
            "charPos": 350,
            "uuid": "4fd33577-9918-6705-cc44-798f8da4d5e9"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 368,
              "uuid": "fc7e1c1b-bb11-0f09-1f55-b8a9973c9695"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 375,
                "uuid": "b1f99e27-cfb8-bc92-2be1-948ffb845396"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 379,
                "uuid": "33a6ac53-cbdf-c33a-f702-e4912042273e"
              }],
              "type": "list",
              "charPos": 374,
              "uuid": "9ba10e9b-d36b-1dfe-914e-cbc44e31371d"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "cons",
                "type": "identifier",
                "charPos": 384,
                "uuid": "79d48889-4262-77ac-862b-896612bde103"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 388,
                "uuid": "8671e875-0542-8e50-07d2-ef63f0b0cd7b"
              }, {
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 390,
                "uuid": "2f1117d6-cee7-17d0-544c-0735adf74c1d"
              }],
              "type": "list",
              "charPos": 383,
              "uuid": "d9849983-0421-f66a-deae-868ee247c986"
            }],
            "type": "list",
            "charPos": 367,
            "uuid": "b6dd0e5f-5921-5622-6721-6de0929f988c"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 400,
              "uuid": "38f2d34b-5be4-0e19-fe06-ce74b3ba4eb8"
            }],
            "type": "list",
            "charPos": 399,
            "uuid": "d252e02c-94c4-c1e4-d0e5-95bd3eaeabf6"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 407,
              "uuid": "b5f15945-6bb4-97e7-8ce3-c554e8dadff5"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 414,
                "uuid": "f0ec3a23-cf52-913a-7bf5-693a35068987"
              }],
              "type": "list",
              "charPos": 413,
              "uuid": "79559e23-a66b-ef7b-b6a2-077ede63a299"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "list",
                "type": "identifier",
                "charPos": 418,
                "uuid": "7f5ce391-9157-7bfd-9cb2-2298986c0fec"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 422,
                "uuid": "8957d1c3-9992-2271-dcce-3dfd0d75d754"
              }],
              "type": "list",
              "charPos": 417,
              "uuid": "1098d726-dae4-a128-6b68-c3068e200767"
            }],
            "type": "list",
            "charPos": 406,
            "uuid": "5482f184-f5f7-7c93-fcd5-03cb68c9fd69"
          }],
          "type": "list",
          "charPos": 340,
          "uuid": "e7695b68-f65a-8fd1-3594-a5293c5bfe8a"
        }],
        "type": "list",
        "charPos": 23,
        "uuid": "c8de16dd-7839-44c8-5f03-b83605574810"
      }],
      "type": "list",
      "charPos": 22,
      "uuid": "81cb8277-bcd7-1246-3208-b47722e5ce0c"
    }],
    "type": "list",
    "charPos": 12,
    "uuid": "d6b8a97a-697e-f6c4-bd3d-421970cedeb3"
  }],
  "type": "list",
  "charPos": 0,
  "uuid": "05045a33-b54b-810a-602c-7e68db256aac"
}
