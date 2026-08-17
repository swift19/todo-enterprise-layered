export type DomainEvent =
  | { type: 'TodoCommand.Create'; payload: { title: string; userId: string; priority?: string } }
  | { type: 'TodoCommand.Update'; payload: { id: string; userId: string; data: any } }
  | { type: 'TodoCommand.Delete'; payload: { id: string; userId: string } }
  | { type: 'TodoCreated'; payload: any }
  | { type: 'TodoUpdated'; payload: any }
  | { type: 'TodoDeleted'; payload: { id: string } };
