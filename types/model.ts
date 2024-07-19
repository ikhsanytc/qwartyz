interface ChatModel {
    id: number;
    sender: string;
    target: string;
    file: string | null;
    fileTypes: string | null;
    message: string;
    reply: number | null;
    created_at: string;
    sending: boolean;
}

interface UserModel {
    id: number;
    img: string;
    email: string;
    username: string;
    userId: string;
    description: string;
    created_at: string;
}

interface ContactModel {
    id: number;
    img: string;
    user: string;
    user2: string;
    userId: string;
    userId2: string;
    description: string;
    created_at: string;
}

interface RequestFriendModel {
    id: number;
    sender: string;
    target: string;
    userId: string;
    userId2: string;
    status: string;
    img: string;
    created_at: string;
}

type ChatModelInput = Omit<ChatModel, 'id' | 'created_at' | 'sending'> & Partial<Pick<ChatModel, 'id' | 'created_at' | 'sending'>>

export type {
    ChatModel,
    UserModel,
    ContactModel,
    RequestFriendModel,
    ChatModelInput,
}