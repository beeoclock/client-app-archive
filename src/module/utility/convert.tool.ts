export class ConvertTool {
  public static toBase64Safely(target: string) {
    const encodedTarget = new TextEncoder().encode(target);
    const base64 = this.bytesToBase64(encodedTarget);
    return base64;
  }

  public static fromBase64Safely(base64: string) {
    const decodedBase64 = this.base64ToBytes(base64);
    const target = new TextDecoder().decode(decodedBase64);
    return target;
  }

  public static base64ToBytes(base64: string) {
    const binString = atob(base64);
    return Uint8Array.from(Array.from(binString, (m) => m.charCodeAt(0)));
  }

  public static bytesToBase64(bytes: Uint8Array) {
    const binString = Array.from(bytes, (byte) =>
      String.fromCharCode(byte),
    ).join('');
    return btoa(binString);
  }

  // Write function which will convert seconds to  ISO 8601 duration format, e.g. 30min = PT30M
  public static secondsToIso8601Duration(seconds: number) {
    let duration = `PT`;
    const hours = Math.floor(seconds / 3600);
    hours && (duration += `${hours}H`);
    const minutes = Math.floor((seconds % 3600) / 60);
    minutes && (duration += `${minutes}M`);
    const remainingSeconds = seconds % 60;
    remainingSeconds && (duration += `${remainingSeconds}S`);
    return duration;
  }
}
