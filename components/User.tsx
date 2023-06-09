export type UserProps = {
  id: string;
  name: string;
  items: {
    name: string;
  } | null;
  email: string;
};