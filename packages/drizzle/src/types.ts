import { ModelProperty } from "@typespec/compiler";

export enum DeleteAction {
  Cascade = "cascade",
  Restrict = "restrict",
  SetNull = "set null",
  SetDefault = "set default",
}
export enum UpdateAction {
  Cascade = "cascade",
  Restrict = "restrict",
}
export interface FieldRef {
  name?: string;
  fields?: string[] | string;
  references?: (string | ModelProperty)[];
  onDelete?: DeleteAction;
  onUpdate?: UpdateAction;
}
export interface IdRef {
  name?: string;
  fields?: string[];
}
