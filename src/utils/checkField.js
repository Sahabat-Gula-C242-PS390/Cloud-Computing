/**
 * Check if a field is required and if it is a string
 *
 * @param {Object} required - Object with the required fields
 * @returns {void} - Nothing
 * @throws {TypeError} - If the field is not a string or is not present
 */
export function customCheckField(required) {
  for (const [field, value] of Object.entries(required)) {
    if (value === undefined) {
      throw new TypeError(`${field} is required`);
    } else if (typeof value !== "string") {
      throw new TypeError(`${field} must be a valid string`);
    }
  }
}

/**
 * Check if a field is required and if it is not a string
 *
 * @param {Object} required - Object with the required fields
 * @returns {void} - Nothing
 * @throws {TypeError} - If the field is not a string or is not present
 */
export function findCheckField(required) {
  for (const [field, value] of Object.entries(required)) {
    if (!value) {
      throw new TypeError(`${field} is required`);
    } else if (field === "field" && typeof value !== "string") {
      throw new TypeError(`${field} must be a valid string`);
    }
  }
}

/**
 * Validate user fields according to user model rules
 *
 * @param {Object} required - User data object
 * @param {string} required.email - User email
 * @param {string} required.name - User name
 * @param {string} required.password - User password
 * @param {"male" | "female"} required.gender - User gender
 * @param {number} required.umur - User age
 * @param {number} required.berat - User weight
 * @param {number} required.tinggi - User height
 * @param {"small" | "medium" | "large"} required.lingkarPinggang - Waist size
 * @param {boolean} required.tekananDarahTinggi - Blood pressure status
 * @param {boolean} required.gulaDarahTinggi - Blood sugar status
 * @param {boolean} required.riwayatDiabetes - Diabetes history
 * @param {"none" | "low" | "medium" | "high" | "extreme"} required.tingkatAktivitas
 *   - Activity level
 *
 * @param {boolean} required.konsumsiBuah - Fruit consumption status
 * @param {number} required.kaloriHarian - Daily calorie intake
 * @param {number} required.karbohidratHarian - Daily carb intake
 * @param {number} required.lemakHarian - Daily fat intake
 * @param {number} required.proteinHarian - Daily protein intake
 * @param {number} required.gulaHarian - Daily sugar intake
 * @throws {TypeError} If any field fails validation
 */
export function userCheckField(required) {
  for (const [field, value] of Object.entries(required)) {
    if (value === undefined) {
      throw new TypeError(`${field} is required`);
    }

    // String fields
    if (["email", "name", "password"].includes(field)) {
      if (typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string`);
      } else if (field === "email" && !value.includes("@")) {
        throw new TypeError("email must be a valid email address");
      }
    }

    // Number fields
    if (
      [
        "umur",
        "berat",
        "tinggi",
        "kaloriHarian",
        "karbohidratHarian",
        "lemakHarian",
        "proteinHarian",
        "gulaHarian",
      ].includes(field)
    ) {
      if (typeof value !== "number") {
        throw new TypeError(`${field} must be a valid number`);
      }
    }

    // Boolean fields
    if (
      [
        "tekananDarahTinggi",
        "gulaDarahTinggi",
        "riwayatDiabetes",
        "konsumsiBuah",
      ].includes(field)
    ) {
      if (typeof value !== "boolean") {
        throw new TypeError(`${field} must be a boolean!`);
      }
    }

    // Enum fields
    if (field === "gender" && !["male", "female"].includes(value)) {
      throw new TypeError("gender must be lowercase 'male' or 'female'!");
    } else if (
      field === "lingkarPinggang" &&
      !["small", "medium", "large"].includes(value)
    ) {
      throw new TypeError(
        "lingkarPinggang must be lowercase 'small', 'medium', or 'large'!",
      );
    } else if (
      field === "tingkatAktivitas" &&
      !["none", "low", "medium", "high", "extreme"].includes(value)
    ) {
      throw new TypeError(
        "tingkatAktivitas must be lowercase 'none', 'low', 'medium', 'high', or 'extreme'!",
      );
    }
  }
}

/**
 * Validate food fields according to food model rules
 *
 * @param {Object} required - Food data object
 * @param {string} required.foodId - Food ID
 * @param {string} required.name - Food name
 * @param {number} required.gula - Sugar content
 * @param {number} required.karbohidrat - Carb content
 * @param {number} required.protein - Protein content
 * @param {number} required.lemak - Fat content
 * @throws {TypeError} If any field fails validation
 */
export function foodCheckField(required) {
  for (const [field, value] of Object.entries(required)) {
    if (value === undefined) {
      throw new TypeError(`${field} is required`);
    }

    if (["gula", "karbohidrat", "protein", "lemak"].includes(field)) {
      if (typeof value !== "number") {
        throw new TypeError(`${field} must be a valid number`);
      }
    }

    // String fields
    if (["name", "foodId"].includes(field)) {
      if (typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string`);
      }
    }
  }
}

export function userLogCheckField(required) {
  for (const [field, value] of Object.entries(required)) {
    if (value === undefined) {
      throw new TypeError(`${field} is required`);
    }

    // String fields
    if (["userId", "foodId", "imageUrl", "userLogId"].includes(field)) {
      if (typeof value !== "string") {
        throw new TypeError(`${field} must be a valid string`);
      }
    }

    // Boolean fields
    if (field === "isDeleted" && typeof value !== "boolean") {
      throw new TypeError(`${field} must be a boolean!`);
    }
  }
}
