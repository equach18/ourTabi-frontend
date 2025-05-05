import axios from "axios";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class OurTabiApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    if (process.env.NODE_ENV === "development") {
      console.debug("API Call:", endpoint, data, method);
    }

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    // const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes
  /**
   *
   * Authentication  Endpoints
   *
   */

  /** Login the user. */
  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup new user. */
  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Update the token. */
  static async setToken(token) {
    this.token = token;
  }

  /**
   *
   * User Endpoints
   *
   */

  /** Get user details */
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Update user profile */
  static async updateUser(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  // /** Delete a user (admin or self only) */
  // static async deleteUser(username) {
  //   let res = await this.request(`users/${username}`, {}, "delete");
  //   return res.deleted;
  // }

  /** Search for users by username */
  static async searchUsers(query) {
    let res = await this.request(`users`, { query });
    return res.users;
  }

  /** Send a friend request to another user */
  static async sendFriendRequest(recipientId) {
    let res = await this.request(`friends/${recipientId}/`, {}, "post");
    return res.friendRequest;
  }

  /** Accept a friend request */
  static async acceptFriendRequest(friendId) {
    let res = await this.request(`friends/${friendId}`, {}, "patch");
    return res.acceptedFriend;
  }

  /** Remove a friend or decline a pending request */
  static async removeFriend(friendId) {
    let res = await this.request(`friends/${friendId}`, {}, "delete");
    return res.removed;
  }

  /**
   *
   * Basic Trip Endpoints
   *
   */

  /** Create a new trip */
  static async createTrip(data) {
    let res = await this.request("trips", data, "post");
    return res.trip;
  }

  /** Get trip details by ID */
  static async getTrip(tripId) {
    let res = await this.request(`trips/${tripId}`);
    return res.trip;
  }

  /** Get all public trips (or filter by title/destination) */
  static async getPublicTrips(filters = {}) {
    let res = await this.request("trips", filters);
    return res.trips;
  }

  /** Update a trip (only trip owner/members) */
  static async updateTrip(tripId, data) {
    let res = await this.request(`trips/${tripId}`, data, "patch");
    return res.trip;
  }

  /** Delete a trip (only the trip owner can do this) */
  static async deleteTrip(tripId) {
    let res = await this.request(`trips/${tripId}`, {}, "delete");
    return res.deleted;
  }

  /**
   *
   * Trip Member Endpoints
   *
   */

  /** Add the user's friend to a trip as member (Trip owner can only add friends) */
  static async addTripMember(friendId, tripId) {
    const res = await this.request(
      `trips/${tripId}/members`,
      { friendId },
      "post"
    );
    return res.member;
  }

  /** Remove a member from a trip (Only trip owner can do this) */
  static async removeTripMember(memberId, tripId) {
    const res = await this.request(
      `trips/${tripId}/members/${memberId}`,
      {},
      "delete"
    );
    return res.removed;
  }

  /**
   *
   * Trip Comment Endpoints
   *
   */

  /** Add a comment to a trip */
  static async addComment(tripId, text) {
    let res = await this.request(`trips/${tripId}/comments`, { text }, "post");
    return res.comment;
  }

  /** Delete a comment from a trip (Only the comment owner can delete) */
  static async deleteComment(tripId, commentId) {
    let res = await this.request(
      `trips/${tripId}/comments/${commentId}`,
      {},
      "delete"
    );
    return res.deleted; // { deleted: commentId }
  }

  /**
   *
   * Trip Activity Endpoints
   *
   */

  /** Get details of a specific activity, including votes */
  static async getActivities(tripId) {
    let res = await this.request(`trips/${tripId}/activities`);
    return res.activities;
  }

  /** Create a new activity within a trip */
  static async addActivity(tripId, data) {
    let res = await this.request(`trips/${tripId}/activities`, data, "post");
    return res.activity;
  }

  /** Update an activity */
  static async updateActivity(tripId, activityId, data) {
    let res = await this.request(
      `trips/${tripId}/activities/${activityId}`,
      data,
      "patch"
    );
    return res.activity;
  }

  /** Delete an activity  */
  static async deleteActivity(tripId, activityId) {
    let res = await this.request(
      `trips/${tripId}/activities/${activityId}`,
      {},
      "delete"
    );
    return res.deleted;
  }

  /** Vote on an activity */
  static async voteOnActivity(tripId, activityId, voteValue) {
    let res = await this.request(
      `trips/${tripId}/activities/${activityId}/vote`,
      { voteValue },
      "post"
    );
    return res.vote;
  }
}

export default OurTabiApi;
