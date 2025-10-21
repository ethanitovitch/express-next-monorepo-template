import { Queue } from "bullmq";
import { ExampleEvent, QueueName } from "@/types/queues";
import { config } from "@/config";

export const exampleQueue = new Queue<ExampleEvent>(QueueName.EXAMPLE, {
  connection: {
    url: config.redis.url,
    ...(config.redis.useTLS && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  },
});

export const addExampleEvent = async (event: ExampleEvent, attempts: number = 3, backoff: number = 1000) => {
  await exampleQueue.add(event.type, event, {
    attempts,
    backoff: {
      type: 'exponential',
      delay: backoff,
    },
  });
}