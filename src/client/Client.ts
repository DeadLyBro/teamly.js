import { EventEmitter } from 'events';
import { WebSocketManager } from '../websocket/WebSocketManager';
import { APIManager } from '../rest/APIManager';
import { User, Message, Channel, Team, Role, Todo, Application, Emoji, Announcement, UserRPC, Blog, DirectMessage, Category, MessageEmbed, MessageOptions, ChannelAdditionalData } from '../structures/Interfaces';

/**
 * Interface for Client events.
 * Maps event names to their argument types.
 */
interface ClientEvents {
    'ready': [user: User];
    'messageCreate': [message: Message];
    'messageUpdate': [message: Message];
    'messageDelete': [messageId: string, channelId: string];
    'channelCreate': [channel: Channel];
    'channelUpdate': [channel: Channel];
    'channelDelete': [channelId: string, teamId: string];
    'messageReactionAdd': [messageId: string, emojiId: string, reactedBy: User];
    'messageReactionRemove': [messageId: string, emojiId: string, reactedBy: User];
    'presenceUpdate': [userId: string, presence: number, userRPC: UserRPC];
    'teamRoleCreate': [teamId: string, role: Role];
    'teamRoleDelete': [teamId: string, roleId: string];
    'teamRolesUpdate': [teamId: string, roles: Role[]];
    'teamUpdate': [team: Team];
    'todoItemCreate': [todo: Todo, channelId: string, teamId: string];
    'todoItemDelete': [todoId: string, channelId: string, teamId: string];
    'todoItemUpdate': [todo: Todo, channelId: string, teamId: string];
    'userJoinedTeam': [member: User, teamId: string];
    'userLeftTeam': [member: User, teamId: string];
    'userJoinedVoiceChannel': [member: User, channelId: string];
    'userLeftVoiceChannel': [member: User, channelId: string];
    'userProfileUpdate': [user: User];
    'userRoleAdd': [teamId: string, member: User, role: Role];
    'userRoleRemove': [teamId: string, member: User, role: Role];
    'userUpdatedVoiceMetadata': [user: User, channelId: string, isStreaming: boolean, isMuted: boolean, isDeafened: boolean];
    'blogCreate': [blog: Blog];
    'blogDelete': [blogId: string, deletedBy: string];
    'categoriesPriorityUpdate': [order: string[]];
    'categoryUpdate': [category: Category];
    'categoryDelete': [categoryId: string];
    'categoryCreate': [category: Category];
    'channelsPriorityUpdate': [order: string[], categoryId?: string];
    'announcementCreate': [teamId: string, channelId: string, announcement: Announcement];
    'announcementDelete': [teamId: string, channelId: string, announcementId: string];
    'applicationCreate': [teamId: string, application: Application];
    'applicationUpdate': [teamId: string, changedBy: string, application: Application];
    'voiceChannelMove': [userId: string, fromChannelId: string, toChannelId: string, teamId: string, token: string];
}

export class Client extends EventEmitter<ClientEvents> {
    token: string;
    ws: WebSocketManager;
    api: APIManager;
    user: User | null;

    constructor(token: string) {
        super();
        this.token = token;
        this.ws = new WebSocketManager(this);
        this.api = new APIManager(this);
        this.user = null;

        this.ws.on('READY', (data: { user: User }) => {
            this.user = data.user;
            this.emit('ready', this.user);
        });

        this.ws.on('MESSAGE_SEND', (data: { message: Message }) => {
            this.emit('messageCreate', data.message);
        });

        this.ws.on('MESSAGE_UPDATED', (data: { message: Message }) => {
            this.emit('messageUpdate', data.message);
        });

        this.ws.on('MESSAGE_DELETED', (data: { messageId: string, channelId: string }) => {
            this.emit('messageDelete', data.messageId, data.channelId);
        });

        this.ws.on('CHANNEL_CREATED', (data: { channel: Channel }) => {
            this.emit('channelCreate', data.channel);
        });

        this.ws.on('CHANNEL_UPDATED', (data: { channel: Channel }) => {
            this.emit('channelUpdate', data.channel);
        });

        this.ws.on('CHANNEL_DELETED', (data: { channelId: string, teamId: string }) => {
            this.emit('channelDelete', data.channelId, data.teamId);
        });

        this.ws.on('MESSAGE_REACTION_ADDED', (data: { messageId: string, emojiId: string, reactedBy: User }) => {
            this.emit('messageReactionAdd', data.messageId, data.emojiId, data.reactedBy);
        });

        this.ws.on('MESSAGE_REACTION_REMOVED', (data: { messageId: string, emojiId: string, reactedBy: User }) => {
            this.emit('messageReactionRemove', data.messageId, data.emojiId, data.reactedBy);
        });

        this.ws.on('PRESENCE_UPDATE', (data: { userId: string, presence: number, userRPC: UserRPC }) => {
            this.emit('presenceUpdate', data.userId, data.presence, data.userRPC);
        });

        this.ws.on('TEAM_ROLE_CREATED', (data: { teamId: string, role: Role }) => {
            this.emit('teamRoleCreate', data.teamId, data.role);
        });

        this.ws.on('TEAM_ROLE_DELETED', (data: { teamId: string, roleId: string }) => {
            this.emit('teamRoleDelete', data.teamId, data.roleId);
        });

        this.ws.on('TEAM_ROLES_UPDATED', (data: { teamId: string, roles: Role[] }) => {
            this.emit('teamRolesUpdate', data.teamId, data.roles);
        });

        this.ws.on('TEAM_UPDATED', (data: { team: Team }) => {
            this.emit('teamUpdate', data.team);
        });

        this.ws.on('TODO_ITEM_CREATED', (data: { todo: Todo, channelId: string, teamId: string }) => {
            this.emit('todoItemCreate', data.todo, data.channelId, data.teamId);
        });

        this.ws.on('TODO_ITEM_DELETED', (data: { todoId: string, channelId: string, teamId: string }) => {
            this.emit('todoItemDelete', data.todoId, data.channelId, data.teamId);
        });

        this.ws.on('TODO_ITEM_UPDATED', (data: { todo: Todo, channelId: string, teamId: string }) => {
            this.emit('todoItemUpdate', data.todo, data.channelId, data.teamId);
        });

        this.ws.on('USER_JOINED_TEAM', (data: { member: User, teamId: string }) => {
            this.emit('userJoinedTeam', data.member, data.teamId);
        });

        this.ws.on('USER_LEFT_TEAM', (data: { member: User, teamId: string }) => {
            this.emit('userLeftTeam', data.member, data.teamId);
        });

        this.ws.on('USER_JOINED_VOICE_CHANNEL', (data: { member: User, channelId: string }) => {
            this.emit('userJoinedVoiceChannel', data.member, data.channelId);
        });

        this.ws.on('USER_LEFT_VOICE_CHANNEL', (data: { member: User, channelId: string }) => {
            this.emit('userLeftVoiceChannel', data.member, data.channelId);
        });

        this.ws.on('USER_PROFILE_UPDATED', (data: { user: User }) => {
            this.emit('userProfileUpdate', data.user);
        });

        this.ws.on('USER_ROLE_ADDED', (data: { teamId: string, member: User, role: Role }) => {
            this.emit('userRoleAdd', data.teamId, data.member, data.role);
        });

        this.ws.on('USER_ROLE_REMOVED', (data: { teamId: string, member: User, role: Role }) => {
            this.emit('userRoleRemove', data.teamId, data.member, data.role);
        });

        this.ws.on('USER_UPDATED_VOICE_METADATA', (data: { user: User, channelId: string, isStreaming: boolean, isMuted: boolean, isDeafened: boolean }) => {
            this.emit('userUpdatedVoiceMetadata', data.user, data.channelId, data.isStreaming, data.isMuted, data.isDeafened);
        });

        this.ws.on('BLOG_CREATED', (data: { blog: Blog }) => {
            this.emit('blogCreate', data.blog);
        });

        this.ws.on('BLOG_DELETED', (data: { blogId: string, deletedBy: string }) => {
            this.emit('blogDelete', data.blogId, data.deletedBy);
        });

        this.ws.on('CATEGORIES_PRIORITY_UPDATED', (data: { order: string[] }) => {
            this.emit('categoriesPriorityUpdate', data.order);
        });

        this.ws.on('CATEGORY_UPDATED', (data: { category: Category }) => {
            this.emit('categoryUpdate', data.category);
        });

        this.ws.on('CATEGORY_DELETED', (data: { categoryId: string }) => {
            this.emit('categoryDelete', data.categoryId);
        });

        this.ws.on('CATEGORY_CREATED', (data: { category: Category }) => {
            this.emit('categoryCreate', data.category);
        });

        this.ws.on('CHANNELS_PRIORITY_UPDATED', (data: { order: string[], categoryId?: string }) => {
            this.emit('channelsPriorityUpdate', data.order, data.categoryId);
        });

        this.ws.on('ANNOUNCEMENT_CREATED', (data: { teamId: string, channelId: string, announcement: Announcement }) => {
            this.emit('announcementCreate', data.teamId, data.channelId, data.announcement);
        });

        this.ws.on('ANNOUNCEMENT_DELETED', (data: { teamId: string, channelId: string, announcementId: string }) => {
            this.emit('announcementDelete', data.teamId, data.channelId, data.announcementId);
        });

        this.ws.on('APPLICATION_CREATED', (data: { teamId: string, application: Application }) => {
            this.emit('applicationCreate', data.teamId, data.application);
        });

        this.ws.on('APPLICATION_UPDATED', (data: { teamId: string, changedBy: string, application: Application }) => {
            this.emit('applicationUpdate', data.teamId, data.changedBy, data.application);
        });

        this.ws.on('VOICE_CHANNEL_MOVE', (data: { userId: string, fromChannelId: string, toChannelId: string, teamId: string, token: string }) => {
            this.emit('voiceChannelMove', data.userId, data.fromChannelId, data.toChannelId, data.teamId, data.token);
        });
    }

    login() {
        this.ws.connect();
    }

    // Methods from APIManager
    async updateChannel(teamId: string, channelId: string, name: string, additionalData: ChannelAdditionalData | null = null): Promise<any> {
        return this.api.updateChannel(teamId, channelId, name, additionalData);
    }

    async updateChannelRolePermissions(teamId: string, channelId: string, roleId: string, allow = 0, deny = 0): Promise<any> {
        return this.api.updateChannelRolePermissions(teamId, channelId, roleId, allow, deny);
    }

    async getChannels(teamId: string): Promise<Channel[]> {
        return this.api.getChannels(teamId);
    }

    async createChannel(teamId: string, name: string, type = 'text', additionalData: ChannelAdditionalData | null = null): Promise<Channel> {
        return this.api.createChannel(teamId, name, type, additionalData);
    }

    async deleteChannel(teamId: string, channelId: string): Promise<void> {
        return this.api.deleteChannel(teamId, channelId);
    }

    async duplicateChannel(teamId: string, channelId: string): Promise<Channel> {
        return this.api.duplicateChannel(teamId, channelId);
    }

    async updateChannelPriority(teamId: string, channels: any[]): Promise<Channel> {
        return this.api.updateChannelPriority(teamId, channels);
    }

    async getChannel(teamId: string, channelId: string): Promise<Channel> {
        return this.api.getChannel(teamId, channelId);
    }

    async getMessages(channelId: string, limit = 50, params: Record<string, any> = {}): Promise<Message[]> {
        return this.api.getMessages(channelId, limit, params);
    }

    async sendMessage(channelId: string, message: string, options: MessageOptions = {}): Promise<Message> {
        return this.api.sendMessage(channelId, message, options);
    }

    async reply(channelId: string, repliedMessageId: string, message: string, options: MessageOptions = {}): Promise<Message> {
        return this.api.reply(channelId, repliedMessageId, message, options);
    }

    async editMessage(channelId: string, messageId: string, newMessage: string, options: MessageOptions = {}): Promise<Message> {
        return this.api.editMessage(channelId, messageId, newMessage, options);
    }

    async deleteMessage(channelId: string, messageId: string): Promise<void> {
        return this.api.deleteMessage(channelId, messageId);
    }

    async getMessage(channelId: string, messageId: string): Promise<Message> {
        return this.api.getMessage(channelId, messageId);
    }

    async sendEmbed(channelId: string, content: string | undefined = undefined, embeds: MessageEmbed[] = [{ title: 'Title', description: 'Description' }]): Promise<Message> {
        return this.api.sendEmbed(channelId, content, embeds);
    }

    async addRole(teamId: string, userId: string, roleId: string): Promise<any> {
        return this.api.addRole(teamId, userId, roleId);
    }

    async removeRole(teamId: string, userId: string, roleId: string): Promise<void> {
        return this.api.removeRole(teamId, userId, roleId);
    }

    async kickMember(teamId: string, userId: string): Promise<void> {
        return this.api.kickMember(teamId, userId);
    }

    async getMember(teamId: string, userId: string): Promise<User> {
        return this.api.getMember(teamId, userId);
    }

    async listMembers(teamId: string): Promise<User[]> {
        return this.api.listMembers(teamId);
    }

    async getTeam(teamId: string): Promise<Team> {
        return this.api.getTeam(teamId);
    }

    async updateTeam(teamId: string, name: string | null = null, description: string | null = null, profilePicture: string | null = null, banner: string | null = null): Promise<any> {
        return this.api.updateTeam(teamId, name, description, profilePicture, banner);
    }

    async listTeams(): Promise<Team[]> {
        return this.api.listTeams();
    }

    async createRole(teamId: string, name: string, color: string, permissions: number | null = null, isDisplayedSeparately = false, color2: string | null = null): Promise<Role> {
        return this.api.createRole(teamId, name, color, permissions, isDisplayedSeparately, color2);
    }

    async getRoles(teamId: string): Promise<Role[]> {
        return this.api.getRoles(teamId);
    }

    async deleteRole(teamId: string, roleId: string): Promise<void> {
        return this.api.deleteRole(teamId, roleId);
    }

    async cloneRole(teamId: string, roleId: string): Promise<Role> {
        return this.api.cloneRole(teamId, roleId);
    }

    async updateRolePriority(teamId: string, RoleIds: string[]): Promise<Role[]> {
        return this.api.updateRolePriority(teamId, RoleIds);
    }

    async updateRole(teamId: string, roleId: string, name: string, color: string, permissions: number | null = null, isDisplayedSeparately = false, color2: string | null = null): Promise<Role> {
        return this.api.updateRole(teamId, roleId, name, color, permissions, isDisplayedSeparately, color2);
    }

    async getUser(userId: string): Promise<User> {
        return this.api.getUser(userId);
    }

    async getCurrentUser(): Promise<User> {
        return this.api.getCurrentUser();
    }

    async setCustomStatus(content: string | null = null, emojiId: string | null = null): Promise<any> {
        return this.api.setCustomStatus(content, emojiId);
    }

    async deleteCustomStatus(): Promise<void> {
        return this.api.deleteCustomStatus();
    }

    async getTodos(channelId: string): Promise<Todo[]> {
        return this.api.getTodos(channelId);
    }

    async createTodo(channelId: string, message: string): Promise<Todo> {
        return this.api.createTodo(channelId, message);
    }

    async deleteTodo(channelId: string, todoId: string): Promise<void> {
        return this.api.deleteTodo(channelId, todoId);
    }

    async cloneTodo(channelId: string, todoId: string): Promise<Todo> {
        return this.api.cloneTodo(channelId, todoId);
    }

    async updateTodo(channelId: string, todoId: string, newMessage: string): Promise<Todo> {
        return this.api.updateTodo(channelId, todoId, newMessage);
    }

    async createDM(userId: string): Promise<DirectMessage> {
        return this.api.createDM(userId);
    }

    async getDMs(): Promise<DirectMessage[]> {
        return this.api.getDMs();
    }

    async getApplications(teamId: string): Promise<Application[]> {
        return this.api.getApplications(teamId);
    }

    async updateApplicationStatus(teamId: string, applicationId: string, status: 'approved' | 'rejected'): Promise<any> {
        return this.api.updateApplicationStatus(teamId, applicationId, status);
    }

    async updateTeamApplicationStatus(teamId: string, enabled: boolean = false): Promise<any> {
        return this.api.updateTeamApplicationStatus(teamId, enabled);
    }

    async updateApplicationQuestions(teamId: string, description: string, questions: { question: string; type: string; }[] = [{ question: 'Örnek soru', type: 'text' }]): Promise<Application> {
        return this.api.updateApplicationQuestions(teamId, description, questions);
    }

    async getApplication(teamId: string, applicationId: string): Promise<Application> {
        return this.api.getApplication(teamId, applicationId);
    }

    async listCustomReactions(teamId: string): Promise<Emoji[]> {
        return this.api.listCustomReactions(teamId);
    }

    async createCustomReaction(teamId: string, name: string | null = null, emoji: Record<string, any> = {}): Promise<Emoji> {
        return this.api.createCustomReaction(teamId, name, emoji);
    }

    async updateCustomReaction(teamId: string, reactionId: string, name: string): Promise<any> {
        return this.api.updateCustomReaction(teamId, reactionId, name);
    }

    async deleteCustomReaction(teamId: string, reactionId: string): Promise<void> {
        return this.api.deleteCustomReaction(teamId, reactionId);
    }

    async uploadAttachment(image: File | Blob, type: string): Promise<string> {
        return this.api.uploadAttachment(image, type);
    }

    async joinVoiceChannel(teamId: string, channelId: string, isMuted = false, isDeafened = false): Promise<string> {
        return this.api.joinVoiceChannel(teamId, channelId, isMuted, isDeafened);
    }

    async updateVoiceSettings(teamId: string, channelId: string, isMuted: boolean, isDeafened: boolean) {
        return this.api.updateVoiceSettings(teamId, channelId, isMuted, isDeafened);
    }

    async leaveVoiceChannel(teamId: string, channelId: string): Promise<any> {
        return this.api.leaveVoiceChannel(teamId, channelId);
    }

    async moveMember(teamId: string, fromChannelId: string, userId: string, toChannelId: string): Promise<any> {
        return this.api.moveMember(teamId, fromChannelId, userId, toChannelId);
    }

    async kickMemberFromVoiceChannel(teamId: string, channelId: string, userId: string): Promise<any> {
        return this.api.kickMemberFromVoiceChannel(teamId, channelId, userId);
    }

    async sendWebhookMessage(webhookId: string, webhookToken: string, username: string, content = 'Teamly.js\'den selamlar!', embeds: MessageEmbed[] | null = null): Promise<Message> {
        return this.api.sendWebhookMessage(webhookId, webhookToken, username, content, embeds);
    }

    async webhookForGithub(webhookId: string, webhookToken: string): Promise<any> {
        return this.api.webhookForGithub(webhookId, webhookToken);
    }

    async getBlogPosts(teamId: string): Promise<Blog[]> {
        return this.api.getBlogPosts(teamId);
    }

    async createBlogPost(teamId: string, title: string, content: string, heroImage: string | null = null): Promise<Blog> {
        return this.api.createBlogPost(teamId, title, content, heroImage);
    }

    async deleteBlogPost(teamId: string, blogId: string): Promise<void> {
        return this.api.deleteBlogPost(teamId, blogId);
    }

    async createCategory(teamId: string, name: string): Promise<Category> {
        return this.api.createCategory(teamId, name);
    }

    async updateCategory(teamId: string, categoryId: string, name: string): Promise<Category> {
        return this.api.updateCategory(teamId, categoryId, name);
    }

    async updateCategoryRolePermissions(teamId: string, categoryId: string, roleId: string, allow: number, deny: number | null = null): Promise<any> {
        return this.api.updateCategoryRolePermissions(teamId, categoryId, roleId, allow, deny);
    }

    async deleteCategory(teamId: string, categoryId: string): Promise<void> {
        return this.api.deleteCategory(teamId, categoryId);
    }

    async addChannelToCategory(teamId: string, categoryId: string, channelId: string): Promise<Channel> {
        return this.api.addChannelToCategory(teamId, categoryId, channelId);
    }

    async removeChannelFromCategory(teamId: string, categoryId: string, channelId: string): Promise<Channel> {
        return this.api.removeChannelFromCategory(teamId, categoryId, channelId);
    }

    async setChannelPriorityOfCategory(teamId: string, categoryId: string, channels: string[]): Promise<any> {
        return this.api.setChannelPriorityOfCategory(teamId, categoryId, channels);
    }

    async setCategoryPriorityOfTeam(teamId: string, categories: string[]): Promise<any> {
        return this.api.setCategoryPriorityOfTeam(teamId, categories);
    }

    async getAnnouncements(channelId: string): Promise<Announcement[]> {
        return this.api.getAnnouncements(channelId);
    }

    async createAnnouncement(channelId: string, title: string, content: string, tagEveryone: boolean = true): Promise<Announcement> {
        return this.api.createAnnouncement(channelId, title, content, tagEveryone);
    }

    async deleteAnnouncement(teamId: string, announcementId: string): Promise<void> {
        return this.api.deleteAnnouncement(teamId, announcementId);
    }
}