<template>
  <div class="container my-5 w-3/4 mx-auto">
    <h2 class="text-xl mb-5">
      Editando permissões de <strong v-text="user.username" />
    </h2>

    <form class="grid grid-cols-1 gap-3" @submit.prevent="save">
      <label
        v-for="permission in permissions"
        :key="permission.name"
        class="flex gap-2 items-center"
      >
        <input
          type="checkbox"
          :checked="user.permissions.includes(permission.name)"
          @click="
            user.permissions.includes(permission.name)
              ? user.permissions.splice(
                  user.permissions.indexOf(permission.name),
                  1
                )
              : user.permissions.push(permission.name)
          "
        />

        {{ permission.description }}
      </label>

      <DButton type="submit" class="mt-5" :disabled="saving">Salvar</DButton>
    </form>
  </div>
</template>

<script lang="ts">
import { http } from "../services/HTTP";
import UserService from "../services/UserService";
import { EPermissions } from "../types/User";

export default {
  async beforeRouteEnter(to, _, next) {
    const response = await http.get("/users/" + to.params.username);

    next((vm: any) => {
      vm.user.username = response.data.user.username;
      vm.user.permissions.push(...response.data.user.permissions);
    });
  },

  data() {
    return {
      saving: false,

      user: {
        username: "",
        permissions: [] as string[],
      },

      permissions: [
        {
          name: "changePermissions",
          description: "Alterar permissões",
        },
        {
          name: "createUser",
          description: "Criar usuários",
        },
        {
          name: "readUser",
          description: "Visualizar usuários",
        },
        {
          name: "updateUser",
          description: "Editar usuários",
        },
        {
          name: "deleteUser",
          description: "Apagar usuários",
        },
      ],
    };
  },

  methods: {
    async save() {
      this.saving = true;

      await UserService.updateUserPermissions(
        this.user.username, // || this.$route.params.username,
        this.user.permissions as EPermissions[]
      );

      this.saving = false;
    },
  },
};
</script>
