import axios from 'axios';

const SECONDME_API_ENDPOINT = process.env.SECONDME_API_ENDPOINT || 'https://api.second.me';
const SECONDME_CLIENT_ID = process.env.SECONDME_CLIENT_ID!;
const SECONDME_CLIENT_SECRET = process.env.SECONDME_CLIENT_SECRET!;

export interface SecondMeUser {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
}

export interface SecondMeChatRequest {
  message: string;
  context?: Record<string, any>;
}

export interface SecondMeChatResponse {
  reply: string;
  timestamp: string;
}

export class SecondMeClient {
  private endpoint: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor() {
    this.endpoint = SECONDME_API_ENDPOINT;
    this.clientId = SECONDME_CLIENT_ID;
    this.clientSecret = SECONDME_CLIENT_SECRET;
  }

  // OAuth: 获取授权 URL
  getAuthUrl(callbackUrl: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      state: state || '',
    });
    return `${this.endpoint}/oauth2/authorize?${params.toString()}`;
  }

  // OAuth: 交换 code 获取 token
  async exchangeCodeForToken(code: string, callbackUrl: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }> {
    const response = await axios.post(`${this.endpoint}/oauth2/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: callbackUrl,
    });
    return response.data;
  }

  // 获取用户信息
  async getUserProfile(accessToken: string): Promise<SecondMeUser> {
    const response = await axios.get(`${this.endpoint}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  // Chat API: 发送消息给 SecondMe AI
  async chat(userId: string, message: string, context?: Record<string, any>): Promise<string> {
    const response = await axios.post(`${this.endpoint}/api/v1/chat`, {
      user_id: userId,
      message,
      context,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data.reply;
  }

  // Note API: 保存笔记
  async saveNote(userId: string, title: string, content: string): Promise<string> {
    const response = await axios.post(`${this.endpoint}/api/v1/notes`, {
      user_id: userId,
      title,
      content,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data.id;
  }

  // Note API: 获取笔记列表
  async getNotes(userId: string): Promise<any[]> {
    const response = await axios.get(`${this.endpoint}/api/v1/notes`, {
      params: { user_id: userId },
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }
}

export const secondMeClient = new SecondMeClient();
