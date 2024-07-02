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

