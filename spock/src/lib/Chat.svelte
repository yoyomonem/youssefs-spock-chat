<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { pb, currentUser } from "./pocketbase";

    let messages = [];
    onMount(async () => {
        const resultList = await pb.collection("messages").getList(1, 50, {
            sort: "created",
            expand: "user"
        });
    });
</script>

<div class="chat">
    <h2>Chat</h2>
    <div class="messages">
        {#each messages as message (message.id)}
            <div class="message">
                <div class="message-sender">
                    <img
                        src={message.expand?.user?.avatar ? `http://localhost:3000/api/files/_pb_users_auth_/${message.expand?.user?.id}/${message.expand?.user?.avatar}` : `https://api.dicebear.com/7.x/identicon/svg?seed=${message.expand?.user?.username}`}
                        alt={`${message.expand?.user?.username}'s avatar`}
                        width="40px"
                    />
                    <span>@{message.expand?.user?.username}</span>
                </div>
                <p class="message-text">{message.text}</p>
            </div>
        {:else}
            <p>Nothing... yet.</p>
        {/each}
    </div>
</div>
