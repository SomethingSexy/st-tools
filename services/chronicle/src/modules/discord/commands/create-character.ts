import { resolve } from "fluture";
import type { ICommand } from "../types";

export default {
  name: 'create-character',
  description: 'Creates a character',
  title: 'Create Character',
  execute: () => {
    return resolve('foo');
  }
} as ICommand;
