export class InvalidRequest extends Error {  
    constructor (name:string="InvalidRequest",message:any) {
      super()
      this.name = name
      this.message = message
      Error.captureStackTrace(this, this.constructor);
    }
    statusCode() {
        return 500
    }
}