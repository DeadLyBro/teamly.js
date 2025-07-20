export interface Message {
    id: string;
    channelId: string;
    type: string;
    content: string | null;
    attachments?: Attachment[] | null;
    url: string;
    editedAt?: string;
    replyTo?: string | null;
    createdBy: User;
    emojis?: Emoji[];
    reactions?: Reaction[];
    nonce?: string;
    mentions: { users?: string[] };
    createdAt: string;
}

export interface User {
    id: string;
    username: string;
    subdomain: string;
    profilePicture?: string | null;
    banner?: string | null;
    bot: boolean;
    system: boolean;
    presence: number;
    flags: string;
    badges: Badge[];
    userStatus?: UserStatus;
    userRPC?: UserRPC;
    connections: any[]; // Keeping as any[] for now because there is no example for this
    createdAt: string;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
}

export interface UserStatus {
    content?: string;
    emojiId?: string;
}

export interface UserRPC {
    type?: string;
    name?: string;
    id?: number;
    startedAt?: string;
}

export interface MessageEmbed {
    title?: string | null;
    description?: string | null;
    url?: string | null;
    color?: number | null;
    author?: { name: string; icon_url: string } | null;
    thumbnail?: { url: string } | null;
    image?: { url: string } | null;
    footer?: { text: string; icon_url: string } | null;
}

export interface Emoji {
    id: string;
    name: string;
    createdBy: string;
    updatedBy?: string | null;
    updatedAt?: string | null;
    url: string;
    createdAt: string;
}

export interface ReactionUser {
    id: string;
    reactedAt: string;
}

export interface Reaction {
    emojiId: string;
    count: number;
    users: ReactionUser[];
}

export interface ChannelPermissions {
    role: Record<string, { allow: number; deny: number }>;
}

export interface Channel {
    id: string;
    type: string;
    teamId: string;
    name: string;
    description?: string | null;
    createdBy: string;
    parentId?: string | null;
    participants?: string[] | null;
    priority: number;
    rateLimitPerUser: number;
    createdAt: string;
    permissions: ChannelPermissions;
    additionalData?: ChannelAdditionalData | null;
    streamChannel?: string | null;
    streamPlatform?: string | null;
}

export interface ChannelAdditionalData {
    streamChannel: string | null;
    streamPlatform: string | null;
}

export interface DirectMessage {
    id: string;
    users: string[];
    channelId: string;
    createdAt: string;
    lastMessage: Message;
}

export interface Todo {
    id: string;
    channelId: string;
    type: string;
    content: string;
    createdBy: string;
    editedBy?: string | null;
    editedAt?: string | null;
    completed: boolean;
    completedBy?: string | null;
    completedAt?: string | null;
    createdAt: string;
}

export interface Application {
    id: string;
    type: string;
    submittedBy: User;
    answers: ApplicationAnswer[];
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface ApplicationAnswer {
    questionId: string;
    answer?: string | string[];
    question: string;
    optional: boolean;
    options: string[];
}

export interface Team {
    id: string;
    name: string;
    profilePicture?: string;
    banner?: string;
    description?: string;
    isVerified: boolean;
    isSuspended?: boolean;
    createdBy?: string;
    defaultChannelId?: string;
    games?: TeamGame[];
    isDiscoverable?: boolean;
    discoverableInvite?: string | null;
    createdAt?: string;
    memberCount?: number;
}

export interface TeamGame {
    id: number;
    platforms: string[];
    region: string;
}

export interface Role {
    id: string;
    teamId: string;
    name: string;
    iconUrl?: string | null;
    color: string;
    color2?: string | null;
    permissions: number;
    priority: number;
    createdAt: string;
    updatedAt?: string | null;
    isDisplayedSeparately: boolean;
    isSelfAssignable?: boolean;
    iconEmojiId?: string | null;
    mentionable: boolean;
    botScope: RoleBotScope;
}

export interface RoleBotScope {
    userId: string | null;
}

export interface Webhook {
    id: string;
    channelId: string;
    teamId: string;
    username: string;
    profilePicture: string | null;
    token: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    createdBy: string;
    editedAt?: string | null;
    teamId: string;
    heroImage?: string | null;
}

export interface CategoryPermissions {
    role: Record<string, { allow: number; deny: number }>;
}

export interface Category {
    id: string;
    teamId: string;
    name: string;
    createdBy: string;
    priority?: number | null;
    permissions: CategoryPermissions;
    createdAt: string;
    editedAt?: string | null;
}

export interface Announcement {
    id: string;
    channelId: string;
    title: string;
    content: string;
    createdBy: User;
    attachments?: Attachment[];
    emojis?: { emojiId?: string }[];
    mentions?: { users?: string[] };
    reactions?: { emojiId?: string; count?: number; users?: AnnouncementReactionUser[] }[];
    createdAt: string;
    editedAt?: string | null;
}

export interface AnnouncementReactionUser {
    userId: string;
    timestamp: string;
}

export interface MessageOptions {
    embeds?: MessageEmbed[];
    replyTo?: string;
}

export interface Attachment {
    url: string;
}
