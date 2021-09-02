import { User } from "../auth/User";

export enum StorageType {
  Local,
  Session,
}

export type StorageServiceOptions = {
  storage: StorageType;
};

export class StorageService {
  //==============================================================//
  // INTERNALS
  //==============================================================//

  /**
   * Gets the selected storage based on the options.
   *
   * @param options		Storage options
   */
  protected static getStorage(options: StorageServiceOptions) {
    switch (options.storage) {
      case StorageType.Local:
        return window.localStorage;
      case StorageType.Session:
        return window.sessionStorage;
    }
  }

  /**
   * Get an item from the storage.
   *
   * @param key				Key of item to fetch from storage
   * @param options		Storage options
   */
  protected static getItem(key: string, options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    return storage.getItem(key);
  }

  /**
   * Set an item to the storage.
   *
   * @param key				Key of item to set to storage
   * @param value			Value to set to storage
   * @param options		Storage options
   */
  protected static setItem(
    key: string,
    value: string | undefined,
    options: StorageServiceOptions
  ) {
    const storage = StorageService.getStorage(options);
    if (typeof value === "string") {
      return storage.setItem(key, value);
    } else {
      return storage.removeItem(key);
    }
  }

  /**
   * Remove an item from the storage.
   *
   * @param key				Key of item to remove from storage
   * @param options		Storage options
   */
  protected static removeItem(key: string, options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    return storage.removeItem(key);
  }

  /**
   * Fully clear all values from the storage.
   *
   * @param options		Storage options
   */
  protected static clear(options: StorageServiceOptions) {
    const storage = StorageService.getStorage(options);
    storage.clear();
  }

  /**
   * Session storage namespace
   */
  static namespace = "@nexpenda";

  /**
   * Returns a namespaced version of the given key
   */
  static createKey(key: string, ...args: string[]) {
    return [StorageService.namespace, key, ...args].join("/");
  }

  /**
   * Creates a storage component which has the following methods:
   * - `getKey()`     for getting the key of the component.
   * - `getValue()`   for fetching the current value of the component.
   * - `setValue()`   for setting the current value of the component.
   * - `clearValue()` for clearing the current value of the component.
   *
   * A component represents a single property in a storage (such as
   * localStorage) and represents it with a clear, centralized API.
   *
   * @param args 					Component options
   * @param options.key				Key of item to use in storage
   * @param options.encode		Function to encode a valid value into a
   * 													string / undefined representation which
   * 													will be stored in the storage.
   * @param options.decode		Function to decode the stringified result
   * 													of encode back into a valid value.
   * @param options.options		Storage options
   */
  protected static createComponent<T>(args: {
    key: string;
    decode(value: string | null): T;
    encode(t: T): string | undefined;
    storage: StorageType;
  }) {
    const options: StorageServiceOptions = { storage: args.storage };

    return {
      getKey() {
        return args.key;
      },
      getValue() {
        return args.decode(StorageService.getItem(args.key, options));
      },
      setValue(t: T) {
        return StorageService.setItem(args.key, args.encode(t), options);
      },
      clearValue() {
        return StorageService.removeItem(args.key, options);
      },
    };
  }

  /**
   * Wrapper for `StorageService.createComponent` for easier and more readable
   * creation of boolean StorageService components. Automatically provides
   * encoder and decored functions such that the value "1" represents true
   * in local storage, while undefined or any other value represents false.
   *
   * @param options 				Component options
   * @param options.key 		Key to use for storing the component.
   * @param options.options Storage options.
   */
  protected static createBooleanComponent(args: {
    key: string;
    storage: StorageType;
  }) {
    const truthy = StorageService.DefaultTruthyValue;
    return StorageService.createComponent({
      decode: (value) => value === truthy,
      encode: (value) => (value ? truthy : undefined),
      key: args.key,
      storage: args.storage,
    });
  }

  /**
   * Value used by createBooleanComponent to represent a truthy value.
   */
  protected static DefaultTruthyValue = "1";

  //==============================================================//
  // COMPONENTS
  //==============================================================//

  /**
   * StorageService component:
   *
   * Represents a boolean value for whether the user has had an access token.
   */
  static user = StorageService.createComponent<User | undefined>({
    key: "@temp/user",
    storage: StorageType.Local,
    decode: (value) => (value ? User.fromJson(value) : undefined),
    encode: (user) => (user ? JSON.stringify(user.toJson()) : ""),
  });
}
