
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "registerUser": "done.invoke.Form.register:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "saveData": "REGISTER";
"validate": "VALIDATE";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "didUserAcceptTerms": "REGISTER";
        };
        eventsCausingServices: {
          "registerUser": "REGISTER";
        };
        matchesStates: "form" | "register" | "submitted";
        tags: never;
      }
  