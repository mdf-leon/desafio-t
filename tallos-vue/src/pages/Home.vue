<template>
  <div class="container absolute mx-auto w-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <h1 class="text-2xl font-bold mb-5">
      Desafio Tallos
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h2 class="text-xl font-bold mb-3">Login</h2>

        <form class="grid grid-cols-1 gap-3" @submit.prevent="login">
          <DInput type="text" v-model="loginData.username" placeholder="Username" />
          <DInput type="password" v-model="loginData.password" placeholder="Password" />

          <DButton type="submit">Login</DButton>
        </form>
      </div>

      <div>
        <h2 class="text-xl font-bold mb-3">Register</h2>

        <form class="grid grid-cols-1 gap-3" @submit.prevent="register">
          <DInput type="text" v-model="registerData.username" placeholder="Username" />
          <DInput type="password" v-model="registerData.password" placeholder="Password" />
          
          <DButton type="submit" class="border rounded">Register</DButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },

      registerData: {
        username: '',
        password: ''
      }
    }
  },

  methods: {
    async login() {
      const response = await this.$http.post('/auth/login', this.loginData);

      localStorage.setItem("token", response.data.token);

      this.$router.push('/list');
    },
    
    async register() {
      const response = await this.$http.post('/auth/register', this.registerData);

      localStorage.setItem("token", response.data.token);

      this.$router.push('/list');
    },
  }
};
</script>