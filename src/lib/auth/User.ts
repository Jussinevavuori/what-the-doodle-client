import { v4 as uuid } from "uuid";
import { z } from "zod";
import { getRandomString } from "../functions/getRandomString";
import { StorageService } from "../storage/StorageService";

export class User {
  /**
   * User's ID
   */
  id: string;

  /**
   * User's name
   */
  name: string;

  /**
   * Users avatar in format {male / female}/{randomSeed}
   */
  avatar: string;

  /**
   * Online status
   */
  isOnline: boolean;

  constructor(
    id: string,
    details: {
      name?: string;
      avatar?: string;
      isOnline?: boolean;
    } = {}
  ) {
    this.id = id;
    this.name = details.name ?? "";
    this.avatar = details.avatar ?? `male/${getRandomString(16)}`;
    this.isOnline = details.isOnline ?? true;
  }

  get avatarUrl() {
    return `https://avatars.dicebear.com/api/${this.avatar}.svg`;
  }

  isValid() {
    return (
      this.id &&
      this.name &&
      this.avatar &&
      (this.avatar.startsWith("male/") || this.avatar.startsWith("female/"))
    );
  }

  /**
   * Encode to object which can then be stringified
   */
  toJson() {
    return { id: this.id, name: this.name, avatar: this.avatar };
  }

  /**
   * JSON schema for validating parsed user data
   */
  static JsonSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
  });

  /**
   * Attempt to parse user from JSON
   */
  static fromJson(json: string) {
    try {
      const parsed = this.JsonSchema.safeParse(JSON.parse(json));
      if (parsed.success) {
        return new User(parsed.data.id, {
          name: parsed.data.name,
          avatar: parsed.data.avatar,
        });
      }
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Get anonymous self user. If no self user, create and save new self user.
   * Attempt to recycle from local storage to ensure same ID stays for as long
   * as possible.
   */
  static getSelf(): User {
    let user = StorageService.user.getValue();
    if (!user) {
      user = new User(uuid());
      User.saveSelf(user);
    }
    // Self is always online
    user.isOnline = true;
    return user;
  }

  /**
   * Save self to local storage
   */
  static saveSelf(user: User) {
    StorageService.user.setValue(user);
  }
}
