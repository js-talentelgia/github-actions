class ApiError extends Error {
        constructor(statusCode, message="Something went wrong", data="", errors= [], stack=""){
        super(message);
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
            // return stack;
            // console.log('====================================');
            // console.log("Not working !!");
            // console.log('====================================');
        }
    }
}

export { ApiError }