class ApiResponse {
    constructor(statusCode, data, message = "Success", error=false, errorType=false) {
        
        if(!errorType){
            this.statusCode = statusCode,
            this.message = message,
            this.success = statusCode < 400
            this.error = error
            this.data = data
        }else if(errorType === "VALIDATION_ERROR"){
            this.statusCode = statusCode,
            this.message = message,
            this.success = statusCode < 400
            this.error = error
            this.data = data
            this.errorType = errorType  
        }
    }
}
export { ApiResponse }