<template>
  <div class="container my-5 w-3/4 mx-auto">
    <h2 class="text-xl mb-5">
      Editando usuário <strong v-text="user.username" />
    </h2>

    <form class="grid grid-cols-1 gap-3" @submit.prevent="save">
      <DInput type="text" v-model="user.username" placeholder="Username" :disabled="saving" />
      <DInput type="password" v-model="user.password" placeholder="Password" :disabled="saving" />

      <DButton type="submit" class="mt-5" :disabled="saving">Salvar</DButton>
    </form>
  </div>
</template>

<script lang="ts">
import { http } from "../services/HTTP";

export default {
  async beforeRouteEnter(to, _, next) {
    const response = await http.get("/users/" + to.params.username);

    next((vm: any) => {
      vm.user = response.data.user;
    });
  },

  data() {
    return {
      saving: false,
      user: {
        username: null,
        password: null
      }
    }
  },

  methods: {
    async save() {
      this.saving = true;

      await this.$http.patch("/users/" + this.$route.params.username, this.user);

      this.saving = false;

      this.$router.replace("/edit/" + this.user.username);
    }
  },
};
</script>