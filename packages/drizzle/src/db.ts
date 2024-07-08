abstract class Db {
  constructor(
    public readonly moduleName: string,
    public readonly imports: Map<string, string[]>,
  ) {}
  addImport(pkgName: string, ...decl: (string | undefined)[]) {
    const imptsArr =
      this.imports.get(pkgName) ?? this.imports.set(pkgName, []).get(pkgName)!;

    const impts = new Set(imptsArr);
    decl.forEach((v) => v && impts.add(v));
    this.imports.set(pkgName, [...impts]);
    return this;
  }
  abstract table(): string;
  abstract enum(): string;
  type(name: string) {
    this.addImport(this.moduleName, name);
    return name;
  }
}
export const sqlite = class extends Db {
  constructor(imports: Map<string, string[]>) {
    super("drizzle-orm/sqlite-core", imports);
  }
  table() {
    return this.type("sqliteTable");
  }
  enum() {
    return this.type("sqliteEnum");
  }
};

export const mysql = class extends Db {
  constructor(imports: Map<string, string[]>) {
    super("drizzle-orm/mysql-core", imports);
  }
  table() {
    return this.type("mysqlTable");
  }
  enum() {
    return this.type("mysqlEnum");
  }
};

export const postgres = class extends Db {
  constructor(imports: Map<string, string[]>) {
    super("drizzle-orm/pg-core", imports);
  }
  table(): string {
    return this.type("pgTable");
  }
  enum(): string {
    return this.type("pgEnum");
  }
};
