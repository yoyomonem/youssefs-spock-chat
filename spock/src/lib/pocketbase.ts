import PocketBase from "pocketbase";
import { writable } from "svelte/store";

export const pb = new PocketBase("http://localhost:3000");
export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log(`authStore changed:\n${auth}`);
    currentUser.set(pb.authStore.model);
});
