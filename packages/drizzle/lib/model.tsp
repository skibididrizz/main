using TypeSpec.Reflection;

namespace Drizzle;

enum DeleteAction {
    SetNull,
    Restrict, 
    Cascade
  }
  
  enum UpdateAction {
    Cascade,
    Restrict,
  }
  
  model RelationOptions {
    name?:  string;
    fields?:  string[] | string;
    references?:  (string | ModelProperty)[] | string;
    onDelete?: DeleteAction;
    onUpdate?: UpdateAction;
  }
  
  enum DefaultType {
    uuid,
    autoincrement
  };
  enum Sequence {
      identity,
      sequence
  };

  alias Date = plainDate;
  alias serial = int32;

  alias Dialect = "sqlite" | "mysql" | "postgres";
  
  model DbCredentials {
    url:string;
  }

  model Configuration {
    dialect:  Dialect;
    strict?:boolean;
    verbose?:boolean;
    /**
     * Where to write the schema.
     */
    schema?:string;
    credentials?:DbCredentials;
  }