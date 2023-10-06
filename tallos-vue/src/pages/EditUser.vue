<template>
  <div class="container my-5 w-3/4 mx-auto">
    <h2 class="text-xl mb-5">
      {{ isCreating ? "Criando" : "Editando" }} usuário
      <strong v-text="user.username" />
    </h2>

    <form class="grid grid-cols-1 gap-3" @submit.prevent="save">
      <DInput
        name="edit-username"
        type="text"
        v-model="user.username"
        placeholder="Username"
        :disabled="saving"
      />
      <DInput
        name="edit-password"
        type="password"
        v-model="user.password"
        placeholder="Password"
        :disabled="saving"
      />

      <DButton name="edit-submit" type="submit" class="mt-5" :disabled="saving">
        {{ isCreating ? "Criar" : "Salvar" }}
      </DButton>
    </form>
  </div>
</template>

<script lang="ts">
import UserService from "../services/UserService";

export default {
  async beforeRouteEnter(to, _, next) {
    if (to.path !== "/create") {
      const response = await UserService.getUser(to.params.username as string);

      // Ensure that the response contains the user property.
      if (!response || !response.user) {
        console.error("Failed to fetch user:", response);
        next();
        return;
      }

      next((vm: any) => {
        vm.oldUsername = response.user.username;
        vm.user = response.user;
      });
    } else {
      next();
    }
  },

  data() {
    return {
      saving: false,
      oldUsername: "",
      user: {
        username: "",
        password: "",
      },
    };
  },

  computed: {
    isCreating() {
      return this.$route.path === "/create";
    },
  },

  methods: {
    async save() {
      this.saving = true;

      if (this.isCreating) {
        await UserService.createUser(this.user);
      } else {
        await UserService.updateUser(this.oldUsername, {
          username: this.user.username,
          password: this.user.password,
        });
      }

      this.saving = false;

      this.$router.replace("/edit/" + this.user.username);
    },
  },
};
</script>
