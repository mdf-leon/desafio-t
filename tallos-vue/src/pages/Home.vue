<template>
  <div
    class="container absolute mx-auto w-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <h1 class="text-2xl font-bold mb-5">Desafio Tallos</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h2 class="text-xl font-bold mb-3">Login</h2>

        <form class="grid grid-cols-1 gap-3" @submit.prevent="login">
          <DInput
            name="login-username"
            type="text"
            v-model="loginData.username"
            placeholder="Username"
          />
          <DInput
            name="login-password"
            type="password"
            v-model="loginData.password"
            placeholder="Password"
          />

          <DButton name="login-submit" type="submit">Login</DButton>
        </form>
      </div>

      <div>
        <h2 class="text-xl font-bold mb-3">Register</h2>

        <form class="grid grid-cols-1 gap-3" @submit.prevent="register">
          <DInput
            name="register-username"
            type="text"
            v-model="registerData.username"
            placeholder="Username"
          />
          <DInput
            name="register-password"
            type="password"
            v-model="registerData.password"
            placeholder="Password"
          />

          <DButton name="register-submit" type="submit" class="border rounded"
            >Register</DButton
          >
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import UserService from "../services/UserService";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loginData: {
        username: "",
        password: "",
      },

      registerData: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(["userLogin", "setCurrentUserFromLogin", "userRegister"]),

    async login() {
      try {
        await this.userLogin(this.loginData);
        this.$router.push("/list");
      } catch (error: any) {
        console.error("Login failed:", error.message);
        // Handle error, perhaps show a message to the user
      }
    },

    async register() {
      try {
        await this.userRegister(this.registerData);
        this.$router.push("/list");
      } catch (error: any) {
        console.error("Registration failed:", error.message);
        // Handle error, perhaps show a message to the user
      }
    },
  },
  // methods: {
  //   async login() {
  //     const response = await UserService.login(this.loginData);

  //     localStorage.setItem("token", response.token);

  //     this.$router.push('/list');
  //   },

  //   async register() {
  //     // const response = await this.$http.post('/auth/register', this.registerData);

  //     const response = await UserService.register(this.registerData);

  //     localStorage.setItem("token", response.token);

  //     this.$router.push('/list');
  //   },
  // }
};
</script>
