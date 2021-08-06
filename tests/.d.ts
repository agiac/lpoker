import type UserDSL from "./UserDSL";

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toSee(text: string): Promise<R>;
    }
  }
}
