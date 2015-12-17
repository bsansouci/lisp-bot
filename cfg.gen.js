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
    "uuid": "75f1a407-8574-3cf8-2747-5b48f3bec8c0"
  }, {
    "src": "",
    "value": "core",
    "type": "identifier",
    "charPos": 7,
    "uuid": "058e6e3f-9a99-6212-3a44-bc33dff15354"
  }, {
    "src": "",
    "value": [{
      "src": "",
      "value": "lambda",
      "type": "identifier",
      "charPos": 13,
      "uuid": "00f15516-93b6-539c-bdab-587a949a0e83"
    }, {
      "src": "",
      "value": [],
      "type": "list",
      "charPos": 19,
      "uuid": "372cc0e6-d601-6f7f-dd72-71a8031c1d4d"
    }, {
      "src": "",
      "value": [{
        "src": "",
        "value": "quote",
        "type": "identifier",
        "charPos": 23,
        "uuid": "155dca8b-0f9a-07e5-06b1-483ae6c38da8"
      }, {
        "src": "",
        "value": [{
          "src": "",
          "value": [{
            "src": "",
            "value": "start-token",
            "type": "identifier",
            "charPos": 30,
            "uuid": "28506485-9a3d-0fdd-6965-ebc3bcc80ecc"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 42,
              "uuid": "e03645d2-a9eb-582f-ecf1-cdd0908f7011"
            }],
            "type": "list",
            "charPos": 41,
            "uuid": "57983762-b035-4402-f556-01a9301d9aeb"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 49,
              "uuid": "00bb74d6-b827-eae6-057d-ca567676625e"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 56,
                "uuid": "4c6f3fe8-fab7-d636-142d-34455933544b"
              }],
              "type": "list",
              "charPos": 55,
              "uuid": "18fb78ea-f76b-b33d-f647-6dd1998f33a8"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 59,
              "uuid": "d2c43f68-e8ac-1359-e641-bb4034d8f854"
            }],
            "type": "list",
            "charPos": 48,
            "uuid": "f5139efe-0890-399e-f83f-f4ebc3450907"
          }],
          "type": "list",
          "charPos": 29,
          "uuid": "0c3d0e25-3544-7f1c-54af-602ae558b644"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr",
            "type": "identifier",
            "charPos": 65,
            "uuid": "3f2db47f-59f3-4a12-d87b-bb3a8a7a0fee"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "list-token",
              "type": "identifier",
              "charPos": 70,
              "uuid": "3e8f1528-1866-65a6-180a-2c435d67586f"
            }],
            "type": "list",
            "charPos": 69,
            "uuid": "125d5658-2edd-a8b7-9586-11fe58475d75"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 83,
              "uuid": "362b3fc3-c6b1-d798-69f9-da4e3eabeb89"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 90,
                "uuid": "cde54191-0af3-3874-fcdb-97a172be6b5b"
              }],
              "type": "list",
              "charPos": 89,
              "uuid": "bc1b7666-f794-fa2a-3e28-ea0370639ceb"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 93,
              "uuid": "22abc503-82d3-1edd-d4f4-41558b1c8001"
            }],
            "type": "list",
            "charPos": 82,
            "uuid": "7364054c-2e67-1bb7-ff66-a97387adc8f4"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "atom-token",
              "type": "identifier",
              "charPos": 98,
              "uuid": "62a197f6-aad6-15c2-945c-ed844f889dc8"
            }],
            "type": "list",
            "charPos": 97,
            "uuid": "6cb3ca21-fe15-22a1-2d15-268d2afdb151"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 111,
              "uuid": "f4a2ac5f-4e1f-3abe-4722-ecc5ae3726c5"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 118,
                "uuid": "445754d0-642d-70ab-4709-1add0c81acd2"
              }],
              "type": "list",
              "charPos": 117,
              "uuid": "b694f642-0e96-8c34-7a5b-9bac0d91a522"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 121,
              "uuid": "b1ac8f73-464b-ddb1-bb64-19f558d42a3c"
            }],
            "type": "list",
            "charPos": 110,
            "uuid": "91d1f936-0151-fb5e-b6c0-4ba75e09f2ae"
          }],
          "type": "list",
          "charPos": 64,
          "uuid": "baa17b7f-fdea-3885-ed01-2bfa82a0ecd9"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "list-token",
            "type": "identifier",
            "charPos": 128,
            "uuid": "50695f69-cb3d-1c75-7030-5c7490b5c535"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 139,
              "uuid": "1283e7dc-cd9f-141b-3e2c-c470193ae8f7"
            }, {
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 147,
              "uuid": "ab12add3-91ba-a9be-0bbb-5b0db0d0f26c"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 157,
              "uuid": "e30c19d9-afb5-04e2-1573-aac27142e556"
            }],
            "type": "list",
            "charPos": 138,
            "uuid": "62955047-03a1-ab44-3037-f0c0ffc37a05"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 169,
              "uuid": "eadab77b-b976-272e-9cca-a593824cf235"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 176,
                "uuid": "098a05ab-341a-80bb-80af-489cfe6fc1ab"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 177,
                "uuid": "3f799146-a18a-4d43-b13b-5e9b395ce78f"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 179,
                "uuid": "a9398c32-180a-36de-4e01-d9863109c3b6"
              }],
              "type": "list",
              "charPos": 175,
              "uuid": "b49e1286-cb45-3abe-6990-cc093ee8afd2"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "reverse-hack",
                "type": "identifier",
                "charPos": 179,
                "uuid": "a9398c32-181a-36de-4e01-d9863109c3b6"
              }, {
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 183,
                "uuid": "e9b205e5-66b1-87ad-b696-9dc767bd6c9e"
              }],
              "type": "list",
              "charPos": 183,
              "uuid": "e9b105e5-66b1-87ad-b696-9dc767bd6c9e"
            }],
            "type": "list",
            "charPos": 168,
            "uuid": "2e1cb720-7c6f-0413-1466-a8f31006b50f"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\(",
              "type": "string",
              "charPos": 188,
              "uuid": "e648cb97-043c-71cb-6864-52469acc624a"
            }, {
              "src": "",
              "value": "\\)",
              "type": "string",
              "charPos": 196,
              "uuid": "a262ad26-f700-51a2-a390-be553385b583"
            }],
            "type": "list",
            "charPos": 187,
            "uuid": "fc6ea925-1158-b259-fd03-ba5af44793c6"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 208,
              "uuid": "0ee52691-3c67-28de-5402-b01ade486362"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 215,
                "uuid": "4256289e-ba24-dea4-b5ad-9b96106f9480"
              }, {
                "src": "",
                "value": "_",
                "type": "identifier",
                "charPos": 216,
                "uuid": "d3856a00-c631-ac37-4028-b09195f4576b"
              }],
              "type": "list",
              "charPos": 214,
              "uuid": "bd43c021-c83f-79ed-68ed-0561f28c81a2"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "quote",
                "type": "identifier",
                "charPos": 221,
                "uuid": "07331e73-8965-afc6-d0e0-309b7e11dead"
              }, {
                "src": "",
                "value": [],
                "type": "list",
                "charPos": 226,
                "uuid": "1f04a8fb-4662-3899-3b1b-d72c8d2a5f3e"
              }],
              "type": "list",
              "charPos": 220,
              "uuid": "fb3b2d66-aaf2-ac79-6105-3d99686f4aa4"
            }],
            "type": "list",
            "charPos": 207,
            "uuid": "de760ca3-3d3e-481e-41bd-010d13ac7c32"
          }],
          "type": "list",
          "charPos": 127,
          "uuid": "a638c7ae-8e7e-e513-c75d-56fb38b366d8"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "atom-token",
            "type": "identifier",
            "charPos": 236,
            "uuid": "c4e295e4-f622-37d8-5287-6f5feb86f637"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\-?\\d*\\.?\\d*e?\\-?\\d+",
              "type": "string",
              "charPos": 247,
              "uuid": "63b43018-55be-d8df-4168-c65ae8aaab9d"
            }],
            "type": "list",
            "charPos": 246,
            "uuid": "166db493-cf55-8633-d4f4-5dc3d660770b"
          }, {
            "src": "",
            "value": "parse-int",
            "type": "identifier",
            "charPos": 258,
            "uuid": "eb782cc6-a1dc-c0d9-5fc5-39b41db137ee"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "\\\"([^\\\"\\\\\\n]|(\\\\\\\\)*\\\\\\\"|\\\\[^\\\"\\n])*\\\"",
              "type": "string",
              "charPos": 269,
              "uuid": "9585dcc5-e3c8-ccac-3892-730b804a7b72"
            }],
            "type": "list",
            "charPos": 268,
            "uuid": "246f1115-1f0c-a3db-52a4-878c9ce4e742"
          }, {
            "src": "",
            "value": "parse-string",
            "type": "identifier",
            "charPos": 283,
            "uuid": "5a475678-1066-079e-7e67-7c5a2d72d532"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "atom-token2",
              "type": "identifier",
              "charPos": 301,
              "uuid": "3b18f6ea-24cd-2204-bfd8-882b79410564"
            }],
            "type": "list",
            "charPos": 300,
            "uuid": "53fc38ef-e7cd-b7bf-6dd7-2eefa2ea0975"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 315,
              "uuid": "ba544672-a43f-e073-1099-357e74b5b27d"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "x",
                "type": "identifier",
                "charPos": 322,
                "uuid": "a87180c8-3447-03f0-5f82-96f1dbd4969e"
              }],
              "type": "list",
              "charPos": 321,
              "uuid": "ffd142e8-7611-73b6-9caf-4d072e1dd3a7"
            }, {
              "src": "",
              "value": "x",
              "type": "identifier",
              "charPos": 325,
              "uuid": "285e35d4-2433-8eb9-f373-34ad3350fade"
            }],
            "type": "list",
            "charPos": 314,
            "uuid": "ca54e993-c6d3-60ec-641b-8044d0c2e2a5"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "true|false",
              "type": "string",
              "charPos": 330,
              "uuid": "93e294ae-9f73-1e51-58ac-2a3f7977c6c1"
            }],
            "type": "list",
            "charPos": 329,
            "uuid": "8d815872-53ea-22e1-99c4-b3d04daddfce"
          }, {
            "src": "",
            "value": "parse-boolean",
            "type": "identifier",
            "charPos": 341,
            "uuid": "4e58f07e-dfb1-c637-732c-bb7049cf8483"
          }],
          "type": "list",
          "charPos": 235,
          "uuid": "077aaca0-eece-2001-4821-0cfc9020b152"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "atom-token2",
            "type": "identifier",
            "charPos": 358,
            "uuid": "a1136d7f-f2e2-473b-002c-2e81417a8b37"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "[^ ()0-9]+[^ ()]*",
              "type": "string",
              "charPos": 370,
              "uuid": "56db4edb-dbff-5743-0d50-b06299c5212c"
            }],
            "type": "list",
            "charPos": 369,
            "uuid": "eda56132-b0dd-87b3-7192-de11308c6140"
          }, {
            "src": "",
            "value": "parse-identifier",
            "type": "identifier",
            "charPos": 380,
            "uuid": "73364e54-bfca-ba58-5693-986eab156af5"
          }],
          "type": "list",
          "charPos": 357,
          "uuid": "d698e9c4-4541-c83e-11b1-3725d4c41363"
        }, {
          "src": "",
          "value": [{
            "src": "",
            "value": "expr-list",
            "type": "identifier",
            "charPos": 396,
            "uuid": "ab01fc82-3ae7-beba-e020-423801b965b6"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr-list",
              "type": "identifier",
              "charPos": 406,
              "uuid": "a2f52b42-cf31-78f4-e9d8-ac1635c941b6"
            }, {
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 415,
              "uuid": "0f008414-3cb8-8b66-da88-3cc9507dd46f"
            }],
            "type": "list",
            "charPos": 405,
            "uuid": "78ad4451-a201-f539-210f-91e971369158"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 423,
              "uuid": "daca49b6-ac65-c5ad-6dc3-b22cb51a1e30"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 430,
                "uuid": "6d7e9e05-6245-431f-6c5b-83914c1dc6a8"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 434,
                "uuid": "6120b267-ecfa-6080-b832-ec08ce1c78f7"
              }],
              "type": "list",
              "charPos": 429,
              "uuid": "4a7377b8-d58b-e4a9-b15d-e2de602f6c9c"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "cons",
                "type": "identifier",
                "charPos": 439,
                "uuid": "2f429519-f3be-d8a8-4b3e-843f21c58508"
              }, {
                "src": "",
                "value": "e",
                "type": "identifier",
                "charPos": 443,
                "uuid": "62ba6c85-1a4f-05cd-9353-0142bee45e50"
              }, {
                "src": "",
                "value": "coll",
                "type": "identifier",
                "charPos": 445,
                "uuid": "9ae4ffea-1d28-bd98-0f55-08af996ae9ef"
              }],
              "type": "list",
              "charPos": 438,
              "uuid": "bcd6c93b-cd4d-7c72-dd77-d55e9f51d581"
            }],
            "type": "list",
            "charPos": 422,
            "uuid": "b7d6bc65-c3f9-7ed2-2026-5738d2e827ae"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "expr",
              "type": "identifier",
              "charPos": 455,
              "uuid": "e5a087ee-bb70-4f85-bcb7-36822bc74881"
            }],
            "type": "list",
            "charPos": 454,
            "uuid": "08e6f730-5912-75bd-5db7-6f06725c6a13"
          }, {
            "src": "",
            "value": [{
              "src": "",
              "value": "lambda",
              "type": "identifier",
              "charPos": 462,
              "uuid": "7f53a966-d0db-ceb4-42cd-faf49f38ff1a"
            }, {
              "src": "",
              "value": [{
                "src": "",
                "value": "args",
                "type": "identifier",
                "charPos": 469,
                "uuid": "68080131-05ad-beaa-6a9b-650e5d58479d"
              }, {
                "src": "",
                "value": "...",
                "type": "identifier",
                "charPos": 473,
                "uuid": "cd24112b-5aea-1145-62a9-9f5e4988f448"
              }],
              "type": "list",
              "charPos": 468,
              "uuid": "e4f9bf2c-6be6-756c-1a17-a030fbcd6c27"
            }, {
              "src": "",
              "value": "args",
              "type": "identifier",
              "charPos": 479,
              "uuid": "bb2a2b40-48fe-dd0a-ca60-720f541fbeb3"
            }],
            "type": "list",
            "charPos": 461,
            "uuid": "79795bf0-428b-b305-5c74-a318bdbfeef0"
          }],
          "type": "list",
          "charPos": 395,
          "uuid": "2257a8cf-2c64-9969-ad54-9c4c2057da62"
        }],
        "type": "list",
        "charPos": 28,
        "uuid": "0dac0ee1-ee71-5ea5-0a7f-569ce1eb6ccd"
      }],
      "type": "list",
      "charPos": 22,
      "uuid": "a5f13b9d-b91d-88dc-2975-f3eda93da951"
    }],
    "type": "list",
    "charPos": 12,
    "uuid": "03b4e645-d0aa-6465-face-3422f79c1b5f"
  }],
  "type": "list",
  "charPos": 0,
  "uuid": "1e1a47d2-5084-c47a-de92-c4c9c1993be1"
}
