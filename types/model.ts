interface ChatModel {
    id: number;
    sender: string;
    target: string;
    file: string;
    fileTypes: string;
    message: string;
    reply: number;
    created_at: string;
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

export type {
    ChatModel,
    UserModel,
    ContactModel,
    RequestFriendModel
}