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

          <DButton
            color="red"
            @click.prevent="confirmAndDeleteUser(user.username)"
          >
            <DIcon name="fa-trash" />
          </DButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts"> 
import { mapActions, mapState } from "vuex";

export default {
  async beforeRouteEnter(_to, _, next) {
    next((vm: any) => {
      vm.fetchUsers();
    });
  },
 

  computed: {
    ...mapState(["users"]),
  },

  methods: {
    ...mapActions(["fetchUsers", "deleteUser"]),

    async confirmAndDeleteUser(username: string) {
      if (!confirm("Deseja mesmo apagar " + username + "?")) {
        return;
      }
      this.deleteUser(username) 
    },
  },
};
</script>
