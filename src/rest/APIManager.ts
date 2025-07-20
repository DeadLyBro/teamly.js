import fetch, { RequestInit } from 'node-fetch';
import { Client } from '../client/Client';
import { Channel, Message, User, Team, Role, Todo, DirectMessage, Application, Emoji, Blog, Category, Announcement, MessageEmbed, MessageOptions, ChannelAdditionalData } from '../structures/Interfaces';

const API_BASE_URL = 'https://api.teamly.one/api/v1';

export class APIManager {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Authorization': `Bot ${this.client.token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
            return {} as T; // Return an empty object or null to prevent bot from crashing
        }

        if (response.status === 204) {
            return {} as T; // No content
        }

        return response.json() as Promise<T>;
    }

    private qs(params: Record<string, any>): string {
        return Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');
    }

    /* Channels */
    async updateChannel(teamId: string, channelId: string, name: string, additionalData: ChannelAdditionalData | null = null): Promise<any> {
        return this.apiCall(`/teams/${teamId}/channels/${channelId}`, {
            method: 'PATCH',
            body: JSON.stringify({ name, additionalData }),
        });
    }

    async updateChannelRolePermissions(teamId: string, channelId: string, roleId: string, allow = 0, deny = 0): Promise<any> {
        return this.apiCall(`/teams/${teamId}/channels/${channelId}/permissions/role/${roleId}`, {
            method: 'POST',
            body: JSON.stringify({ allow, deny }),
        });
    }

    async getChannels(teamId: string): Promise<Channel[]> {
        const response = await this.apiCall<{ channels: Channel[] }>(`/teams/${teamId}/channels`);
        return response.channels;
    }

    async createChannel(teamId: string, name: string, type = 'text', additionalData: ChannelAdditionalData | null = null): Promise<Channel> {
        const response = await this.apiCall<{ channel: Channel }>(`/teams/${teamId}/channels`, {
            method: 'PUT',
            body: JSON.stringify({ name, type, additionalData }),
        });
        return response.channel;
    }

    async deleteChannel(teamId: string, channelId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/channels/${channelId}`, {
            method: 'DELETE',
        });
    }

    async duplicateChannel(teamId: string, channelId: string): Promise<Channel> {
        const response = await this.apiCall<{ channel: Channel }>(`/teams/${teamId}/channels/${channelId}/clone`, {
            method: 'POST',
        });
        return response.channel;
    }

    async updateChannelPriority(teamId: string, channels: any[]): Promise<Channel> {
        const response = await this.apiCall<{ channel: Channel }>(`/teams/${teamId}/channelspriority`, {
            method: 'PUT',
            body: JSON.stringify(channels),
        });
        return response.channel;
    }

    async getChannel(teamId: string, channelId: string): Promise<Channel> {
        const response = await this.apiCall<{ channel: Channel }>(`/teams/${teamId}/channels/${channelId}`);
        return response.channel;
    }

    /* Messages */
    async getMessages(channelId: string, limit = 50, params: Record<string, any> = {}): Promise<Message[]> {
        const query = this.qs(params);
        const response = await this.apiCall<{ messages: Message[] }>(`/channels/${channelId}/messages?limit=${limit}${query ? '&' + query : ''}`);
        return response.messages;
    }

    async sendMessage(channelId: string, message: string, options: MessageOptions = {}): Promise<Message> {
        const response = await this.apiCall<{ message: Message }>(`/channels/${channelId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content: message, ...options }),
        });
        return response.message;
    }

    async reply(channelId: string, repliedMessageId: string, message: string, options: MessageOptions = {}): Promise<Message> {
        const response = await this.apiCall<{ message: Message }>(`/channels/${channelId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content: message, replyTo: repliedMessageId, ...options }),
        });
        return response.message;
    }

    async editMessage(channelId: string, messageId: string, newMessage: string, options: MessageOptions = {}): Promise<Message> {
        const response = await this.apiCall<{ message: Message }>(`/channels/${channelId}/messages/${messageId}`, {
            method: 'PATCH',
            body: JSON.stringify({ content: newMessage, ...options }),
        });
        return response.message;
    }

    async deleteMessage(channelId: string, messageId: string): Promise<void> {
        return this.apiCall(`/channels/${channelId}/messages/${messageId}`, {
            method: 'DELETE',
        });
    }

    async getMessage(channelId: string, messageId: string): Promise<Message> {
        const response = await this.apiCall<{ message: Message }>(`/channels/${channelId}/messages/${messageId}`);
        return response.message;
    }

    async sendEmbed(channelId: string, content: string | undefined = undefined, embeds: MessageEmbed[] = [{ title: 'Title', description: 'Description' }]): Promise<Message> {
        const response = await this.apiCall<{ message: Message }>(`/channels/${channelId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ content, embeds }),
        });
        return response.message;
    }

    /* Teams */
    async addRole(teamId: string, userId: string, roleId: string): Promise<any> {
        return this.apiCall(`/teams/${teamId}/members/${userId}/roles/${roleId}`, {
            method: 'POST',
        });
    }

    async removeRole(teamId: string, userId: string, roleId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/members/${userId}/roles/${roleId}`, {
            method: 'DELETE',
        });
    }

    async kickMember(teamId: string, userId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/members/${userId}`, {
            method: 'DELETE',
        });
    }

    async getMember(teamId: string, userId: string): Promise<User> {
        const response = await this.apiCall<{ member: User }>(`/teams/${teamId}/members/${userId}`);
        return response.member;
    }

    async listMembers(teamId: string): Promise<User[]> {
        const response = await this.apiCall<{ members: User[] }>(`/teams/${teamId}/members`);
        return response.members;
    }

    async getTeam(teamId: string): Promise<Team> {
        const response = await this.apiCall<{ team: Team }>(`/teams/${teamId}/details`);
        return response.team;
    }

    async updateTeam(teamId: string, name: string | null = null, description: string | null = null, profilePicture: string | null = null, banner: string | null = null): Promise<any> {
        return this.apiCall(`/teams/${teamId}`, {
            method: 'POST',
            body: JSON.stringify({ name, description, profilePicture, banner }),
        });
    }

    async listTeams(): Promise<Team[]> {
        const response = await this.apiCall<{ teams: Team[] }>(`/teams`);
        return response.teams;
    }

    /* Roles */
    async createRole(teamId: string, name: string, color: string, permissions: number | null = null, isDisplayedSeparately = false, color2: string | null = null): Promise<Role> {
        const response = await this.apiCall<{ role: Role }>(`/teams/${teamId}/roles`, {
            method: 'POST',
            body: JSON.stringify({ name, color, permissions, isDisplayedSeparately, color2 }),
        });
        return response.role;
    }

    async getRoles(teamId: string): Promise<Role[]> {
        const response = await this.apiCall<{ roles: Role[] }>(`/teams/${teamId}/roles`);
        return response.roles;
    }

    async deleteRole(teamId: string, roleId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/roles/${roleId}`, {
            method: 'DELETE',
        });
    }

    async cloneRole(teamId: string, roleId: string): Promise<Role> {
        const response = await this.apiCall<{ role: Role }>(`/teams/${teamId}/roles/${roleId}/clone`, {
            method: 'POST',
        });
        return response.role;
    }

    async updateRolePriority(teamId: string, RoleIds: string[]): Promise<Role[]> {
        const response = await this.apiCall<{ roles: Role[] }>(`/teams/${teamId}/roles-priority`, {
            method: 'PATCH',
            body: JSON.stringify(RoleIds),
        });
        return response.roles;
    }

    async updateRole(teamId: string, roleId: string, name: string, color: string, permissions: number | null = null, isDisplayedSeparately = false, color2: string | null = null): Promise<Role> {
        const response = await this.apiCall<{ role: Role }>(`/teams/${teamId}/roles/${roleId}`, {
            method: 'PATCH',
            body: JSON.stringify({ name, color, permissions, isDisplayedSeparately, color2 }),
        });
        return response.role;
    }

    /* Users */
    async getUser(userId: string): Promise<User> {
        const response = await this.apiCall<{ user: User }>(`/users/${userId}`);
        return response.user;
    }

    async getCurrentUser(): Promise<User> {
        const response = await this.apiCall<{ user: User }>(`/me`);
        return response.user;
    }

    /* Custom Status */
    async setCustomStatus(content: string | null = null, emojiId: string | null = null): Promise<any> {
        return this.apiCall(`/me/status`, {
            method: 'POST',
            body: JSON.stringify({ content, emojiId }),
        });
    }

    async deleteCustomStatus(): Promise<void> {
        return this.apiCall(`/me/status`, {
            method: 'DELETE',
        });
    }

    /* Todos */
    async getTodos(channelId: string): Promise<Todo[]> {
        const response = await this.apiCall<{ todos: Todo[] }>(`/channels/${channelId}/todo/list`);
        return response.todos;
    }

    async createTodo(channelId: string, message: string): Promise<Todo> {
        const response = await this.apiCall<{ todo: Todo }>(`/channels/${channelId}/todo/item`, {
            method: 'POST',
            body: JSON.stringify({ content: message }),
        });
        return response.todo;
    }

    async deleteTodo(channelId: string, todoId: string): Promise<void> {
        return this.apiCall(`/channels/${channelId}/todo/item/${todoId}`, {
            method: 'DELETE',
        });
    }

    async cloneTodo(channelId: string, todoId: string): Promise<Todo> {
        const response = await this.apiCall<{ todo: Todo }>(`/channels/${channelId}/todo/item/${todoId}/clone`, {
            method: 'POST',
        });
        return response.todo;
    }

    async updateTodo(channelId: string, todoId: string, newMessage: string): Promise<Todo> {
        const response = await this.apiCall<{ todo: Todo }>(`/channels/${channelId}/todo/item/${todoId}`, {
            method: 'PUT',
            body: JSON.stringify({ content: newMessage }),
        });
        return response.todo;
    }

    /* DMs */
    async createDM(userId: string): Promise<DirectMessage> {
        const response = await this.apiCall<{ DM: DirectMessage }>(`/me/chats`, {
            method: 'POST',
            body: JSON.stringify({ users: [{ id: userId }] }),
        });
        return response.DM;
    }

    async getDMs(): Promise<DirectMessage[]> {
        const response = await this.apiCall<{ DMs: DirectMessage[] }>(`/me/chats`);
        return response.DMs;
    }

    /* Applications */
    async getApplications(teamId: string): Promise<Application[]> {
        const response = await this.apiCall<{ applications: Application[] }>(`/teams/${teamId}/applications`);
        return response.applications;
    }

    async updateApplicationStatus(teamId: string, applicationId: string, status: 'approved' | 'rejected'): Promise<any> {
        return this.apiCall(`/teams/${teamId}/applications/${applicationId}`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        });
    }

    async updateTeamApplicationStatus(teamId: string, enabled: boolean = false): Promise<any> {
        return this.apiCall(`/teams/${teamId}/applications/status`, {
            method: 'POST',
            body: JSON.stringify({ enabled: enabled.toString() }),
        });
    }

    async updateApplicationQuestions(teamId: string, description: string, questions: { question: string; type: string; }[] = [{ question: 'Örnek soru', type: 'text' }]): Promise<Application> {
        const response = await this.apiCall<{ application: Application }>(`/teams/${teamId}/applications`, {
            method: 'PATCH',
            body: JSON.stringify({ description, questions }),
        });
        return response.application;
    }

    async getApplication(teamId: string, applicationId: string): Promise<Application> {
        const response = await this.apiCall<{ application: Application }>(`/teams/${teamId}/applications/${applicationId}`);
        return response.application;
    }

    /* Custom Reactions */
    async listCustomReactions(teamId: string): Promise<Emoji[]> {
        const response = await this.apiCall<{ reactions: Emoji[] }>(`/teams/${teamId}/reactions`);
        return response.reactions;
    }

    async createCustomReaction(teamId: string, name: string | null = null, emoji: Record<string, any> = {}): Promise<Emoji> {
        const formData = new FormData();
        formData.append('payload_json', JSON.stringify({ name, ...emoji }));

        const response = await this.apiCall<{ emoji: Emoji }>(`/teams/${teamId}/reactions`, {
            method: 'POST',
            body: formData as any, // FormData needs to be cast to any for node-fetch
            headers: {},
        });

        return response.emoji;
    }

    async updateCustomReaction(teamId: string, reactionId: string, name: string): Promise<any> {
        return this.apiCall(`/teams/${teamId}/reactions/${reactionId}`, {
            method: 'PUT',
            body: JSON.stringify({ name }),
        });
    }

    async deleteCustomReaction(teamId: string, reactionId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/reactions/${reactionId}`, {
            method: 'DELETE',
        });
    }

    /* Attachments */
    async uploadAttachment(image: File | Blob, type: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('payload_json', JSON.stringify({ type }));

        const response = await this.apiCall<{ url: string }>(`/upload`, {
            method: 'POST',
            body: formData as any, // FormData needs to be cast to any for node-fetch
            headers: {},
        });

        return response.url;
    }

    /* Voice */
    async joinVoiceChannel(teamId: string, channelId: string, isMuted = false, isDeafened = false): Promise<string> {
        const response = await this.apiCall<{ token: string }>(`/teams/${teamId}/channels/${channelId}/join?isMuted=${isMuted}&isDeafened=${isDeafened}`);
        return response.token;
    }

    async updateVoiceSettings(teamId: string, channelId: string, isMuted: boolean, isDeafened: boolean) {
        const response = await this.apiCall<{ data: { isMuted: boolean; isDeafened: boolean; }}>(`/teams/${teamId}/channels/${channelId}/metadata`, {
            method: 'POST',
            body: JSON.stringify({ isMuted, isDeafened }),
        });
        return response.data;
    }

    async leaveVoiceChannel(teamId: string, channelId: string): Promise<any> {
        return this.apiCall(`/teams/${teamId}/channels/${channelId}/leave`, {
            method: 'POST',
        });
    }

    async moveMember(teamId: string, fromChannelId: string, userId: string, toChannelId: string): Promise<any> {
        return this.apiCall(`/teams/${teamId}/channels/${toChannelId}/move`, {
            method: 'POST',
            body: JSON.stringify({ userId, fromChannelId }),
        });
    }

    async kickMemberFromVoiceChannel(teamId: string, channelId: string, userId: string): Promise<any> {
        return this.apiCall(`/teams/${teamId}/channels/${channelId}/participants/${userId}/disconnect`, {
            method: 'POST',
        });
    }

    /* Webhooks */
    async sendWebhookMessage(webhookId: string, webhookToken: string, username: string, content = 'Teamly.js\'den selamlar!', embeds: MessageEmbed[] | null = null): Promise<Message> {
        const response = await this.apiCall<{ message: Message }>(`/webhooks/${webhookId}/${webhookToken}`, {
            method: 'POST', body: JSON.stringify({ username, content, embeds }),
        });
        return response.message;
    }

    async webhookForGithub(webhookId: string, webhookToken: string): Promise<any> {
        return this.apiCall(`/webhooks/${webhookId}/${webhookToken}/github`, { method: 'POST' });
    }

    /* Blog */
    async getBlogPosts(teamId: string): Promise<Blog[]> {
        const response = await this.apiCall<{ blogs: Blog[] }>(`/teams/${teamId}/blogs`);
        return response.blogs;
    }

    async createBlogPost(teamId: string, title: string, content: string, heroImage: string | null = null): Promise<Blog> {
        const response = await this.apiCall<{ blog: Blog }>(`/teams/${teamId}/blogs`, {
            method: 'POST',
            body: JSON.stringify({ title, content, heroImage }),
        });
        return response.blog;
    }

    async deleteBlogPost(teamId: string, blogId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/blogs/${blogId}`, {
            method: 'DELETE',
        });
    }

    /* Category */
    async createCategory(teamId: string, name: string): Promise<Category> {
        const response = await this.apiCall<{ category: Category }>(`/teams/${teamId}/categories`, {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
        return response.category;
    }

    async updateCategory(teamId: string, categoryId: string, name: string): Promise<Category> {
        const response = await this.apiCall<{ category: Category }>(`/teams/${teamId}/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify({ name }),
        });
        return response.category;
    }

    async updateCategoryRolePermissions(teamId: string, categoryId: string, roleId: string, allow: number, deny: number | null = null): Promise<any> {
        return this.apiCall(`/teams/${teamId}/categories/${categoryId}/permissions/role/${roleId}`, {
            method: 'POST',
            body: JSON.stringify({ allow, deny }),
        });
    }

    async deleteCategory(teamId: string, categoryId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/categories/${categoryId}`, {
            method: 'DELETE',
        });
    }

    async addChannelToCategory(teamId: string, categoryId: string, channelId: string): Promise<Channel> {
        const response = await this.apiCall<{ channel: Channel }>(`/teams/${teamId}/categories/${categoryId}/channels/${channelId}`, {
            method: 'POST',
        });
        return response.channel;
    }

    async removeChannelFromCategory(teamId: string, categoryId: string, channelId: string): Promise<Channel> {
        const response = await this.apiCall<{ channel: Channel }>(`/teams/${teamId}/categories/${categoryId}/channels/${channelId}`, {
            method: 'DELETE',
        });
        return response.channel;
    }

    async setChannelPriorityOfCategory(teamId: string, categoryId: string, channels: string[]): Promise<any> {
        return this.apiCall(`/teams/${teamId}/categories/${categoryId}/channels-priority`, {
            method: 'POST',
            body: JSON.stringify({ channels }),
        });
    }

    async setCategoryPriorityOfTeam(teamId: string, categories: string[]): Promise<any> {
        return this.apiCall(`/teams/${teamId}/categories-priority`, {
            method: 'POST',
            body: JSON.stringify({ categories }),
        });
    }

    /* Announcements */
    async getAnnouncements(channelId: string): Promise<Announcement[]> {
        return this.apiCall(`/channels/${channelId}/announcements`);
    }

    async createAnnouncement(channelId: string, title: string, content: string, tagEveryone: boolean = true): Promise<Announcement> {
        return this.apiCall(`/channels/${channelId}/announcements`, {
            method: 'POST',
            body: JSON.stringify({ title, content, tagEveryone }),
        });
    }

    async deleteAnnouncement(teamId: string, announcementId: string): Promise<void> {
        return this.apiCall(`/teams/${teamId}/announcements/${announcementId}`, {
            method: 'DELETE',
        });
    }
}
