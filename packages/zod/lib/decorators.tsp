import "../dist/src/decorators.js";

using TypeSpec.Reflection;

namespace Zod;

/**
 * zod - Mark this model as a Zod model.
 */
extern dec zod(target: Model | Enum);
/**
 * Mark a model with a brand.
 */
extern dec brand(target:Model, brand:valueof string);

/**
 * Custom message for a invalid property.
 */
extern dec error(target:ModelProperty, message:valueof string, typeMessage?:valueof string);
