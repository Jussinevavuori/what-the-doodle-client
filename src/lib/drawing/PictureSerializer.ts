import { Picture } from "./Picture";

export class PictureSerializer {
  /**
   * Serialize the image to a string, for example
   *
   * 640x360#00affadba8c9048458493c...
   *
   * Contains the metadata before the hash as {width}x{height} and pixel data
   * as a string of two-character hex numbers corresponding to integers between
   * 0 and 255 inclusive that can be directly mapped to the array.
   */
  static serialize(picture: Picture): string {
    let str = `${picture.width}x${picture.height}#`;
    for (let i = 0; i < picture.pixels.length; i++) {
      str += picture.pixels[i].toString(16).padStart(2, "0");
    }
    return str;
  }

  /**
   * Deserialize an image string into a picture object
   */
  static deserialize(serial: string): Picture {
    // Split image data and metadata
    const [metadata, imagedata] = serial.split("#");
    if (!metadata || !imagedata) {
      throw new Error("Could not deserialize string");
    }

    // Parse width and height as positive integers
    const [width, height] = metadata
      .split("x")
      .map((_) => Math.max(Math.floor(parseInt(_)), 0));
    if (!width || !height) {
      throw new Error("Could not parse serial size");
    }

    // Parse imagedata
    const pixels = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < imagedata.length; i += 2) {
      const hex = imagedata.charAt(i) + imagedata.charAt(i + 1);
      pixels[Math.floor(i / 2)] = parseInt(hex, 16);
    }

    return new Picture({ width, height }).setData(pixels);
  }
}
