import "../dist/src/decorators.js";

using TypeSpec.Reflection;

namespace Zod;

/**
 * zod - Mark this model as a Zod model.
 */
extern dec zod(target: Model | Enum);
