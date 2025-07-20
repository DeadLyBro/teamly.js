![Teamly.js Logo](logo.png)

# @deadlybro/teamly.js

A powerful JavaScript library for interacting with the Teamly.one API.

## Installation

```bash
npm install @deadlybro/teamly.js dotenv
```

## Usage

### Basic Bot

```typescript
const { Client } = require('@deadlybro/teamly.js');
require('dotenv').config(); // Load environment variables from .env file

const TOKEN = process.env.BOT_TOKEN; // Get token from environment variables or enter string, example: const TOKEN = 'YOUR_TOKEN_HERE';

const client = new Client(TOKEN);

client.on('ready', (user) => {
    console.log(`Logged in as ${user.username}`);
});

client.on('messageCreate', async (message) => {
    if (message.content?.toLowerCase() === '!ping') {
        let startTime = new Date(message.createdAt).getTime();

        let reply = await client.reply(message.channelId, message.id, `Pong <@${message.createdBy.id}>!`);

        let endTime = new Date(reply.createdAt).getTime();
        let latency = endTime - startTime;

        await client.editMessage(reply.channelId, reply.id, undefined, {
            embeds: [{
                title: '🏓 Pong!',
                description: `Latency: ${latency}ms`,
                color: 0x00ff00
            }]
        });
    }
});

client.login();
```

### Sending an Embed

```typescript
const { Client } = require('@deadlybro/teamly.js');
require('dotenv').config(); // Load environment variables from .env file

const TOKEN = process.env.BOT_TOKEN; // Get token from environment variables or enter string, example: const TOKEN = 'YOUR_TOKEN_HERE';

const client = new Client(TOKEN);

client.on('ready', (user) => {
    console.log(`Logged in as ${user.username}`);
});

client.on('messageCreate', async (message) => {
    if (message.content?.toLowerCase() === '!embed') {
        await client.sendEmbed(message.channelId, undefined, [{
            title: 'Welcome!',
            description: 'Hello from DeadLyBro\'s Teamly.js!\n\nThis is an example embed.',
            color: 0x00FF00,
            footer: {
                text: 'Teamly.js Bot',
                icon_url: 'https://example.com/icon.png'
            }
        }]);
    }
});

client.login();
```

## API Reference

All API interactions are available directly through the `client` object.

### Channels
- `client.getChannels(teamId: string)`
- `client.getChannel(teamId: string, channelId: string)`
- `client.createChannel(teamId: string, name: string, type?: string, additionalData?: any)`
- `client.updateChannel(teamId: string, channelId: string, name: string, additionalData?: any)`
- `client.deleteChannel(teamId: string, channelId: string)`
- `client.duplicateChannel(teamId: string, channelId: string)`
- `client.updateChannelPriority(teamId: string, channels: any[])`
- `client.updateChannelRolePermissions(teamId: string, channelId: string, roleId: string, allow?: number, deny?: number)`

### Messages
- `client.getMessages(channelId: string, limit?: number, params?: Record<string, any>)`
- `client.sendMessage(channelId: string, message: string, options?: MessageOptions)`
- `client.reply(channelId: string, repliedMessageId: string, message: string, options?: MessageOptions)`
- `client.editMessage(channelId: string, messageId: string, newMessage: string, options?: MessageOptions)`
- `client.deleteMessage(channelId: string, messageId: string)`
- `client.getMessage(channelId: string, messageId: string)`
- `client.sendEmbed(channelId: string, content?: string, embeds?: MessageEmbed[])`

### Teams
- `client.listTeams()`
- `client.getTeam(teamId: string)`
- `client.updateTeam(teamId: string, name?: string | null, description?: string | null, profilePicture?: string | null, banner?: string | null)`
- `client.listMembers(teamId: string)`
- `client.getMember(teamId: string, userId: string)`
- `client.kickMember(teamId: string, userId: string)`
- `client.addRole(teamId: string, userId: string, roleId: string)`
- `client.removeRole(teamId: string, userId: string, roleId: string)`

### Roles
- `client.getRoles(teamId: string)`
- `client.createRole(teamId: string, name: string, color: string, permissions?: number | null, isDisplayedSeparately?: boolean, color2?: string | null)`
- `client.updateRole(teamId: string, roleId: string, name: string, color: string, permissions?: number | null, isDisplayedSeparately?: boolean, color2?: string | null)`
- `client.deleteRole(teamId: string, roleId: string)`
- `client.cloneRole(teamId: string, roleId: string)`
- `client.updateRolePriority(teamId: string, RoleIds: string[])`

### Users
- `client.getUser(userId: string)`
- `client.getCurrentUser()`
- `client.setCustomStatus(content?: string | null, emojiId?: string | null)`
- `client.deleteCustomStatus()`

### Todos
- `client.getTodos(channelId: string)`
- `client.createTodo(channelId: string, message: string)`
- `client.updateTodo(channelId: string, todoId: string, newMessage: string)`
- `client.deleteTodo(channelId: string, todoId: string)`
- `client.cloneTodo(channelId: string, todoId: string)`

### Direct Messages
- `client.getDMs()`
- `client.createDM(userId: string)`

### Applications
- `client.getApplications(teamId: string)`
- `client.getApplication(teamId: string, applicationId: string)`
- `client.updateApplicationStatus(teamId: string, applicationId: string, status: 'approved' | 'rejected')`
- `client.updateTeamApplicationStatus(teamId: string, enabled?: boolean)`
- `client.updateApplicationQuestions(teamId: string, description: string, questions?: { question: string; type: string; }[])`

### Custom Reactions
- `client.listCustomReactions(teamId: string)`
- `client.createCustomReaction(teamId: string, name?: string | null, emoji?: Record<string, any>)`
- `client.updateCustomReaction(teamId: string, reactionId: string, name: string)`
- `client.deleteCustomReaction(teamId: string, reactionId: string)`

### Attachments
- `client.uploadAttachment(image: File | Blob, type: string)`

### Voice
- `client.joinVoiceChannel(teamId: string, channelId: string, isMuted?: boolean, isDeafened?: boolean)`
- `client.updateVoiceSettings(teamId: string, channelId: string, isMuted: boolean, isDeafened: boolean)`
- `client.leaveVoiceChannel(teamId: string, channelId: string)`
- `client.moveMember(teamId: string, fromChannelId: string, userId: string, toChannelId: string)`
- `client.kickMemberFromVoiceChannel(teamId: string, channelId: string, userId: string)`

### Webhooks
- `client.sendWebhookMessage(webhookId: string, webhookToken: string, username: string, content?: string, embeds?: MessageEmbed[] | null)`
- `client.webhookForGithub(webhookId: string, webhookToken: string)`

### Blog
- `client.getBlogPosts(teamId: string)`
- `client.createBlogPost(teamId: string, title: string, content: string, heroImage?: string | null)`
- `client.deleteBlogPost(teamId: string, blogId: string)`

### Category
- `client.createCategory(teamId: string, name: string)`
- `client.updateCategory(teamId: string, categoryId: string, name: string)`
- `client.updateCategoryRolePermissions(teamId: string, categoryId: string, roleId: string, allow: number, deny?: number | null)`
- `client.deleteCategory(teamId: string, categoryId: string)`
- `client.addChannelToCategory(teamId: string, categoryId: string, channelId: string)`
- `client.removeChannelFromCategory(teamId: string, categoryId: string, channelId: string)`
- `client.setChannelPriorityOfCategory(teamId: string, categoryId: string, channels: string[])`
- `client.setCategoryPriorityOfTeam(teamId: string, categories: string[])`

### Announcements
- `client.getAnnouncements(channelId: string)`
- `client.createAnnouncement(channelId: string, title: string, content: string, tagEveryone?: boolean)`
- `client.deleteAnnouncement(teamId: string, announcementId: string)`

## Events

The `Client` extends `EventEmitter` and emits various events from the WebSocket. You can listen to these events using `client.on('eventName', callback)`.

Here's a list of common events:

- `ready(user: User)`: Emitted when the bot successfully connects and is ready.
- `messageCreate(message: Message)`: Emitted when a new message is sent.
- `messageUpdate(message: Message)`: Emitted when a message is updated.
- `messageDelete(messageId: string, channelId: string)`: Emitted when a message is deleted.
- `channelCreate(channel: Channel)`: Emitted when a channel is created.
- `channelUpdate(channel: Channel)`: Emitted when a channel is updated.
- `channelDelete(channelId: string, teamId: string)`: Emitted when a channel is deleted.
- `messageReactionAdd(messageId: string, emojiId: string, reactedBy: User)`: Emitted when a reaction is added to a message.
- `messageReactionRemove(messageId: string, emojiId: string, reactedBy: User)`: Emitted when a reaction is removed from a message.
- `presenceUpdate(userId: string, presence: number, userRPC: any)`: Emitted when a user's presence updates.
- `teamRoleCreate(teamId: string, role: Role)`: Emitted when a team role is created.
- `teamRoleDelete(teamId: string, roleId: string)`: Emitted when a team role is deleted.
- `teamRolesUpdate(teamId: string, roles: Role[])`: Emitted when team roles are updated.
- `teamUpdate(team: Team)`: Emitted when a team is updated.
- `todoItemCreate(todo: Todo, channelId: string, teamId: string)`: Emitted when a todo item is created.
- `todoItemDelete(todoId: string, channelId: string, teamId: string)`: Emitted when a todo item is deleted.
- `todoItemUpdate(todo: Todo, channelId: string, teamId: string)`: Emitted when a todo item is updated.
- `userJoinedTeam(member: User, teamId: string)`: Emitted when a user joins a team.
- `userLeftTeam(member: User, teamId: string)`: Emitted when a user leaves a team.
- `userJoinedVoiceChannel(member: User, channelId: string)`: Emitted when a user joins a voice channel.
- `userLeftVoiceChannel(member: User, channelId: string)`: Emitted when a user leaves a voice channel.
- `userProfileUpdate(user: User)`: Emitted when a user's profile is updated.
- `userRoleAdd(teamId: string, member: User, role: Role)`: Emitted when a role is added to a user.
- `userRoleRemove(teamId: string, member: User, role: Role)`: Emitted when a role is removed from a user.
- `userUpdatedVoiceMetadata(user: User, channelId: string, isStreaming: boolean, isMuted: boolean, isDeafened: boolean)`: Emitted when a user's voice metadata is updated.
- `blogCreate(blog: Blog)`: Emitted when a blog post is created.
- `blogDelete(blogId: string, deletedBy: string)`: Emitted when a blog post is deleted.
- `categoriesPriorityUpdate(order: string[])`: Emitted when category priorities are updated.
- `categoryUpdate(category: Category)`: Emitted when a category is updated.
- `categoryDelete(categoryId: string)`: Emitted when a category is deleted.
- `categoryCreate(category: Category)`: Emitted when a category is created.
- `channelsPriorityUpdate(order: string[], categoryId?: string)`: Emitted when channel priorities are updated.
- `announcementCreate(teamId: string, channelId: string, announcement: Announcement)`: Emitted when an announcement is created.
- `announcementDelete(teamId: string, channelId: string, announcementId: string)`: Emitted when an announcement is deleted.
- `applicationCreate(teamId: string, application: Application)`: Emitted when an application is created.
- `applicationUpdate(teamId: string, changedBy: string, application: Application)`: Emitted when an application is updated.
- `voiceChannelMove(userId: string, fromChannelId: string, toChannelId: string, teamId: string, token: string)`: Emitted when a user is moved between voice channels.

## Contributing

Feel free to open issues or pull requests on the GitHub repository.

```