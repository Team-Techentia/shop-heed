/**
 * @typedef {Object} IAnnouncement
 * @property {string} text - The announcement text
 * @property {boolean} isActive - Whether the announcement is active
 * @property {Date} createdAt - When the announcement was created
 * @property {Date} updatedAt - When the announcement was last updated
 */

/**
 * @typedef {Object} IAnnouncementResponse
 * @property {boolean} success - Whether the request succeeded
 * @property {string} [message] - Optional message
 * @property {{ text: string, isActive: boolean, updatedAt: Date }} [data] - Announcement data
 * @property {string} [error] - Error message if any
 */

/**
 * @typedef {Object} IAnnouncementUpdateRequest
 * @property {string} text - The announcement text
 * @property {boolean} [isActive] - Whether the announcement is active
 */

/**
 * @typedef {import("express").Request & {
 *   user?: {
 *     id: string;
 *     email: string;
 *     role: string;
 *   }
 * }} IAuthenticatedRequest
 */
