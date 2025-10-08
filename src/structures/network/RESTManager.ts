import {Request} from "./Request.ts";
import { Response } from "./Response.ts";

export class RESTManager {
    public requestNumber: number = 0;
    private queue: Array<() => Promise<unknown>> = [];
    private isProcessingQueue: boolean = false;

    public enqueueRequest<T>(request: Request): Promise<Response<T>> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await request.send<T>();
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.isProcessingQueue) return;
        this.isProcessingQueue = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (!task) continue;
            await task();
        }

        this.isProcessingQueue = false;
    }
}
