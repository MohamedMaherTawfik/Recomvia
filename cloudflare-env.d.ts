declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    RECOMVIA_ADMIN_USER_ID?: string;
  }
}
