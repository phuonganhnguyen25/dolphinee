type ObjectWithAnyFields = { [key: string]: any };

export function RemoveDuplicateObj(
  obj1: ObjectWithAnyFields,
  obj2: ObjectWithAnyFields
): ObjectWithAnyFields {
  const differingFields: ObjectWithAnyFields = {};

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
      differingFields[key] = obj1[key];
    }
  }

  return differingFields;
}