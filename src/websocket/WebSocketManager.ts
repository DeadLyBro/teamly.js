import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { Client } from '../client/Client';

const WS_URL = 'wss://api.teamly.one/api/v1/ws';

export class WebSocketManager extends EventEmitter {
    client: Client;
    ws: WebSocket | null;
    heartbeatInterval: NodeJS.Timeout | null;

    constructor(client: Client) {
        super();
        this.client = client;
        this.ws = null;
        this.heartbeatInterval = null;
    }

    connect() {
        this.ws = new WebSocket(WS_URL, {
            headers: {
                Authorization: `Bot ${this.client.token}`
            }
        });

        this.ws.on('open', () => {
            console.log('Connected to Teamly WebSocket');
            this.startHeartbeat();
        });

        this.ws.on('message', (data: WebSocket.RawData) => {
            const dataObj = JSON.parse(data.toString());
            const { t: eventName, d: eventData } = dataObj;
            this.emit(eventName, eventData);
        });

        this.ws.on('close', (code: number, reason: Buffer) => {
            console.log(`Disconnected from Teamly WebSocket: ${code} - ${reason.toString()}`);
            this.stopHeartbeat();
            // Implement reconnect logic if needed
        });

        this.ws.on('error', (error: Error) => {
            console.error('WebSocket error:', error);
        });
    }

    private startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.heartbeatInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ t: "HEARTBEAT", d: {} }));
            }
        }, 20000); // Send heartbeat every 20 seconds
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}
