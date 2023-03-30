import { createMachine, assign } from "xstate";

export interface UserSubmitForm {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  message: string;
};

function FormMachine() {
    return createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5QDED2AnAtgOgGYcwGJcBXAGzIDsBDTMbEgBwmoBcwBtABgF1FRGqWAEtWw1JX4gAHogDsAFmwBGAKwAmdQA4AzDoCcXHaoBsckwBoQAT0QmTXbOuVa5yuVwX6TCueoC+-lZoWHgEhCSwYOg0dAzMbJy8UoIiYhJSsggm+tjGqjpanqoFXlyWNoimOtjmJd7GBvq6gcEEYViEYJjUwmTxLOzcfEggqaLikqNZWiYq7soKBcruXm5WtggKZnnK6r6mqrpeOq0gITj4nYzUsLAA7hgQA4nDKUITGdPyjlzqevpVHJDOZ7MoNogdB5sFpVPpjF4TOoPEYzhcOkQAMYSXDCLAABVuDyeLyGyVG43SU1AWQUymw+kZTOZTNmEIQyKUCnK-wU6jMXFUyj0aPaVyI1ExmLAjFYABVophYKSkiMBB8qZkqloVID+aojOUDXT2e45AzlsKgYs-sZRaFxYQAEoAUQA4gBJADKcpdTreFI1ky1HK06mw2y4wL1JgNOnZ5ly6hK7h0yi4IO29su4VdXpdcoD6rSwe+CH0Sn0dShSMFvjk7K09K8TO0ciBBR0Jmz2HQYCgwlg7HQhAgEnowkoADdUABrejovsDofRBCTmeYtiTYZFsZBr40+Rh7CmTTlCtHBQ6BQJ695EzKCuLfTpsM9peD4dddDoDDYRhkGw4rYIu-afqu66oJuVI7uSxafNSMiQrCDLaAoWgKJhFbNFojaxrUQLcoYWiwso9iBEEICUKgEBwFIFzvCWB5IQgAC0cxcJxXHcVxizsuxPbioxCEhisOraAaOSplGyLsoY4YaLMZRmFo3j6O+YErugwmamWHbYFwahLOURhkYyt7hroGHNHC1otJR6KwCQABGmCiOwEA6aWh7liYOpRnIHhLHyTZpgmJQGSRXjoYFhTlBR-hAA */
        id: "Form",
        initial: "form",
        tsTypes: {} as import("./fsm.typegen").Typegen0,
        schema: {
            context: {} as UserSubmitForm,
            services: {} as {
              registerUser: {
                data: string
              }
            },
            events: {} as 
              | { type: "fullname.update", value: string }
              | { type: "username.update", value: string }
              | { type: "email.update", value: string }
              | { type: "password.update", value: string }
              | { type: "confirmPassword.update", value: string }
              | { type: "acceptTerms.update", value: boolean}
              | { type: "REGISTER", data?: UserSubmitForm}
              | { type: "RESET"}
        },
        context: {
          fullname: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
          message: ""
        },
        states: {
            form: {
                on: {
                    "fullname.update": {
                        actions: assign((_ctx, {value}) => ({ fullname: value }))
                    },
                    "username.update": {
                        actions: assign((_ctx, {value}) => ({ username: value }))
                    },
                    "email.update": {
                        actions: assign((_ctx, {value}) => ({ email: value }))
                    },
                    "password.update": {
                        actions: assign((_ctx, {value}) => ({ password: value }))
                    },
                    "confirmPassword.update": {
                        actions: assign((_ctx, {value}) => ({ confirmPassword: value }))
                    },
                    "acceptTerms.update": {
                        actions: assign((_ctx, {value}) => ({ acceptTerms: value }))
                    },
                    REGISTER: {
                      target: "register",
                      cond: "didUserAcceptTerms"
                    },
                    RESET: {
                      actions: "resetForm"
                    }
                }
            },
            register: {
              invoke: {
                src: "registerUser",
                onDone: {
                  target: "submitted",
                  actions: assign((_ctx, {data}) => ({ message: data }))
                },
                onError: {
                  target: "form",
                  actions: assign((_ctx, {data}) => ({ message: data }))
                }
              }
            },
            submitted: {
              type: "final"
            } 
        }
    }, {
      actions: {
        resetForm: (_ctx, _evt) => ({fullname: "", username: "", email: "", password: "", confirmPassword: "", acceptTerms: false })
      },
      guards: {
        didUserAcceptTerms: (ctx, _evt) => {
          console.log('terms accepted?', ctx.acceptTerms)
          return ctx.acceptTerms === true
        }
      },
      services: {
        registerUser: async (ctx, _evt) => {
          console.log('submitting...')
          if (ctx.password !== ctx.confirmPassword) throw new Error("Passwords don't match") 

          console.log(`Register user with the following:
            \n fullname: ${ctx.fullname}
            \n username: ${ctx.username}
            \n email: ${ctx.email}
            \n password: ${ctx.password}
            \n confirmPassword: ${ctx.confirmPassword}
            \n acceptTerms: ${ctx.acceptTerms}`)
            return "User registered successfully"
        }
        // registerUser: async () => {
        //   return "success"
        // }
      }
    })
}

export default FormMachine