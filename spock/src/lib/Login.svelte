<script lang="ts">
    import { pb, currentUser } from "./pocketbase";
    import Chat from "./Chat.svelte";
    import type { FormEventHandler } from "svelte/elements";

    let username: string;
    let password: string;

    const signIn = async () => {
        try {
            await pb.collection("users").authWithPassword(username, password);
        } catch (e) {
            console.error(new Error("Couldn't sign in, scroll below this error for more details. (You may be receiving this error because the account doesn't exist, or you entered the wrong password.)"));
            console.error(e);
        }
    };
    const signUp = async () => {
        try {
            const data = {
                username,
                password,
                passwordConfirm: password,
                isAdmin: false,
                hasChanceToChangeUsername: false
            };
            const newUser = await pb.collection("users").create(data);
            await signIn();
        } catch (e) {
            console.error(new Error("Couldn't sign up, scroll below this error for more details."));
            console.error(e);
        }
    };
    const signOut = () => {
        const confirmSignOut = confirm("Are you sure you want to sign out of Youssef's Chat?");
        if (confirmSignOut) {
            pb.authStore.clear();
            alert("You have successfully been signed out of Youssef's Chat. Come back soon!");
        }
    };
    const changeUsername = async () => {
        if (currentUser.hasChanceToChangeUsername) {
            const newUsername = prompt("You have a chance to change your username! Type your new username below!");
            const confirmYourNewUsername = confirm(`Your new username will be ${newUsername}.\nAre you sure you want to use that username? Note that there's no going back when changing your username!`);
            if (confirmYourNewUsername) {
                try {
                    const newData = {
                        username: newUsername,
                        hasChanceToChangeUsername: false
                    };
                    await pb.collection('users').update(currentUser.id, newData);
                    alert("You may need to log in again after changing your username.");
                    signOut();
                } catch (e) {
                    console.error(new Error("Couldn't change your username, scroll below this error for more details."));
                    console.error(e);
                }
            } else {
                changeUsername();
            }
        }
    };
</script>

{#if $currentUser}
    <img
        src={$currentUser.avatar ? `http://localhost:3000/api/files/_pb_users_auth_/${$currentUser.id}/${$currentUser.avatar}` : `https://api.dicebear.com/7.x/identicon/svg?seed=${$currentUser.username}`}
        alt={`${$currentUser.username}'s avatar`}
        width="40px"
    />
    <h3>Welcome, {$currentUser.username}!</h3>
    {#if $currentUser.isAdmin}
        <p>You are an admin, and admins moderate Youssef's Chat.</p>
    {/if}
    {#if $currentUser.hasChanceToChangeUsername}
        <p>You have a chance to change your username!</p>
        <button
            on:click={changeUsername}
        >
            Click here to change your username
        </button>
        <br /><br />
    {/if}
    {#if !$currentUser.isAdmin && ($currentUser.username !== "Youssef" || $currentUser.username !== "Test123" || $currentUser.username !== "amogus")}
        <a href="mailto:youssef.land@outlook.com" target="_blank" rel="noreferrer noopener" title="Click on this button and add an attachment with the picture you want as your proposed new avatar. You need to put your username in the message as well. Type as follows: &quot;Hello Youssef, I want to change my avatar for [insert your username]. Can you please get to PocketBase and upload the avatar there? [insert your signature here]&quot; If Youssef accordingly gives you the avatar and tells you he did so, you'll need to sign out and back in again to see your new avatar.">
            <button>Want to change your avatar?</button>
        </a>
    {/if}
    <button
        class="sign-out"
        on:click={signOut}
    >
        Sign out of Youssef's Chat
    </button>
    <Chat />
{:else}
    <form on:submit|preventDefault>
        <h2>Sign in/up</h2>
        <div style="display: flex; justify-content: center">
            <div style="display: flex; justify-content: center; flex-direction: column; spacing: 10px;">
                <input
                    placeholder="Username/email"
                    type="text"
                    bind:value={username}
                />
                <br />
                <input
                    placeholder="Password"
                    type="password"
                    bind:value={password}
                />
            </div>
            &nbsp;&nbsp;&nbsp;
            <div style="display: flex; justify-content: center; flex-direction: column">
                <button
                    on:click={signIn}
                >
                    Sign in
                </button>
                <br />
                <button
                    on:click={signUp}
                >
                    Sign up
                </button>
            </div>
        </div>
    </form>
{/if}
