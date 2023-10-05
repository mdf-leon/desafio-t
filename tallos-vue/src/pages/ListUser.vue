<template>
  <div class="mx-auto w-3/4 my-5">
    <h2 class="text-2xl font-medium">Listando usuários</h2>

    <div class="rounded-md overflow-hidden mt-5">
      <div
        v-for="user in users"
        :key="user.username"
        class="flex flex-row justify-between items-center border p-3"
      >
        {{ user.username }}

        <div class="flex gap-5 text-gray-500">
          <DButton @click.prevent="$router.push(`/edit/${user.username}`)">
            <DIcon name="fa-pencil-alt" />
          </DButton>

          <DButton
            @click.prevent="$router.push(`/edit/${user.username}/permissions`)"
          >
            <DIcon name="fa-lock-open" />
          </DButton>

          <DButton color="red" @click.prevent="deleteUser(user.username)">
            <DIcon name="fa-trash" />
          </DButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { http } from "../services/HTTP";
import UserService from "../services/UserService";
import { IUser } from "../types/User";

export default {
  async beforeRouteEnter(_to, _, next) {
    const response = await http.get("/users/");

    next((vm: any) => {
      vm.users.push(...response.data.users);
    });
  },

  data() {
    return {
      users: [] as IUser[],
    };
  },

  methods: {
    async deleteUser(username: string) {
      if (!confirm("Deseja mesmo apagar " + username + "?")) {
        return false;
      }

      await UserService.deleteUser(username);

      const userIndex = this.users.findIndex(
        (user) => user.username === username
      );
      this.users.splice(userIndex, 1);
    },
  },
};
</script>
