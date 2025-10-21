export enum QueueName {
  EXAMPLE = 'example',
}

export enum ExampleEventType {
  GET_EXAMPLE = 'getExample',
}

export interface ExampleEvent {
  id: string
  type: ExampleEventType
}
