import { TodoDomain } from '@/lib/domain/todo.entity';
describe('TodoDomain', () => {
  it('validates title length', () => {
    expect(() => TodoDomain.validateTitle('ab')).toThrow();
    expect(() => TodoDomain.validateTitle('Valid todo')).not.toThrow();
  });
  it('creates entity', () => {
    const t = TodoDomain.create('Test todo', 'u1', 'high');
    expect(t.title).toBe('Test todo');
    expect(t.priority).toBe('high');
  });
});
