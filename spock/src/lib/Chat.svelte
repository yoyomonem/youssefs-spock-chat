<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { currentUser, pb } from './pocketbase';
    import { CensorSensor } from 'censor-sensor';

    const censor = new CensorSensor();
    censor.setCleanFunction((str) => Array.from(str, x => '*').join(''));

    let newMessage: string;
    let messages = [];
    let unsubscribe: () => void;

    onMount(async () => {
        // Get initial messages
        const resultList = await pb.collection('messages').getList(1, 50, {
            sort: 'created',
            expand: 'user',
        });
        messages = resultList.items;

        // Subscribe to realtime messages
        unsubscribe = await pb
            .collection('messages')
            .subscribe('*', async ({ action, record }) => {
                if (action === 'create') {
                    // Fetch associated user
                    const user = await pb.collection('users').getOne(record.user);
                    record.expand = { user };
                    messages = [...messages, record];
                }
                if (action === 'delete') {
                    messages = messages.filter((m) => m.id !== record.id);
                }
            });
    });

    // Unsubscribe from realtime messages
    onDestroy(() => {
    unsubscribe?.();
    });

    const sendMessage = async () => {
        newMessage = censor.cleanProfanity(newMessage);
        const data = {
            text: newMessage,
            user: $currentUser.id
        };
        const createdMessage = await pb.collection('messages').create(data);
        newMessage = '';
    }
</script>

<div class="chat">
    <h2>Chat</h2>
    <div class="messages">
        {#each messages as message (message.id)}
            <div class="message">
                <div class="message-sender">
                    <small>
                        <img
                            src={message.expand?.user?.avatar ? `http://localhost:3000/api/files/_pb_users_auth_/${message.expand?.user?.id}/${message.expand?.user?.avatar}` : `https://api.dicebear.com/7.x/identicon/svg?seed=${message.expand?.user?.username}`}
                            alt={`${message.expand?.user?.username}'s avatar`}
                            width="20px"
                        />
                        <span>@{message.expand?.user?.username}</span>
                    </small>
                </div>
                <p class="message-text">{message.text}</p>
            </div>
        {:else}
            <p>Nothing... yet.</p>
        {/each}
    </div>
    <form on:submit|preventDefault={sendMessage}>
        <input placeholder="Type your message here..." type="text" bind:value={newMessage} />
        <button type="submit" on:click={sendMessage}>Send</button>
    </form>
</div>
