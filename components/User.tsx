export type UserProps = {
  id: string;
  name: string;
  todos: {
    name: string;
  } | null;
  email: string;
};