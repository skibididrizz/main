using TypeSpec.Reflection;

namespace Drizzle;

enum ConfigurationType {
    postgres;
    mysql;
    sqlite;
}

model Configuration {
    name: string;
    url: string;
    type: ConfigurationType;
}