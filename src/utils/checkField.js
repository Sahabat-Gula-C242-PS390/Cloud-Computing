/**
 * Check if a field is required and if it is a string
 *
 * @param {Object} required - Object with the required fields
 * @returns {void} - Nothing
 * @throws {TypeError} - If the field is not a string or is not present
 */
export function checkField(required) {
  for (const [field, value] of Object.entries(required)) {
    if (!value) {
      throw new TypeError(`${field} is required`);
    } else if (typeof value !== "string") {
      throw new TypeError(`${field} must be a valid string`);
    }
  }
}

export function fullCheckField(required) {
  for (const [field, value] of Object.entries(required)) {
    if (!value) {
      throw new TypeError(`${field} is required`);
    } else if (field === "gender" && !["male", "female"].includes(value)) {
      throw new TypeError("gender must be lowercase 'male' or 'female'!");
    } else if (
      ["age", "weight", "height", "waistSize"].includes(field) &&
      typeof value !== "number"
    ) {
      throw new TypeError(`${field} must be a valid number`);
    } else if (typeof value !== "string") {
      throw new TypeError(`${field} must be a valid string`);
    }
  }
}
